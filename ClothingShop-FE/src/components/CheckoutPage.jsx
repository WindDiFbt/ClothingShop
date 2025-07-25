import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaMoneyBillWave, FaShippingFast, FaUser, FaPhone, FaMapMarkerAlt, FaStickyNote, FaSpinner } from 'react-icons/fa';
import { useCheckoutMutation } from '../services/orderAPI';
import { useCreatePayOSPaymentMutation } from '../services/paymentAPI';
import { useGetCartQuery } from '../services/cartAPI';
import { updateCheckoutForm, resetCheckoutForm, selectCheckoutForm } from '../redux/slices/orderSlice';
import { selectAuth } from '../redux/auth/authSlice';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(selectAuth);
    const checkoutForm = useSelector(selectCheckoutForm);
    console.log('Current checkoutForm:', checkoutForm); // Debug log
    const [checkout, { isLoading: isCheckingOut }] = useCheckoutMutation();
    const [createPayOSPayment, { isLoading: isCreatingPayment }] = useCreatePayOSPaymentMutation();
    const { data: cartData, isLoading: isCartLoading } = useGetCartQuery(user?.id, {
        skip: !user?.id
    });

    const [formErrors, setFormErrors] = useState({});
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // Initialize form with user data if available (only once)
    useEffect(() => {
        if (user && (!checkoutForm.customerName && !checkoutForm.customerPhone)) {
            dispatch(updateCheckoutForm({
                customerName: user.fullName || '',
                customerPhone: user.phoneNumber || '',
            }));
        }
    }, [user, dispatch]); // Remove checkoutForm dependencies to avoid re-triggering

    // Redirect if cart is empty
    useEffect(() => {
        if (!isCartLoading && (!cartData || !cartData.cartDetails || cartData.cartDetails.length === 0)) {
            toast.info('Your cart is empty. Please add items before checkout.');
            navigate('/cart');
        }
    }, [cartData, isCartLoading, navigate]);

    const handleInputChange = (field, value) => {
        console.log('Input change:', field, value); // Debug log
        dispatch(updateCheckoutForm({ [field]: value }));
        // Clear error when user starts typing
        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!checkoutForm.customerName.trim()) {
            errors.customerName = 'Full name is required';
        }

        if (!checkoutForm.customerPhone.trim()) {
            errors.customerPhone = 'Phone number is required';
        } else if (!/^[0-9]{10,11}$/.test(checkoutForm.customerPhone.replace(/\s/g, ''))) {
            errors.customerPhone = 'Please enter a valid phone number';
        }

        if (!checkoutForm.shippingAddress.trim()) {
            errors.shippingAddress = 'Shipping address is required';
        }

        if (!checkoutForm.paymentMethod) {
            errors.paymentMethod = 'Payment method is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const calculateSubtotal = () => {
        if (!cartData || !cartData.cartDetails) return 0;
        return cartData.cartDetails.reduce((total, item) => {
            const currentPrice = item.product?.currentPrice || item.product?.price || 0;
            return total + currentPrice * item.quantity;
        }, 0);
    };

    const calculateTax = () => {
        return Math.round(calculateSubtotal() * 0.1);
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTax();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fill in all required fields correctly');
            return;
        }

        try {
            setIsProcessingPayment(true);

            // First create the order
            const result = await checkout(checkoutForm).unwrap();

            if (result.success) {
                toast.success('Order created successfully!');
                dispatch(resetCheckoutForm());

                // If PayOS payment is selected, create payment link
                if (checkoutForm.paymentMethod === 'PAYOS') {
                    try {
                        const paymentResult = await createPayOSPayment({ orderId: result.orderId }).unwrap();

                        if (paymentResult.success && paymentResult.data) {
                            toast.info('Redirecting to payment...');
                            // Redirect to PayOS checkout page
                            window.location.href = paymentResult.data.checkoutUrl;
                        } else {
                            toast.error(paymentResult.message || 'Failed to create payment link');
                            // Redirect to order details if payment link creation fails
                            navigate(`/order/${result.orderId}`);
                        }
                    } catch (paymentError) {
                        console.error('PayOS payment error:', paymentError);
                        toast.error('Failed to create payment link. You can pay later from order details.');
                        navigate(`/order/${result.orderId}`);
                    }
                } else {
                    // For COD, go directly to order details
                    navigate(`/order/${result.orderId}`);
                }
            } else {
                toast.error(result.message || 'Failed to place order');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error(error.data?.message || 'An error occurred during checkout');
        } finally {
            setIsProcessingPayment(false);
        }
    };

    if (isCartLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!cartData || !cartData.cartDetails || cartData.cartDetails.length === 0) {
        return null; // Will redirect via useEffect
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Customer Information */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <FaUser className="mr-2 text-indigo-600" />
                                    Customer Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={checkoutForm.customerName}
                                            onChange={(e) => handleInputChange('customerName', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${formErrors.customerName ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Enter your full name"
                                        />
                                        {formErrors.customerName && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.customerName}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone Number *
                                        </label>
                                        <div className="relative">
                                            <FaPhone className="absolute left-3 top-3 text-gray-400" />
                                            <input
                                                type="tel"
                                                value={checkoutForm.customerPhone}
                                                onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                                                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${formErrors.customerPhone ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                placeholder="0123456789"
                                            />
                                        </div>
                                        {formErrors.customerPhone && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.customerPhone}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Information */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <FaShippingFast className="mr-2 text-indigo-600" />
                                    Shipping Information
                                </h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Shipping Address *
                                    </label>
                                    <div className="relative">
                                        <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                                        <textarea
                                            value={checkoutForm.shippingAddress}
                                            onChange={(e) => handleInputChange('shippingAddress', e.target.value)}
                                            rows={3}
                                            className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${formErrors.shippingAddress ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Enter your full shipping address"
                                        />
                                    </div>
                                    {formErrors.shippingAddress && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.shippingAddress}</p>
                                    )}
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <FaCreditCard className="mr-2 text-indigo-600" />
                                    Payment Method
                                </h2>

                                <div className="space-y-3">
                                    <label className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="COD"
                                            checked={checkoutForm.paymentMethod === 'COD'}
                                            onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <FaMoneyBillWave className="ml-3 mr-2 text-green-600" />
                                        <div className="flex-1">
                                            <span className="text-gray-900 font-medium">Cash on Delivery (COD)</span>
                                            <p className="text-sm text-gray-500 mt-1">Pay when you receive your order</p>
                                        </div>
                                    </label>

                                    <label className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="PAYOS"
                                            checked={checkoutForm.paymentMethod === 'PAYOS'}
                                            onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <FaCreditCard className="ml-3 mr-2 text-blue-600" />
                                        <div className="flex-1">
                                            <span className="text-gray-900 font-medium">PayOS - Online Banking</span>
                                            <p className="text-sm text-gray-500 mt-1">Pay securely with your bank account</p>
                                        </div>
                                    </label>
                                </div>
                                {formErrors.paymentMethod && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.paymentMethod}</p>
                                )}
                            </div>

                            {/* Order Notes */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <FaStickyNote className="mr-2 text-indigo-600" />
                                    Order Notes (Optional)
                                </h2>

                                <textarea
                                    value={checkoutForm.note}
                                    onChange={(e) => handleInputChange('note', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Any special instructions for your order..."
                                />
                            </div>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                {cartData?.cartDetails?.map((item) => (
                                    <div key={item.productId} className="flex items-center space-x-3">
                                        <img
                                            src={item.product?.thumbnailUrl || '/images/placeholder.jpg'}
                                            alt={item.product?.name}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {item.product?.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Qty: {item.quantity} × {formatCurrency(item.product?.currentPrice || item.product?.price)}
                                            </p>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {formatCurrency((item.product?.currentPrice || item.product?.price || 0) * item.quantity)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                    <p>Subtotal</p>
                                    <p>{formatCurrency(calculateSubtotal())}</p>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <p>Shipping</p>
                                    <p>Free</p>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <p>Tax (VAT 10%)</p>
                                    <p>{formatCurrency(calculateTax())}</p>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
                                    <p>Total</p>
                                    <p>{formatCurrency(calculateTotal())}</p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                onClick={handleSubmit}
                                disabled={isCheckingOut || isProcessingPayment}
                                className="w-full mt-6 bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                            >
                                {isProcessingPayment ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" />
                                        {checkoutForm.paymentMethod === 'PAYOS' ? 'Creating Payment...' : 'Processing Order...'}
                                    </>
                                ) : (
                                    <>
                                        {checkoutForm.paymentMethod === 'PAYOS' ? (
                                            <>
                                                <FaCreditCard className="mr-2" />
                                                Pay with PayOS - {formatCurrency(calculateTotal())}
                                            </>
                                        ) : (
                                            <>
                                                <FaMoneyBillWave className="mr-2" />
                                                Place Order (COD)
                                            </>
                                        )}
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-gray-500 text-center mt-3">
                                {checkoutForm.paymentMethod === 'PAYOS' ? (
                                    <>
                                        You will be redirected to PayOS for secure payment.
                                        <br />
                                        By placing your order, you agree to our terms and conditions.
                                    </>
                                ) : (
                                    'By placing your order, you agree to our terms and conditions.'
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
