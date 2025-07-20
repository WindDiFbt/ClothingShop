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

import cartReducer from "./slices/CartSlice";
import orderReducer from "./slices/orderSlice";
import feedbackReducer from "./slices/feedbackSlice";
import orderManagementReducer from "./redux/slices/OrderManagementSlice";

import cartAPI from "../services/cartAPI";
import orderAPI from "../services/orderAPI";
import paymentAPI from "../services/paymentAPI";

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
    adminOrder: adminOrderReducer,
    cart: cartReducer,
    order: orderReducer,
    feedback: feedbackReducer,
    orderManagement: orderManagementReducer,
    [cartAPI.reducerPath]: cartAPI.reducer,
    [orderAPI.reducerPath]: orderAPI.reducer,
    [paymentAPI.reducerPath]: paymentAPI.reducer,
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
