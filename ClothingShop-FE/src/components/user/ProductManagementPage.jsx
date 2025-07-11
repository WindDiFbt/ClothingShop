import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  fetchProducts,
  setCurrentPage,
  setCategoryFilter
} from "../../redux/slices/ProductSlice";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";

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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Manage Products</h2>
        <Link
          to="/seller/products/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Add Product
        </Link>
      </div>

      {/* Filter and Sort */}
      <div className="flex justify-between items-center mb-4 space-x-4">
        <select
          value={categoryFilter.name}
          onChange={(e) => {
            const sel = categories.find(c => c.name === e.target.value);
            dispatch(setCategoryFilter(sel || null));
            dispatch(setCurrentPage(1));
          }}
          className="border border-gray-300 rounded-md px-3 py-1 text-sm"
        >
          <option value="">-- All Categories --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
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
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">#</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Image</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
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
                    <td className="px-6 py-3 text-sm text-gray-800">{product.Name}</td>
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
                                product.Price * (1 - product.Discount / 100)
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
                      {product.Status === 1 ? (
                        <span className="text-green-600 font-medium">Approved</span>
                      ) : (
                        <span className="text-yellow-500 font-medium">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-sm space-x-2">
                      <Link
                        to={`/seller/products/edit/${product.Id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products?.length === 0 && (
              <p className="text-center text-gray-500 mt-4">No products found.</p>
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
