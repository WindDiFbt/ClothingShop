import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductStock,
  setStockFilter,
  setCurrentPage,
} from "../../redux/slices/productStockSlice";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";

const ProductStockPage = () => {
  const dispatch = useDispatch();
  const {
    items = [],
    loading,
    error,
    stockFilter,
    currentPage,
    pageSize,
  } = useSelector((state) => state.productStock);

  useEffect(() => {
    dispatch(fetchProductStock());
  }, [dispatch]);

  const filteredItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    if (stockFilter === "all") return items;
    return items.filter((item) =>
      item.variants?.some((v) => v.stockStatus === stockFilter)
    );
  }, [items, stockFilter]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredItems.slice(start, end);
  }, [filteredItems, currentPage, pageSize]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredItems.length / pageSize);
  }, [filteredItems.length, pageSize]);

  const handleFilterChange = (e) => {
    dispatch(setStockFilter(e.target.value));
    dispatch(setCurrentPage(1));
  };

  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage));
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case "low":
        return "bg-red-100 text-red-700 border border-red-300";
      case "normal":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "high":
        return "bg-green-100 text-green-700 border border-green-300";
      default:
        return "bg-gray-100 text-gray-500 border border-gray-300";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Product Stock</h2>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <select
          value={stockFilter}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="all">All</option>
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <>
          {Array.isArray(paginatedItems) && paginatedItems.length > 0 ? (
            <div className="overflow-x-auto rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">#</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Product</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Total Quantity</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Variants</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {paginatedItems.map((item, index) => {
                    const totalQuantity = item.variants?.reduce(
                      (sum, v) => sum + (v.quantity ?? 0),
                      0
                    ) ?? 0;

                    return (
                      <tr key={item.id} className="hover:bg-gray-50 align-top">
                        <td className="px-6 py-3 text-sm text-gray-800">
                          {(currentPage - 1) * pageSize + index + 1}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-800">{item.productName}</td>
                        <td className="px-6 py-3 text-sm text-gray-800">{totalQuantity}</td>
                        <td className="px-6 py-3 text-sm text-gray-800">
                          {item.variants?.map((variant, idx) => (
                            <div key={idx} className="flex items-center gap-2 mb-1">
                              <span className="text-gray-700 text-sm font-medium">
                                {variant.size}:
                              </span>
                              <span className="text-gray-600 text-sm">
                                {variant.quantity} pcs
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-md text-xs font-semibold ${getBadgeClass(
                                  variant.stockStatus
                                )}`}
                              >
                                {variant.stockStatus}
                              </span>
                            </div>
                          ))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-4">No stock data found.</p>
          )}

          {/* Pagination */}
          {filteredItems.length > pageSize && (
            <div className="flex items-center justify-center px-4 py-3">
              <div className="flex justify-center mt-6 space-x-2">
                <button
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() =>
                    currentPage > 1 && handlePageChange(currentPage - 1)
                  }
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    className={`px-3 py-1 border rounded-md ${
                      currentPage === index + 1
                        ? "bg-gray-800 text-white"
                        : "bg-white text-gray-800 border-gray-300"
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() =>
                    currentPage < totalPages &&
                    handlePageChange(currentPage + 1)
                  }
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductStockPage;
