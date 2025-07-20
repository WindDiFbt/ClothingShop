import axios from '../../utils/APIUtil';

const OrderService = {
    // Lấy danh sách đơn hàng với phân trang và lọc
    getAllOrders: (params) => 
        axios.get('/admin/orders', { params }),
    
    // Lấy chi tiết đơn hàng
    getOrderDetail: (orderId) => 
        axios.get(`/admin/orders/${orderId}`),
    
    // Cập nhật trạng thái đơn hàng
    updateOrderStatus: (orderId, status) => 
        axios.put(`/admin/orders/${orderId}/status`, { status }),
    
    // Lấy danh sách trạng thái đơn hàng
    getOrderStatuses: () => 
        axios.get('/admin/orders/statuses'),
    
    // Lấy thống kê đơn hàng
    getOrderStatistics: () => 
        axios.get('/admin/orders/statistics')
};

export default OrderService; 