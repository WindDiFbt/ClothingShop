import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const RecentOrdersTable = () => {
    const { overview, loading } = useSelector(state => state.analytics);
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="mb-5">
                    <h5 className="text-lg font-semibold">Đơn hàng gần đây</h5>
                </div>
                <div className="animate-pulse space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!overview?.recentOrders || overview.recentOrders.length === 0) {
        return (
            <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="mb-5">
                    <h5 className="text-lg font-semibold">Đơn hàng gần đây</h5>
                </div>
                <div className="text-center text-gray-500 py-8">
                    Không có đơn hàng nào trong khoảng thời gian này
                </div>
            </div>
        );
    }

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

    return (
        <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="mb-5">
                <h5 className="text-lg font-semibold">Đơn hàng gần đây</h5>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left p-3 font-medium text-gray-700">Mã đơn</th>
                            <th className="text-left p-3 font-medium text-gray-700">Khách hàng</th>
                            <th className="text-left p-3 font-medium text-gray-700">Giá trị</th>
                            <th className="text-left p-3 font-medium text-gray-700">Trạng thái</th>
                            <th className="text-left p-3 font-medium text-gray-700">Ngày tạo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {overview.recentOrders.map((order, index) => (
                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="p-3 text-sm font-medium text-gray-900">
                                    {order.id.toString().substring(0, 8)}...
                                </td>
                                <td className="p-3 text-sm text-gray-700">
                                    {order.customerName || 'Không xác định'}
                                </td>
                                <td className="p-3 text-sm font-medium text-gray-900">
                                    {order.totalAmount?.toLocaleString('vi-VN')}đ
                                </td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                        {order.statusName || 'Không xác định'}
                                    </span>
                                </td>
                                <td className="p-3 text-sm text-gray-600">
                                    {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {overview.recentOrders.length > 0 && (
                <div className="mt-4 text-center">
                    <button 
                        className="text-primary hover:text-primary-dark text-sm font-medium transition-colors"
                        onClick={() => navigate('/admin-business/orders')}
                    >
                        Xem tất cả đơn hàng →
                    </button>
                </div>
            )}
        </div>
    );
};

export default RecentOrdersTable; 