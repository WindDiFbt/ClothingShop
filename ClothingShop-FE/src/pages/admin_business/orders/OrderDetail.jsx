import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchOrderDetail } from '../../../redux/slices/admin_business/orderSlice';
import './OrderDetail.css';

const OrderDetail = () => {
    const dispatch = useDispatch();
    const { orderId } = useParams();
    const { selectedOrder: order, loading, error } = useSelector(state => state.orders);

    useEffect(() => {
        if (orderId) {
            dispatch(fetchOrderDetail(orderId));
        }
    }, [dispatch, orderId]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            1: { class: 'status-pending', text: 'Chờ xử lý', icon: '⏳' },
            2: { class: 'status-confirmed', text: 'Đã xác nhận', icon: '✅' },
            3: { class: 'status-shipping', text: 'Đang giao', icon: '🚚' },
            4: { class: 'status-completed', text: 'Hoàn thành', icon: '✅' },
            5: { class: 'status-cancelled', text: 'Đã hủy', icon: '❌' }
        };
        const config = statusConfig[status] || { class: 'status-unknown', text: 'Không xác định', icon: '❓' };
        return (
            <span className={`status-badge ${config.class}`}>
                {config.icon} {config.text}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="order-detail-loading">
                <div className="loading-spinner"></div>
                <p>Đang tải chi tiết đơn hàng...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="order-detail-error">
                <div className="error-icon">⚠️</div>
                <h3>Có lỗi xảy ra</h3>
                <p>{error}</p>
                <Link to="/admin-business/orders" className="btn-back">
                    ← Quay lại danh sách đơn hàng
                </Link>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="order-detail-not-found">
                <div className="not-found-icon">📦</div>
                <h3>Không tìm thấy đơn hàng</h3>
                <p>Đơn hàng với ID <strong>{orderId}</strong> không tồn tại.</p>
                <Link to="/admin-business/orders" className="btn-back">
                    ← Quay lại danh sách đơn hàng
                </Link>
            </div>
        );
    }

    return (
        <div className="order-detail">
            {/* Breadcrumb */}
            <div className="breadcrumb-container">
                <nav className="breadcrumb">
                    <Link to="/admin-business/sales" className="breadcrumb-link">
                        Dashboard
                    </Link>
                    <span className="breadcrumb-separator">/</span>
                    <Link to="/admin-business/orders" className="breadcrumb-link">
                        Quản lý đơn hàng
                    </Link>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">Chi tiết đơn hàng</span>
                </nav>
            </div>

            {/* Header */}
            <div className="order-detail-header">
                <div className="header-content">
                    <div className="header-left">
                        <h1 className="page-title">
                            Đơn hàng #{order.id?.slice(0, 8)}
                        </h1>
                        <p className="order-date">
                            Đặt lúc: {formatDate(order.createAt)}
                        </p>
                    </div>
                    <div className="header-right">
                        {getStatusBadge(order.status)}
                    </div>
                </div>
            </div>

            {/* Order Info Cards */}
            <div className="order-info-grid">
                {/* Customer Info */}
                <div className="info-card customer-info">
                    <div className="card-header">
                        <h3>👤 Thông tin khách hàng</h3>
                    </div>
                    <div className="card-content">
                        <div className="info-row">
                            <label>Tên khách hàng:</label>
                            <span>{order.customerName || order.fullName || 'N/A'}</span>
                        </div>
                        <div className="info-row">
                            <label>Số điện thoại:</label>
                            <span>{order.phoneNumber || 'N/A'}</span>
                        </div>
                        <div className="info-row">
                            <label>Email:</label>
                            <span>{order.email || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* Shipping Info */}
                <div className="info-card shipping-info">
                    <div className="card-header">
                        <h3>🚚 Thông tin giao hàng</h3>
                    </div>
                    <div className="card-content">
                        <div className="info-row">
                            <label>Địa chỉ:</label>
                            <span>{order.address || 'N/A'}</span>
                        </div>
                        <div className="info-row">
                            <label>Ghi chú:</label>
                            <span>{order.notes || 'Không có ghi chú'}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Info */}
                <div className="info-card payment-info">
                    <div className="card-header">
                        <h3>💳 Thông tin thanh toán</h3>
                    </div>
                    <div className="card-content">
                        <div className="info-row">
                            <label>Phương thức:</label>
                            <span>{order.paymentMethod || 'Thanh toán khi nhận hàng'}</span>
                        </div>
                        <div className="info-row">
                            <label>Trạng thái thanh toán:</label>
                            <span className={`payment-status ${order.paymentStatus === 'Paid' ? 'paid' : 'unpaid'}`}>
                                {order.paymentStatus === 'Paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div className="order-items-section">
                <div className="section-header">
                    <h3>📦 Sản phẩm trong đơn hàng</h3>
                </div>
                <div className="items-table-container">
                    <table className="items-table">
                        <thead>
                            <tr>
                                <th>Sản phẩm</th>
                                <th>Đơn giá</th>
                                <th>Số lượng</th>
                                <th>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.orderItems && order.orderItems.length > 0 ? order.orderItems.map((item, index) => (
                                <tr key={index}>
                                    <td className="product-info">
                                        <div className="product-details">
                                            <div className="product-image">
                                                {item.productImage ? (
                                                    <img src={item.productImage} alt={item.productName} />
                                                ) : (
                                                    <div className="no-image">📷</div>
                                                )}
                                            </div>
                                            <div className="product-text">
                                                <div className="product-name">{item.productName || 'N/A'}</div>
                                                {item.variant && (
                                                    <div className="product-variant">
                                                        Size: {item.variant.size}, Màu: {item.variant.color}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="price">
                                        {formatCurrency(item.unitPrice || 0)}
                                    </td>
                                    <td className="quantity">
                                        {item.quantity || 0}
                                    </td>
                                    <td className="total">
                                        {formatCurrency(item.totalPrice || 0)}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="no-items">
                                        Không có sản phẩm nào trong đơn hàng
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Summary */}
            <div className="order-summary">
                <div className="summary-card">
                    <div className="summary-header">
                        <h3>💰 Tổng kết đơn hàng</h3>
                    </div>
                    <div className="summary-content">
                        <div className="summary-row">
                            <label>Tổng tiền hàng:</label>
                            <span>{formatCurrency(
                                order.orderItems?.reduce((sum, item) => sum + (item.totalPrice || 0), 0) || 0
                            )}</span>
                        </div>
                        <div className="summary-row">
                            <label>Phí vận chuyển:</label>
                            <span>{formatCurrency(order.shippingFee || 0)}</span>
                        </div>
                        <div className="summary-row">
                            <label>Giảm giá:</label>
                            <span>-{formatCurrency(order.discount || 0)}</span>
                        </div>
                        <div className="summary-row total">
                            <label>Tổng cộng:</label>
                            <span>{formatCurrency(order.totalAmount || 0)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
                <Link to="/admin-business/orders" className="btn-back">
                    ← Quay lại danh sách
                </Link>
            </div>
        </div>
    );
};

export default OrderDetail;
