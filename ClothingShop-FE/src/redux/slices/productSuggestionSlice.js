import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchImportRecommendations = createAsyncThunk(
  "productSuggestion/fetchImportRecommendations",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get('http://localhost:5078/api/Products/import-recommendation', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch');
    }
  }
);

export const fetchLimitRecommendations = createAsyncThunk(
  "productSuggestion/fetchLimitRecommendations",
 async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get('http://localhost:5078/api/Products/limit-recommendation', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch');
    }
  }
);

const productSuggestionSlice = createSlice({
  name: "productSuggestion",
  initialState: {
    importList: [],
    limitList: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchImportRecommendations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchImportRecommendations.fulfilled, (state, action) => {
        state.importList = action.payload;
        state.loading = false;
      })
      .addCase(fetchImportRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchLimitRecommendations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLimitRecommendations.fulfilled, (state, action) => {
        state.limitList = action.payload;
        state.loading = false;
      })
      .addCase(fetchLimitRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productSuggestionSlice.reducer;
