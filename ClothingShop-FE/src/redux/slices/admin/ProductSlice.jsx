import ProductService from '../../../services/admin/ProductService';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchAllProducts = createAsyncThunk(
  'product/fetchAllProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ProductService.getAllProducts();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching all products');
    }
  }
);

export const fetchProductDetail = createAsyncThunk(
  'detail/fetchProductDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await ProductService.getDetailProductById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching product detail');
    }
  }
);

const adminProductSlice = createSlice({
    name: 'adminProduct',
    initialState: {
      products: [],
      loading: false,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchAllProducts.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchAllProducts.fulfilled, (state, action) => {
          state.loading = false;
          state.products = action.payload;
        })
        .addCase(fetchAllProducts.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
  });
  
  export default adminProductSlice.reducer;