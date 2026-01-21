const express = require('express');
const router = express.Router();
const { protect, checkStudent } = require('../middleware/authMiddleware');
const StudentProfile = require('../models/StudentProfile');
const TestAttempt = require('../models/TestAttempt');
const UserMentor = require('../models/UserMentor');
const Notification = require('../models/Notification');
const Todo = require('../models/Todo');

// @route   GET /api/student/dashboard
// @desc    Get student dashboard data
// @access  Private (Student)
router.get('/dashboard', protect, checkStudent, async (req, res) => {
    try {
        const userId = req.user._id;

        // Get student profile
        const profile = await StudentProfile.findOne({ user_id: userId });

        // Get test statistics
        const testAttempts = await TestAttempt.find({
            user_id: userId,
            status: 'submitted'
        });

        const totalTests = testAttempts.length;
        const averageScore = totalTests > 0
            ? testAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / totalTests
            : 0;

        // Get active mentors count
        const activeMentors = await UserMentor.countDocuments({
            user_id: userId,
            is_active: true
        });

        // Get unread notifications
        const unreadNotifications = await Notification.countDocuments({
            user_id: userId,
            is_read: false
        });

        // Get pending todos
        const pendingTodos = await Todo.countDocuments({
            user_id: userId,
            is_completed: false
        });

        res.json({
            profile,
            stats: {
                totalTests,
                averageScore: Math.round(averageScore),
                activeMentors,
                unreadNotifications,
                pendingTodos
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/student/analytics
// @desc    Get detailed analytics
// @access  Private (Student)
router.get('/analytics', protect, checkStudent, async (req, res) => {
    try {
        const userId = req.user._id;

        // Get all test attempts with test details
        const attempts = await TestAttempt.find({
            user_id: userId,
            status: { $in: ['submitted', 'auto_submitted'] }
        })
            .populate('test_id', 'title subject')
            .sort({ submitted_at: -1 });

        // Get mentor interaction data
        const mentorData = await UserMentor.find({ user_id: userId })
            .populate('mentor_id', 'name domain level')
            .select('total_messages total_time_minutes last_interaction notes_from_mentor recommendations');

        // Calculate subject-wise performance
        const subjectPerformance = {};
        attempts.forEach(attempt => {
            if (attempt.test_id && attempt.test_id.subject) {
                const subject = attempt.test_id.subject;
                if (!subjectPerformance[subject]) {
                    subjectPerformance[subject] = {
                        count: 0,
                        totalScore: 0
                    };
                }
                subjectPerformance[subject].count++;
                subjectPerformance[subject].totalScore += attempt.percentage;
            }
        });

        // Calculate averages
        Object.keys(subjectPerformance).forEach(subject => {
            const data = subjectPerformance[subject];
            subjectPerformance[subject].average = Math.round(data.totalScore / data.count);
        });

        res.json({
            testHistory: attempts,
            mentorData,
            subjectPerformance
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/student/notifications
// @desc    Get user notifications
// @access  Private (Student)
router.get('/notifications', protect, checkStudent, async (req, res) => {
    try {
        const notifications = await Notification.find({ user_id: req.user._id })
            .sort({ created_at: -1 })
            .limit(50);

        res.json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/student/notifications/:id/read
// @desc    Mark notification as read
// @access  Private (Student)
router.put('/notifications/:id/read', protect, checkStudent, async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, user_id: req.user._id },
            { is_read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.json(notification);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/student/profile
// @desc    Update student profile
// @access  Private (Student)
router.put('/profile', protect, checkStudent, async (req, res) => {
    try {
        const profile = await StudentProfile.findOneAndUpdate(
            { user_id: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
