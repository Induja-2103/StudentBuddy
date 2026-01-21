const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password_hash: {
        type: String,
        required: function () {
            return !this.github_id && !this.google_id;
        }
    },
    role: {
        type: String,
        enum: ['Student', 'Admin', 'SuperAdmin'],
        default: 'Student',
        required: true
    },
    github_id: {
        type: String,
        sparse: true
    },
    google_id: {
        type: String,
        sparse: true
    },
    full_name: {
        type: String,
        required: true
    },
    is_active: {
        type: Boolean,
        default: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    last_login: {
        type: Date
    }
}, {
    timestamps: true
});

// Index for faster queries
// Note: email index is automatically created by unique: true
userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);
