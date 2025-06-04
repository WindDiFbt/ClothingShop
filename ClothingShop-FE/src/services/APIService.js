import axios from '../utils/APIUtil';

export const getProducts = () => {
    return axios.get(`/Products`);
}