const mongoose = require('mongoose');

const mentorMasterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    domain: {
        type: String,
        required: true
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    avatar_url: {
        type: String
    },
    advanced_system_prompt: {
        type: String,
        required: true
    },
    specializations: [{
        type: String
    }],
    is_active: {
        type: Boolean,
        default: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Indexes for mentor search
mentorMasterSchema.index({ domain: 1, level: 1 });
mentorMasterSchema.index({ is_active: 1 });

module.exports = mongoose.model('MentorMaster', mentorMasterSchema);
