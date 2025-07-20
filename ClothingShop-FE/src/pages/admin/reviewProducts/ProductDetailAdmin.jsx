import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductDetail, approveProductById, rejectProductById, resetProductDetailStatus } from '../../../redux/slices/admin/ProductDetailSlice'
import { StarIcon, ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/20/solid'
import { Radio, RadioGroup } from '@headlessui/react'

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
                        <img src={img} alt={`image-${idx}`} className="w-full h-full object-cover" />
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

const ProductDetailAdmin = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const [selectedSize, setSelectedSize] = useState('');
    const {
        product,
        seller,
        productVariants,
        loading,
        error,
        approving,
        approveSuccess,
        rejectSuccess,
        approveError,
        rejectError,
        rejecting
    } = useSelector((state) => state.adminProductDetail);
    const [showReject, setShowReject] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (productVariants && productVariants.length > 0) {
            setSelectedSize(productVariants[0].size);
        }
    }, [productVariants]);

    useEffect(() => {
        dispatch(resetProductDetailStatus());
        dispatch(fetchProductDetail(id));
    }, [dispatch, id]);

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>
    if (!product) return <p>No products found</p>

    const isApproved = product.status === 1;
    const isRejected = product.status === 3;

    const images = product.images || []

    return (
        <div className="bg-gray-50 py-10 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                    <span className="hover:underline cursor-pointer" onClick={() => navigate('/admin/review-products')}>Danh sách chờ duyệt</span>
                    <ChevronRightIcon className="h-4 w-4" />
                    <span className="text-gray-700 font-semibold">Chi tiết sản phẩm</span>
                </div>
                <div className="mb-6">
                    <button
                        type="button"
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-800 font-medium shadow-sm"
                        onClick={() => navigate(-1)}
                    >
                        ← Quay lại
                    </button>
                </div>
                <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">Kiểm tra sản phẩm chờ duyệt</h2>
                <div className="flex flex-col lg:flex-row gap-8 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    {/* Left: Product info */}
                    <div className="flex-1 min-w-0">
                        <ProductGallery images={images} />
                        <div className="mt-8">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                            <p className="text-gray-700 mb-4 text-base">{product.description}</p>
                            <div className="flex flex-wrap gap-4 mb-3 text-sm">
                                <span className="bg-gray-100 px-3 py-1 rounded">Danh mục: <b>{product.categoryName}</b></span>
                                <span className="bg-gray-100 px-3 py-1 rounded">Trạng thái: <b>{product.status === 1 ? 'Đã duyệt' : 'Chờ duyệt'}</b></span>
                            </div>
                            <div className="flex flex-wrap gap-4 mb-3 text-sm">
                                <span className="bg-gray-100 px-3 py-1 rounded">Ngày tạo: <b>{(() => {
                                    const dateStr = product.createdAt || product.createAt;
                                    const date = dateStr ? new Date(dateStr) : null;
                                    return (date && !isNaN(date.getTime())) ? date.toLocaleDateString() : '-';
                                })()}</b></span>
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <img
                                    src={seller?.avatarUrl || `https://ui-avatars.com/api/?name=${seller?.fullName || product.sellerName}`}
                                    alt="Seller Avatar"
                                    className="w-12 h-12 rounded-full object-cover border"
                                />
                                <div>
                                    <span className="font-medium text-gray-800 text-base">{seller?.fullName || product.sellerName}</span>
                                    <div className="text-xs text-gray-500">{seller?.username || product.sellerEmail}</div>
                                </div>
                            </div>
                            <div className="mb-2 text-sm">
                                <span className="font-semibold">Số lượng mỗi size:</span>
                                <ul className="list-disc ml-6 mt-2 space-y-1">
                                    {(product.variants || productVariants || []).map((v, idx) => (
                                        <li key={idx} className="text-base font-medium text-gray-700 flex items-center gap-2">
                                            <span className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-sm font-semibold">Size: {v.size}</span>
                                            <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded text-sm font-semibold">Số lượng: {v.quantity}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/* Right: Price & Actions */}
                    <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6 border border-gray-100 rounded-2xl p-6 bg-gray-50 shadow-md">
                        <div className="mb-2">
                            <p className="text-3xl font-bold text-green-700">
                                {(product.price * (1 - product.discount / 100)).toLocaleString('vi-VN')} ₫
                            </p>
                            {product.discount > 0 && (
                                <span className="text-sm text-gray-500 line-through">
                                    {product.price.toLocaleString('vi-VN')} ₫
                                </span>
                            )}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Giảm giá:</span> {product.discount}%
                        </div>
                        <div className="flex flex-col gap-3 mt-4">  
                            <button
                                type="button"
                                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold disabled:opacity-60 transition-all duration-150"
                                onClick={() => dispatch(approveProductById(product.id))}
                                disabled={approving || approveSuccess || rejectSuccess || isApproved}
                            >
                                {approving ? 'Đang duyệt...' : 'Duyệt sản phẩm'}
                            </button>
                            <button
                                type="button"
                                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold disabled:opacity-60 transition-all duration-150"
                                onClick={() => setShowReject(true)}
                                disabled={rejecting || approveSuccess || rejectSuccess || isRejected}
                            >
                                Từ chối sản phẩm
                            </button>
                            {isRejected && product.rejectionReason && (
                                <div className="mt-2 p-3 border rounded bg-white animate-fade-in">
                                    <div className="text-red-700 font-semibold mb-1">Lý do từ chối:</div>
                                    <div className="text-gray-800">{product.rejectionReason}</div>
                                    {product.rejectedAt && (
                                        <div className="text-xs text-gray-500 mt-1">Thời gian: {new Date(product.rejectedAt).toLocaleString()}</div>
                                    )}
                                </div>
                            )}
                            {showReject && (
                                <div className="mt-2 p-3 border rounded bg-white animate-fade-in">
                                    <textarea
                                        className="w-full border rounded p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                                        rows={3}
                                        placeholder="Nhập lý do từ chối..."
                                        value={rejectReason}
                                        onChange={e => setRejectReason(e.target.value)}
                                        disabled={rejecting}
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-60"
                                            onClick={() => dispatch(rejectProductById({ id: product.id, rejectReason }))}
                                            disabled={rejecting || !rejectReason}
                                        >
                                            {rejecting ? 'Đang gửi...' : 'Xác nhận từ chối'}
                                        </button>
                                        <button
                                            type="button"
                                            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                                            onClick={() => setShowReject(false)}
                                            disabled={rejecting}
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                    {rejectError && <div className="text-red-500 mt-1">{rejectError}</div>}
                                </div>
                            )}
                            {approveError && <div className="text-red-500 mt-2">{approveError}</div>}
                            {approveSuccess && <div className="text-green-600 mt-2">{approveSuccess}</div>}
                            {rejectSuccess && <div className="text-green-600 mt-2">{rejectSuccess}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailAdmin;
