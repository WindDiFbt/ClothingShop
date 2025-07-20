'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, changeUserStatus, changeUserRole } from '../../../redux/slices/UserSlice';
import { toast } from 'react-toastify';

/**
 * Component phân trang
 * @param {number} currentPage - Trang hiện tại
 * @param {number} totalPages - Tổng số trang
 * @param {function} onPageChange - Callback khi chuyển trang
 */
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

/**
 * Component danh sách tài khoản
 * Hiển thị danh sách users với các chức năng:
 * - Tìm kiếm
 * - Lọc theo trạng thái và role
 * - Phân trang
 * - Thay đổi trạng thái user
 */
const AccountList = () => {
    // State cho các bộ lọc và phân trang
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Lấy dữ liệu từ Redux store
    const { users, loading, error } = useSelector((state) => state.user);

    // Fetch danh sách users khi component mount
    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    /**
     * Xử lý thay đổi trạng thái user
     * @param {string} userId - ID của user
     * @param {number} newStatus - Trạng thái mới (1: active, 0: inactive)
     */
    const handleStatusChange = async (userId, newStatus) => {
        try {
            await dispatch(changeUserStatus({ id: userId, status: newStatus })).unwrap();
            toast.success('Cập nhật trạng thái thành công');
        } catch (error) {
            toast.error('Không thể cập nhật trạng thái');
        }
    };

    /**
     * Xử lý thay đổi role của user
     * @param {string} userId - ID của user
     * @param {number} newRoleId - ID của role mới
     */
    const handleRoleChange = async (userId, newRoleId) => {
        try {
            await dispatch(changeUserRole({ id: userId, roleId: newRoleId })).unwrap();
            toast.success('Cập nhật vai trò thành công');
        } catch (error) {
            toast.error('Không thể cập nhật vai trò');
        }
    };

    // Lọc users theo điều kiện tìm kiếm và bộ lọc
    const filteredUsers = users
        .filter((user) => 
            user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.userinfo?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((user) => (statusFilter ? user.status === parseInt(statusFilter) : true))
        .filter((user) => {
            if (!roleFilter) return true;
            return user.userRoles?.some(role => Number(role) === Number(roleFilter));
        });

    // Tính toán phân trang
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    // Xử lý xem chi tiết user
    const handleViewDetails = (userId) => {
        navigate(`/admin/accounts/${userId}`);
    };

    // Hiển thị loading spinner
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Hiển thị thông báo lỗi
    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-red-600">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Danh sách tài khoản</h2>

            {/* Nút mời user */}
            <div className="mb-6">
                <Link
                    to="/admin/accounts/invite"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                >
                    <span>Mời user</span>
                </Link>
            </div>

            {/* Bộ lọc và tìm kiếm */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:w-1/3">
                    <input
                        type="text"
                        placeholder="Tìm theo tên, email..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="input input-bordered w-full pl-4 pr-4 py-2 rounded-lg shadow-sm"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    {/* Bộ lọc trạng thái */}
                    <div className="relative">
                        <select
                            className="select select-bordered pl-4 pr-4 py-2 rounded-lg shadow-sm"
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="1">Hoạt động</option>
                            <option value="2">Không hoạt động</option>
                            <option value="3">Bị khóa</option>
                        </select>
                    </div>

                    {/* Bộ lọc vai trò */}
                    <div className="relative">
                        <select
                            className="select select-bordered pl-4 pr-4 py-2 rounded-lg shadow-sm"
                            value={roleFilter}
                            onChange={(e) => {
                                setRoleFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">Tất cả vai trò</option>
                            <option value="1">Admin</option>
                            <option value="2">Seller</option>
                            <option value="3">Customer</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Thông tin phân trang */}
            <div className="flex flex-wrap items-center gap-2 mb-3 text-sm text-gray-600">
                <span>
                    Hiển thị {startIndex + 1} đến {Math.min(startIndex + itemsPerPage, filteredUsers.length)} trong tổng {filteredUsers.length} tài khoản.
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

            {/* Bảng danh sách users */}
            <div className="overflow-x-auto mb-5">
                <table className="table w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="text-center py-3 px-4 border-b border-gray-200 font-semibold text-gray-600">Tên đăng nhập</th>
                            <th className="text-center py-3 px-4 border-b border-gray-200 font-semibold text-gray-600">Email</th>
                            <th className="text-center py-3 px-4 border-b border-gray-200 font-semibold text-gray-600">Họ và tên</th>
                            <th className="text-center py-3 px-4 border-b border-gray-200 font-semibold text-gray-600">Số điện thoại</th>
                            <th className="text-center py-3 px-4 border-b border-gray-200 font-semibold text-gray-600">Vai trò</th>
                            <th className="text-center py-3 px-4 border-b border-gray-200 font-semibold text-gray-600">Trạng thái</th>
                            <th className="text-center py-3 px-4 border-b border-gray-200 font-semibold text-gray-600">Ngày tạo</th>
                            <th className="text-center py-3 px-4 border-b border-gray-200 font-semibold text-gray-600">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="text-center py-3 px-4 border-b border-gray-200">{user.userName}</td>
                                <td className="text-center py-3 px-4 border-b border-gray-200">{user.email}</td>
                                <td className="text-center py-3 px-4 border-b border-gray-200">{user.userinfo?.fullName}</td>
                                <td className="text-center py-3 px-4 border-b border-gray-200">{user.userinfo?.phoneNumber}</td>
                                <td className="text-center py-3 px-4 border-b border-gray-200">
                                    {user.userRoles?.map(role => {
                                        let roleName = '';
                                        switch(Number(role)) {
                                            case 1:
                                                roleName = 'Admin';
                                                break;
                                            case 2:
                                                roleName = 'Seller';
                                                break;
                                            case 3:
                                                roleName = 'Customer';
                                                break;
                                            default:
                                                roleName = role;
                                        }
                                        return (
                                            <span key={role} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1">
                                                {roleName}
                                            </span>
                                        );
                                    })}
                                </td>
                                <td className="text-center py-3 px-4 border-b border-gray-200">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        user.status === 1 
                                        ? 'bg-green-100 text-green-800 border border-green-400' 
                                        : 'bg-red-100 text-red-800 border border-red-400'
                                    }`}>
                                        {user.status === 1 ? 'Hoạt động' : 'Bị khóa'}
                                    </span>
                                </td>
                                <td className="text-center py-3 px-4 border-b border-gray-200">{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td className="text-center py-3 px-4 border-b border-gray-200">
                                    <div className="flex justify-center gap-2">
                                        <Link
                                            to={`/admin/accounts/edit/${user.id}`}
                                            className="px-3 py-1.5 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors duration-200"
                                        >
                                            Chỉnh sửa
                                        </Link>
                                        <button
                                            type="button"
                                            className={`px-3 py-1.5 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
                                                user.status === 1 
                                                ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500' 
                                                : 'bg-green-500 hover:bg-green-600 focus:ring-green-500'
                                            }`}
                                            onClick={() => handleStatusChange(user.id, user.status === 1 ? 3 : 1)}
                                        >
                                            {user.status === 1 ? 'Khóa' : 'Mở khóa'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
    );
};

export default AccountList;