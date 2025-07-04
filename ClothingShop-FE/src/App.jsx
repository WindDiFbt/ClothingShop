import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import AdminLayout from "./layouts/AdminLayout";
import AccountList from "./pages/admin/accounts/AccountList";
import EditAccount from "./pages/admin/accounts/edit";
import InviteUser from './pages/admin/accounts/Invite';
import HomePage from './components/home/Home';
import Products from './components/product/Products';
import ProductDetail from './components/product/ProductDetail';
import PageNotFound from './components/share/PageNotFound';
import LoginPage from './components/login/LoginPage';
import { ToastContainer } from 'react-toastify';
import SaleDashboard from "./pages/admin/SaleDashboard";
import ReviewProductsList from "./pages/admin/reviewProducts/ReviewProductsList";
import ProductDetailAdmin from "./pages/admin/reviewProducts/ProductDetailAdmin";
import { ReportList, ReportDetail } from './pages/admin/report';
import CreateUserInvite from './pages/admin/accounts/CreateUserInvite';

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
          <Route path="*" element={<PageNotFound />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminLayout />}>
            <Route path="/admin/sales" element={<SaleDashboard />} />
            <Route path="/admin/accounts" element={<AccountList />} />
            <Route path="/admin/accounts/edit/:id" element={<EditAccount />} />
            <Route path="/admin/accounts/invite" element={<InviteUser />} />
            <Route path="/admin/accounts/create-invite" element={<CreateUserInvite />} />
            <Route path="/admin/review-products" element={<ReviewProductsList />} />
            <Route path="/admin/review-products/detail/:id" element={<ProductDetailAdmin />} />
            <Route path="/admin/report" element={<ReportList />} />
            <Route path="/admin/report/:id" element={<ReportDetail />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
