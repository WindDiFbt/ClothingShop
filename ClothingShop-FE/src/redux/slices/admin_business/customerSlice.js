import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5078/api/admin';

// Async thunks
export const fetchCustomers = createAsyncThunk(
    'customers/fetchCustomers',
    async ({ searchTerm = '', statusFilter = '', page = 1, pageSize = 10 }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                pageSize: pageSize.toString()
            });
            
            if (searchTerm) params.append('searchTerm', searchTerm);
            if (statusFilter) params.append('statusFilter', statusFilter);

            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/customers?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch customers');
        }
    }
);

export const fetchCustomerDetail = createAsyncThunk(
    'customers/fetchCustomerDetail',
    async (customerId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/customers/${customerId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch customer detail');
        }
    }
);

export const fetchCustomerOrders = createAsyncThunk(
    'customers/fetchCustomerOrders',
    async (customerId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/customers/${customerId}/orders`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch customer orders');
        }
    }
);

export const fetchCustomerStatistics = createAsyncThunk(
    'customers/fetchCustomerStatistics',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/customers/statistics`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch customer statistics');
        }
    }
);

export const updateCustomerStatus = createAsyncThunk(
    'customers/updateCustomerStatus',
    async ({ customerId, status }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE_URL}/customers/${customerId}/status`, 
                { status },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return { customerId, status };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update customer status');
        }
    }
);

// Initial state
const initialState = {
    customers: [],
    selectedCustomer: null,
    customerOrders: [],
    statistics: null,
    pagination: null,
    loading: false,
    error: null
};

// Slice
const customerSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSelectedCustomer: (state) => {
            state.selectedCustomer = null;
            state.customerOrders = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch customers
            .addCase(fetchCustomers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.loading = false;
                state.customers = action.payload.customers || [];
                state.pagination = {
                    totalCount: action.payload.totalCount,
                    currentPage: action.payload.currentPage,
                    totalPages: action.payload.totalPages,
                    pageSize: action.payload.pageSize
                };
            })
            .addCase(fetchCustomers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Fetch customer detail
            .addCase(fetchCustomerDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomerDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedCustomer = action.payload;
            })
            .addCase(fetchCustomerDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Fetch customer orders
            .addCase(fetchCustomerOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomerOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.customerOrders = action.payload;
            })
            .addCase(fetchCustomerOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Fetch customer statistics
            .addCase(fetchCustomerStatistics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomerStatistics.fulfilled, (state, action) => {
                state.loading = false;
                state.statistics = action.payload;
            })
            .addCase(fetchCustomerStatistics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Update customer status
            .addCase(updateCustomerStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCustomerStatus.fulfilled, (state, action) => {
                state.loading = false;
                const { customerId, status } = action.payload;
                
                // Update in customers list
                const customerIndex = state.customers.findIndex(c => c.id === customerId);
                if (customerIndex !== -1) {
                    state.customers[customerIndex].status = status;
                }
                
                // Update selected customer if it's the same
                if (state.selectedCustomer && state.selectedCustomer.id === customerId) {
                    state.selectedCustomer.status = status;
                }
            })
            .addCase(updateCustomerStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, clearSelectedCustomer } = customerSlice.actions;
export default customerSlice.reducer;
