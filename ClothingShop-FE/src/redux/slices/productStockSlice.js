import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thay URL này bằng endpoint thật từ backend của bạn
const API_URL = 'http://localhost:5078/api/Products/stock-status';

export const fetchProductStock = createAsyncThunk(
  'productStock/fetchProductStock',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL);
      return response.data; // Mảng danh sách tồn kho sản phẩm
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch');
    }
  }
);

const productStockSlice = createSlice({
  name: 'productStock',
  initialState: {
    items: [],
    loading: false,
    error: null,
    stockFilter: 'all', // all | low | normal | high
    currentPage: 1,
    pageSize: 10,
  },
  reducers: {
    setStockFilter: (state, action) => {
      state.stockFilter = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductStock.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProductStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setStockFilter, setCurrentPage } = productStockSlice.actions;

export default productStockSlice.reducer;
