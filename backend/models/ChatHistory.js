const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
    session_id: {
        type: String,
        required: true,
        index: true
    },
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
    sender: {
        type: String,
        enum: ['user', 'mentor'],
        required: true
    },
    message_text: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true
});

// Indexes for efficient chat retrieval
chatHistorySchema.index({ session_id: 1, timestamp: 1 });
chatHistorySchema.index({ user_id: 1, timestamp: -1 });

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
