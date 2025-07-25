import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBestSellingByMonth,
  fetchBestSellingByYear,
} from "../../../redux/slices/bestSellingProductsSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const BestSellingProducts = () => {
  const dispatch = useDispatch();
  const { byMonth, byYear, loading, error } = useSelector(
    (state) => state.bestSellingProducts
  );

  const [viewType, setViewType] = useState("month");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (viewType === "month") {
      dispatch(fetchBestSellingByMonth({ month, year }));
    } else {
      dispatch(fetchBestSellingByYear({ year }));
    }
  }, [dispatch, month, year, viewType]);

  const data = viewType === "month" ? byMonth : byYear;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Sản phẩm bán chạy</h2>

      {/* Bộ lọc */}
      <div className="flex gap-4 mb-6">
        <select
          className="border px-3 py-2 rounded"
          value={viewType}
          onChange={(e) => setViewType(e.target.value)}
        >
          <option value="month">Theo tháng</option>
          <option value="year">Theo năm</option>
        </select>

        {viewType === "month" && (
          <select
            className="border px-3 py-2 rounded"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>
                Tháng {i + 1}
              </option>
            ))}
          </select>
        )}

        <input
          type="number"
          className="border px-3 py-2 rounded w-24"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          min="2000"
          max={new Date().getFullYear()}
        />
      </div>

      {/* Biểu đồ */}
      <div className="h-96 w-full bg-white rounded shadow p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="productName" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalSold" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bảng chi tiết */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Chi tiết sản phẩm</h3>
        {loading ? (
          <p>Đang tải...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <table className="w-full border mt-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">#</th>
                <th className="border p-2">Ảnh</th>
                <th className="border p-2">Tên sản phẩm</th>
                <th className="border p-2">Số lượng bán</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={item.productId}>
                  <td className="border p-2 text-center">{idx + 1}</td>
                  <td className="border p-2 text-center">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.productName}
                      className="h-12 w-12 object-cover mx-auto"
                    />
                  </td>
                  <td className="border p-2">{item.productName}</td>
                  <td className="border p-2 text-center">{item.totalSold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BestSellingProducts;
