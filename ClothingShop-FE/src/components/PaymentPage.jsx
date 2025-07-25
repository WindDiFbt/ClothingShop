import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaCreditCard, FaMoneyBillWave, FaQrcode, FaExternalLinkAlt, FaSpinner } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import { useGetOrderQuery } from '../services/orderAPI';
import { useCreatePayOSPaymentMutation } from '../services/paymentAPI';
import { selectAuth } from '../redux/auth/authSlice';
import { toast } from 'react-toastify';

const PaymentPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector(selectAuth);
    const [selectedMethod, setSelectedMethod] = useState('payos');
    const [paymentData, setPaymentData] = useState(null);

    const { data: order, isLoading: isOrderLoading, error: orderError } = useGetOrderQuery(orderId);
    const [createPayOSPayment, { isLoading: isCreatingPayment }] = useCreatePayOSPaymentMutation();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    useEffect(() => {
        if (!user) {
            toast.error('Please login to continue');
            navigate('/login');
            return;
        }

        if (orderError) {
            toast.error('Order not found');
            navigate('/orders');
            return;
        }

        if (order && order.status !== 1) {
            toast.info('This order is not available for payment');
            navigate(`/order/${orderId}`);
            return;
        }
    }, [user, order, orderError, orderId, navigate]);

    const handlePayOSPayment = async () => {
        try {
            const result = await createPayOSPayment({ orderId }).unwrap();

            if (result.success && result.data) {
                setPaymentData(result.data);
                toast.success('Payment link created successfully!');
            } else {
                toast.error(result.message || 'Failed to create payment link');
            }
        } catch (error) {
            console.error('PayOS payment error:', error);
            toast.error(error.data?.message || 'Failed to create payment link');
        }
    };

    const handleCODPayment = () => {
        // COD is already handled in checkout, redirect to order details
        toast.info('COD payment is selected during checkout');
        navigate(`/order/${orderId}`);
    };

    const openPaymentLink = () => {
        if (paymentData?.checkoutUrl) {
            window.open(paymentData.checkoutUrl, '_blank');
        }
    };

    if (isOrderLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
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
                    <h1 className="text-3xl font-bold text-gray-900">Payment</h1>
                    <p className="text-gray-600 mt-2">Complete your payment for Order #{order.id.slice(0, 8)}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Payment Methods */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Choose Payment Method</h2>

                            <div className="space-y-4">
                                {/* PayOS Payment */}
                                <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedMethod === 'payos' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'
                                    }`} onClick={() => setSelectedMethod('payos')}>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="payos"
                                            checked={selectedMethod === 'payos'}
                                            onChange={() => setSelectedMethod('payos')}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <div className="ml-4 flex-1">
                                            <div className="flex items-center">
                                                <FaCreditCard className="text-blue-600 mr-2" />
                                                <span className="font-medium text-gray-900">PayOS - Online Banking</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Pay securely with your bank account via PayOS
                                            </p>
                                        </div>
                                    </div>

                                    {selectedMethod === 'payos' && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            {!paymentData ? (
                                                <button
                                                    onClick={handlePayOSPayment}
                                                    disabled={isCreatingPayment}
                                                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                                                >
                                                    {isCreatingPayment ? (
                                                        <>
                                                            <FaSpinner className="animate-spin mr-2" />
                                                            Creating Payment Link...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FaCreditCard className="mr-2" />
                                                            Create Payment Link
                                                        </>
                                                    )}
                                                </button>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                                                        <h4 className="font-medium text-green-900 mb-2">Payment Link Created!</h4>
                                                        <p className="text-sm text-green-700 mb-3">
                                                            Click the button below to complete your payment
                                                        </p>
                                                        <button
                                                            onClick={openPaymentLink}
                                                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
                                                        >
                                                            <FaExternalLinkAlt className="mr-2" />
                                                            Pay Now - {formatCurrency(paymentData.amount)}
                                                        </button>
                                                    </div>

                                                    {(paymentData.qrCode || paymentData.checkoutUrl) && (
                                                        <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                                                            <div className="flex items-center mb-2">
                                                                <FaQrcode className="text-gray-600 mr-2" />
                                                                <span className="font-medium text-gray-900">QR Code Payment</span>
                                                            </div>
                                                            <div className="flex justify-center">
                                                                <QRCodeSVG
                                                                    value={paymentData.checkoutUrl || paymentData.qrCode}
                                                                    size={192}
                                                                    level="M"
                                                                    includeMargin={true}
                                                                    className="border border-gray-300 rounded"
                                                                />
                                                            </div>
                                                            <p className="text-sm text-gray-600 text-center mt-2">
                                                                Scan this QR code with your banking app or camera
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* COD Payment */}
                                <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedMethod === 'cod' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'
                                    }`} onClick={() => setSelectedMethod('cod')}>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={selectedMethod === 'cod'}
                                            onChange={() => setSelectedMethod('cod')}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <div className="ml-4 flex-1">
                                            <div className="flex items-center">
                                                <FaMoneyBillWave className="text-green-600 mr-2" />
                                                <span className="font-medium text-gray-900">Cash on Delivery (COD)</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Pay when you receive your order
                                            </p>
                                        </div>
                                    </div>

                                    {selectedMethod === 'cod' && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <button
                                                onClick={handleCODPayment}
                                                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 flex items-center"
                                            >
                                                <FaMoneyBillWave className="mr-2" />
                                                Continue with COD
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

                            <div className="space-y-4 mb-6">
                                {order.orderDetails?.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-3">
                                        <img
                                            src={item.product?.thumbnailUrl || '/images/placeholder.jpg'}
                                            alt={item.product?.name}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {item.product?.name || 'Product'}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {formatCurrency(item.totalPrice)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                    <p>Total Amount</p>
                                    <p>{formatCurrency(order.totalAmount)}</p>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <div className="text-sm text-gray-600">
                                    <p><strong>Customer:</strong> {order.fullName}</p>
                                    <p><strong>Phone:</strong> {order.phoneNumber}</p>
                                    <p><strong>Address:</strong> {order.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
