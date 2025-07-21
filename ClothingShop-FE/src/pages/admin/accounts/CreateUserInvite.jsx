'use client';

import React, { useState, useEffect } from 'react';
import InviteService from '../../../services/admin/InviteService';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

const CreateUserInvite = () => {
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        fullName: '',
        phoneNumber: '',
        gender: '',
        dateOfBirth: '',
        address: '',
        roleId: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const email = params.get('email') || '';
        const role = params.get('role') || '';
        setFormData((prev) => ({
            ...prev,
            email,
            roleId: role
        }));
    }, [location.search]);

    const validateForm = () => {
        const newErrors = {};

        // Validate userName
        if (!formData.userName.trim()) {
            newErrors.userName = 'Tên đăng nhập là bắt buộc';
        } else if (formData.userName.length < 3) {
            newErrors.userName = 'Tên đăng nhập phải có ít nhất 3 ký tự';
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.userName)) {
            newErrors.userName = 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới';
        }

        // Validate email
        if (!formData.email.trim()) {
            newErrors.email = 'Email là bắt buộc';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        // Validate password
        if (!formData.password.trim()) {
            newErrors.password = 'Mật khẩu là bắt buộc';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        // Validate fullName
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Họ và tên là bắt buộc';
        } else if (formData.fullName.length < 2) {
            newErrors.fullName = 'Họ và tên phải có ít nhất 2 ký tự';
        }

        // Validate phoneNumber
        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Số điện thoại là bắt buộc';
        } else if (!/^[0-9]{10,11}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
            newErrors.phoneNumber = 'Số điện thoại không hợp lệ (10-11 số)';
        }

        // Validate gender
        if (!formData.gender) {
            newErrors.gender = 'Vui lòng chọn giới tính';
        }

        // Validate dateOfBirth
        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = 'Ngày sinh là bắt buộc';
        } else {
            const birthDate = new Date(formData.dateOfBirth);
            const today = new Date();
            if (birthDate > today) {
                newErrors.dateOfBirth = 'Ngày sinh không thể trong tương lai';
            }
            // } else if (today.getFullYear() - birthDate.getFullYear() < 13) {
            //     newErrors.dateOfBirth = 'Người dùng phải từ 13 tuổi trở lên';
            // }
        }

        // Validate address
        if (!formData.address.trim()) {
            newErrors.address = 'Địa chỉ là bắt buộc';
        } else if (formData.address.length < 5) {
            newErrors.address = 'Địa chỉ phải có ít nhất 5 ký tự';
        }

        // Validate roleId
        if (!formData.roleId) {
            newErrors.roleId = 'Vui lòng chọn vai trò';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Vui lòng kiểm tra lại thông tin');
            return;
        }

        setIsSubmitting(true);
        try {
            await InviteService.createUserFromInvite({
                ...formData,
                gender: formData.gender ? parseInt(formData.gender) : null,
                dateOfBirth: formData.dateOfBirth || null,
                roleId: formData.roleId ? parseInt(formData.roleId) : 3, // default Customer
            });
            toast.success('Tạo user thành công!');
            // Reset form after successful submission
            setFormData({
                userName: '',
                email: '',
                password: '',
                fullName: '',
                phoneNumber: '',
                gender: '',
                dateOfBirth: '',
                address: '',
                roleId: '',
            });
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error.message;
            if (errorMessage.includes('email') || errorMessage.includes('Email')) {
                setErrors(prev => ({ ...prev, email: 'Email này đã được sử dụng' }));
                toast.error('Email này đã được sử dụng');
            } else if (errorMessage.includes('userName') || errorMessage.includes('username')) {
                setErrors(prev => ({ ...prev, userName: 'Tên đăng nhập này đã được sử dụng' }));
                toast.error('Tên đăng nhập này đã được sử dụng');
            } else {
                toast.error('Tạo user thất bại: ' + errorMessage);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-2">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-center text-primary mb-8">Invite New User</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
                            <input 
                                id="userName" 
                                name="userName" 
                                type="text" 
                                placeholder="Username" 
                                className={`form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${errors.userName ? 'border-red-500' : 'border-gray-300'}`} 
                                value={formData.userName} 
                                onChange={handleChange} 
                            />
                            {errors.userName && <p className="mt-1 text-sm text-red-600">{errors.userName}</p>}
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input 
                                id="email" 
                                name="email" 
                                type="email" 
                                placeholder="Jimmy@gmail.com" 
                                className={`form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-gray-100 ${errors.email ? 'border-red-500' : 'border-gray-300'}`} 
                                value={formData.email} 
                                onChange={handleChange} 
                                disabled 
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input 
                                id="password" 
                                name="password" 
                                type="password" 
                                placeholder="Password" 
                                className={`form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${errors.password ? 'border-red-500' : 'border-gray-300'}`} 
                                value={formData.password} 
                                onChange={handleChange} 
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                        </div>
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input 
                                id="fullName" 
                                name="fullName" 
                                type="text" 
                                placeholder="Jimmy Turner" 
                                className={`form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`} 
                                value={formData.fullName} 
                                onChange={handleChange} 
                            />
                            {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                        </div>
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input 
                                id="phoneNumber" 
                                name="phoneNumber" 
                                type="text" 
                                placeholder="0123456789" 
                                className={`form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`} 
                                value={formData.phoneNumber} 
                                onChange={handleChange} 
                            />
                            {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
                        </div>
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                            <select 
                                id="gender" 
                                name="gender" 
                                className={`form-select w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${errors.gender ? 'border-red-500' : 'border-gray-300'}`} 
                                value={formData.gender} 
                                onChange={handleChange} 
                            >
                                <option value="">Select Gender</option>
                                <option value="1">Male</option>
                                <option value="2">Female</option>
                            </select>
                            {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
                        </div>
                        <div>
                            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <input 
                                id="dateOfBirth" 
                                name="dateOfBirth" 
                                type="date" 
                                className={`form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`} 
                                value={formData.dateOfBirth} 
                                onChange={handleChange} 
                            />
                            {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <input 
                                id="address" 
                                name="address" 
                                type="text" 
                                placeholder="New York" 
                                className={`form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${errors.address ? 'border-red-500' : 'border-gray-300'}`} 
                                value={formData.address} 
                                onChange={handleChange} 
                            />
                            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                        </div>
                        <div>
                            <label htmlFor="roleId" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <select 
                                id="roleId" 
                                name="roleId" 
                                className={`form-select w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-gray-100 ${errors.roleId ? 'border-red-500' : 'border-gray-300'}`} 
                                value={formData.roleId} 
                                onChange={handleChange} 
                                disabled
                            >
                                <option value="">Select Role</option>
                                <option value="1">Admin</option>
                                <option value="2">Seller</option>
                                <option value="3">Customer</option>
                            </select>
                            {errors.roleId && <p className="mt-1 text-sm text-red-600">{errors.roleId}</p>}
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="px-8 py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-lg shadow disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Đang tạo...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateUserInvite;
