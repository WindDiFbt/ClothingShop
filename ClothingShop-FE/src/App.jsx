import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./Layout";
import HomePage from "./components/home/Home";
import Products from "./components/product/Products";
import ProductDetail from "./components/product/ProductDetail";
import PageNotFound from "./components/share/PageNotFound";
import LoginPage from "./components/login/LoginPage";
import { ToastContainer } from "react-toastify";
import RegisterPage from "./components/login/RegisterPage";
import CartPage from "./components/cart/CartPage";
import CheckoutPage from "./components/CheckoutPage";
import OrderDetailsPage from "./components/OrderDetailsPage";
import OrderHistoryPage from "./components/OrderHistoryPage";
import PaymentPage from "./components/PaymentPage";
import PaymentSuccessPage from "./components/PaymentSuccessPage";
import PaymentCancelPage from "./components/PaymentCancelPage";
import ProfilePage from "./components/user/ProfilePage";
import PrivateRouteSeller from "./components/share/PrivateRouteSeller";
import SellerDashboard from "./components/user/SellerDashboard";
import ProductManagementPage from "./components/user/ProductManagementPage";
import OrderManagementPage from "./components/user/OrderManagementPage";
import AddProductPage from "./components/user/AddProductPage";
import EditProductPage from "./components/user/EditProductPage";
import OrderDetailPage from "./components/user/OrderDetailPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="home" element={<HomePage />} />
          <Route path="products" element={<Products />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders" element={<OrderHistoryPage />} />
          <Route path="order/:orderId" element={<OrderDetailsPage />} />
          <Route path="payment/:orderId" element={<PaymentPage />} />
          <Route path="payment/success" element={<PaymentSuccessPage />} />
          <Route path="payment/cancel" element={<PaymentCancelPage />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/seller"
            element={
              <PrivateRouteSeller>
                <SellerDashboard />
              </PrivateRouteSeller>
            }
          >
            <Route index element={<Navigate to="products" replace />} />
            <Route path="products" element={<ProductManagementPage />} />
            <Route path="orders" element={<OrderManagementPage />} />
          </Route>
          <Route path="/seller/products/add" element={<AddProductPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />

          <Route
            path="/seller/products/edit/:id"
            element={<EditProductPage />}
          />
        </Route>
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
