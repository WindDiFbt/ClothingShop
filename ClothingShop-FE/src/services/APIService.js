import axios from '../utils/APIUtil';

export const getProductsOdata = async (query) => {
    return await axios.get(`/odata/Products?$count=true&${query}`);
}

export const fetchSuggestion = async (keyword) => {
    if (!keyword) return [];
    const query = `$filter=startswith(tolower(Name),'${keyword.toLowerCase()}')  or startswith(NameUnsigned,'${keyword.toLowerCase()}')`;
    return await axios.get(`/odata/Products?$top=5&${query}`);
}

export const fetchDataHomePage = () => {
    return axios.get(`/Home`);
}

export const getDetailProductById = (id) => {
    return axios.get(`/Products/detail/${id}`);
}

export const getCategories = () => {
    return axios.get(`/Products/categories`)
}

