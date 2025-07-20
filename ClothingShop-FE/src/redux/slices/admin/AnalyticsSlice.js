import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AnalyticsService from '../../../services/admin/AnalyticsService';

export const fetchDashboardOverview = createAsyncThunk(
    'analytics/fetchDashboardOverview',
    async ({ startDate, endDate }) => {
        const response = await AnalyticsService.getDashboardOverview(startDate, endDate);
        return response.data;
    }
);

export const fetchCategorySales = createAsyncThunk(
    'analytics/fetchCategorySales',
    async ({ startDate, endDate }) => {
        const response = await AnalyticsService.getCategorySales(startDate, endDate);
        return response.data;
    }
);

const analyticsSlice = createSlice({
    name: 'analytics',
    initialState: {
        overview: null,
        categorySales: null,
        loading: false,
        error: null,
        dateRange: {
            startDate: null,
            endDate: null
        }
    },
    reducers: {
        clearAnalytics: (state) => {
            state.overview = null;
            state.categorySales = null;
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
            // Dashboard Overview
            .addCase(fetchDashboardOverview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardOverview.fulfilled, (state, action) => {
                state.loading = false;
                state.overview = action.payload;
            })
            .addCase(fetchDashboardOverview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Category Sales
            .addCase(fetchCategorySales.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategorySales.fulfilled, (state, action) => {
                state.loading = false;
                state.categorySales = action.payload;
            })
            .addCase(fetchCategorySales.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { clearAnalytics, setDateRange, clearError } = analyticsSlice.actions;
export default analyticsSlice.reducer; 