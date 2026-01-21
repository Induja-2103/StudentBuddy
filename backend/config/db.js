const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Use explicit localhost connection
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/studentbuddy';

        console.log('Attempting to connect to MongoDB...');
        console.log(`Connection URI: ${mongoURI.replace(/\/\/.*@/, '//<credentials>@')}`);

        const conn = await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
            socketTimeoutMS: 45000,
        });

        console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);

    } catch (error) {
        console.error('❌ MongoDB Connection Error:');
        console.error(`Error: ${error.message}`);

        if (error.message.includes('ECONNREFUSED')) {
            console.error('\n🔧 SOLUTION:');
            console.error('MongoDB is not running! Please start MongoDB:');
            console.error('1. Open PowerShell as Administrator');
            console.error('2. Run: Start-Service -Name MongoDB');
            console.error('   OR');
            console.error('3. Run: cd "C:\\Program Files\\MongoDB\\Server\\7.0\\bin"');
            console.error('4. Run: .\\mongod.exe --dbpath "C:\\data\\db"');
        }

        process.exit(1);
    }
};

module.exports = connectDB;
