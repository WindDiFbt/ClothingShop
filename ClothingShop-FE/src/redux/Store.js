import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./slices/ProductSlice";

const store = configureStore({
    reducer: {
        product: productSlice,
    },
});

export default store;