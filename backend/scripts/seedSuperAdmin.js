require('dotenv').config({ path: '../.env' }); // Adjust path if running from scripts folder
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const connectDB = require('../config/db');

const seedSuperAdmin = async () => {
    try {
        await connectDB();

        const superAdminEmail = 'vetriikrs@gmail.com';
        const superAdminPass = '##vetrii##07';

        // Check if exists
        const userExists = await User.findOne({ email: superAdminEmail });

        if (userExists) {
            console.log('SuperAdmin already exists.');

            // Optional: Update role if needed
            if (userExists.role !== 'SuperAdmin') {
                userExists.role = 'SuperAdmin';
                await userExists.save();
                console.log('Updated existing user to SuperAdmin role.');
            }
        } else {
            // Create new
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(superAdminPass, salt);

            await User.create({
                full_name: 'Super Admin',
                email: superAdminEmail,
                password_hash: password_hash,
                role: 'SuperAdmin',
                is_active: true
            });

            console.log('SuperAdmin created successfully.');
        }

        process.exit();
    } catch (error) {
        console.error('Error seeding SuperAdmin:', error);
        process.exit(1);
    }
};

seedSuperAdmin();
