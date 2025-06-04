import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ListProduct from "./components/product/ListProduct";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/product" element={<ListProduct />}></Route>
      </Routes>
      <ToastContainer />
    </Router>
  )
}

export default App
