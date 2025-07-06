import { XMarkIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/slices/CartSlice";

const CartItem = ({ item, onRemove }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Use product data from backend or fallback
  const product = item.product;
  const hasProductData = !!product;

  // Calculate prices - use real product data if available
  const unitPrice = hasProductData
    ? (product.currentPrice || product.price || 0)
    : 299000; // Fallback price
  const totalPrice = item.totalPrice || (unitPrice * item.quantity);

  // Product display data
  const productData = {
    name: product?.name || `Product ${item.productId}`,
    image: product?.thumbnailUrl || `https://picsum.photos/200/200?random=${item.productId}`,
    brand: hasProductData ? 'Noiré Collection' : 'Unknown Brand',
    category: product?.categoryName || 'Fashion',
    hasRealData: hasProductData
  };

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;

    setIsUpdating(true);
    try {
      await dispatch(addToCart({
        userId: user.id,
        productId: item.productId,
        quantity: newQuantity
      }));
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-start space-x-4">
      {/* Product Image */}
      <div className="flex-shrink-0 relative">
        <img
          src={productData.image}
          alt={productData.name}
          className="w-24 h-24 object-cover rounded-lg shadow-sm"
        />
        {!productData.hasRealData && (
          <div className="absolute top-1 left-1 bg-yellow-100 text-yellow-800 text-xs px-1 py-0.5 rounded">
            Demo
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 truncate">
              {productData.name}
            </h3>
            <div className="mt-1 space-y-1">
              <p className="text-sm text-gray-500">{productData.brand}</p>
              <p className="text-sm text-gray-500">Category: {productData.category}</p>
              <p className="text-sm font-medium text-gray-700">
                {unitPrice.toLocaleString('vi-VN')} ₫ each
              </p>
              {hasProductData && product.discount > 0 && (
                <p className="text-xs text-green-600">
                  {product.discount}% off • Original: {product.price?.toLocaleString('vi-VN')} ₫
                </p>
              )}
            </div>
          </div>

          {/* Remove Button */}
          <button
            onClick={() => onRemove(item.productId)}
            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition duration-150 ease-in-out"
            aria-label="Remove item"
          >
            <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        {/* Price and Quantity */}
        <div className="mt-4 flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">Qty:</span>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1 || isUpdating}
                className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
              >
                <MinusIcon className="h-4 w-4 text-gray-600" />
              </button>

              <span className="px-3 py-1 text-sm font-medium text-gray-900 min-w-[40px] text-center">
                {isUpdating ? '...' : item.quantity}
              </span>

              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={isUpdating}
                className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
              >
                <PlusIcon className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">
              {totalPrice.toLocaleString('vi-VN')} ₫
            </p>
            {item.quantity > 1 && (
              <p className="text-sm text-gray-500">
                {unitPrice.toLocaleString('vi-VN')} ₫ × {item.quantity}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem; 