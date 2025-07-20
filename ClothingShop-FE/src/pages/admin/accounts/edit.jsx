'use client';

import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserById, updateUserInfo } from '../../../redux/slices/UserSlice';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

// Schema validation
const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Vui lòng nhập họ và tên'),
    phoneNumber: Yup.string()
        .required('Vui lòng nhập số điện thoại')
        .matches(/^[0-9]{10}$/, 'Số điện thoại không hợp lệ'),
    address: Yup.string().required('Vui lòng nhập địa chỉ'),
    gender: Yup.string().required('Vui lòng chọn giới tính'),
    dateOfBirth: Yup.date()
        .required('Vui lòng nhập ngày sinh')
        .max(new Date(), 'Ngày sinh không hợp lệ '),
    role: Yup.string().required('Vui lòng chọn vai trò'),
    status: Yup.string().required('Vui lòng chọn trạng thái')
});

const EditAccount = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Lấy thông tin user từ Redux store
    const { selectedUser, loading, error } = useSelector((state) => state.user);

    // Fetch thông tin user khi component mount
    useEffect(() => {
        dispatch(fetchUserById(id));
    }, [dispatch, id]);

    // Xử lý submit form
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await dispatch(updateUserInfo({ 
                id, 
                userData: {
                    userName: values.userName,
                    email: values.email,
                    status: parseInt(values.status),
                    userRoles: [parseInt(values.role)],
                    userinfo: {
                        fullName: values.fullName,
                        phoneNumber: values.phoneNumber,
                        address: values.address,
                        gender: parseInt(values.gender),
                        dateOfBirth: values.dateOfBirth,
                        avatarUrl: values.avatarUrl
                    }
                }
            })).unwrap();
            toast.success('Cập nhật thông tin thành công');
            navigate('/admin/accounts');
        } catch (error) {
            toast.error('Không thể cập nhật thông tin: ' + error);
        } finally {
            setSubmitting(false);
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

    // Initial values cho form
    const initialValues = {
        userName: selectedUser?.userName || '',
        email: selectedUser?.email || '',
        fullName: selectedUser?.userinfo?.fullName || '',
        phoneNumber: selectedUser?.userinfo?.phoneNumber || '',
        address: selectedUser?.userinfo?.address || '',
        gender: selectedUser?.userinfo?.gender?.toString() || '',
        dateOfBirth: selectedUser?.userinfo?.dateOfBirth || '',
        avatarUrl: selectedUser?.userinfo?.avatarUrl || '',
        role: selectedUser?.userRoles?.[0] || '',
        status: selectedUser?.status?.toString() || ''
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Chỉnh sửa tài khoản</h2>
                <Link to="/admin/accounts" className="text-gray-600 hover:text-gray-800">
                    <span className="text-sm">← Quay lại danh sách</span>
                </Link>
            </div>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ errors, touched, isSubmitting }) => (
                    <Form className="space-y-8">
                        {/* Thông tin đăng nhập */}
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin đăng nhập</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                                        Tên đăng nhập
                                    </label>
                                    <Field
                                        type="text"
                                        id="userName"
                                        name="userName"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <Field
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Thông tin cá nhân */}
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin cá nhân</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                                        Họ và tên
                                    </label>
                                    <Field
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            touched.fullName && errors.fullName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {touched.fullName && errors.fullName && (
                                        <div className="mt-1 text-sm text-red-600">{errors.fullName}</div>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                        Số điện thoại
                                    </label>
                                    <Field
                                        type="tel"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            touched.phoneNumber && errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {touched.phoneNumber && errors.phoneNumber && (
                                        <div className="mt-1 text-sm text-red-600">{errors.phoneNumber}</div>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                                        Giới tính
                                    </label>
                                    <Field
                                        as="select"
                                        id="gender"
                                        name="gender"
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            touched.gender && errors.gender ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Chọn giới tính</option>
                                        <option value="1">Nam</option>
                                        <option value="2">Nữ</option>
                                        <option value="3">Khác</option>
                                    </Field>
                                    {touched.gender && errors.gender && (
                                        <div className="mt-1 text-sm text-red-600">{errors.gender}</div>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                                        Ngày sinh
                                    </label>
                                    <Field
                                        type="date"
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            touched.dateOfBirth && errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {touched.dateOfBirth && errors.dateOfBirth && (
                                        <div className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</div>
                                    )}
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                        Địa chỉ
                                    </label>
                                    <Field
                                        as="textarea"
                                        id="address"
                                        name="address"
                                        rows="3"
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            touched.address && errors.address ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {touched.address && errors.address && (
                                        <div className="mt-1 text-sm text-red-600">{errors.address}</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Cài đặt tài khoản */}
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Cài đặt tài khoản</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                                        Vai trò
                                    </label>
                                    <Field
                                        as="select"
                                        id="role"
                                        name="role"
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            touched.role && errors.role ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="1">Admin</option>
                                        <option value="2">Seller</option>
                                        <option value="3">Customer</option>
                                    </Field>
                                    {touched.role && errors.role && (
                                        <div className="mt-1 text-sm text-red-600">{errors.role}</div>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                        Trạng thái
                                    </label>
                                    <Field
                                        as="select"
                                        id="status"
                                        name="status"
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            touched.status && errors.status ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="1">Hoạt động</option>
                                        <option value="2">Không hoạt động</option>
                                        <option value="3">Bị khóa</option>
                                    </Field>
                                    {touched.status && errors.status && (
                                        <div className="mt-1 text-sm text-red-600">{errors.status}</div>
                                    )}
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
                                disabled={isSubmitting}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default EditAccount; 