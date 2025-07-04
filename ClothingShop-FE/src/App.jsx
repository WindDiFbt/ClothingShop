import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import HomePage from './components/home/Home';
import Products from './components/product/Products';
import ProductDetail from './components/product/ProductDetail';
import PageNotFound from './components/share/PageNotFound';
import LoginPage from './components/login/LoginPage';
import { ToastContainer } from 'react-toastify';
import RegisterPage from './components/login/RegisterPage';
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
          <Route path="*" element={<PageNotFound />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
