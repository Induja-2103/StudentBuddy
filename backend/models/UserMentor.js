const mongoose = require('mongoose');

const userMentorSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mentor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MentorMaster',
        required: true
    },
    gemini_chat_session_id: {
        type: String,
        required: true,
        unique: true
    },
    activation_date: {
        type: Date,
        default: Date.now
    },
    total_messages: {
        type: Number,
        default: 0
    },
    total_time_minutes: {
        type: Number,
        default: 0
    },
    last_interaction: {
        type: Date
    },
    is_active: {
        type: Boolean,
        default: true
    },
    notes_from_mentor: [{
        note: String,
        created_at: {
            type: Date,
            default: Date.now
        }
    }],
    recommendations: [{
        recommendation: String,
        created_at: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Compound index for user-mentor relationship
userMentorSchema.index({ user_id: 1, mentor_id: 1 }, { unique: true });
// Note: gemini_chat_session_id index is automatically created by unique: true

module.exports = mongoose.model('UserMentor', userMentorSchema);
