import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCart, removeFromCart, clearUserCart } from "../../redux/slices/CartSlice";
import CartItem from "./CartItem";
import { Link } from "react-router-dom";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import "../../styles/cart.css";

const CartPage = () => {
  const dispatch = useDispatch();
  const { cart, loading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.id) {
      dispatch(getCart({ userId: user.id }));
    }
  }, [dispatch, user]);

  const handleRemove = (productId) => {
    if (user?.id) {
      dispatch(removeFromCart({ userId: user.id, productId }));
    }
  };

  const handleClear = () => {
    if (user?.id) {
      dispatch(clearUserCart({ userId: user.id }));
    }
  };

  // Calculate total amount - improved logic with real product data from backend
  const calculateItemTotal = (item) => {
    // If totalPrice is calculated from backend, use it
    if (item.totalPrice && item.totalPrice > 0) {
      return item.totalPrice;
    }

    // If we have product data from backend, calculate based on current price
    if (item.product && item.quantity) {
      const currentPrice = item.product.currentPrice || item.product.price || 0;
      return currentPrice * item.quantity;
    }

    // Fallback for safety
    return 0;
  };

  const totalAmount = cart?.cartDetails?.reduce((sum, item) => {
    return sum + calculateItemTotal(item);
  }, 0) || 0;

  const totalItems = cart?.cartDetails?.reduce((sum, item) => {
    return sum + (item.quantity || 0);
  }, 0) || 0;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <ShoppingBagIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Required</h2>
          <p className="text-gray-600 mb-6">Please login to view your shopping cart</p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 transition duration-150 ease-in-out"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.cartDetails.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBagIcon className="h-24 w-24 text-gray-400 mx-auto mb-8" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 transition duration-150 ease-in-out"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cart-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-8 fade-in">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="mt-2 text-gray-600">{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          {/* Cart Items */}
          <div className="lg:col-span-7">
            <div className="fashion-card shadow-sm rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Items</h2>
              </div>
              <ul className="divide-y divide-gray-200">
                {cart.cartDetails.map((item, index) => (
                  <li key={item.productId} className="px-6 py-6 cart-item-card">
                    <CartItem item={item} onRemove={handleRemove} />
                  </li>
                ))}
              </ul>
            </div>

            {/* Clear Cart Button */}
            <div className="mt-6">
              <button
                onClick={handleClear}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition duration-150 ease-in-out"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-16 lg:mt-0 lg:col-span-5">
            <div className="cart-summary shadow-lg rounded-lg overflow-hidden sticky top-24">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
              </div>

              <div className="px-6 py-6 space-y-4">
                {/* Item breakdown */}
                <div className="space-y-2">
                  {cart.cartDetails.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.product?.name || `Product ${item.productId}`} x {item.quantity}
                      </span>
                      <span className="font-medium">
                        {calculateItemTotal(item).toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                  ))}
                </div>

                <hr className="my-4" />

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="font-medium">{totalAmount.toLocaleString('vi-VN')} ₫</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (VAT 10%)</span>
                  <span className="font-medium">{(totalAmount * 0.1).toLocaleString('vi-VN')} ₫</span>
                </div>

                <hr className="my-4" />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-xl">{(totalAmount * 1.1).toLocaleString('vi-VN')} ₫</span>
                </div>

                {/* Savings */}
                {totalAmount >= 500000 && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-4">
                    <p className="text-sm text-green-800">
                      🎉 You saved on shipping! Free delivery on orders over 500,000₫
                    </p>
                  </div>
                )}
              </div>

              <div className="px-6 py-6 bg-gray-50">
                <Link
                  to="/checkout"
                  className="btn-primary w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white transition duration-150 ease-in-out"
                >
                  Proceed to Checkout • {(totalAmount * 1.1).toLocaleString('vi-VN')} ₫
                </Link>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500 mb-2">
                    Secure checkout • Free returns within 30 days
                  </p>
                  <Link
                    to="/products"
                    className="text-sm font-medium text-gray-700 hover:text-gray-900 transition duration-150 ease-in-out"
                  >
                    ← Continue Shopping
                  </Link>
                </div>

                {/* Payment methods */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">We accept:</p>
                  <div className="flex space-x-2">
                    <div className="text-xs bg-gray-100 px-2 py-1 rounded">💳 COD</div>
                    <div className="text-xs bg-gray-100 px-2 py-1 rounded">🏦 Bank Transfer</div>
                    <div className="text-xs bg-gray-100 px-2 py-1 rounded">📱 E-Wallet</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 