import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, fetchOrderStatuses } from '../../../redux/slices/admin/OrderSlice';
import { toast } from 'react-toastify';

const OrderList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { orders, orderStatuses, loading, error, pagination } = useSelector(state => state.adminOrder);

    const statusOptions = [
        { value: '', label: 'Tất cả trạng thái' },
        ...(orderStatuses.map(status => ({
            value: status.id.toString(),
            label: status.name
        })))
    ];

    useEffect(() => {
        dispatch(fetchOrderStatuses());
    }, [dispatch]);

    useEffect(() => {
        const params = {
            searchTerm: searchTerm || undefined,
            statusFilter: statusFilter || undefined,
            page: currentPage,
            pageSize: itemsPerPage
        };
        dispatch(fetchAllOrders(params));
    }, [dispatch, searchTerm, statusFilter, currentPage, itemsPerPage]);



    const getStatusColor = (status) => {
        switch(status) {
            case '4': // Completed
                return 'bg-green-100 text-green-800';
            case '1': // Pending
                return 'bg-yellow-100 text-yellow-800';
            case '5': // Cancelled
                return 'bg-red-100 text-red-800';
            case '2': // Processing
                return 'bg-blue-100 text-blue-800';
            case '3': // Shipped
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Handle error
    useEffect(() => {
        if (error) {
            toast.error('Không thể tải danh sách đơn hàng');
        }
    }, [error]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Quản lý đơn hàng</h2>
            </div>

            {/* Bộ lọc và tìm kiếm */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-2 w-full md:w-2/3">
                    <select
                        className="select select-bordered border-gray-300 pl-4 pr-4 py-2 rounded-lg shadow-sm"
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Tìm theo tên khách hàng, mã đơn hàng, số điện thoại..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="input input-bordered w-full pl-4 pr-4 py-2 rounded-lg shadow-sm"
                    />
                </div>
            </div>

            {/* Thông tin phân trang */}
            <div className="flex flex-wrap items-center gap-2 mb-3 text-sm text-gray-600">
                <span>
                    Hiển thị {((pagination.currentPage - 1) * pagination.pageSize) + 1} đến {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalCount)} trong tổng {pagination.totalCount} đơn hàng.
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

            {/* Bảng danh sách đơn hàng */}
            <div className="overflow-x-auto mb-5">
                <table className="table w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="text-center py-3 px-4 border-b border-gray-200 font-semibold text-gray-600">Mã đơn hàng</th>
                            <th className="text-center py-3 px-4 border-b border-gray-200 font-semibold text-gray-600">Khách hàng</th>
                            <th className="text-center py-3 px-4 border-b border-gray-200 font-semibold text-gray-600">Số điện thoại</th>
                            <th className="text-center py-3 px-4 border-b border-gray-200 font-semibold text-gray-600">Địa chỉ</th>
                            <th className="text-center py-3 px-4 border-b border-gray-200 font-semibold text-gray-600">Tổng tiền</th>
                            <th className="text-center py-3 px-4 border-b border-gray-200 font-semibold text-gray-600">Trạng thái</th>
                            <th className="text-center py-3 px-4 border-b border-gray-200 font-semibold text-gray-600">Ngày đặt</th>
                            <th className="text-center py-3 px-4 border-b border-gray-200 font-semibold text-gray-600">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="text-center py-3 px-4 border-b border-gray-200 font-medium">
                                    #{order.id}
                                </td>
                                <td className="text-center py-3 px-4 border-b border-gray-200">
                                    {order.customerName}
                                </td>
                                <td className="text-center py-3 px-4 border-b border-gray-200">
                                    {order.phoneNumber}
                                </td>
                                <td className="text-center py-3 px-4 border-b border-gray-200">
                                    <div className="max-w-xs truncate" title={order.address}>
                                        {order.address}
                                    </div>
                                </td>
                                <td className="text-center py-3 px-4 border-b border-gray-200 font-medium">
                                    {order.totalAmount?.toLocaleString('vi-VN')}đ
                                </td>
                                <td className="text-center py-3 px-4 border-b border-gray-200">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                        {order.statusName}
                                    </span>
                                </td>
                                <td className="text-center py-3 px-4 border-b border-gray-200">
                                    {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                                </td>
                                <td className="text-center py-3 px-4 border-b border-gray-200">
                                    <button
                                        className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                                    >
                                        Xem chi tiết
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
                    >
                        &lt;
                    </button>
                    {[...Array(pagination.totalPages)].map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                                currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-300'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === pagination.totalPages}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
                    >
                        &gt;
                    </button>
                </div>
            )}
        </div>
    );
};

export default OrderList; 