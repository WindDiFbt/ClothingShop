import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderDetail, updateOrderStatus, fetchOrderStatuses } from '../../../redux/slices/admin/OrderSlice';
import { toast } from 'react-toastify';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selectedStatus, setSelectedStatus] = useState('');
    
    const { orderDetail, orderStatuses, loading, error } = useSelector(state => state.adminOrder);

    useEffect(() => {
        if (id) {
            dispatch(fetchOrderDetail(id));
        }
        dispatch(fetchOrderStatuses());
    }, [dispatch, id]);

    useEffect(() => {
        if (orderDetail) {
            setSelectedStatus(orderDetail.status?.toString() || '');
        }
    }, [orderDetail]);

    useEffect(() => {
        if (error) {
            toast.error('Không thể tải thông tin đơn hàng');
        }
    }, [error]);

    const handleStatusUpdate = async () => {
        if (!selectedStatus || selectedStatus === orderDetail?.status?.toString()) {
            return;
        }

        try {
            await dispatch(updateOrderStatus({ orderId: id, status: parseInt(selectedStatus) })).unwrap();
            toast.success('Cập nhật trạng thái thành công');
        } catch (error) {
            toast.error('Không thể cập nhật trạng thái');
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 4: // Completed
                return 'bg-green-100 text-green-800';
            case 1: // Pending
                return 'bg-yellow-100 text-yellow-800';
            case 5: // Cancelled
                return 'bg-red-100 text-red-800';
            case 2: // Processing
                return 'bg-blue-100 text-blue-800';
            case 3: // Shipped
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!orderDetail) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-red-600">Không tìm thấy đơn hàng</div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold">Chi tiết đơn hàng</h2>
                    <p className="text-gray-600">Mã đơn hàng: #{orderDetail.id}</p>
                </div>
                <button
                    onClick={() => navigate('/admin/orders')}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                    Quay lại
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Thông tin đơn hàng */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Thông tin đơn hàng</h3>
                    
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                        <div className="flex justify-between">
                            <span className="font-medium">Trạng thái:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(orderDetail.status)}`}>
                                {orderDetail.statusName}
                            </span>
                        </div>
                        
                        <div className="flex justify-between">
                            <span className="font-medium">Ngày đặt:</span>
                            <span>{new Date(orderDetail.orderDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                        
                        <div className="flex justify-between">
                            <span className="font-medium">Tổng tiền:</span>
                            <span className="font-semibold">{orderDetail.totalAmount?.toLocaleString('vi-VN')}đ</span>
                        </div>
                        
                        <div className="flex justify-between">
                            <span className="font-medium">Số lượng sản phẩm:</span>
                            <span>{orderDetail.orderItems?.length || 0}</span>
                        </div>
                    </div>

                    {/* Cập nhật trạng thái */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-3">Cập nhật trạng thái</h4>
                        <div className="flex gap-2">
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="flex-1 p-2 border border-gray-300 rounded-lg"
                            >
                                {orderStatuses.map(status => (
                                    <option key={status.id} value={status.id}>
                                        {status.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleStatusUpdate}
                                disabled={selectedStatus === orderDetail.status?.toString()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                Cập nhật
                            </button>
                        </div>
                    </div>
                </div>

                {/* Thông tin khách hàng */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Thông tin khách hàng</h3>
                    
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                        <div className="flex justify-between">
                            <span className="font-medium">Tên khách hàng:</span>
                            <span>{orderDetail.customerName}</span>
                        </div>
                        
                        <div className="flex justify-between">
                            <span className="font-medium">Số điện thoại:</span>
                            <span>{orderDetail.phoneNumber}</span>
                        </div>
                        
                        <div className="flex justify-between">
                            <span className="font-medium">Địa chỉ:</span>
                            <span className="text-right max-w-xs">{orderDetail.address}</span>
                        </div>
                        
                        {orderDetail.note && (
                            <div className="flex justify-between">
                                <span className="font-medium">Ghi chú:</span>
                                <span className="text-right max-w-xs">{orderDetail.note}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Danh sách sản phẩm</h3>
                
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="text-left p-3 font-medium text-gray-700">Sản phẩm</th>
                                <th className="text-left p-3 font-medium text-gray-700">Giá</th>
                                <th className="text-left p-3 font-medium text-gray-700">Số lượng</th>
                                <th className="text-left p-3 font-medium text-gray-700">Giảm giá</th>
                                <th className="text-left p-3 font-medium text-gray-700">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderDetail.orderItems?.map((item) => (
                                <tr key={item.id} className="border-b border-gray-100">
                                    <td className="p-3">
                                        <div className="flex items-center space-x-3">
                                            {item.productImage && (
                                                <img 
                                                    src={item.productImage} 
                                                    alt={item.productName}
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                            )}
                                            <div>
                                                <div className="font-medium">{item.productName}</div>
                                                <div className="text-sm text-gray-500">ID: {item.productId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3">{item.unitPrice?.toLocaleString('vi-VN')}đ</td>
                                    <td className="p-3">{item.quantity}</td>
                                    <td className="p-3">{item.discount || 0}%</td>
                                    <td className="p-3 font-medium">{item.totalPrice?.toLocaleString('vi-VN')}đ</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail; 