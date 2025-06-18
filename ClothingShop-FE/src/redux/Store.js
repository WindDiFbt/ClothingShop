import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./slices/ProductSlice";
import homeSlice from "./slices/HomeSlice";
import productDetailSlice from "./slices/ProductDetailSlice";
import userSlice from "./slices/UserSlice";

const store = configureStore({
    reducer: {
        product: productSlice,
        home: homeSlice,
        detail: productDetailSlice,
        user: userSlice,
    },
    devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in development
});

export default store;