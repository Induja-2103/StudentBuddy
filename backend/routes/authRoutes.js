const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const ActivationCode = require('../models/ActivationCode');
const { sendPasswordResetEmail } = require('../services/emailService');

// Generate JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// @route   POST /api/auth/signup
// @desc    Register new student
// @access  Public
router.post('/signup', async (req, res) => {
    try {
        const { email, password, full_name, grade_level, subjects_enrolled } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            email,
            password_hash,
            full_name,
            role: 'Student'
        });

        // Create student profile
        await StudentProfile.create({
            user_id: user._id,
            grade_level,
            subjects_enrolled: subjects_enrolled || []
        });

        // Generate token
        const token = generateToken(user._id, user.role);

        res.status(201).json({
            _id: user._id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if user is active
        if (!user.is_active) {
            return res.status(403).json({ message: 'Account is deactivated' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Update last login
        user.last_login = new Date();
        await user.save();

        // Generate token
        const token = generateToken(user._id, user.role);

        res.json({
            _id: user._id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/auth/forgot-password
// @desc    Request password reset code
// @access  Public
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            // Don't reveal if user exists
            return res.json({ message: 'If the email exists, a reset code has been sent' });
        }

        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Delete old codes for this user
        await ActivationCode.deleteMany({
            email,
            type: 'password_reset'
        });

        // Create new code
        await ActivationCode.create({
            user_id: user._id,
            email,
            code,
            type: 'password_reset',
            expiry_timestamp: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
        });

        // Send email
        await sendPasswordResetEmail(email, code);

        res.json({ message: 'If the email exists, a reset code has been sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with code
// @access  Public
router.post('/reset-password', async (req, res) => {
    try {
        const { email, code, new_password } = req.body;

        // Find valid code
        const activationCode = await ActivationCode.findOne({
            email,
            code,
            type: 'password_reset',
            is_used: false,
            expiry_timestamp: { $gt: new Date() }
        });

        if (!activationCode) {
            return res.status(400).json({ message: 'Invalid or expired code' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(new_password, salt);

        // Update user password
        await User.findByIdAndUpdate(activationCode.user_id, { password_hash });

        // Mark code as used
        activationCode.is_used = true;
        await activationCode.save();

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
