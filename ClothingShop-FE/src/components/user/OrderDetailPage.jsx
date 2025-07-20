import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, User, Phone, MapPin } from "lucide-react";
import { toast } from "react-toastify";

const statusOptions = [
  { value: 1, label: "Pending" },
  { value: 2, label: "Confirmed" },
  { value: 3, label: "Processing" },
  { value: 4, label: "Shipped" },
  { value: 5, label: "Delivered" },
  { value: 6, label: "Cancelled" },
];

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`http://localhost:5078/api/Order/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrder(res.data);
        setSelectedStatus(res.data.status);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to load order:", err);
        setLoading(false);
      });
  }, [id]);

  const handleStatusUpdate = () => {
    axios
      .put(
        `http://localhost:5078/api/Order/${id}/status`,
        { status: selectedStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        toast.success("Status updated successfully!");
      })
      .catch((err) => {
        console.error("Failed to update status:", err);
        toast.error("Failed to update status.");
      });
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!order) return <p className="p-6 text-red-500">Order not found</p>;

  const subtotal = order.orderDetails.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-blue-600 hover:underline"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-indigo-600">
              <User size={20} />
              Customer Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  disabled
                  value={order.customerName}
                  className="w-full border rounded px-4 py-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Phone Number
                </label>
                <div className="flex items-center border rounded px-4 py-2 mt-1 bg-gray-50">
                  <Phone size={16} className="mr-2 text-gray-400" />
                  {order.phoneNumber}
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-indigo-600">
              <MapPin size={20} />
              Shipping Information
            </h3>
            <label className="block text-gray-700 font-medium mb-1">
              Shipping Address
            </label>
            <textarea
              disabled
              value={order.address}
              className="w-full border rounded px-4 py-2"
            />
          </div>

          {/* Order Status */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-indigo-600">
              Update Order Status
            </h3>
            <div className="flex gap-4 items-center">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(parseInt(e.target.value))}
                className="border rounded px-4 py-2"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                onClick={handleStatusUpdate}
                className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Order Summary */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
          <ul className="divide-y text-sm mb-4">
            {order.orderDetails.map((item) => (
              <li key={item.id} className="py-2 flex justify-between">
                <span>
                  {item.productName} x {item.quantity}
                </span>
                <span>
                  {(item.unitPrice * item.quantity).toLocaleString("vi-VN")} đ
                </span>
              </li>
            ))}
          </ul>

          <div className="text-sm space-y-1 text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{subtotal.toLocaleString("vi-VN")} đ</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (10%)</span>
              <span>{tax.toLocaleString("vi-VN")} đ</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{total.toLocaleString("vi-VN")} đ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
