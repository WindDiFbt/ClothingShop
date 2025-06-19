import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProducts, getPendingProducts } from "../../services/APIService";

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (_, thunkAPI) => {
    try {
      const response = await getProducts();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchPendingProducts = createAsyncThunk(
  "product/fetchPendingProducts",
  async (_, thunkAPI) => {
    try {
      const response = await getPendingProducts();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  products: [],
  loading: false,
  error: null,
  pendingProducts: [],
  loadingPending: false,
  errorPending: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter(p => p.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPendingProducts.pending, (state) => {
        state.loadingPending = true;
        state.errorPending = null;
      })
      .addCase(fetchPendingProducts.fulfilled, (state, action) => {
        state.pendingProducts = action.payload;
        state.loadingPending = false;
      })
      .addCase(fetchPendingProducts.rejected, (state, action) => {
        state.loadingPending = false;
        state.errorPending = action.payload;
      });
  }
});

export default productSlice.reducer;
