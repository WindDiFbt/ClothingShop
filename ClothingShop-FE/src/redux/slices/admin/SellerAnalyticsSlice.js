import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AnalyticsService from '../../../services/admin/AnalyticsService';

export const fetchSellerAnalytics = createAsyncThunk(
    'sellerAnalytics/fetchSellerAnalytics',
    async ({ startDate, endDate }) => {
        const response = await AnalyticsService.getSellerAnalytics(startDate, endDate);
        return response.data;
    }
);

const sellerAnalyticsSlice = createSlice({
    name: 'sellerAnalytics',
    initialState: {
        data: null,
        loading: false,
        error: null,
        dateRange: {
            startDate: null,
            endDate: null
        }
    },
    reducers: {
        clearSellerAnalytics: (state) => {
            state.data = null;
        },
        setDateRange: (state, action) => {
            state.dateRange = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSellerAnalytics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSellerAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchSellerAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { clearSellerAnalytics, setDateRange, clearError } = sellerAnalyticsSlice.actions;
export default sellerAnalyticsSlice.reducer; 