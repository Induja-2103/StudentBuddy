import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/student';

const initialState = {
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    isError: false,
    message: '',
};

// Get notifications
export const getNotifications = createAsyncThunk('notification/getAll', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(`${API_URL}/notifications`, config);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// Mark as read
export const markAsRead = createAsyncThunk('notification/markAsRead', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.put(`${API_URL}/notifications/${id}/read`, {}, config);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getNotifications.fulfilled, (state, action) => {
                state.notifications = action.payload;
                state.unreadCount = action.payload.filter((n) => !n.is_read).length;
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                const index = state.notifications.findIndex((n) => n._id === action.payload._id);
                if (index !== -1) {
                    state.notifications[index] = action.payload;
                    state.unreadCount = state.notifications.filter((n) => !n.is_read).length;
                }
            });
    },
});

export const { reset } = notificationSlice.actions;
export default notificationSlice.reducer;
