import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/mentor';

const initialState = {
    availableMentors: [],
    activatedMentors: [],
    currentSession: null,
    chatHistory: [],
    isLoading: false,
    isError: false,
    message: '',
};

// Get available mentors
export const getAvailableMentors = createAsyncThunk('mentor/getAvailable', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(`${API_URL}/available`, config);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// Get activated mentors
export const getActivatedMentors = createAsyncThunk('mentor/getActivated', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(`${API_URL}/activated`, config);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// Register mentor
export const registerMentor = createAsyncThunk('mentor/register', async (mentorId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.post(`${API_URL}/register`, { mentor_id: mentorId }, config);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// Activate mentor
export const activateMentor = createAsyncThunk('mentor/activate', async ({ mentorId, code }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.post(`${API_URL}/activate`, { mentor_id: mentorId, code }, config);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// Get chat history
export const getChatHistory = createAsyncThunk('mentor/getChatHistory', async (sessionId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(`${API_URL}/chat/${sessionId}/history`, config);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// Send message
export const sendMessage = createAsyncThunk('mentor/sendMessage', async ({ sessionId, message }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.post(`${API_URL}/chat/${sessionId}/message`, { message }, config);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

export const mentorSlice = createSlice({
    name: 'mentor',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.message = '';
        },
        setCurrentSession: (state, action) => {
            state.currentSession = action.payload;
        },
        addMessageToHistory: (state, action) => {
            state.chatHistory.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAvailableMentors.fulfilled, (state, action) => {
                state.availableMentors = action.payload;
            })
            .addCase(getActivatedMentors.fulfilled, (state, action) => {
                state.activatedMentors = action.payload;
            })
            .addCase(getChatHistory.fulfilled, (state, action) => {
                state.chatHistory = action.payload;
            })
            .addCase(activateMentor.fulfilled, (state, action) => {
                state.activatedMentors.push(action.payload.userMentor);
            });
    },
});

export const { reset, setCurrentSession, addMessageToHistory } = mentorSlice.actions;
export default mentorSlice.reducer;
