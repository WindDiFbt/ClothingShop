import API from '../../utils/APIUtil'

export const fetchCart = async (userId) => {
  const res = await API.get(`/cart`, { params: { userId } });
  return res.data; // CartDTO
}

export const addOrUpdateItem = async ({ userId, productId, quantity }) => {
  const res = await API.post('/cart/addOrUpdate', { userId, productId, quantity });
  return res.data; // CartDTO
}

export const removeItem = async ({ userId, productId }) => {
  return API.delete('/cart/remove', { data: { userId, productId } });
}

export const clearCart = async (userId) => {
  return API.delete(`/cart/clear/${userId}`);
} 