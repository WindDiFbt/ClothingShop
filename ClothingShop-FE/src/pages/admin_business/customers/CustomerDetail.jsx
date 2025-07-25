import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchCustomerDetail,
    fetchCustomerOrders
} from '../../../redux/slices/admin_business/customerSlice';

// CSS riêng cho Customer Detail
import './CustomerDetail.css';

const CustomerDetail = () => {
    const { customerId } = useParams();
    const dispatch = useDispatch();
    const { selectedCustomer, customerOrders, loading, error } = useSelector(state => state.customers);
    const [activeTab, setActiveTab] = useState('info');

    useEffect(() => {
        if (customerId) {
            dispatch(fetchCustomerDetail(customerId));
            dispatch(fetchCustomerOrders(customerId));
        }
    }, [dispatch, customerId]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDateOnly = (dateString) => {
        if (!dateString) return 'Chưa cập nhật';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const getStatusInfo = (status) => {
        const statusConfig = {
            1: { class: 'status-active', text: 'Hoạt động', icon: '✅' },
            2: { class: 'status-inactive', text: 'Tạm khóa', icon: '⏸️' },
            3: { class: 'status-banned', text: 'Bị cấm', icon: '🚫' }
        };
        return statusConfig[status] || { class: 'status-unknown', text: 'Không xác định', icon: '❓' };
    };

    const getOrderStatusInfo = (status) => {
        const statusConfig = {
            1: { class: 'order-pending', text: 'Chờ xử lý', icon: '⏳' },
            2: { class: 'order-confirmed', text: 'Đã xác nhận', icon: '✅' },
            3: { class: 'order-shipping', text: 'Đang giao', icon: '🚚' },
            4: { class: 'order-completed', text: 'Hoàn thành', icon: '✅' },
            5: { class: 'order-cancelled', text: 'Đã hủy', icon: '❌' }
        };
        return statusConfig[status] || { class: 'order-unknown', text: 'Không xác định', icon: '❓' };
    };

    if (loading) {
        return (
            <div className="customer-detail-loading">
                <div className="loading-spinner"></div>
                <p>Đang tải thông tin khách hàng...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="customer-detail-error">
                <div className="error-icon">⚠️</div>
                <h3>Có lỗi xảy ra</h3>
                <p>{error}</p>
                <Link to="/admin-business/customers" className="btn-back">
                    Quay lại danh sách
                </Link>
            </div>
        );
    }

    if (!selectedCustomer) {
        return (
            <div className="customer-not-found">
                <div className="not-found-icon">🔍</div>
                <h3>Không tìm thấy khách hàng</h3>
                <p>Khách hàng không tồn tại hoặc đã bị xóa.</p>
                <Link to="/admin-business/customers" className="btn-back">
                    Quay lại danh sách
                </Link>
            </div>
        );
    }

    const statusInfo = getStatusInfo(selectedCustomer.status);

    return (
        <div className="customer-detail">
            {/* Breadcrumb */}
            <div className="breadcrumb-container">
                <nav className="breadcrumb">
                    <Link to="/admin-business/sales" className="breadcrumb-link">
                        Dashboard
                    </Link>
                    <span className="breadcrumb-separator">/</span>
                    <Link to="/admin-business/customers" className="breadcrumb-link">
                        Quản lý khách hàng
                    </Link>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">Chi tiết khách hàng</span>
                </nav>
            </div>

            {/* Header */}
            <div className="customer-header">
                <div className="customer-header-content">
                    <div className="customer-avatar-large">
                        {selectedCustomer.fullName 
                            ? selectedCustomer.fullName.charAt(0).toUpperCase() 
                            : selectedCustomer.userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="customer-header-info">
                        <h1 className="customer-title">
                            {selectedCustomer.fullName || selectedCustomer.userName}
                        </h1>
                        <p className="customer-username">@{selectedCustomer.userName}</p>
                        <div className="customer-header-badges">
                            <span className={`status-badge ${statusInfo.class}`}>
                                {statusInfo.icon} {statusInfo.text}
                            </span>
                            <span className="join-date">
                                Tham gia: {formatDate(selectedCustomer.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="customer-header-actions">
                    <Link to="/admin-business/customers" className="btn-back">
                        ← Quay lại danh sách
                    </Link>
                </div>
            </div>

            {/* Statistics Summary */}
            <div className="customer-stats">
                <div className="stat-item">
                    <div className="stat-icon">📦</div>
                    <div className="stat-content">
                        <div className="stat-number">{selectedCustomer.totalOrders}</div>
                        <div className="stat-label">Tổng đơn hàng</div>
                    </div>
                </div>
                <div className="stat-item">
                    <div className="stat-icon">💰</div>
                    <div className="stat-content">
                        <div className="stat-number">{formatCurrency(selectedCustomer.totalSpent)}</div>
                        <div className="stat-label">Tổng chi tiêu</div>
                    </div>
                </div>
                <div className="stat-item">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                        <div className="stat-number">{formatCurrency(selectedCustomer.averageOrderValue)}</div>
                        <div className="stat-label">Trung bình/đơn</div>
                    </div>
                </div>
                <div className="stat-item">
                    <div className="stat-icon">🕒</div>
                    <div className="stat-content">
                        <div className="stat-number">
                            {selectedCustomer.lastOrderDate 
                                ? formatDateOnly(selectedCustomer.lastOrderDate)
                                : 'Chưa có đơn hàng'}
                        </div>
                        <div className="stat-label">Đơn gần nhất</div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="tab-navigation">
                <button
                    className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
                    onClick={() => setActiveTab('info')}
                >
                    <span className="tab-icon">👤</span>
                    Thông tin cá nhân
                </button>
                <button
                    className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    <span className="tab-icon">📦</span>
                    Lịch sử đơn hàng ({customerOrders.length})
                </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {activeTab === 'info' && (
                    <div className="info-tab">
                        <div className="info-grid">
                            <div className="info-section">
                                <h3 className="section-title">
                                    <span className="section-icon">📧</span>
                                    Thông tin liên hệ
                                </h3>
                                <div className="info-group">
                                    <div className="info-item">
                                        <label>Email:</label>
                                        <span>{selectedCustomer.email}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Số điện thoại:</label>
                                        <span>{selectedCustomer.phoneNumber || 'Chưa cập nhật'}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Địa chỉ:</label>
                                        <span>{selectedCustomer.address || 'Chưa cập nhật'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="info-section">
                                <h3 className="section-title">
                                    <span className="section-icon">👤</span>
                                    Thông tin cá nhân
                                </h3>
                                <div className="info-group">
                                    <div className="info-item">
                                        <label>Họ và tên:</label>
                                        <span>{selectedCustomer.fullName || 'Chưa cập nhật'}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Ngày sinh:</label>
                                        <span>
                                            {formatDateOnly(selectedCustomer.dateOfBirth)}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <label>Giới tính:</label>
                                        <span>
                                            {selectedCustomer.gender || 'Chưa cập nhật'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="info-section">
                                <h3 className="section-title">
                                    <span className="section-icon">⚙️</span>
                                    Thông tin tài khoản
                                </h3>
                                <div className="info-group">
                                    <div className="info-item">
                                        <label>Tên đăng nhập:</label>
                                        <span>{selectedCustomer.userName}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Trạng thái:</label>
                                        <span className={`status-badge ${statusInfo.class}`}>
                                            {statusInfo.icon} {statusInfo.text}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <label>Ngày tạo:</label>
                                        <span>{formatDate(selectedCustomer.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="orders-tab">
                        {customerOrders.length > 0 ? (
                            <div className="orders-list">
                                {customerOrders.map((order) => {
                                    const orderStatus = getOrderStatusInfo(order.status);
                                    return (
                                        <div key={order.id} className="order-card">
                                            <div className="order-header">
                                                <div className="order-id">
                                                    <strong>#{order.id.slice(0, 8)}</strong>
                                                </div>
                                                <div className={`order-status ${orderStatus.class}`}>
                                                    {orderStatus.icon} {orderStatus.text}
                                                </div>
                                            </div>
                                            <div className="order-content">
                                                <div className="order-info">
                                                    <div className="info-row">
                                                        <span className="label">Ngày đặt:</span>
                                                        <span className="value">{formatDate(order.createAt)}</span>
                                                    </div>
                                                    <div className="info-row">
                                                        <span className="label">Tổng tiền:</span>
                                                        <span className="value amount">{formatCurrency(order.totalAmount)}</span>
                                                    </div>
                                                    <div className="info-row">
                                                        <span className="label">Số sản phẩm:</span>
                                                        <span className="value">{order.itemCount} sản phẩm</span>
                                                    </div>
                                                </div>
                                                <div className="order-products">
                                                    <div className="products-label">Sản phẩm:</div>
                                                    <div className="products-list">
                                                        {order.productNames.map((productName, index) => (
                                                            <span key={index} className="product-tag">
                                                                {productName}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="order-actions">
                                                <Link 
                                                    to={`/admin-business/orders/${order.id}`}
                                                    className="btn-view-order"
                                                >
                                                    Xem chi tiết
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="empty-orders">
                                <div className="empty-icon">📦</div>
                                <h3>Chưa có đơn hàng</h3>
                                <p>Khách hàng này chưa có đơn hàng nào.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerDetail;
