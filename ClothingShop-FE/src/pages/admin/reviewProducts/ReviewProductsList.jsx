import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from '../../../redux/slices/admin/ProductSlice';
import { useNavigate } from 'react-router-dom';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const renderPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition ${currentPage === i ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-300'}`}
                >
                    {i}
                </button>,
            );
        }
        return pages;
    };
    return (
        <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
            >
                &lt;
            </button>
            {renderPageNumbers()}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
            >
                &gt;
            </button>
        </div>
    );
};

const ReviewProductsList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [statusFilter, setStatusFilter] = useState('all');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { products = [], loading = false, error = null } = useSelector((state) => state.adminProduct || {});

    useEffect(() => {
        dispatch(fetchAllProducts());
      }, [dispatch]);

    // Lọc sản phẩm theo trạng thái
    const statusMap = {
        all: null,
        pending: 2,   // Chờ duyệt
        approved: 1,  // Đã duyệt
        rejected: 3   // Đã từ chối
    };
    const filteredByStatus = statusFilter === 'all'
        ? products
        : products.filter(product => product.status === statusMap[statusFilter]);

    // Lọc sản phẩm theo tên, mô tả, seller
    const filteredProducts = filteredByStatus.filter((product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sellerName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Phân trang
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-red-600">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Danh sách sản phẩm</h2>
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-2 w-full md:w-2/3">
                    <select
                        className="select select-bordered border-gray-300 pl-4 pr-4 py-2 rounded-lg shadow-sm"
                        value={statusFilter}
                        onChange={e => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="pending">Chờ duyệt</option>
                        <option value="approved">Đã duyệt</option>
                        <option value="rejected">Đã từ chối</option>
                        <option value="all">Tất cả</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Tìm theo tên, mô tả, seller..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="input input-bordered w-full pl-4 pr-4 py-2 rounded-lg shadow-sm"
                    />
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-3 text-sm text-gray-600">
                <span>
                    Hiển thị {startIndex + 1} đến {Math.min(startIndex + itemsPerPage, filteredProducts.length)} trong tổng {filteredProducts.length} sản phẩm.
                </span>
                <select
                    className="select select-bordered border-gray-300 pl-4 pr-4 py-2 rounded-lg shadow-sm"
                    value={itemsPerPage}
                    onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                    }}
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </div>
            <div className="overflow-x-auto mb-5">
                <table className="table w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="text-center py-3 px-4 border-b border-gray-200 font-semibold text-gray-600">Tên sản phẩm</th>
                            <th className="text-center py-3 px-4 border-b border-gray-200 font-semibold text-gray-600">Danh mục</th>
                            <th className="text-center py-3 px-4 border-b border-gray-200 font-semibold text-gray-600">Giá</th>
                            <th className="text-center py-3 px-4 border-b border-gray-200 font-semibold text-gray-600">Giảm giá</th>
                            <th className="text-center py-3 px-4 border-b border-gray-200 font-semibold text-gray-600">Người bán</th>
                            <th className="text-center py-3 px-4 border-b border-gray-200 font-semibold text-gray-600">Ngày tạo</th>
                            <th className="text-center py-3 px-4 border-b border-gray-200 font-semibold text-gray-600">Trạng thái</th>
                            <th className="text-center py-3 px-4 border-b border-gray-200 font-semibold text-gray-600">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="text-center py-3 px-4 border-b border-gray-200">{product.name}</td>
                                <td className="text-center py-3 px-4 border-b border-gray-200">{product.categoryName}</td>
                                <td className="text-center py-3 px-4 border-b border-gray-200">{product.price?.toLocaleString('vi-VN')} ₫</td>
                                <td className="text-center py-3 px-4 border-b border-gray-200">{product.discount}%</td>
                                <td className="text-center py-3 px-4 border-b border-gray-200">{product.sellerName} <br /><span className="text-xs text-gray-500">{product.sellerEmail}</span></td>
                                <td className="text-center py-3 px-4 border-b border-gray-200">{
                                    (() => {
                                        const dateStr = product.createdAt || product.createAt;
                                        const date = dateStr ? new Date(dateStr) : null;
                                        return (date && !isNaN(date.getTime())) ? date.toLocaleDateString() : '-';
                                    })()
                                }</td>
                                <td className="text-center py-3 px-4 border-b border-gray-200">
                                    {product.statusName === 'APPROVED' ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-400">
                                            Approved
                                        </span>
                                    ) : product.statusName === 'REJECTED' ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-400">
                                            Rejected
                                        </span>
                                    ) : product.statusName === 'UNAPPROVED' ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-400">
                                            Unapproved
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-400">
                                            -
                                        </span>
                                    )}
                                </td>
                                <td className="text-center py-3 px-4 border-b border-gray-200">
                                    <button
                                        className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                                        onClick={() => navigate(`/admin/products/detail/${product.id}`)}
                                    >
                                        Xem chi tiết
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
    );
};

export default ReviewProductsList;
