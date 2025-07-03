import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./slices/ProductSlice";
import homeSlice from "./slices/HomeSlice";
import productDetailSlice from "./slices/ProductDetailSlice";
import productDetailAdminSlice from "./slices/admin/ProductDetailSlice";
import authReducer from './auth/authSlice';
import userSlice from './slices/UserSlice';
import adminProductSlice from './slices/admin/ProductSlice';

const store = configureStore({
    reducer: {
        product: productSlice,
        home: homeSlice,
        detail: productDetailSlice,
        auth: authReducer,
        user: userSlice,
        adminProduct: adminProductSlice,
        adminProductDetail: productDetailAdminSlice,
    },
});

export default store;