// src/redux/slices/bestSellingProductsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchBestSellingByMonth = createAsyncThunk(
  "bestSelling/fetchByMonth",
  async ({ month, year }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5078/api/Products/best-selling-month?month=${month}&year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch by month"
      );
    }
  }
);

export const fetchBestSellingByYear = createAsyncThunk(
  "bestSelling/fetchByYear",
  async ({ year }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5078/api/Products/best-selling-year?year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch by year"
      );
    }
  }
);

const bestSellingProductsSlice = createSlice({
  name: "bestSellingProducts",
  initialState: {
    byMonth: [],
    byYear: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // By Month
      .addCase(fetchBestSellingByMonth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBestSellingByMonth.fulfilled, (state, action) => {
        state.loading = false;
        state.byMonth = action.payload;
      })
      .addCase(fetchBestSellingByMonth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // By Year
      .addCase(fetchBestSellingByYear.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBestSellingByYear.fulfilled, (state, action) => {
        state.loading = false;
        state.byYear = action.payload;
      })
      .addCase(fetchBestSellingByYear.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bestSellingProductsSlice.reducer;
