'use client';

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import InviteService from '../../../services/admin/InviteService';

const InviteUser = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // State cho form
    const [formData, setFormData] = useState({
        email: '',
        role: ''
    });

    // State cho validation
    const [errors, setErrors] = useState({});

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
        
        if (!formData.email) newErrors.email = 'Vui lòng nhập email';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
        
        if (!formData.role) newErrors.role = 'Vui lòng chọn vai trò';

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
            await InviteService.inviteUser({
                email: formData.email,
                role: parseInt(formData.role)
            });
            toast.success('Gửi lời mời thành công');
            navigate('/admin/accounts');
        } catch (error) {
            toast.error('Không thể gửi lời mời: ' + (error?.response?.data?.message || error.message));
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Mời user mới</h2>
                <Link to="/admin/accounts" className="text-gray-600 hover:text-gray-800">
                    <span className="text-sm">← Quay lại danh sách</span>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
                <div className="space-y-6">
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Nhập email của user"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    {/* Vai trò */}
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                            Vai trò
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors.role ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            <option value="">Chọn vai trò</option>
                            <option value="1">Admin</option>
                            <option value="2">Seller</option>
                            <option value="3">Customer</option>
                        </select>
                        {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
                    </div>
                </div>

                {/* Nút điều hướng */}
                <div className="mt-8 flex justify-end gap-4">
                    <Link
                        to="/admin/accounts"
                        className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Hủy
                    </Link>
                    <button
                        type="submit"
                        className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Gửi lời mời
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InviteUser; 