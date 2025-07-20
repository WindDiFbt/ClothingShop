import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import OrderService from '../../../services/admin/OrderService';

// Async thunks
export const fetchAllOrders = createAsyncThunk(
    'adminOrder/fetchAllOrders',
    async (params) => {
        const response = await OrderService.getAllOrders(params);
        return response.data;
    }
);

export const fetchOrderDetail = createAsyncThunk(
    'adminOrder/fetchOrderDetail',
    async (orderId) => {
        const response = await OrderService.getOrderDetail(orderId);
        return response.data;
    }
);

export const updateOrderStatus = createAsyncThunk(
    'adminOrder/updateOrderStatus',
    async ({ orderId, status }) => {
        const response = await OrderService.updateOrderStatus(orderId, status);
        return { orderId, status, response: response.data };
    }
);

export const fetchOrderStatuses = createAsyncThunk(
    'adminOrder/fetchOrderStatuses',
    async () => {
        const response = await OrderService.getOrderStatuses();
        return response.data;
    }
);

export const fetchOrderStatistics = createAsyncThunk(
    'adminOrder/fetchOrderStatistics',
    async () => {
        const response = await OrderService.getOrderStatistics();
        return response.data;
    }
);

const initialState = {
    orders: [],
    orderDetail: null,
    orderStatuses: [],
    statistics: null,
    loading: false,
    error: null,
    pagination: {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        pageSize: 10
    }
};

const adminOrderSlice = createSlice({
    name: 'adminOrder',
    initialState,
    reducers: {
        clearOrderDetail: (state) => {
            state.orderDetail = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all orders
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders;
                state.pagination = {
                    currentPage: action.payload.currentPage,
                    totalPages: action.payload.totalPages,
                    totalCount: action.payload.totalCount,
                    pageSize: action.payload.pageSize
                };
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            
            // Fetch order detail
            .addCase(fetchOrderDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.orderDetail = action.payload;
            })
            .addCase(fetchOrderDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            
            // Update order status
            .addCase(updateOrderStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.loading = false;
                // Update the order status in the orders list
                const orderIndex = state.orders.findIndex(order => order.id === action.payload.orderId);
                if (orderIndex !== -1) {
                    state.orders[orderIndex].status = action.payload.status;
                }
                // Update order detail if it's currently loaded
                if (state.orderDetail && state.orderDetail.id === action.payload.orderId) {
                    state.orderDetail.status = action.payload.status;
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            
            // Fetch order statuses
            .addCase(fetchOrderStatuses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderStatuses.fulfilled, (state, action) => {
                state.loading = false;
                state.orderStatuses = action.payload;
            })
            .addCase(fetchOrderStatuses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            
            // Fetch order statistics
            .addCase(fetchOrderStatistics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderStatistics.fulfilled, (state, action) => {
                state.loading = false;
                state.statistics = action.payload;
            })
            .addCase(fetchOrderStatistics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { clearOrderDetail, clearError } = adminOrderSlice.actions;
export default adminOrderSlice.reducer; 