import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchOrders = createAsyncThunk(
  "orderManagement/fetchOrders",
  async ({ query }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5078/api/odata/Orders?${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        orders: response.data.value,
        totalCount: response.data["@odata.count"],
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const orderManagementSlice = createSlice({
  name: "orderManagement",
  initialState: {
    orders: [],
    loading: false,
    error: null,
    currentPage: 1,
    pageSize: 8,
    totalCount: 0,
    statusFilter: "", // Optional
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.orders = [];
        state.error = action.payload;
      });
  },
});

export const { setCurrentPage, setStatusFilter } = orderManagementSlice.actions;
export default orderManagementSlice.reducer;
