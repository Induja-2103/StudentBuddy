const mongoose = require('mongoose');

const testAttemptSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    test_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true
    },
    started_at: {
        type: Date,
        default: Date.now
    },
    submitted_at: {
        type: Date
    },
    time_taken_seconds: {
        type: Number
    },
    user_answers: [{
        question_id: mongoose.Schema.Types.ObjectId,
        answer: mongoose.Schema.Types.Mixed,
        is_correct: Boolean,
        points_earned: Number
    }],
    score: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number
    },
    status: {
        type: String,
        enum: ['in_progress', 'submitted', 'auto_submitted'],
        default: 'in_progress'
    }
}, {
    timestamps: true
});

// Indexes for analytics queries
testAttemptSchema.index({ user_id: 1, test_id: 1 });
testAttemptSchema.index({ user_id: 1, submitted_at: -1 });

module.exports = mongoose.model('TestAttempt', testAttemptSchema);
