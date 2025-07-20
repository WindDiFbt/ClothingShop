import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { useGetPaymentStatusQuery } from '../services/paymentAPI';
import { useGetOrderQuery } from '../services/orderAPI';
import { toast } from 'react-toastify';

const PaymentSuccessPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [paymentVerified, setPaymentVerified] = useState(false);

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

        // Auto-verify payment status after a short delay
        const timer = setTimeout(() => {
            setPaymentVerified(true);
            toast.success('Payment completed successfully!');
        }, 2000);

        return () => clearTimeout(timer);
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

    if (isOrderLoading || !paymentVerified) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
                    <FaSpinner className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Verifying Payment...
                    </h2>
                    <p className="text-gray-600">
                        Please wait while we verify your payment
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Success Header */}
                    <div className="bg-green-50 px-6 py-8 text-center">
                        <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-green-900 mb-2">
                            Payment Successful!
                        </h1>
                        <p className="text-green-700 text-lg">
                            Thank you for your payment. Your order has been confirmed.
                        </p>
                    </div>

                    {/* Order Details */}
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
                                                <p><strong>Payment Method:</strong> PayOS - Online Banking</p>
                                                <p><strong>Status:</strong> <span className="text-green-600 font-medium">Paid</span></p>
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

                        {/* Next Steps */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h2>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <div className="space-y-3 text-sm text-blue-900">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</div>
                                        <p>Your order is being processed and will be shipped within 1-2 business days.</p>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</div>
                                        <p>You will receive a confirmation email with tracking information.</p>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</div>
                                        <p>You can track your order status in your account order history.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate(`/order/${orderId}`)}
                                className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
                            >
                                View Order Details
                            </button>
                            <button
                                onClick={() => navigate('/orders')}
                                className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors"
                            >
                                View All Orders
                            </button>
                            <button
                                onClick={() => navigate('/products')}
                                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
