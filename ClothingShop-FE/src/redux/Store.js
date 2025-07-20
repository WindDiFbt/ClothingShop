import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import homeReducer from './slices/HomeSlice';
import productReducer from './slices/ProductSlice';
import productDetailReducer from './slices/ProductDetailSlice';
import userReducer from './slices/UserSlice';
import adminProductReducer from './slices/admin/ProductSlice';
import adminProductDetailReducer from './slices/admin/ProductDetailSlice';
import adminReportReducer from './slices/admin/ReportSlice';
import analyticsReducer from './slices/admin/AnalyticsSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        home: homeReducer,
        product: productReducer,
        productDetail: productDetailReducer,
        user: userReducer,
        adminProduct: adminProductReducer,
        adminProductDetail: adminProductDetailReducer,
        adminReport: adminReportReducer,
        analytics: analyticsReducer,
    },
});

export default store;