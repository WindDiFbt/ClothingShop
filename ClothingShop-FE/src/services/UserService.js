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


export const updateUser = (id, userData) => {
    return axios.put(`/Users/${id}`, userData);
}

