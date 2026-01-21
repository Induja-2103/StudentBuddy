const mongoose = require('mongoose');

const activationCodeSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    email: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['password_reset', 'mentor_activation'],
        required: true
    },
    mentor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MentorMaster'
    },
    expiry_timestamp: {
        type: Date,
        required: true
    },
    is_used: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// TTL index to auto-delete expired codes
activationCodeSchema.index({ expiry_timestamp: 1 }, { expireAfterSeconds: 0 });
activationCodeSchema.index({ code: 1, type: 1 });

module.exports = mongoose.model('ActivationCode', activationCodeSchema);
