import React, { useState, useEffect  } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./../../redux/auth/authSlice";
import { Navigate, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const dispatch = useDispatch();
  const { token,user, status, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(form));
  };
  const navigate = useNavigate();
  console.log("user role after login:", user?.role);
   useEffect(() => {
    if (status === "succeeded" && token && user) {
      if (user.role === "ADMIN") {
        navigate("/admin/sales");
      } else if (user.role === "SELLER") {
        navigate("/seller");
      } else {
        navigate("/home");
      }
    }
  }, [status, token, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-white px-4">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 text-3xl text-gray-800 hover:text-black transition-colors"
        aria-label="Quay lại"
      >
        ←
      </button>
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome back
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              name="username"
              placeholder="Enter your username"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          {status === "loading" && (
            <p className="text-sm text-gray-500 text-center">Loading...</p>
          )}
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition"
          >
            Log In
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-purple-600 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
