import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./slices/ProductSlice";
import homeSlice from "./slices/HomeSlice";
import productDetailSlice from "./slices/ProductDetailSlice";
import authReducer from './auth/authSlice'; 
const store = configureStore({
    reducer: {
        product: productSlice,
        home: homeSlice,
        detail: productDetailSlice,
        auth: authReducer,
    },
});

export default store;