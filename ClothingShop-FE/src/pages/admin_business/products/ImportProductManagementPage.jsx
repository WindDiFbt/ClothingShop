import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  fetchProducts,
  setCurrentPage,
  setCategoryFilterSeller,
} from "../../../redux/slices/ProductSlice";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

export default function ProductManagementPage() {
  const dispatch = useDispatch();
  const {
    products,
    loading,
    error,
    currentPage,
    pageSize,
    countProduct,
    categoryFilter,
  } = useSelector((state) => state.product);

  const [sortQuery, setSortQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5078/api/Categories")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.error("Failed to load categories:", err);
      });
  }, []);
  useEffect(() => {
    const skip = (currentPage - 1) * pageSize;
    let query = `$top=${pageSize}&$skip=${skip}`;

    const filters = [];
    if (categoryFilter.query) filters.push(categoryFilter.query);
    if (filters.length > 0) query += `&$filter=${filters.join(" and ")}`;
    if (sortQuery) query += `&${sortQuery}`;

    dispatch(fetchProducts({ query }));
  }, [dispatch, currentPage, pageSize, sortQuery, categoryFilter]);

  const totalPages = Math.ceil(countProduct / pageSize);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4"></div>

      {/* Filter and Sort */}
      <div className="flex justify-between items-center mb-4 space-x-4">
        <select
          value={categoryFilter.name}
          onChange={(e) => {
            const sel = categories.find((c) => c.name === e.target.value);
            dispatch(setCategoryFilterSeller(sel || null));
            dispatch(setCurrentPage(1));
          }}
          className="border border-gray-300 rounded-md px-3 py-1 text-sm"
        >
          <option value="">-- All Categories --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={selectedSort}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedSort(value);
            switch (value) {
              case "newest":
                setSortQuery("$orderby=CreateAt desc");
                break;
              case "priceAsc":
                setSortQuery("$orderby=Price asc");
                break;
              case "priceDesc":
                setSortQuery("$orderby=Price desc");
                break;
              default:
                setSortQuery("");
            }
            dispatch(setCurrentPage(1));
          }}
          className="border border-gray-300 rounded-md px-3 py-1 text-sm"
        >
          <option value="">-- Sort --</option>
          <option value="newest">Newest</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
        </select>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {products?.map((product, i) => (
                  <tr key={product.Id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-800">
                      {(currentPage - 1) * pageSize + i + 1}
                    </td>
                    <td className="px-6 py-3">
                      <img
                        src={product.ThumbnailUrl}
                        alt={product.Name}
                        className="w-14 h-14 object-cover rounded-md border"
                      />
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-800">
                      {product.Name}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-800">
                      {typeof product.Price === "number" ? (
                        product.Discount > 0 ? (
                          <div className="flex flex-col text-sm">
                            <span className="line-through text-gray-400">
                              {product.Price.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </span>
                            <span className="text-gray-800 font-medium">
                              {(
                                product.Price *
                                (1 - product.Discount / 100)
                              ).toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </span>
                          </div>
                        ) : (
                          product.Price.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })
                        )
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <select
                        value={product.Status}
                        onChange={async (e) => {
                          const newStatusId = parseInt(e.target.value);
                          const token = localStorage.getItem("token");
                          try {
                            await axios.put(
                              `http://localhost:5078/api/Products/${product.Id}/status?newStatus=${newStatusId}`,
                              null,
                              {
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                              }
                            );
                            dispatch(fetchProducts({ query: "" })); // Refetch
                          } catch (error) {
                            console.error(
                              "Failed to update product status",
                              error
                            );
                            alert(
                              "Không thể cập nhật trạng thái. Có thể bạn chưa đăng nhập."
                            );
                          }
                        }}
                        className="border px-2 py-1 rounded"
                        disabled={product.Status === 3} // Không cho đổi nếu bị từ chối
                      >
                        <option value="1">Approved</option>
                        <option value="2">Unapproved</option>
                        <option value="3">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products?.length === 0 && (
              <p className="text-center text-gray-500 mt-4">
                No products found.
              </p>
            )}
          </div>

          {/* Pagination */}
          {products && countProduct > pageSize && (
            <div className="flex items-center justify-center px-4 py-3">
              <div className="flex justify-center mt-6 space-x-2">
                <button
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() =>
                    currentPage > 1 && dispatch(setCurrentPage(currentPage - 1))
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
                    onClick={() => dispatch(setCurrentPage(index + 1))}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() =>
                    currentPage < totalPages &&
                    dispatch(setCurrentPage(currentPage + 1))
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
}
