import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./slices/ProductSlice";
import homeSlice from "./slices/HomeSlice";
import productDetailSlice from "./slices/ProductDetailSlice";
import authReducer from "./auth/authSlice";
import cartReducer from "./slices/CartSlice";
import orderReducer from "./slices/orderSlice";
import feedbackReducer from "./slices/feedbackSlice";
import cartAPI from "../services/cartAPI";
import orderAPI from "../services/orderAPI";
import paymentAPI from "../services/paymentAPI";
import orderManagementReducer from ".././redux/slices/OrderManagementSlice";
const store = configureStore({
  reducer: {
    order: orderReducer,
    orderManagement: orderManagementReducer,
    product: productSlice,
    home: homeSlice,
    detail: productDetailSlice,
    auth: authReducer,
    cart: cartReducer,
    order: orderReducer,
    feedback: feedbackReducer,
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
