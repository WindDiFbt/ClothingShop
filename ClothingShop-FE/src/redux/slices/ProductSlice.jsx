import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProductsOdata } from "../../services/APIService";

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async ({ query }, thunkAPI) => {
    try {
      const response = await getProductsOdata(query);
      return {
        p: response.data.value,
        ttc: response.data['@odata.count'] ?? 0
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  products: [],
  countProduct: 0,
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 8,
  categoryFilter: {
    name: "",
    query: ""
  },
  priceFilter: {
    label: "",
    query: ""
  },
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
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
    setCategoryFilter: (state, action) => {
      state.categoryFilter = action.payload;
    },
    setPriceFilter: (state, action) => {
      state.priceFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload.p;
        state.countProduct = action.payload.ttc;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setCurrentPage,
  setCategoryFilter,
  setPriceFilter,
} = productSlice.actions;
export default productSlice.reducer;