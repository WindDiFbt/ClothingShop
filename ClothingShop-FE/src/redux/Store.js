import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./slices/ProductSlice";
import homeSlice from "./slices/HomeSlice";

const store = configureStore({
    reducer: {
        product: productSlice,
        home: homeSlice,
    },
});

export default store;