import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchImportProducts = createAsyncThunk(
  'importProducts/fetch',
  async (status, thunkAPI) => {
    const response = await axios.get(`/api/products/pagination?status=${status}`);
    return response.data.products;
  }
);

export const updateProductStatus = createAsyncThunk(
  'importProducts/updateStatus',
  async ({ productId, status }, thunkAPI) => {
    await axios.put(`/api/products/${productId}/status`, { status });
    return { productId, status };
  }
);

const importProductSlice = createSlice({
  name: 'importProducts',
  initialState: {
    products: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchImportProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchImportProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(updateProductStatus.fulfilled, (state, action) => {
        const { productId, status } = action.payload;
        const product = state.products.find(p => p.id === productId);
        if (product) {
          product.status = status;
        }
      });
  }
});

export default importProductSlice.reducer;
