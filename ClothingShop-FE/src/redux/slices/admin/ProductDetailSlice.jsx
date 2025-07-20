import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDetailProductById, approveProduct, rejectProduct } from "../../../services/APIService";
import ProductService from '../../../services/admin/ProductService';

export const fetchProductDetail = createAsyncThunk(
    "adminProductDetail/fetchProductDetail",
    async (id, thunkAPI) => {
        try {
            const response = await ProductService.getAdminDetailProductById(id);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const approveProductById = createAsyncThunk(
    "productDetail/approveProductById",
    async (id, thunkAPI) => {
        try {
            const response = await approveProduct(id);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const rejectProductById = createAsyncThunk(
    "productDetail/rejectProductById",
    async ({ id, rejectReason }, thunkAPI) => {
        try {
            const response = await rejectProduct(id, rejectReason);
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
    approving: false,
    approveError: null,
    approveSuccess: null,
    rejecting: false,
    rejectError: null,
    rejectSuccess: null,
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
    resetProductDetailStatus: (state) => {
      state.approving = false;
      state.approveError = null;
      state.approveSuccess = null;
      state.rejecting = false;
      state.rejectError = null;
      state.rejectSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.product = action.payload;
        state.productVariants = action.payload.productVariants;
        state.loading = false;
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(approveProductById.pending, (state) => {
        state.approving = true;
        state.approveError = null;
        state.approveSuccess = null;
      })
      .addCase(approveProductById.fulfilled, (state, action) => {
        state.approving = false;
        state.approveSuccess = action.payload?.message || 'Duyệt sản phẩm thành công';
      })
      .addCase(approveProductById.rejected, (state, action) => {
        state.approving = false;
        state.approveError = action.payload;
      })
      .addCase(rejectProductById.pending, (state) => {
        state.rejecting = true;
        state.rejectError = null;
        state.rejectSuccess = null;
      })
      .addCase(rejectProductById.fulfilled, (state, action) => {
        state.rejecting = false;
        state.rejectSuccess = action.payload?.message || 'Từ chối sản phẩm thành công';
      })
      .addCase(rejectProductById.rejected, (state, action) => {
        state.rejecting = false;
        state.rejectError = action.payload;
      });
  },
});

export const { clearProductDetail, resetProductDetailStatus } = productDetailSlice.actions;
export default productDetailSlice.reducer;
