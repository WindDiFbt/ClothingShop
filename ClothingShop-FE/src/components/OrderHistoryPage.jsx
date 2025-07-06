import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaTimes, FaShoppingBag, FaCalendarAlt } from 'react-icons/fa';
import { useGetUserOrdersQuery, useCancelOrderMutation } from '../services/orderAPI';
import { toast } from 'react-toastify';
import OrderFeedback from './OrderFeedback';

const OrderHistoryPage = () => {
    const navigate = useNavigate();
    const { data: orders, isLoading, error, refetch } = useGetUserOrdersQuery();
    const [cancelOrder] = useCancelOrderMutation();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const handleCancelOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            try {
                await cancelOrder(orderId).unwrap();
                toast.success('Order cancelled successfully');
                refetch();
            } catch (error) {
                toast.error(error.data?.message || 'Failed to cancel order');
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 1: // PENDING CONFIRMATION
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 2: // CONFIRMED
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 3: // SHIPPING
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 4: // DELIVERED
                return 'bg-green-100 text-green-800 border-green-200';
            case 5: // CANCELLED
                return 'bg-red-100 text-red-800 border-red-200';
            case 6: // RETURNED
                return 'bg-orange-100 text-orange-800 border-orange-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Orders</h2>
                    <p className="text-gray-600 mb-4">There was an error loading your orders. Please try again.</p>
                    <button
                        onClick={() => refetch()}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
                    <p className="text-gray-600 mt-2">Track and manage your orders</p>
                </div>

                {/* Orders List */}
                {!orders || orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <FaShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No Orders Yet</h3>
                        <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your order history here.</p>
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                {/* Order Header */}
                                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    Order #{order.id.slice(0, 8)}...
                                                </h3>
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <FaCalendarAlt />
                                                    <span>{formatDate(order.createAt)}</span>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                                                {order.statusName}
                                            </span>
                                        </div>

                                        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                                            <span className="text-lg font-bold text-gray-900">
                                                {formatCurrency(order.totalAmount)}
                                            </span>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => navigate(`/order/${order.id}`)}
                                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center space-x-1"
                                                >
                                                    <FaEye />
                                                    <span>View</span>
                                                </button>
                                                {order.status === 1 && (
                                                    <button
                                                        onClick={() => handleCancelOrder(order.id)}
                                                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center space-x-1"
                                                    >
                                                        <FaTimes />
                                                        <span>Cancel</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="px-6 py-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {order.orderDetails?.slice(0, 3).map((item) => (
                                            <div key={item.id} className="flex flex-col space-y-2">
                                                <div className="flex items-center space-x-3">
                                                    <img
                                                        src={item.product.thumbnailUrl}
                                                        alt={item.productName}
                                                        className="w-12 h-12 object-cover rounded"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {item.productName}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                                                        </p>
                                                    </div>
                                                </div>
                                                {/* Feedback cho từng sản phẩm */}
                                                <OrderFeedback order={order} orderDetail={item} />
                                            </div>
                                        ))}
                                        {order.orderDetails && order.orderDetails.length > 3 && (
                                            <div className="flex items-center justify-center text-sm text-gray-500">
                                                +{order.orderDetails.length - 3} more items
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Order Info */}
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-900">Customer:</span>
                                            <span className="ml-2 text-gray-600">{order.customerName}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-900">Phone:</span>
                                            <span className="ml-2 text-gray-600">{order.customerPhone}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-900">Payment:</span>
                                            <span className="ml-2 text-gray-600">{order.paymentMethod}</span>
                                        </div>
                                    </div>

                                    <div className="mt-2">
                                        <span className="font-medium text-gray-900">Shipping Address:</span>
                                        <span className="ml-2 text-gray-600">{order.shippingAddress}</span>
                                    </div>

                                    {order.note && (
                                        <div className="mt-2">
                                            <span className="font-medium text-gray-900">Notes:</span>
                                            <span className="ml-2 text-gray-600">{order.note}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistoryPage;
