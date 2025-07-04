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
        avatarUrl: '',
        roleId: '',
    });

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await InviteService.createUserFromInvite({
                ...formData,
                gender: formData.gender ? parseInt(formData.gender) : null,
                dateOfBirth: formData.dateOfBirth || null,
                roleId: formData.roleId ? parseInt(formData.roleId) : 3, // default Customer
            });
            toast.success('Tạo user thành công!');
        } catch (error) {
            toast.error('Tạo user thất bại: ' + (error?.response?.data?.message || error.message));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-2">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-center text-primary mb-8">Invite New User</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-shrink-0">
                            <img src="/assets/images/profile-34.jpeg" alt="img" className="h-28 w-28 rounded-full object-cover border-4 border-primary shadow" />
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
                                <input id="userName" name="userName" type="text" placeholder="Username" className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" value={formData.userName} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input id="email" name="email" type="email" placeholder="Jimmy@gmail.com" className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-gray-100" value={formData.email} onChange={handleChange} disabled />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input id="password" name="password" type="password" placeholder="Password" className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" value={formData.password} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input id="fullName" name="fullName" type="text" placeholder="Jimmy Turner" className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" value={formData.fullName} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input id="phoneNumber" name="phoneNumber" type="text" placeholder="+1 (530) 555-12121" className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" value={formData.phoneNumber} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select id="gender" name="gender" className="form-select w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" value={formData.gender} onChange={handleChange} >
                                    <option value="">Select Gender</option>
                                    <option value="1">Male</option>
                                    <option value="2">Female</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                <input id="dateOfBirth" name="dateOfBirth" type="date" className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" value={formData.dateOfBirth} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input id="address" name="address" type="text" placeholder="New York" className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" value={formData.address} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                                <input id="avatarUrl" name="avatarUrl" type="text" placeholder="Avatar URL" className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" value={formData.avatarUrl} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="roleId" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select id="roleId" name="roleId" className="form-select w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-gray-100" value={formData.roleId} onChange={handleChange} disabled>
                                    <option value="">Select Role</option>
                                    <option value="1">Admin</option>
                                    <option value="2">Seller</option>
                                    <option value="3">Customer</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="px-8 py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-lg shadow">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateUserInvite;
