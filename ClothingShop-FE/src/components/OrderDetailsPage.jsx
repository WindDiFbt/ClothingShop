import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaPhone, FaMapMarkerAlt, FaCreditCard, FaCalendarAlt, FaHashtag } from 'react-icons/fa';
import { useGetOrderQuery, useCancelOrderMutation } from '../services/orderAPI';
import { toast } from 'react-toastify';

const OrderDetailsPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { data: order, isLoading, error, refetch } = useGetOrderQuery(orderId);
    const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const handleCancelOrder = async () => {
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
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
                    <p className="text-gray-600 mb-4">The order you're looking for doesn't exist or you don't have permission to view it.</p>
                    <button
                        onClick={() => navigate('/orders')}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                        View All Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-indigo-600 hover:text-indigo-700 mb-4"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back
                    </button>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
                            <p className="text-gray-600 mt-1">Order #{order.id}</p>
                        </div>

                        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                                {order.statusName}
                            </span>
                            {order.status === 1 && (
                                <>
                                    <button
                                        onClick={() => navigate(`/payment/${order.id}`)}
                                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-1"
                                    >
                                        <FaCreditCard />
                                        <span>Pay Now</span>
                                    </button>
                                    <button
                                        onClick={handleCancelOrder}
                                        disabled={isCancelling}
                                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
                                    >
                                        {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>

                            <div className="space-y-4">
                                {order.orderDetails?.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                                        <img
                                            src={item.product.thumbnailUrl}
                                            alt={item.productName}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{item.productName}</h3>
                                            <p className="text-sm text-gray-600">
                                                {formatCurrency(item.unitPrice)} × {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900">
                                                {formatCurrency(item.totalPrice)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t mt-6 pt-4">
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total Amount</span>
                                    <span>{formatCurrency(order.totalAmount)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Order Timeline */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Timeline</h2>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <div>
                                        <p className="font-medium text-gray-900">Order Placed</p>
                                        <p className="text-sm text-gray-600">
                                            <FaCalendarAlt className="inline mr-1" />
                                            {formatDate(order.createAt)}
                                        </p>
                                    </div>
                                </div>

                                {order.status >= 2 && (
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                        <div>
                                            <p className="font-medium text-gray-900">Order Processing</p>
                                            <p className="text-sm text-gray-600">Your order is being prepared</p>
                                        </div>
                                    </div>
                                )}

                                {order.status >= 3 && (
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                        <div>
                                            <p className="font-medium text-gray-900">Order Shipped</p>
                                            <p className="text-sm text-gray-600">Your order is on the way</p>
                                        </div>
                                    </div>
                                )}

                                {order.status === 5 && (
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                                        <div>
                                            <p className="font-medium text-gray-900">Order Completed</p>
                                            <p className="text-sm text-gray-600">Your order has been delivered</p>
                                        </div>
                                    </div>
                                )}

                                {order.status === 4 && (
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <div>
                                            <p className="font-medium text-gray-900">Order Cancelled</p>
                                            <p className="text-sm text-gray-600">This order has been cancelled</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4 space-y-6">
                            {/* Customer Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <FaUser className="text-gray-400" />
                                        <span className="text-gray-900">{order.customerName}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <FaPhone className="text-gray-400" />
                                        <span className="text-gray-900">{order.phoneNumber}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Shipping Address</h3>
                                <div className="flex items-start space-x-3">
                                    <FaMapMarkerAlt className="text-gray-400 mt-1" />
                                    <span className="text-gray-900">{order.address}</span>
                                </div>
                            </div>



                            {/* Order Details */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Details</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Order Date</span>
                                        <span className="text-gray-900">{formatDate(order.createAt)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Last Updated</span>
                                        <span className="text-gray-900">{formatDate(order.updateAt)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Notes */}
                            {order.note && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Notes</h3>
                                    <p className="text-gray-600 text-sm">{order.note}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;
