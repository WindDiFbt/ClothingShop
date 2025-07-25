import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchImportRecommendations,
  fetchLimitRecommendations,
} from "../../../redux/slices/productSuggestionSlice";

const ProductSuggestionPage = () => {
  const dispatch = useDispatch();

  // Fallback để tránh crash nếu state.productSuggestion là undefined
  const {
    importList = [],
    limitList = [],
    loading = false,
    error = null,
  } = useSelector((state) => state.productSuggestion || {});

  const [activeTab, setActiveTab] = useState("import");

  useEffect(() => {
    dispatch(fetchImportRecommendations());
    dispatch(fetchLimitRecommendations());
  }, [dispatch]);

  const dataToRender = activeTab === "import" ? importList : limitList;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gợi ý nhập hàng</h1>

      <div className="flex mb-4">
        <button
          className={`px-4 py-2 mr-2 rounded ${
            activeTab === "import" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("import")}
        >
          Nên nhập thêm
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "limit" ? "bg-red-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("limit")}
        >
          Giới hạn nhập
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="text-red-500">Lỗi: {error}</p>
      ) : dataToRender.length === 0 ? (
        <p className="text-gray-500">Không có dữ liệu phù hợp.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {dataToRender.map((item) => (
            <div
              key={item.productId}
              className="border p-4 rounded shadow hover:shadow-md transition"
            >
              <img
                src={item.thumbnailUrl}
                alt={item.productName}
                className="w-full h-40 object-cover mb-2 rounded"
              />
              <h2 className="font-semibold text-lg">{item.productName}</h2>
              <p className="text-gray-700">Số lượng bán: {item.totalSold}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSuggestionPage;
