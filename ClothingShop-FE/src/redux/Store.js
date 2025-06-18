import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./slices/ProductSlice";
import homeSlice from "./slices/HomeSlice";
import productDetailSlice from "./slices/ProductDetailSlice";

const store = configureStore({
    reducer: {
        product: productSlice,
        home: homeSlice,
        detail: productDetailSlice,
    },
});

export default store;