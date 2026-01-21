const express = require('express');
const router = express.Router();
const { protect, checkStudent } = require('../middleware/authMiddleware');
const Test = require('../models/Test');
const TestAttempt = require('../models/TestAttempt');

// @route   GET /api/test/active
// @desc    Get active tests for student
// @access  Private (Student)
router.get('/active', protect, checkStudent, async (req, res) => {
    try {
        const userId = req.user._id;
        const now = new Date();

        // Find tests assigned to this user
        const activeTests = await Test.find({
            assigned_to: userId,
            is_active: true,
            $or: [
                { available_from: { $lte: now }, available_until: { $gte: now } },
                { available_from: null, available_until: null }
            ]
        }).select('-questions.correct_answer'); // Don't send correct answers

        // Check which tests have been attempted
        const attemptedTestIds = await TestAttempt.find({
            user_id: userId,
            status: { $in: ['submitted', 'auto_submitted'] }
        }).distinct('test_id');

        // Filter out completed tests
        const availableTests = activeTests.filter(
            test => !attemptedTestIds.some(id => id.equals(test._id))
        );

        // Get in-progress tests
        const inProgressTests = await TestAttempt.find({
            user_id: userId,
            status: 'in_progress'
        }).populate('test_id');

        res.json({
            available: availableTests,
            inProgress: inProgressTests
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/test/:id/start
// @desc    Start a test
// @access  Private (Student)
router.post('/:id/start', protect, checkStudent, async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // Check if already attempted
        const existingAttempt = await TestAttempt.findOne({
            user_id: req.user._id,
            test_id: test._id,
            status: { $in: ['submitted', 'auto_submitted', 'in_progress'] }
        });

        if (existingAttempt) {
            return res.status(400).json({ message: 'Test already started or completed' });
        }

        // Create new attempt
        const attempt = await TestAttempt.create({
            user_id: req.user._id,
            test_id: test._id,
            started_at: new Date(),
            score: 0,
            user_answers: []
        });

        // Return test with questions but without correct answers
        const testData = test.toObject();
        testData.questions = testData.questions.map(q => {
            const { correct_answer, ...questionWithoutAnswer } = q.toObject();
            return questionWithoutAnswer;
        });

        res.json({
            attempt: attempt,
            test: testData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/test/:attemptId/submit
// @desc    Submit test answers
// @access  Private (Student)
router.post('/:attemptId/submit', protect, checkStudent, async (req, res) => {
    try {
        const { answers, isAutoSubmit } = req.body;

        const attempt = await TestAttempt.findOne({
            _id: req.params.attemptId,
            user_id: req.user._id
        });

        if (!attempt) {
            return res.status(404).json({ message: 'Test attempt not found' });
        }

        if (attempt.status !== 'in_progress') {
            return res.status(400).json({ message: 'Test already submitted' });
        }

        const test = await Test.findById(attempt.test_id);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // Calculate score
        let totalScore = 0;
        const userAnswers = [];

        test.questions.forEach((question, index) => {
            const userAnswer = answers[question._id.toString()];
            let isCorrect = false;
            let pointsEarned = 0;

            if (question.question_type === 'multiple_choice' || question.question_type === 'true_false') {
                isCorrect = userAnswer === question.correct_answer;
                pointsEarned = isCorrect ? question.points : 0;
            }

            totalScore += pointsEarned;

            userAnswers.push({
                question_id: question._id,
                answer: userAnswer,
                is_correct: isCorrect,
                points_earned: pointsEarned
            });
        });

        const percentage = Math.round((totalScore / test.total_points) * 100);
        const timeTaken = Math.floor((new Date() - attempt.started_at) / 1000);

        // Update attempt
        attempt.user_answers = userAnswers;
        attempt.score = totalScore;
        attempt.percentage = percentage;
        attempt.submitted_at = new Date();
        attempt.time_taken_seconds = timeTaken;
        attempt.status = isAutoSubmit ? 'auto_submitted' : 'submitted';
        await attempt.save();

        res.json({
            score: totalScore,
            percentage,
            totalPoints: test.total_points,
            timeTaken,
            attempt
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/test/:attemptId/results
// @desc    Get test results
// @access  Private (Student)
router.get('/:attemptId/results', protect, checkStudent, async (req, res) => {
    try {
        const attempt = await TestAttempt.findOne({
            _id: req.params.attemptId,
            user_id: req.user._id
        }).populate('test_id');

        if (!attempt) {
            return res.status(404).json({ message: 'Test attempt not found' });
        }

        res.json(attempt);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
