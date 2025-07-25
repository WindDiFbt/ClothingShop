import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTopSellingProducts = createAsyncThunk(
  'statistics/fetchTopSellingProducts',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get('http://localhost:5078/api/Order/top-selling-products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch');
    }
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
