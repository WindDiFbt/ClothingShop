import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addFeedback, getFeedbackByProduct, getFeedbackByOrder } from '../../services/feedbackAPI';

// Async thunks
export const addFeedbackThunk = createAsyncThunk(
    'feedback/addFeedback',
    async (feedbackData, { rejectWithValue }) => {
        try {
            const response = await addFeedback(feedbackData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add feedback');
        }
    }
);

export const getFeedbackByProductThunk = createAsyncThunk(
    'feedback/getFeedbackByProduct',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await getFeedbackByProduct(productId);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch product feedback');
        }
    }
);

export const getFeedbackByOrderThunk = createAsyncThunk(
    'feedback/getFeedbackByOrder',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await getFeedbackByOrder(orderId);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch order feedback');
        }
    }
);

const feedbackSlice = createSlice({
    name: 'feedback',
    initialState: {
        productFeedbacks: [],
        orderFeedbacks: [],
        loading: false,
        error: null,
        success: false
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = false;
        },
        resetFeedbackState: (state) => {
            state.productFeedbacks = [];
            state.orderFeedbacks = [];
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Add feedback
            .addCase(addFeedbackThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(addFeedbackThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                // Optionally add the new feedback to productFeedbacks if needed
            })
            .addCase(addFeedbackThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })
            // Get feedback by product
            .addCase(getFeedbackByProductThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFeedbackByProductThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.productFeedbacks = action.payload;
            })
            .addCase(getFeedbackByProductThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get feedback by order
            .addCase(getFeedbackByOrderThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFeedbackByOrderThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.orderFeedbacks = action.payload;
            })
            .addCase(getFeedbackByOrderThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, clearSuccess, resetFeedbackState } = feedbackSlice.actions;
export default feedbackSlice.reducer;
