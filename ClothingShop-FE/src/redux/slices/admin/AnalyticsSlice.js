import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AnalyticsService from '../../../services/admin/AnalyticsService';

export const fetchDashboardOverview = createAsyncThunk(
    'analytics/fetchDashboardOverview',
    async ({ startDate, endDate }) => {
        const response = await AnalyticsService.getDashboardOverview(startDate, endDate);
        return response.data;
    }
);

export const fetchRevenueAnalytics = createAsyncThunk(
    'analytics/fetchRevenueAnalytics',
    async ({ startDate, endDate }) => {
        const response = await AnalyticsService.getRevenueAnalytics(startDate, endDate);
        return response.data;
    }
);

export const fetchOrderAnalytics = createAsyncThunk(
    'analytics/fetchOrderAnalytics',
    async ({ startDate, endDate }) => {
        const response = await AnalyticsService.getOrderAnalytics(startDate, endDate);
        return response.data;
    }
);

export const fetchCustomerAnalytics = createAsyncThunk(
    'analytics/fetchCustomerAnalytics',
    async ({ startDate, endDate }) => {
        const response = await AnalyticsService.getCustomerAnalytics(startDate, endDate);
        return response.data;
    }
);

export const fetchProductAnalytics = createAsyncThunk(
    'analytics/fetchProductAnalytics',
    async ({ startDate, endDate }) => {
        const response = await AnalyticsService.getProductAnalytics(startDate, endDate);
        return response.data;
    }
);

export const fetchReportAnalytics = createAsyncThunk(
    'analytics/fetchReportAnalytics',
    async ({ startDate, endDate }) => {
        const response = await AnalyticsService.getReportAnalytics(startDate, endDate);
        return response.data;
    }
);

const analyticsSlice = createSlice({
    name: 'analytics',
    initialState: {
        overview: null,
        revenue: null,
        orders: null,
        customers: null,
        products: null,
        reports: null,
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
            state.revenue = null;
            state.orders = null;
            state.customers = null;
            state.products = null;
            state.reports = null;
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
            // Revenue Analytics
            .addCase(fetchRevenueAnalytics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRevenueAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.revenue = action.payload;
            })
            .addCase(fetchRevenueAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Order Analytics
            .addCase(fetchOrderAnalytics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchOrderAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Customer Analytics
            .addCase(fetchCustomerAnalytics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomerAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.customers = action.payload;
            })
            .addCase(fetchCustomerAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Product Analytics
            .addCase(fetchProductAnalytics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProductAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Report Analytics
            .addCase(fetchReportAnalytics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReportAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.reports = action.payload;
            })
            .addCase(fetchReportAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { clearAnalytics, setDateRange, clearError } = analyticsSlice.actions;
export default analyticsSlice.reducer; 