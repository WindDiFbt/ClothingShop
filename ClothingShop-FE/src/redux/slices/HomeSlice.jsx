import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchDataHomePage } from "../../services/APIService";

export const fetchHomePageData = createAsyncThunk(
    "home/fetchHomePageData",
    async (_, thunkAPI) => {
        try {
            const response = await fetchDataHomePage();
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const initialState = {
    hotProducts: [],
    saleProducts: [],
    loading: false,
    error: null,
};

const homeSlice = createSlice({
    name: "home",
    initialState,
    reducers: {
        setHotProducts: (state, action) => {
            state.hotProducts = action.payload;
        },
        setSaleProducts: (state, action) => {
            state.saleProducts = action.payload;
        },
        clearHomeData: (state) => {
            state.hotProducts = [];
            state.saleProducts = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHomePageData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHomePageData.fulfilled, (state, action) => {
                state.hotProducts = action.payload.hotProducts;
                state.saleProducts = action.payload.saleProducts;
                state.loading = false;
            })
            .addCase(fetchHomePageData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default homeSlice.reducer;