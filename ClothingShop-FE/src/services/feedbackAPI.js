import axios from '../utils/APIUtil';

// Thêm feedback mới (cần authentication)
export const addFeedback = async (feedbackData) => {
    try {
        const response = await axios.post('/feedback', feedbackData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Lấy feedback theo sản phẩm
export const getFeedbackByProduct = async (productId) => {
    try {
        const response = await axios.get(`/feedback/product/${productId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Lấy feedback theo đơn hàng
export const getFeedbackByOrder = async (orderId) => {
    try {
        const response = await axios.get(`/feedback/order/${orderId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
