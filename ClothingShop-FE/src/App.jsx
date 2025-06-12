import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "./Layout";

import Products from "./components/product/Products";
import HomePage from "./components/home/Home";
import PageNotFound from "./components/share/PageNotFound";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/products" element={<Products />}></Route>
          <Route path="/home" element={<HomePage />}></Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <ToastContainer />
      </Layout>
    </Router>
  )
}

export default App;