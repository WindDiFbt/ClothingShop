// src/pages/admin_business/BestSellingProductPage.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBestSellingByMonth,
  fetchBestSellingByYear,
} from "../../../redux/slices/bestSellingProductsSlice";

const BestSellingProductPage = () => {
  const dispatch = useDispatch();

  const {
    byMonth = [],
    byYear = [],
    loading,
    error,
  } = useSelector((state) => state.bestSellingProducts || {});

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [searchedType, setSearchedType] = useState(""); // "month" | "year"

  const handleSearchByMonth = () => {
    const parsedMonth = parseInt(month);
    const parsedYear = parseInt(year);
    if (!parsedMonth || !parsedYear || parsedMonth < 1 || parsedMonth > 12) {
      alert("Vui lòng nhập tháng từ 1 đến 12 và năm hợp lệ!");
      return;
    }

    dispatch(fetchBestSellingByMonth({ month: parsedMonth, year: parsedYear }));
    setSearchedType("month");
  };

  const handleSearchByYear = () => {
    const parsedYear = parseInt(year);
    if (!parsedYear) {
      alert("Vui lòng nhập năm hợp lệ!");
      return;
    }

    dispatch(fetchBestSellingByYear({ year: parsedYear }));
    setSearchedType("year");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📊 Sản phẩm bán chạy</h2>

      <div className="flex gap-4 items-center mb-6">
        <input
          type="number"
          min="1"
          max="12"
          placeholder="Tháng"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded w-24"
        />
        <input
          type="number"
          min="2000"
          placeholder="Năm"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border p-2 rounded w-32"
        />
        <button
          onClick={handleSearchByMonth}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Tìm theo tháng
        </button>
        <button
          onClick={handleSearchByYear}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Tìm theo năm
        </button>
      </div>

      {loading && <p className="text-blue-600 font-semibold">⏳ Đang tải dữ liệu...</p>}
      {error && <p className="text-red-500 font-medium">Lỗi: {error}</p>}

      {/* Kết quả theo tháng */}
      {searchedType === "month" && byMonth.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">
            📅 Kết quả theo tháng {month}/{year}
          </h3>
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Tên sản phẩm</th>
                <th className="border p-2">Số lượng bán</th>
                <th className="border p-2">Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {byMonth.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border p-2">{product.productName}</td>
                  <td className="border p-2 text-center">{product.totalQuantity}</td>
                  <td className="border p-2 text-right">
                    {product.totalRevenue.toLocaleString("vi-VN")} ₫
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Kết quả theo năm */}
      {searchedType === "year" && byYear.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">📆 Kết quả theo năm {year}</h3>
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Tên sản phẩm</th>
                <th className="border p-2">Số lượng bán</th>
                <th className="border p-2">Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {byYear.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border p-2">{product.productName}</td>
                  <td className="border p-2 text-center">{product.totalQuantity}</td>
                  <td className="border p-2 text-right">
                    {product.totalRevenue.toLocaleString("vi-VN")} ₫
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Không có dữ liệu */}
      {searchedType && !loading && ((searchedType === "month" && byMonth.length === 0) ||
        (searchedType === "year" && byYear.length === 0)) && (
        <p className="text-gray-500 italic">Không tìm thấy dữ liệu phù hợp.</p>
      )}
    </div>
  );
};

export default BestSellingProductPage;
