const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['test_available', 'test_reminder', 'mentor_message', 'system', 'admin_action'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    link: {
        type: String
    },
    is_read: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for notification queries
notificationSchema.index({ user_id: 1, is_read: 1, created_at: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
