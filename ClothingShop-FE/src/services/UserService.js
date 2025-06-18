import axios from '../utils/APIUtil';

export const getUsers = () => {
    return axios.get('/Users');
}

export const getUserById = (id) => {
    return axios.get(`/Users/${id}`);
}

export const updateUserStatus = (id, status) => {
    return axios.put(`/Users/${id}/status`, { status });
}

export const updateUserRole = (id, roleId) => {
    return axios.put(`/Users/${id}/role`, { roleId });
}

/**
 * Cập nhật thông tin user
 * @param {string} id - ID của user
 * @param {Object} userData - Dữ liệu cần cập nhật
 * @param {string} userData.fullName - Họ và tên
 * @param {string} userData.phoneNumber - Số điện thoại
 * @param {string} userData.address - Địa chỉ
 * @param {number} userData.role - Vai trò (1: Admin, 2: Seller, 3: Customer)
 * @param {number} userData.status - Trạng thái (1: Active, 2: Inactive, 3: Locked)
 * @returns {Promise} Promise chứa response từ API
 */
export const updateUser = (id, userData) => {
    return axios.put(`/Users/${id}`, userData);
}

