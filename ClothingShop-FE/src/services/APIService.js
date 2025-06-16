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