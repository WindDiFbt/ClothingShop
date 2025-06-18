'use client';

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserById, updateUserInfo } from '../../../redux/slices/UserSlice';
import { toast } from 'react-toastify';

const EditAccount = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // State cho form
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        fullName: '',
        phoneNumber: '',
        address: '',
        gender: '',
        dateOfBirth: '',
        avatarUrl: '',
        role: '',
        status: ''
    });

    // State cho validation
    const [errors, setErrors] = useState({});

    // Lấy thông tin user từ Redux store
    const { selectedUser, loading, error } = useSelector((state) => state.user);

    // Fetch thông tin user khi component mount
    useEffect(() => {
        dispatch(fetchUserById(id));
    }, [dispatch, id]);

    // Cập nhật form data khi có thông tin user
    useEffect(() => {
        if (selectedUser) {
            setFormData({
                userName: selectedUser.userName || '',
                email: selectedUser.email || '',
                fullName: selectedUser.userinfo?.fullName || '',
                phoneNumber: selectedUser.userinfo?.phoneNumber || '',
                address: selectedUser.userinfo?.address || '',
                gender: selectedUser.userinfo?.gender?.toString() || '',
                dateOfBirth: selectedUser.userinfo?.dateOfBirth || '',
                avatarUrl: selectedUser.userinfo?.avatarUrl || '',
                role: selectedUser.userRoles?.[0] || '',
                status: selectedUser.status?.toString() || ''
            });
        }
    }, [selectedUser]);

    // Xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Xóa lỗi khi người dùng bắt đầu nhập lại
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.userName) newErrors.userName = 'Vui lòng nhập tên đăng nhập';
        if (!formData.email) newErrors.email = 'Vui lòng nhập email';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
        
        if (!formData.fullName) newErrors.fullName = 'Vui lòng nhập họ và tên';
        if (!formData.phoneNumber) newErrors.phoneNumber = 'Vui lòng nhập số điện thoại';
        else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
        
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Vui lòng nhập ngày sinh';
        if (!formData.gender) newErrors.gender = 'Vui lòng chọn giới tính';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Vui lòng kiểm tra lại thông tin');
            return;
        }

        try {
            await dispatch(updateUserInfo({ 
                id, 
                userData: {
                    userName: formData.userName,
                    email: formData.email,
                    status: parseInt(formData.status),
                    userRoles: [parseInt(formData.role)],
                    userinfo: {
                        fullName: formData.fullName,
                        phoneNumber: formData.phoneNumber,
                        address: formData.address,
                        gender: parseInt(formData.gender),
                        dateOfBirth: formData.dateOfBirth,
                        avatarUrl: formData.avatarUrl
                    }
                }
            })).unwrap();
            toast.success('Cập nhật thông tin thành công');
            navigate('/admin/accounts');
        } catch (error) {
            toast.error('Không thể cập nhật thông tin: ' + error);
        }
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
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Chỉnh sửa tài khoản</h2>
                <Link to="/admin/accounts" className="text-gray-600 hover:text-gray-800">
                    <span className="text-sm">← Quay lại danh sách</span>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Thông tin đăng nhập */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin đăng nhập</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                            <input
                                type="text"
                                id="userName"
                                name="userName"
                                value={formData.userName}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.userName ? 'border-red-500' : 'border-gray-300'
                                }`}
                                disabled
                            />
                            {errors.userName && <p className="mt-1 text-sm text-red-600">{errors.userName}</p>}
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                                disabled
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>
                    </div>
                </div>

                {/* Thông tin cá nhân */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin cá nhân</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                        </div>
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
                        </div>
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.gender ? 'border-red-500' : 'border-gray-300'
                                }`}
                            >
                                <option value="">Chọn giới tính</option>
                                <option value="1">Nam</option>
                                <option value="2">Nữ</option>
                                <option value="3">Khác</option>
                            </select>
                            {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
                        </div>
                        <div>
                            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                            <input
                                type="date"
                                id="dateOfBirth"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Cài đặt tài khoản */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Cài đặt tài khoản</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="1">Admin</option>
                                <option value="2">Seller</option>
                                <option value="3">Customer</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="1">Hoạt động</option>
                                <option value="2">Không hoạt động</option>
                                <option value="3">Bị khóa</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Nút điều hướng */}
                <div className="flex justify-end gap-4">
                    <Link
                        to="/admin/accounts"
                        className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Hủy
                    </Link>
                    <button
                        type="submit"
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cập nhật
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditAccount; 