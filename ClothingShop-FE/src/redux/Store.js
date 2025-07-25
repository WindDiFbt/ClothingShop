import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth/authSlice';
import homeReducer from './slices/HomeSlice';
import productReducer from './slices/ProductSlice';
import productDetailReducer from './slices/ProductDetailSlice';
import userReducer from './slices/UserSlice';
import adminProductReducer from './slices/admin/ProductSlice';
import adminProductDetailReducer from './slices/admin/ProductDetailSlice';
import adminReportReducer from './slices/admin/ReportSlice';
import analyticsReducer from './slices/admin/AnalyticsSlice';
import adminOrderReducer from './slices/admin/OrderSlice';

// Admin Business slices
import customerReducer from './slices/admin_business/customerSlice';
import orderBusinessReducer from './slices/admin_business/orderSlice';

import cartReducer from "./slices/CartSlice";
import orderReducer from "./slices/orderSlice";
import feedbackReducer from "./slices/feedbackSlice";
import orderManagementSlice from "./slices/OrderManagementSlice";
import cartAPI from "../services/cartAPI";
import orderAPI from "../services/orderAPI";
import paymentAPI from "../services/paymentAPI";
import productStockReducer from './slices/productStockSlice';
import topSellingProductsReducer from './slices/topSellingProductsSlice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    home: homeReducer,
    product: productReducer,
    detail: productDetailReducer,
    user: userReducer,
    adminProduct: adminProductReducer,
    adminProductDetail: adminProductDetailReducer,
    adminReport: adminReportReducer,
    analytics: analyticsReducer,
    adminOrder: adminOrderReducer,
    // Admin Business reducers
    customers: customerReducer,
    orders: orderBusinessReducer,
    cart: cartReducer,
    order: orderReducer,
    feedback: feedbackReducer,
    orderManagement: orderManagementSlice,
    [cartAPI.reducerPath]: cartAPI.reducer,
    [orderAPI.reducerPath]: orderAPI.reducer,
    [paymentAPI.reducerPath]: paymentAPI.reducer,
    productStock: productStockReducer,
    topSellingProducts: topSellingProductsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    })
      .concat(cartAPI.middleware)
      .concat(orderAPI.middleware)
      .concat(paymentAPI.middleware),
});

export default store;
