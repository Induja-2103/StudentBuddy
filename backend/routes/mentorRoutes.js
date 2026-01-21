const express = require('express');
const router = express.Router();
const { protect, checkStudent } = require('../middleware/authMiddleware');
const MentorMaster = require('../models/MentorMaster');
const UserMentor = require('../models/UserMentor');
const ActivationCode = require('../models/ActivationCode');
const { createChatSession, sendMessage, getChatHistory } = require('../services/aiService');
const { sendMentorActivationEmail } = require('../services/emailService');

// @route   GET /api/mentor/available
// @desc    Get all available mentors
// @access  Private (Student)
router.get('/available', protect, checkStudent, async (req, res) => {
    try {
        const { domain, level } = req.query;

        const query = { is_active: true };
        if (domain) query.domain = domain;
        if (level) query.level = level;

        const mentors = await MentorMaster.find(query)
            .select('-advanced_system_prompt'); // Don't expose system prompts

        res.json(mentors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/mentor/activated
// @desc    Get user's activated mentors
// @access  Private (Student)
router.get('/activated', protect, checkStudent, async (req, res) => {
    try {
        const userMentors = await UserMentor.find({
            user_id: req.user._id,
            is_active: true
        }).populate('mentor_id');

        res.json(userMentors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/mentor/register
// @desc    Request mentor activation (sends email with code)
// @access  Private (Student)
router.post('/register', protect, checkStudent, async (req, res) => {
    try {
        const { mentor_id } = req.body;

        const mentor = await MentorMaster.findById(mentor_id);
        if (!mentor) {
            return res.status(404).json({ message: 'Mentor not found' });
        }

        // Check if already activated
        const existing = await UserMentor.findOne({
            user_id: req.user._id,
            mentor_id
        });

        if (existing) {
            return res.status(400).json({ message: 'Mentor already activated' });
        }

        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Delete old codes for this mentor activation
        await ActivationCode.deleteMany({
            user_id: req.user._id,
            mentor_id,
            type: 'mentor_activation'
        });

        // Create activation code
        await ActivationCode.create({
            user_id: req.user._id,
            email: req.user.email,
            code,
            type: 'mentor_activation',
            mentor_id,
            expiry_timestamp: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
        });

        // Send email
        await sendMentorActivationEmail(req.user.email, mentor.name, code);

        res.json({ message: 'Activation code sent to your email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/mentor/activate
// @desc    Activate mentor with code
// @access  Private (Student)
router.post('/activate', protect, checkStudent, async (req, res) => {
    try {
        const { mentor_id, code } = req.body;

        // Find valid code
        const activationCode = await ActivationCode.findOne({
            user_id: req.user._id,
            mentor_id,
            code,
            type: 'mentor_activation',
            is_used: false,
            expiry_timestamp: { $gt: new Date() }
        });

        if (!activationCode) {
            return res.status(400).json({ message: 'Invalid or expired code' });
        }

        // Create Gemini chat session
        const { sessionId } = await createChatSession(req.user._id, mentor_id);

        // Create UserMentor relationship
        const userMentor = await UserMentor.create({
            user_id: req.user._id,
            mentor_id,
            gemini_chat_session_id: sessionId,
            activation_date: new Date()
        });

        // Mark code as used
        activationCode.is_used = true;
        await activationCode.save();

        const populatedUserMentor = await UserMentor.findById(userMentor._id)
            .populate('mentor_id');

        res.json({
            message: 'Mentor activated successfully',
            userMentor: populatedUserMentor
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/mentor/chat/:sessionId/message
// @desc    Send message to mentor
// @access  Private (Student)
router.post('/chat/:sessionId/message', protect, checkStudent, async (req, res) => {
    try {
        const { message } = req.body;
        const { sessionId } = req.params;

        // Verify session belongs to user
        const userMentor = await UserMentor.findOne({
            gemini_chat_session_id: sessionId,
            user_id: req.user._id
        }).populate('mentor_id');

        if (!userMentor) {
            return res.status(404).json({ message: 'Chat session not found' });
        }

        // Send message to Gemini
        const response = await sendMessage(
            sessionId,
            message,
            userMentor.mentor_id.advanced_system_prompt
        );

        // Emit via Socket.IO
        const io = req.app.get('io');
        io.to(sessionId).emit('receive_message', {
            sessionId,
            sender: 'mentor',
            message: response,
            timestamp: new Date()
        });

        res.json({
            userMessage: message,
            mentorResponse: response
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/mentor/chat/:sessionId/history
// @desc    Get chat history
// @access  Private (Student)
router.get('/chat/:sessionId/history', protect, checkStudent, async (req, res) => {
    try {
        const { sessionId } = req.params;

        // Verify session belongs to user
        const userMentor = await UserMentor.findOne({
            gemini_chat_session_id: sessionId,
            user_id: req.user._id
        });

        if (!userMentor) {
            return res.status(404).json({ message: 'Chat session not found' });
        }

        const history = await getChatHistory(sessionId);

        res.json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
