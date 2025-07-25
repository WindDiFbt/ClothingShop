import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    fetchOrders
} from '../../../redux/slices/admin_business/orderSlice';

// CSS riêng cho Order Management
import './OrderManagement.css';

const OrderManagement = () => {
    const dispatch = useDispatch();
    const { orders, loading, error, pagination } = useSelector(state => state.orders);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    useEffect(() => {
        dispatch(fetchOrders({ searchTerm, statusFilter, page: currentPage, pageSize }));
    }, [dispatch, searchTerm, statusFilter, currentPage, pageSize]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleStatusFilter = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
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

    if (loading && orders.length === 0) {
        return (
            <div className="order-loading">
                <div className="loading-spinner"></div>
                <p>Đang tải dữ liệu đơn hàng...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="order-error">
                <div className="error-icon">⚠️</div>
                <h3>Có lỗi xảy ra</h3>
                <p>{error}</p>
                <button 
                    className="btn-retry"
                    onClick={() => dispatch(fetchOrders({ searchTerm, statusFilter, page: currentPage, pageSize }))}
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="order-management">
            {/* Breadcrumb */}
            <div className="breadcrumb-container">
                <nav className="breadcrumb">
                    <Link to="/admin-business/sales" className="breadcrumb-link">
                        Dashboard
                    </Link>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">Quản lý đơn hàng</span>
                </nav>
            </div>

            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <h1 className="page-title">Quản lý đơn hàng</h1>
                    <p className="page-subtitle">Theo dõi và quản lý tất cả đơn hàng</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="quick-stats">
                <div className="stat-card pending">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-content">
                        <h3 className="stat-number">
                            {orders.filter(order => order.status === 1).length}
                        </h3>
                        <p className="stat-label">Chờ xử lý</p>
                    </div>
                </div>
                <div className="stat-card confirmed">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <h3 className="stat-number">
                            {orders.filter(order => order.status === 2).length}
                        </h3>
                        <p className="stat-label">Đã xác nhận</p>
                    </div>
                </div>
                <div className="stat-card shipping">
                    <div className="stat-icon">🚚</div>
                    <div className="stat-content">
                        <h3 className="stat-number">
                            {orders.filter(order => order.status === 3).length}
                        </h3>
                        <p className="stat-label">Đang giao</p>
                    </div>
                </div>
                <div className="stat-card completed">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <h3 className="stat-number">
                            {orders.filter(order => order.status === 4).length}
                        </h3>
                        <p className="stat-label">Hoàn thành</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-container">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo ID đơn hàng, tên khách hàng, số điện thoại..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="search-input"
                    />
                    <div className="search-icon">🔍</div>
                </div>
                <div className="filter-group">
                    <select
                        value={statusFilter}
                        onChange={handleStatusFilter}
                        className="status-filter"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="1">Chờ xử lý</option>
                        <option value="2">Đã xác nhận</option>
                        <option value="3">Đang giao</option>
                        <option value="4">Hoàn thành</option>
                        <option value="5">Đã hủy</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="table-container">
                <div className="table-wrapper">
                    <table className="order-table">
                        <thead>
                            <tr>
                                <th>Mã đơn hàng</th>
                                <th>Khách hàng</th>
                                <th>Sản phẩm</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                                <th>Ngày đặt</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="table-row">
                                    <td className="order-id">
                                        <div className="id-container">
                                            <strong>#{order.id.slice(0, 8)}</strong>
                                            <span className="full-id">{order.id}</span>
                                        </div>
                                    </td>
                                    <td className="customer-info">
                                        <div className="customer-details">
                                            <div className="customer-name">
                                                {order.customerName || order.fullName || 'N/A'}
                                            </div>
                                            <div className="customer-contact">
                                                {order.phoneNumber && (
                                                    <span className="phone">📞 {order.phoneNumber}</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="order-items">
                                        <div className="items-summary">
                                            <span className="items-count">
                                                {order.totalItems || order.itemCount || 0} sản phẩm
                                            </span>
                                        </div>
                                    </td>
                                    <td className="order-total">
                                        <span className="total-amount">
                                            {formatCurrency(order.totalAmount)}
                                        </span>
                                    </td>
                                    <td className="order-status">
                                        {getStatusBadge(order.status)}
                                    </td>
                                    <td className="order-date">
                                        {formatDate(order.createAt)}
                                    </td>
                                    <td className="order-actions">
                                        <div className="action-buttons">
                                            <Link 
                                                to={`/admin-business/orders/${order.id}`}
                                                className="btn-view"
                                                title="Xem chi tiết"
                                            >
                                                👁️ Chi tiết
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {orders.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">📦</div>
                        <h3>Không tìm thấy đơn hàng</h3>
                        <p>Không có đơn hàng nào phù hợp với tiêu chí tìm kiếm.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="pagination-container">
                    <div className="pagination-info">
                        Hiển thị {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, pagination.totalCount)} 
                        trong tổng số {pagination.totalCount} đơn hàng
                    </div>
                    <div className="pagination-controls">
                        <button
                            className="pagination-btn"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            ← Trước
                        </button>
                        <div className="pagination-numbers">
                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                const page = Math.max(1, currentPage - 2) + i;
                                if (page <= pagination.totalPages) {
                                    return (
                                        <button
                                            key={page}
                                            className={`pagination-number ${page === currentPage ? 'active' : ''}`}
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </button>
                                    );
                                }
                                return null;
                            })}
                        </div>
                        <button
                            className="pagination-btn"
                            disabled={currentPage === pagination.totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            Sau →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
