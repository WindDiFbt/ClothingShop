import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTopSellingProducts = createAsyncThunk(
  'statistics/fetchTopSellingProducts',
  async () => {
    const response = await axios.get('http://localhost:5078/api/Order/top-selling-products');
    return response.data;
  }
);

const topSellingProductsSlice = createSlice({
  name: 'topSellingProducts',
  initialState: {
    products: [],
    loading: false,
    error: null
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTopSellingProducts.pending, state => {
        state.loading = true;
      })
      .addCase(fetchTopSellingProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchTopSellingProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default topSellingProductsSlice.reducer;
