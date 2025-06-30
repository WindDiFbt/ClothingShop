import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi } from './authApi'; // Ensure this path is correct
const initialState = {
  token: localStorage.getItem('token') || null,
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  status: 'idle',
  error: null
};

export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const data = await loginApi(credentials); // { token, user }
    console.log('✅ Login success:', data);
    return data;
  } catch (err) {
    console.error('❌ Login error full:', err);
    console.error('❌ Login error response:', err?.response);
    console.error('❌ Login error message:', err?.message);
    return thunkAPI.rejectWithValue(err?.response?.data?.message || err?.message || 'Login failed');
  }
});


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
