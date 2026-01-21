const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    due_date: {
        type: Date
    },
    is_completed: {
        type: Boolean,
        default: false
    },
    completed_at: {
        type: Date
    },
    category: {
        type: String,
        enum: ['study', 'assignment', 'exam', 'personal', 'other'],
        default: 'other'
    }
}, {
    timestamps: true
});

// Indexes for todo queries
todoSchema.index({ user_id: 1, is_completed: 1, due_date: 1 });

module.exports = mongoose.model('Todo', todoSchema);
