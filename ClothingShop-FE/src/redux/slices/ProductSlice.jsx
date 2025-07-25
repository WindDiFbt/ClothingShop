import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProductsOdata } from "../../services/APIService";
import {
  createProductApi,
  updateProductApi,
  getProductByIdApi,
} from "../../services/APIService";
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async ({ query }, thunkAPI) => {
    try {
      const response = await getProductsOdata(query);
      return {
        p: response.data.value,
        ttc: response.data["@odata.count"] ?? 0,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const updateProductStatus = createAsyncThunk(
  "product/updateProductStatus",
  async ({ productId, newStatusId }, { rejectWithValue }) => {
    try {
      await axios.put(`http://localhost:5078/api/Products/${productId}/status`, {
        statusId: newStatusId,
      });
      return { productId, newStatusId };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
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
    query: "",
  },
  priceFilter: {
    label: "",
    query: "",
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
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },
    setCategoryFilter: (state, action) => {
      state.categoryFilter = action.payload;
    },
    setPriceFilter: (state, action) => {
      state.priceFilter = action.payload;
    },
    setCategoryFilterSeller: (state, action) => {
      const category = action.payload;
      if (category) {
        state.categoryFilter = {
          name: category.name,
          query: `CategoryId eq ${category.id}`,
        };
      } else {
        // Reset khi chọn All
        state.categoryFilter = { name: "", query: "" };
      }
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
      })

      .addCase(updateProductStatus.fulfilled, (state, action) => {
        const { productId, newStatusId } = action.payload;
        const product = state.products.find((p) => p.Id === productId);
        if (product) {
          product.Status = newStatusId;
        }
      });
  },
});

export const {
  setCurrentPage,
  setCategoryFilter,
  setPriceFilter,
  setCategoryFilterSeller,
} = productSlice.actions;
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (data) => {
    const response = await createProductApi(data);
    return response.data;
  }
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, data }) => {
    const response = await updateProductApi(id, data);
    return response.data;
  }
);

export const fetchProductById = createAsyncThunk(
  "product/fetchProductById",
  async (id) => {
    const response = await getProductByIdApi(id);
    return response.data;
  }
);

export default productSlice.reducer;
