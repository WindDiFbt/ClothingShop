import React from "react";
import { Link, Outlet } from "react-router-dom";
import {
  ShoppingBagIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

export default function SellerDashboard() {
  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1f2937] shadow-md text-gray-200">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Noiré Seller</h2>
          <p className="text-sm text-gray-400 mt-1">Seller Panel</p>
        </div>
        <nav className="mt-6 space-y-2 px-4">
          <Link
            to="/seller/products"
            className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            <ShoppingBagIcon className="h-5 w-5 mr-2 text-gray-300" />
            Products
          </Link>
          <Link
            to="/seller/orders"
            className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            <ClipboardDocumentCheckIcon className="h-5 w-5 mr-2 text-gray-300" />
            Orders
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
