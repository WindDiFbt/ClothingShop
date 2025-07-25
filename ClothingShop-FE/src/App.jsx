import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import AdminLayout from "./layouts/AdminLayout";
import AccountList from "./pages/admin/accounts/AccountList";
import EditAccount from "./pages/admin/accounts/edit";
import InviteUser from './pages/admin/accounts/Invite';
import CreateUserInvite from './pages/admin/accounts/CreateUserInvite';
import SaleDashboard from "./pages/admin/SaleDashboard";
import ReviewProductsList from "./pages/admin/reviewProducts/ReviewProductsList";
import ProductDetailAdmin from "./pages/admin/reviewProducts/ProductDetailAdmin";
import { ReportList, ReportDetail } from './pages/admin/report';
import OrderList from './pages/admin/orders/OrderList';
import OrderDetail from './pages/admin/orders/OrderDetail';

import HomePage from './components/home/Home';
import Products from './components/product/Products';
import ProductDetail from './components/product/ProductDetail';
import PageNotFound from './components/share/PageNotFound';
import LoginPage from './components/login/LoginPage';
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
import { AdminProtectedRoute } from "./components/share/ProtectedRoute";

import { ToastContainer } from "react-toastify";
import ProductStockPage from "./components/user/ProductStockPage";
import TopSellingProductsPage from "./components/user/TopSellingProductsPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Public Routes */}
        <Route element={<Layout />}>
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
          <Route path="/seller/products/edit/:id" element={<EditProductPage />} />
        </Route>

        {/* Admin Routes */}
        <Route element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }>
          <Route path="/admin/sales" element={<SaleDashboard />} />
          <Route path="/admin/accounts" element={<AccountList />} />
          <Route path="/admin/accounts/edit/:id" element={<EditAccount />} />
          <Route path="/admin/accounts/invite" element={<InviteUser />} />
          <Route path="/admin/accounts/create-invite" element={<CreateUserInvite />} />
          <Route path="/admin/review-products" element={<ReviewProductsList />} />
          <Route path="/admin/review-products/detail/:id" element={<ProductDetailAdmin />} />
          <Route path="/admin/orders" element={<OrderList />} />
          <Route path="/admin/orders/:id" element={<OrderDetail />} />
          <Route path="/admin/report" element={<ReportList />} />
          <Route path="/admin/report/:id" element={<ReportDetail />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<PageNotFound />} />
        <Route path="/product-stock" element={<ProductStockPage />} />
        <Route path="/product-revenue" element={<TopSellingProductsPage />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
