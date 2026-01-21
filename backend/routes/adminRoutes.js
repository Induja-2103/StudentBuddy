const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const xlsx = require('xlsx');
const { protect, checkAdmin, checkSuperAdmin } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Test = require('../models/Test');
const MentorMaster = require('../models/MentorMaster');
const Notification = require('../models/Notification');
const { sendPasswordResetEmail, sendTestNotificationEmail } = require('../services/emailService');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// @route   GET /api/admin/users
// @desc    Get all users (Admin/SuperAdmin)
// @access  Private (Admin, SuperAdmin)
router.get('/users', protect, checkAdmin, async (req, res) => {
    try {
        const { role } = req.query;

        const query = {};
        if (role) query.role = role;

        // SuperAdmin can see all, Admin can't see SuperAdmin
        if (req.user.role === 'Admin') {
            query.role = { $ne: 'SuperAdmin' };
        }

        const users = await User.find(query)
            .select('-password_hash')
            .sort({ created_at: -1 });

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private (Admin, SuperAdmin)
router.delete('/users/:id', protect, checkAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Admin can't delete SuperAdmin
        if (req.user.role === 'Admin' && user.role === 'SuperAdmin') {
            return res.status(403).json({ message: 'Cannot delete SuperAdmin' });
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/admin/users/:id/reset-password
// @desc    Reset user password and send email
// @access  Private (Admin, SuperAdmin)
router.put('/users/:id/reset-password', protect, checkAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate temporary password
        const tempPassword = Math.random().toString(36).slice(-8);

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(tempPassword, salt);

        user.password_hash = password_hash;
        await user.save();

        // Send email (you might want to create a specific email template for this)
        // For now, we'll use the password reset email
        await sendPasswordResetEmail(user.email, tempPassword);

        res.json({ message: 'Password reset successfully, email sent to user' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/admin/users/create-admin
// @desc    Create new admin (SuperAdmin only)
// @access  Private (SuperAdmin)
router.post('/users/create-admin', protect, checkSuperAdmin, async (req, res) => {
    try {
        const { email, password, full_name } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Create admin user
        const user = await User.create({
            email,
            password_hash,
            full_name,
            role: 'Admin'
        });

        res.status(201).json({
            _id: user._id,
            email: user.email,
            full_name: user.full_name,
            role: user.role
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/admin/users/:id/deactivate
// @desc    Deactivate/Activate user
// @access  Private (Admin, SuperAdmin)
router.put('/users/:id/deactivate', protect, checkAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.is_active = !user.is_active;
        await user.save();

        res.json({
            message: `User ${user.is_active ? 'activated' : 'deactivated'} successfully`,
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/admin/tests
// @desc    Get all tests
// @access  Private (Admin, SuperAdmin)
router.get('/tests', protect, checkAdmin, async (req, res) => {
    try {
        const tests = await Test.find()
            .populate('created_by', 'full_name email')
            .sort({ created_at: -1 });

        res.json(tests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/admin/tests
// @desc    Create new test
// @access  Private (Admin, SuperAdmin)
router.post('/tests', protect, checkAdmin, async (req, res) => {
    try {
        const test = await Test.create({
            ...req.body,
            created_by: req.user._id
        });

        // Send notifications to assigned students
        if (test.assigned_to && test.assigned_to.length > 0) {
            const notifications = test.assigned_to.map(userId => ({
                user_id: userId,
                type: 'test_available',
                title: 'New Test Available',
                message: `A new test "${test.title}" has been assigned to you`,
                link: `/tests/${test._id}`
            }));

            await Notification.insertMany(notifications);

            // Send emails
            const users = await User.find({ _id: { $in: test.assigned_to } });
            for (const user of users) {
                await sendTestNotificationEmail(user.email, test.title, test.available_until);
            }
        }

        res.status(201).json(test);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/admin/tests/bulk-upload
// @desc    Bulk upload tests from Excel/CSV
// @access  Private (Admin, SuperAdmin)
router.post('/tests/bulk-upload', protect, checkAdmin, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Read the Excel/CSV file
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        // Process and create tests
        // This is a simplified version - you'd need to define your Excel format
        const tests = [];

        for (const row of data) {
            // Assuming Excel has columns: title, description, subject, duration_minutes, etc.
            const test = await Test.create({
                title: row.title,
                description: row.description,
                subject: row.subject,
                duration_minutes: row.duration_minutes,
                total_points: row.total_points,
                questions: JSON.parse(row.questions || '[]'),
                created_by: req.user._id
            });

            tests.push(test);
        }

        res.json({
            message: `${tests.length} tests created successfully`,
            tests
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/admin/tests/:id
// @desc    Update test
// @access  Private (Admin, SuperAdmin)
router.put('/tests/:id', protect, checkAdmin, async (req, res) => {
    try {
        const test = await Test.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        res.json(test);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/admin/tests/:id
// @desc    Delete test
// @access  Private (Admin, SuperAdmin)
router.delete('/tests/:id', protect, checkAdmin, async (req, res) => {
    try {
        const test = await Test.findByIdAndDelete(req.params.id);

        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        res.json({ message: 'Test deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/admin/mentors
// @desc    Get all mentors
// @access  Private (Admin, SuperAdmin)
router.get('/mentors', protect, checkAdmin, async (req, res) => {
    try {
        const mentors = await MentorMaster.find().sort({ created_at: -1 });
        res.json(mentors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/admin/mentors
// @desc    Create new mentor
// @access  Private (Admin, SuperAdmin)
router.post('/mentors', protect, checkAdmin, async (req, res) => {
    try {
        const mentor = await MentorMaster.create({
            ...req.body,
            created_by: req.user._id
        });

        res.status(201).json(mentor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/admin/mentors/:id
// @desc    Update mentor
// @access  Private (Admin, SuperAdmin)
router.put('/mentors/:id', protect, checkAdmin, async (req, res) => {
    try {
        const mentor = await MentorMaster.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!mentor) {
            return res.status(404).json({ message: 'Mentor not found' });
        }

        res.json(mentor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/admin/mentors/:id
// @desc    Delete mentor
// @access  Private (Admin, SuperAdmin)
router.delete('/mentors/:id', protect, checkAdmin, async (req, res) => {
    try {
        const mentor = await MentorMaster.findByIdAndDelete(req.params.id);

        if (!mentor) {
            return res.status(404).json({ message: 'Mentor not found' });
        }

        res.json({ message: 'Mentor deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
