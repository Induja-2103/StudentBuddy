const { GoogleGenerativeAI } = require('@google/generative-ai');
const ChatHistory = require('../models/ChatHistory');
const UserMentor = require('../models/UserMentor');
const MentorMaster = require('../models/MentorMaster');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Create a new chat session for a user-mentor pair
const createChatSession = async (userId, mentorId) => {
    try {
        const mentor = await MentorMaster.findById(mentorId);
        if (!mentor) {
            throw new Error('Mentor not found');
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const chat = model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        // Generate unique session ID
        const sessionId = `${userId}_${mentorId}_${Date.now()}`;

        return {
            chat,
            sessionId,
            systemPrompt: mentor.advanced_system_prompt
        };
    } catch (error) {
        console.error('Error creating chat session:', error);
        throw error;
    }
};

// Send message to Gemini and get response
const sendMessage = async (sessionId, message, systemPrompt) => {
    try {
        const userMentor = await UserMentor.findOne({ gemini_chat_session_id: sessionId });
        if (!userMentor) {
            throw new Error('Chat session not found');
        }

        // Get chat history
        const history = await ChatHistory.find({ session_id: sessionId })
            .sort({ timestamp: 1 })
            .limit(50); // Last 50 messages for context

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Build history for Gemini
        const geminiHistory = history.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.message_text }]
        }));

        const chat = model.startChat({
            history: geminiHistory,
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        // Prepend system prompt to first message if history is empty
        const fullMessage = geminiHistory.length === 0
            ? `${systemPrompt}\n\nUser: ${message}`
            : message;

        const result = await chat.sendMessage(fullMessage);
        const response = result.response.text();

        // Save user message
        await ChatHistory.create({
            session_id: sessionId,
            user_id: userMentor.user_id,
            mentor_id: userMentor.mentor_id,
            sender: 'user',
            message_text: message
        });

        // Save mentor response
        await ChatHistory.create({
            session_id: sessionId,
            user_id: userMentor.user_id,
            mentor_id: userMentor.mentor_id,
            sender: 'mentor',
            message_text: response
        });

        // Update interaction stats
        await UserMentor.findByIdAndUpdate(userMentor._id, {
            $inc: { total_messages: 2 },
            last_interaction: new Date()
        });

        return response;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

// Get chat history for a session
const getChatHistory = async (sessionId) => {
    try {
        const history = await ChatHistory.find({ session_id: sessionId })
            .sort({ timestamp: 1 });
        return history;
    } catch (error) {
        console.error('Error getting chat history:', error);
        throw error;
    }
};

module.exports = {
    createChatSession,
    sendMessage,
    getChatHistory
};
