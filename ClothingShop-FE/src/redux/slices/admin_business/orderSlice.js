import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5078/api/admin';

// Async thunks
export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async ({ searchTerm = '', statusFilter = '', page = 1, pageSize = 10 }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                pageSize: pageSize.toString()
            });
            
            if (searchTerm) params.append('searchTerm', searchTerm);
            if (statusFilter) params.append('statusFilter', statusFilter);

            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/orders?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
        }
    }
);

export const fetchOrderDetail = createAsyncThunk(
    'orders/fetchOrderDetail',
    async (orderId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch order detail');
        }
    }
);

export const updateOrderStatus = createAsyncThunk(
    'orders/updateOrderStatus',
    async ({ orderId, status }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE_URL}/orders/${orderId}/status`, 
                { status },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return { orderId, status };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
        }
    }
);

// Initial state
const initialState = {
    orders: [],
    selectedOrder: null,
    pagination: null,
    loading: false,
    error: null
};

// Slice
const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSelectedOrder: (state) => {
            state.selectedOrder = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch orders
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders || [];
                state.pagination = {
                    totalCount: action.payload.totalCount,
                    currentPage: action.payload.currentPage,
                    totalPages: action.payload.totalPages,
                    pageSize: action.payload.pageSize
                };
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Fetch order detail
            .addCase(fetchOrderDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedOrder = action.payload;
            })
            .addCase(fetchOrderDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Update order status
            .addCase(updateOrderStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.loading = false;
                const { orderId, status } = action.payload;
                
                // Update in orders list
                const orderIndex = state.orders.findIndex(o => o.id === orderId);
                if (orderIndex !== -1) {
                    state.orders[orderIndex].status = status;
                }
                
                // Update selected order if it's the same
                if (state.selectedOrder && state.selectedOrder.id === orderId) {
                    state.selectedOrder.status = status;
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, clearSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
