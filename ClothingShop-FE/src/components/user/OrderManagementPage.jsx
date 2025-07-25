import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchOrders,
  setCurrentPage,
  setStatusFilter,
} from "../../redux/slices/OrderManagementSlice";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";

export default function OrderManagementPage() {
  const dispatch = useDispatch();
  const {
    orders,
    currentPage,
    pageSize,
    totalCount,
    loading,
    error,
    statusFilter,
  } = useSelector((state) => state.orderManagement);

  const [selectedSort, setSelectedSort] = useState("dateDesc");
const [sortQuery, setSortQuery] = useState("OrderDate desc");

  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    const skip = (currentPage - 1) * pageSize;
    let query = `$top=${pageSize}&$skip=${skip}&$count=true`;

    const filters = [];
    if (statusFilter) filters.push(`Status eq ${statusFilter}`);
    if (filters.length > 0) query += `&$filter=${filters.join(" and ")}`;
    if (sortQuery) query += `&$orderby=${sortQuery}`;

    dispatch(fetchOrders({ query }));
  }, [dispatch, currentPage, pageSize, sortQuery, statusFilter]);
function getStatusName(status) {
  switch (status) {
    case 1: return "Pending";
    case 2: return "Confirmed";
    case 3: return "Processing";
    case 4: return "Shipped";
    case 5: return "Delivered";
    case 6: return "Cancelled";
    default: return "Unknown";
  }
}

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
      </div>

      {/* Filter and Sort */}
      <div className="flex justify-between items-center mb-4 space-x-4">
        {/* Sort Dropdown */}
        <select
          value={selectedSort}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedSort(value);
            switch (value) {
              case "dateDesc":
                setSortQuery("OrderDate desc");
                break;
              case "dateAsc":
                setSortQuery("OrderDate asc");
                break;
              case "amountDesc":
                setSortQuery("TotalAmount desc");
                break;
              case "amountAsc":
                setSortQuery("TotalAmount asc");
                break;
              default:
                setSortQuery("");
            }
            dispatch(setCurrentPage(1));
          }}
          className="border px-3 py-1 rounded text-sm"
        >
          <option value="">-- Sort --</option>
          <option value="dateDesc">Date: Newest</option>
          <option value="dateAsc">Date: Oldest</option>
          <option value="amountDesc">Amount: High → Low</option>
          <option value="amountAsc">Amount: Low → High</option>
        </select>

        {/* Filter by Status */}
        <select
          value={statusFilter}
          onChange={(e) => {
            dispatch(setStatusFilter(e.target.value));
            dispatch(setCurrentPage(1));
          }}
          className="border px-3 py-1 rounded text-sm"
        >
          <option value="">-- All Statuses --</option>
          <option value="1">Pending</option>
          <option value="2">Confirmed</option>
          <option value="3">Processing</option>
          <option value="4">Shipped</option>
          <option value="5">Delivered</option>
          <option value="6">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">#</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Customer</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Total</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {orders.map((order, index) => (
                  <tr key={order.Id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">{(currentPage - 1) * pageSize + index + 1}</td>
                    <td className="px-6 py-3">{order.FullName}</td>
                    <td className="px-6 py-3">
                      {new Date(order.OrderDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3">
                      {order.TotalAmount?.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.Status === 1
                          ? "bg-yellow-100 text-yellow-800"
                          : order.Status === 4
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {getStatusName(order.Status)}
                      </span>
                    </td>
                    <td className="px-6 py-3 space-x-2 text-sm">
                      <Link to={`/orders/${order.Id}`} className="text-blue-600 hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center px-4 py-3">
              <div className="flex justify-center mt-6 space-x-2">
                <button
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => currentPage > 1 && dispatch(setCurrentPage(currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`px-3 py-1 border rounded-md ${
                      currentPage === i + 1
                        ? "bg-gray-800 text-white"
                        : "bg-white text-gray-800 border-gray-300"
                    }`}
                    onClick={() => dispatch(setCurrentPage(i + 1))}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => currentPage < totalPages && dispatch(setCurrentPage(currentPage + 1))}
                  disabled={currentPage === totalPages}
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
