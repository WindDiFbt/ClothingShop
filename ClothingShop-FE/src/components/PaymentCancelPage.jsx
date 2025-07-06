import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaTimesCircle, FaArrowLeft } from 'react-icons/fa';
import { useGetOrderQuery } from '../services/orderAPI';
import { toast } from 'react-toastify';

const PaymentCancelPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');

    const { data: order, isLoading: isOrderLoading } = useGetOrderQuery(orderId, {
        skip: !orderId
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    useEffect(() => {
        if (!orderId) {
            toast.error('Invalid payment session');
            navigate('/orders');
            return;
        }

        toast.info('Payment was cancelled. You can try again anytime.');
    }, [orderId, navigate]);

    if (!orderId) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Payment Session</h2>
                    <button
                        onClick={() => navigate('/orders')}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                        View Orders
                    </button>
                </div>
            </div>
        );
    }

    if (isOrderLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Cancel Header */}
                    <div className="bg-red-50 px-6 py-8 text-center">
                        <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-red-900 mb-2">
                            Payment Cancelled
                        </h1>
                        <p className="text-red-700 text-lg">
                            Your payment was cancelled. Don't worry, you can try again anytime.
                        </p>
                    </div>

                    {/* Order Information */}
                    <div className="px-6 py-8">
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Information</h2>

                            {order && (
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="font-medium text-gray-900 mb-2">Order Details</h3>
                                            <div className="space-y-1 text-sm text-gray-600">
                                                <p><strong>Order ID:</strong> #{order.id.slice(0, 8)}</p>
                                                <p><strong>Amount:</strong> {formatCurrency(order.totalAmount)}</p>
                                                <p><strong>Status:</strong> <span className="text-yellow-600 font-medium">Pending Payment</span></p>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="font-medium text-gray-900 mb-2">Customer Information</h3>
                                            <div className="space-y-1 text-sm text-gray-600">
                                                <p><strong>Name:</strong> {order.fullName}</p>
                                                <p><strong>Phone:</strong> {order.phoneNumber}</p>
                                                <p><strong>Address:</strong> {order.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* What happened */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">What Happened?</h2>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                <div className="space-y-3 text-sm text-yellow-900">
                                    <p>Your payment was cancelled, but your order is still active. This could happen for several reasons:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        <li>You clicked the back button or closed the payment window</li>
                                        <li>The payment session timed out</li>
                                        <li>There was a technical issue with the payment gateway</li>
                                        <li>You chose to cancel the payment</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h2>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <div className="space-y-3 text-sm text-blue-900">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</div>
                                        <p>Your order is still pending and waiting for payment.</p>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</div>
                                        <p>You can try the payment again by clicking "Try Payment Again" below.</p>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</div>
                                        <p>Or you can choose Cash on Delivery (COD) if you prefer.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate(`/payment/${orderId}`)}
                                className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
                            >
                                <FaArrowLeft className="mr-2" />
                                Try Payment Again
                            </button>
                            <button
                                onClick={() => navigate(`/order/${orderId}`)}
                                className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors"
                            >
                                View Order Details
                            </button>
                            <button
                                onClick={() => navigate('/orders')}
                                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                View All Orders
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentCancelPage;
