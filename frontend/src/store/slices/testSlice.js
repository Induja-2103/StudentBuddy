import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/test';

const initialState = {
    activeTests: [],
    inProgressTests: [],
    currentTest: null,
    currentAttempt: null,
    results: null,
    isLoading: false,
    isError: false,
    message: '',
};

// Get active tests
export const getActiveTests = createAsyncThunk('test/getActive', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(`${API_URL}/active`, config);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// Start test
export const startTest = createAsyncThunk('test/start', async (testId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.post(`${API_URL}/${testId}/start`, {}, config);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// Submit test
export const submitTest = createAsyncThunk('test/submit', async ({ attemptId, answers, isAutoSubmit }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.post(`${API_URL}/${attemptId}/submit`, { answers, isAutoSubmit }, config);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

export const testSlice = createSlice({
    name: 'test',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.message = '';
        },
        clearCurrentTest: (state) => {
            state.currentTest = null;
            state.currentAttempt = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getActiveTests.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getActiveTests.fulfilled, (state, action) => {
                state.isLoading = false;
                state.activeTests = action.payload.available;
                state.inProgressTests = action.payload.inProgress;
            })
            .addCase(getActiveTests.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(startTest.fulfilled, (state, action) => {
                state.currentTest = action.payload.test;
                state.currentAttempt = action.payload.attempt;
            })
            .addCase(submitTest.fulfilled, (state, action) => {
                state.results = action.payload;
            });
    },
});

export const { reset, clearCurrentTest } = testSlice.actions;
export default testSlice.reducer;
