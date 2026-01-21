const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            req.user = await User.findById(decoded.id).select('-password_hash');

            if (!req.user || !req.user.is_active) {
                return res.status(401).json({ message: 'User not found or inactive' });
            }

            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Role-based access control middleware
const checkRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access denied. Required role: ${roles.join(' or ')}`
            });
        }

        next();
    };
};

// Specific role checkers
const checkStudent = checkRole('Student');
const checkAdmin = checkRole('Admin', 'SuperAdmin');
const checkSuperAdmin = checkRole('SuperAdmin');

module.exports = {
    protect,
    checkRole,
    checkStudent,
    checkAdmin,
    checkSuperAdmin
};
