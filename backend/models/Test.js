const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question_text: {
        type: String,
        required: true
    },
    question_type: {
        type: String,
        enum: ['multiple_choice', 'true_false', 'short_answer', 'essay'],
        required: true
    },
    options: [{
        type: String
    }],
    correct_answer: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    points: {
        type: Number,
        default: 1
    }
});

const testSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    subject: {
        type: String,
        required: true
    },
    grade_level: {
        type: String
    },
    duration_minutes: {
        type: Number,
        required: true
    },
    total_points: {
        type: Number,
        required: true
    },
    questions: [questionSchema],
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assigned_to: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    is_active: {
        type: Boolean,
        default: true
    },
    available_from: {
        type: Date
    },
    available_until: {
        type: Date
    }
}, {
    timestamps: true
});

// Indexes for performance
testSchema.index({ created_by: 1 });
testSchema.index({ is_active: 1 });

module.exports = mongoose.model('Test', testSchema);
