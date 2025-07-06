import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCart, addOrUpdateItem, removeItem, clearCart } from "../cart/cartAPI";

// Thunks
export const getCart = createAsyncThunk(
  "cart/getCart",
  async ({ userId }, thunkAPI) => {
    try {
      const data = await fetchCart(userId);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }, thunkAPI) => {
    try {
      const data = await addOrUpdateItem({ userId, productId, quantity });
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ userId, productId }, thunkAPI) => {
    try {
      await removeItem({ userId, productId });
      return productId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const clearUserCart = createAsyncThunk(
  "cart/clear",
  async ({ userId }, thunkAPI) => {
    try {
      await clearCart(userId);
      return userId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const initialState = {
  cart: null,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        if (!state.cart) return;
        state.cart.cartDetails = state.cart.cartDetails.filter(
          (d) => d.productId !== action.payload
        );
      })
      .addCase(clearUserCart.fulfilled, (state) => {
        if (!state.cart) return;
        state.cart.cartDetails = [];
      });
  },
});

export default cartSlice.reducer; 