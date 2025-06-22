import API from '../../utils/APIUtil'

export async function loginApi({ username, password }) {
  const res = await API.post('/auth/login', { username, password });
  return res.data; // { token, user }
}