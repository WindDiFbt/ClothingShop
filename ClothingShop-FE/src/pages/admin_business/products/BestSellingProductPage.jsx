import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBestSellingByMonth,
  fetchBestSellingByYear,
} from "../../../redux/slices/bestSellingProductsSlice";

const BestSellingProductPage = () => {
  const dispatch = useDispatch();
  const bestSellingState = useSelector((state) => state.bestSellingProducts);

  const { byMonth = [], byYear = [], loading, error } = bestSellingState || {};

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const handleSearchByMonth = () => {
    if (month && year) {
      dispatch(fetchBestSellingByMonth({ month, year }));
    } else {
      alert("Vui lòng chọn đầy đủ tháng và năm.");
    }
  };

  const handleSearchByYear = () => {
    if (year) {
      dispatch(fetchBestSellingByYear({ year }));
    } else {
      alert("Vui lòng chọn năm.");
    }
  };

  const dataToDisplay = byMonth.length > 0 ? byMonth : byYear;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Sản phẩm bán chạy</h2>

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          style={{ padding: "6px" }}
        >
          <option value="">-- Chọn tháng --</option>
          {[...Array(12)].map((_, index) => (
            <option key={index + 1} value={index + 1}>
              Tháng {index + 1}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={{ padding: "6px" }}
        >
          <option value="">-- Chọn năm --</option>
          {[2022, 2023, 2024, 2025].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <button
          onClick={handleSearchByMonth}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "6px 12px",
            borderRadius: 4,
            border: "none",
            cursor: "pointer",
          }}
        >
          Tìm theo tháng
        </button>

        <button
          onClick={handleSearchByYear}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            padding: "6px 12px",
            borderRadius: 4,
            border: "none",
            cursor: "pointer",
          }}
        >
          Tìm theo năm
        </button>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : error ? (
        <p style={{ color: "red" }}>Lỗi: {error}</p>
      ) : dataToDisplay.length === 0 ? (
        <p>Không tìm thấy dữ liệu phù hợp.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Tên sản phẩm</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Tổng số lượng</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Tổng doanh thu</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Chi tiết size đã bán</th>
            </tr>
          </thead>
          <tbody>
            {dataToDisplay.map((item, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {item.productName}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {item.totalQuantity?.toLocaleString() ?? 0}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {(item.totalRevenue ?? 0).toLocaleString()} đ
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {item.sizes?.map((size, i) => (
                    <div key={i}>
                      Size {size.size} - SL: {size.quantity} - Doanh thu:{" "}
                      {(size.revenue ?? 0).toLocaleString()} đ
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BestSellingProductPage;
