import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentOrder: null,
  orderHistory: [],
  checkoutForm: {
    customerName: '',
    customerPhone: '',
    shippingAddress: '',
    paymentMethod: 'COD',
    note: '',
  },
  isLoading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },

    setOrderHistory: (state, action) => {
      state.orderHistory = action.payload;
    },

    updateCheckoutForm: (state, action) => {
      console.log('Redux updateCheckoutForm:', action.payload); // Debug log
      state.checkoutForm = { ...state.checkoutForm, ...action.payload };
    },

    resetCheckoutForm: (state) => {
      state.checkoutForm = {
        customerName: '',
        customerPhone: '',
        shippingAddress: '',
        paymentMethod: 'COD',
        note: '',
      };
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    addToOrderHistory: (state, action) => {
      state.orderHistory.unshift(action.payload);
    },

    updateOrderInHistory: (state, action) => {
      const { orderId, updates } = action.payload;
      const orderIndex = state.orderHistory.findIndex(order => order.id === orderId);
      if (orderIndex !== -1) {
        state.orderHistory[orderIndex] = { ...state.orderHistory[orderIndex], ...updates };
      }
    },
  },
});

export const {
  setCurrentOrder,
  setOrderHistory,
  updateCheckoutForm,
  resetCheckoutForm,
  setLoading,
  setError,
  clearError,
  addToOrderHistory,
  updateOrderInHistory,
} = orderSlice.actions;

// Selectors
export const selectCurrentOrder = (state) => state.order.currentOrder;
export const selectOrderHistory = (state) => state.order.orderHistory;
export const selectCheckoutForm = (state) => state.order.checkoutForm;
export const selectOrderLoading = (state) => state.order.isLoading;
export const selectOrderError = (state) => state.order.error;

export default orderSlice.reducer;
