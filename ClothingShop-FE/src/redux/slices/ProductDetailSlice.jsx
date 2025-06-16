import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDetailProductById } from "../../services/APIService";

export const fetchProductDetail = createAsyncThunk(
    "productDetail/fetchProductDetail",
    async (id, thunkAPI) => {
        try {
            const response = await getDetailProductById(id);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const initialState = {
    product: null,
    seller: null,
    relatedProducts: [],
    productVariants: [],
    feedbacks: [],
    loading: false,
    error: null,
};

const productDetailSlice = createSlice({
  name: "productDetail",
  initialState,
  reducers: {
    clearProductDetail: (state) => {
      state.product = null;
      state.seller = null;
      state.productVariants = [];
      state.relatedProducts = [];
      state.feedbacks = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.product = action.payload.productDto;
        state.seller = action.payload.seller;
        state.relatedProducts = action.payload.relatedProducts;
        state.productVariants = action.payload.productDto.productVariants;
        state.feedbacks = action.payload.feedbacks;
        state.loading = false;
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProductDetail } = productDetailSlice.actions;
export default productDetailSlice.reducer;
