import axios from '../../utils/APIUtil';

const ProductService = {

    getDetailProductById: (id) => {
        return axios.get(`/Products/detail/${id}`);
    },
    getPendingProducts: () => {
        return axios.get(`/Products/pending`);
    },
    approveProduct: (id) => {
        return axios.put(`/Products/${id}/approve`);
    },
    rejectProduct: (id, rejectReason) => {
        return axios.put(`/Products/${id}/reject`, { rejectReason });
    },
    getAllProducts: () => {
        return axios.get(`/Products/all`);
    }
};

export default ProductService;