require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const testRoutes = require('./routes/testRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const todoRoutes = require('./routes/todoRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/test', testRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/todo', todoRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'StudentBuddy API is running' });
});

// Socket.IO for real-time chat
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join_chat', (sessionId) => {
        socket.join(sessionId);
        console.log(`Client joined chat session: ${sessionId}`);
    });

    socket.on('send_message', async (data) => {
        // Broadcast to the specific chat session
        io.to(data.sessionId).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Make io accessible to routes
app.set('io', io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
