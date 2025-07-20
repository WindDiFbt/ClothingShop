import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductDetail } from '../../redux/slices/admin/ProductDetailSlice'
import { fetchProductDetail } from '../../redux/slices/ProductDetailSlice'
import { addToCart } from '../../redux/slices/CartSlice'
import { StarIcon, ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/20/solid'
import { Radio, RadioGroup } from '@headlessui/react'
import FeedbackList from '../FeedbackList'

const ProductGallery = ({ images }) => {
    const [startIndex, setStartIndex] = useState(0);
    const visibleCount = 3;

    const nextImages = () => {
        if (startIndex + visibleCount < images.length) {
            setStartIndex(startIndex + 1);
        }
    };

    const prevImages = () => {
        if (startIndex > 0) {
            setStartIndex(startIndex - 1);
        }
    };

    const visibleImages = images.slice(startIndex, startIndex + visibleCount);
    return (
        <div className="relative max-w-7xl mx-auto px-4">
            <div className="flex gap-4">
                {visibleImages.map((img, idx) => (
                    <div key={idx} className="w-1/3 aspect-square overflow-hidden rounded-lg">
                        <img src={img} alt={`image-${idx}`} className="w-full h-full object-cover rounded border border-gray-200" />
                    </div>
                ))}
            </div>
            {startIndex > 0 && (
                <button
                    onClick={prevImages}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 p-1.5 rounded-full shadow"
                >
                    <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
                </button>
            )}
            {startIndex + visibleCount < images.length && (
                <button
                    onClick={nextImages}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 p-1.5 rounded-full shadow"
                >
                    <ChevronRightIcon className="h-5 w-5 text-gray-700" />
                </button>
            )}
        </div>
    )
};

const ProductDetail = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [maxQuantity, setMaxQuantity] = useState(1);
    const {
        product,
        seller,
        relatedProducts,
        productVariants,
        feedbacks,
        loading,
        error
    } = useSelector((state) => state.detail)

    useEffect(() => {
        if (productVariants && productVariants.length > 0) {
            setSelectedSize(productVariants[0].size);
        }
    }, [productVariants]);

    useEffect(() => {
        dispatch(fetchProductDetail(id));
    }, [dispatch, id]);

    useEffect(() => {
        const variant = productVariants?.find(v => v.size === selectedSize);
        if (variant) {
            setMaxQuantity(variant.quantity);
            setQuantity(1);
        }
    }, [selectedSize, productVariants]);

    const breadcrumbs = [
        { id: 1, name: 'Products', href: '/products' }
    ]

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>
    if (!product) return <p>No products found</p>

    const images = product.images || []
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    return (
        <div className="bg-white py-18 sm:py-24 lg:py-24">
            <div className="pt-6">
                <nav aria-label="Breadcrumb" className="pb-4">
                    <ol role="list" className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                        {breadcrumbs.map((breadcrumb) => (
                            <li key={breadcrumb.id}>
                                <div className="flex items-center">
                                    <a href={breadcrumb.href} className="mr-2 text-sm font-medium text-gray-900">
                                        {breadcrumb.name}
                                    </a>
                                    <svg
                                        fill="currentColor"
                                        width={16}
                                        height={20}
                                        viewBox="0 0 16 20"
                                        aria-hidden="true"
                                        className="h-5 w-4 text-gray-300"
                                    >
                                        <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                                    </svg>
                                </div>
                            </li>
                        ))}
                        <li className="text-sm">
                            <a href={product.href} aria-current="page" className="font-medium text-gray-500 hover:text-gray-600">
                                {product.name}
                            </a>
                        </li>
                    </ol>
                </nav>
                <ProductGallery images={images} />
                <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24">
                    <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-2xl">{product.name}</h1>
                    </div>
                    <div className="mt-4 lg:row-span-3 lg:mt-0">
                        <p className="text-3xl tracking-tight text-gray-900">
                            {(product.price * (1 - product.discount / 100)).toLocaleString('vi-VN')} ₫
                        </p>
                        <p>
                            {product.discount > 0 && (
                                <span className="text-sm text-gray-500 line-through">
                                    {product.price.toLocaleString('vi-VN')} ₫
                                </span>
                            )}
                        </p>

                        <div className="mt-6">
                            <h3 className="sr-only">Reviews</h3>
                            <div className="flex items-center">
                                {[0, 1, 2, 3, 4].map((rating) => (
                                    <StarIcon
                                        key={rating}
                                        aria-hidden="true"
                                        className={classNames(
                                            5 > rating ? 'text-gray-900' : 'text-gray-200',
                                            'size-5 shrink-0'
                                        )}
                                    />
                                ))}
                            </div>
                        </div>

                        <form
                            className="mt-10"
                            onSubmit={(e) => {
                                e.preventDefault();
                                const currentUser = JSON.parse(localStorage.getItem('user'));
                                if (!currentUser) {
                                    alert('Please login to add to cart');
                                    return;
                                }
                                const { id: userId } = currentUser;
                                dispatch(addToCart({
                                    userId,
                                    productId: product.id,
                                    quantity,
                                }));
                            }}
                        >
                            <div className="mt-10">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-gray-900">Size</h3>
                                    <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                        Size guide
                                    </a>
                                </div>
                                <fieldset aria-label="Chọn size" className="mt-4">
                                    <RadioGroup
                                        value={selectedSize}
                                        onChange={setSelectedSize}
                                        className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4"
                                    >
                                        {productVariants?.map((variant) => (
                                            <Radio
                                                key={variant.size}
                                                value={variant.size}
                                                disabled={variant.quantity <= 0}
                                            >
                                                {({ checked }) => (
                                                    <span
                                                        className={classNames(
                                                            variant.quantity > 0
                                                                ? 'cursor-pointer bg-white text-gray-900 shadow-xs hover:bg-gray-100'
                                                                : 'cursor-not-allowed bg-gray-50 text-gray-300 line-through',
                                                            checked ? 'ring-2 ring-indigo-500 border-transparent' : 'border-gray-300',
                                                            'group relative flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium uppercase focus:outline-none sm:flex-1 sm:py-6'
                                                        )}
                                                    >
                                                        {variant.size.toUpperCase()}
                                                        {variant.quantity <= 0 && (
                                                            <span
                                                                aria-hidden="true"
                                                                className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-300"
                                                            >
                                                                <svg
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 100 100"
                                                                    preserveAspectRatio="none"
                                                                    className="absolute inset-0 size-full stroke-2 text-gray-300"
                                                                >
                                                                    <line x1={0} x2={100} y1={100} y2={0} vectorEffect="non-scaling-stroke" />
                                                                </svg>
                                                            </span>
                                                        )}
                                                    </span>
                                                )}
                                            </Radio>
                                        ))}
                                    </RadioGroup>
                                </fieldset>
                            </div>
                            <div className="mb-6">
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-900 mb-1">
                                    Quantity
                                </label>
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        min={1}
                                        max={maxQuantity}
                                        value={quantity}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value) || 1;
                                            setQuantity(val > maxQuantity ? maxQuantity : val);
                                        }}
                                        className="w-20 rounded-md border border-gray-300 px-2 py-1 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    <span className="text-sm text-gray-500">
                                        Remaining: <span className="font-semibold text-gray-700">{maxQuantity}</span> products
                                    </span>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Add to cart
                            </button>
                        </form>
                    </div>

                    <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pr-8 lg:pb-16">
                        <div>
                            <h3 className="sr-only">Description</h3>
                            <div className="space-y-6">
                                <p className="text-base text-gray-900">{product.description}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-3 rouded-md bg-gray-100 p-4 border border-gray-100 lg:col-span-3 border-3">
                        <img
                            src={seller.avatarUrl || `https://ui-avatars.com/api/?name=${seller.fullName}`}
                            alt="Seller Avatar"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                            <p>Seller: <span className="font-medium">{seller.fullName}</span></p>
                            <p className="text-xs">@{seller.username}</p>
                        </div>
                    </div>
                    <div className="mt-10 border-t border-gray-200 pt-8 lg:col-span-3 lg:pt-10">
                        <h2 className="text-2xl tracking-tight text-gray-900 mb-4">Product reviews</h2>
                        {feedbacks.length === 0 ? (
                            <p className="text-sm text-gray-500">There are no reviews yet.</p>
                        ) : (
                            <div className="space-y-6">
                                {feedbacks.map((fb) => (
                                    <div key={fb.id} className="flex items-start space-x-4  border-gray-100 pb-4">
                                        <div className="flex-shrink-0">
                                            {fb.avatar ? (
                                                <img
                                                    src={fb.avatar}
                                                    alt={fb.userName}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                                                    {fb.userName?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <p className="text-sm font-medium text-gray-900">{fb.userName}</p>
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <svg
                                                            key={star}
                                                            className={`h-4 w-4 ${star <= fb.rating ? 'text-yellow-400' : 'text-gray-300'
                                                                }`}
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.538 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.783.57-1.838-.197-1.538-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69l1.286-3.957z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                            </div>
                                            {fb.comment && (
                                                <p className="mt-1 text-sm text-gray-700">{fb.comment}</p>
                                            )}
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(fb.createAt).toLocaleString('vi-VN')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mx-auto max-w-2xl lg:max-w-7xl lg:px-8">
                    <h2 className="text-2xl tracking-tight text-gray-900">Customers also purchased</h2>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5 xl:gap-x-8 pt-6">
                        {relatedProducts.map((product) => (
                            <div key={product.id} className="group relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md">
                                <img
                                    src={product.thumbnailUrl}
                                    className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                                />
                                <div className="mt-4 flex justify-between">
                                    <div>
                                        <h3 className="text-xs text-gray-700">
                                            <a href={`/product/${product.id}`} className="font-medium text-gray-900 hover:text-gray-700">
                                                <span aria-hidden="true" className="absolute inset-0" />
                                                {product.name}
                                            </a>
                                        </h3>
                                        <p className="mt-1 text-xs text-gray-500">{product.color}</p>
                                    </div>
                                    {product.discount > 0 ? (
                                        <div>
                                            <p className="text-xs line-through text-gray-400">
                                                {(product.price).toLocaleString('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                })}
                                            </p>
                                            <p className="text-xs font-medium text-gray-900">
                                                {(product.price * (1 - product.discount / 100)).toLocaleString('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                })}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-xs font-medium text-gray-900">
                                            {(product.price).toLocaleString('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            })}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Feedback Section */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <FeedbackList productId={product?.id} />
            </div>
        </div>
    )
}

export default ProductDetail
