const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    grade_level: {
        type: String,
        required: true
    },
    subjects_enrolled: [{
        type: String
    }],
    learning_style: {
        type: String,
        enum: ['Visual', 'Auditory', 'Kinesthetic', 'Reading/Writing', 'Mixed'],
        default: 'Mixed'
    },
    academic_goals: {
        type: String
    },
    interests: [{
        type: String
    }],
    preferred_study_time: {
        type: String
    }
}, {
    timestamps: true
});

// Note: user_id index is automatically created by unique: true

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
