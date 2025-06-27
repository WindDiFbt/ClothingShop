import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "./Layout";
import AdminLayout from "./layouts/AdminLayout";
import AccountList from "./pages/admin/accounts/AccountList";
import EditAccount from "./pages/admin/accounts/edit";
import InviteUser from "./pages/admin/accounts/invite";

import Products from "./components/product/Products";
import HomePage from "./components/home/Home";
import PageNotFound from "./components/share/PageNotFound";
import ProductDetail from "./components/product/ProductDetail";
import SaleDashboard from "./pages/admin/SaleDashboard";
import ReviewProductsList from "./pages/admin/reviewProducts/reviewProductsList";
import ProductDetailAdmin from "./pages/admin/reviewProducts/ProductDetailAdmin";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/products" element={<Products />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminLayout />}>
            <Route path="/admin/sales" element={<SaleDashboard />} />
            <Route path="/admin/accounts" element={<AccountList />} />
            <Route path="/admin/accounts/edit/:id" element={<EditAccount />} />
            <Route path="/admin/accounts/invite" element={<InviteUser />} />
            <Route path="/admin/review-products" element={<ReviewProductsList />} />
            <Route path="/admin/review-products/detail/:id" element={<ProductDetailAdmin />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <ToastContainer />
    </Router>
  )
}

export default App;