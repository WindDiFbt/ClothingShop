import axios from '../utils/APIUtil';

export const getProducts = () => {
    return axios.get(`/Products`);
}

export const fetchDataHomePage = () => {
    return axios.get(`/Home`);
}

export const getDetailProductById = (id) => {
    return axios.get(`/Products/detail/${id}`);
}

export const getPendingProducts = () => {
    return axios.get(`/Products/pending`);
}

export const approveProduct = (id) => {
    return axios.put(`/Products/${id}/approve`);
}

export const rejectProduct = (id, rejectReason) => {
    return axios.put(`/Products/${id}/reject`, { rejectReason });
}