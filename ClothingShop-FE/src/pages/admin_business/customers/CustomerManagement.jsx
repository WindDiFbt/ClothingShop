import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    fetchCustomers,
    fetchCustomerStatistics,
    updateCustomerStatus
} from '../../../redux/slices/admin_business/customerSlice';

// CSS riêng cho Customer Management
import './CustomerManagement.css';

const CustomerManagement = () => {
    const dispatch = useDispatch();
    const { customers, statistics, loading, error, pagination } = useSelector(state => state.customers);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    useEffect(() => {
        dispatch(fetchCustomers({ searchTerm, statusFilter, page: currentPage, pageSize }));
        dispatch(fetchCustomerStatistics());
    }, [dispatch, searchTerm, statusFilter, currentPage, pageSize]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleStatusFilter = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleStatusUpdate = async (customerId, newStatus) => {
        try {
            await dispatch(updateCustomerStatus({ customerId, status: newStatus })).unwrap();
            dispatch(fetchCustomers({ searchTerm, statusFilter, page: currentPage, pageSize }));
        } catch (error) {
            console.error('Failed to update customer status:', error);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            1: { class: 'status-active', text: 'Hoạt động', icon: '✅' },
            2: { class: 'status-inactive', text: 'Không hoạt động', icon: '❌' },
            3: { class: 'status-banned', text: 'Bị cấm', icon: '🚫' }
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
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    if (loading && customers.length === 0) {
        return (
            <div className="customer-loading">
                <div className="loading-spinner"></div>
                <p>Đang tải dữ liệu khách hàng...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="customer-error">
                <div className="error-icon">⚠️</div>
                <h3>Có lỗi xảy ra</h3>
                <p>{error}</p>
                <button 
                    className="btn-retry"
                    onClick={() => dispatch(fetchCustomers({ searchTerm, statusFilter, page: currentPage, pageSize }))}
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="customer-management">
            {/* Breadcrumb */}
            <div className="breadcrumb-container">
                <nav className="breadcrumb">
                    <Link to="/admin-business/sales" className="breadcrumb-link">
                        Dashboard
                    </Link>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">Quản lý khách hàng</span>
                </nav>
            </div>

            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <h1 className="page-title">Quản lý khách hàng</h1>
                    <p className="page-subtitle">Theo dõi và quản lý thông tin khách hàng</p>
                </div>
            </div>

            {/* Statistics Cards */}
            {statistics && (
                <div className="statistics-grid">
                    <div className="stat-card total-customers">
                        <div className="stat-icon">👥</div>
                        <div className="stat-content">
                            <h3 className="stat-number">{statistics.totalCustomers}</h3>
                            <p className="stat-label">Tổng khách hàng</p>
                        </div>
                    </div>
                    <div className="stat-card active-customers">
                        <div className="stat-icon">✅</div>
                        <div className="stat-content">
                            <h3 className="stat-number">{statistics.activeCustomers}</h3>
                            <p className="stat-label">Hoạt động</p>
                            <p className="stat-percentage">
                                ({statistics.totalCustomers > 0 ? ((statistics.activeCustomers / statistics.totalCustomers) * 100).toFixed(1) : 0}%)
                            </p>
                        </div>
                    </div>
                    <div className="stat-card inactive-customers">
                        <div className="stat-icon">❌</div>
                        <div className="stat-content">
                            <h3 className="stat-number">{statistics.inactiveCustomers}</h3>
                            <p className="stat-label">Không hoạt động</p>
                            <p className="stat-percentage">
                                ({statistics.totalCustomers > 0 ? ((statistics.inactiveCustomers / statistics.totalCustomers) * 100).toFixed(1) : 0}%)
                            </p>
                        </div>
                    </div>
                    <div className="stat-card banned-customers">
                        <div className="stat-icon">🚫</div>
                        <div className="stat-content">
                            <h3 className="stat-number">{statistics.bannedCustomers}</h3>
                            <p className="stat-label">Bị cấm</p>
                            <p className="stat-percentage">
                                ({statistics.totalCustomers > 0 ? ((statistics.bannedCustomers / statistics.totalCustomers) * 100).toFixed(1) : 0}%)
                            </p>
                        </div>
                    </div>
                    <div className="stat-card new-customers">
                        <div className="stat-icon">🆕</div>
                        <div className="stat-content">
                            <h3 className="stat-number">{statistics.newCustomersThisMonth}</h3>
                            <p className="stat-label">Khách hàng mới tháng này</p>
                        </div>
                    </div>
                   
                </div>
            )}

            {/* Filters */}
            <div className="filters-container">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, email, số điện thoại..."
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
                        <option value="1">Hoạt động</option>
                        <option value="2">Không hoạt động</option>
                        <option value="3">Bị cấm</option>
                    </select>
                </div>
            </div>

            {/* Customer Table */}
            <div className="table-container">
                <div className="table-wrapper">
                    <table className="customer-table">
                        <thead>
                            <tr>
                                <th>Khách hàng</th>
                                <th>Email</th>
                                <th>Số điện thoại</th>
                                <th>Địa chỉ</th>
                                <th>Trạng thái</th>
                                <th>Ngày tạo</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer) => (
                                <tr key={customer.id} className="table-row">
                                    <td className="customer-info">
                                        <div className="customer-avatar">
                                            {customer.fullName ? customer.fullName.charAt(0).toUpperCase() : customer.userName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="customer-details">
                                            <div className="customer-name">
                                                {customer.fullName || customer.userName}
                                            </div>
                                            <div className="customer-username">
                                                @{customer.userName}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="customer-email">{customer.email}</td>
                                    <td className="customer-phone">{customer.phoneNumber || 'N/A'}</td>
                                    <td className="customer-address">
                                        <div className="address-text">
                                            {customer.address || 'Chưa cập nhật'}
                                        </div>
                                    </td>
                                    <td className="customer-status">
                                        {getStatusBadge(customer.status)}
                                    </td>
                                    <td className="customer-date">
                                        {formatDate(customer.createdAt)}
                                    </td>
                                    <td className="customer-actions">
                                        <div className="action-buttons">
                                            <Link 
                                                to={`/admin-business/customers/${customer.id}`}
                                                className="btn-view"
                                                title="Xem chi tiết"
                                            >
                                                👁️
                                            </Link>
                                            <div className="status-dropdown">
                                                <select
                                                    value={customer.status}
                                                    onChange={(e) => handleStatusUpdate(customer.id, parseInt(e.target.value))}
                                                    className="status-select"
                                                >
                                                    <option value={1}>Hoạt động</option>
                                                    <option value={2}>Không hoạt động</option>
                                                    <option value={3}>Bị cấm</option>
                                                </select>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {customers.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">📝</div>
                        <h3>Không tìm thấy khách hàng</h3>
                        <p>Không có khách hàng nào phù hợp với tiêu chí tìm kiếm.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="pagination-container">
                    <div className="pagination-info">
                        Hiển thị {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, pagination.totalCount)} 
                        trong tổng số {pagination.totalCount} khách hàng
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

export default CustomerManagement;
