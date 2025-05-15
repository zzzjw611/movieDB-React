import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'https://api.themoviedb.org/3';
const API_KEY  = process.env.REACT_APP_TMDB_API_KEY;

// 每次登录都走这整个流程
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      // STEP 1: 创建 request token
      const {
        data: { request_token }
      } = await axios.get(`${API_BASE}/authentication/token/new`, {
        params: { api_key: API_KEY }
      });

      // STEP 2: 用用户名密码去验证这个 token
      await axios.post(
        `${API_BASE}/authentication/token/validate_with_login`,
        { username, password, request_token },
        { params: { api_key: API_KEY } }
      );

      // STEP 3: 用验证后的 token 换 session_id
      const {
        data: { session_id }
      } = await axios.post(
        `${API_BASE}/authentication/session/new`,
        { request_token },
        { params: { api_key: API_KEY } }
      );

      // STEP 4: 用 session_id 拿 account details
      const { data: account } = await axios.get(`${API_BASE}/account`, {
        params: { api_key: API_KEY, session_id }
      });

      // 返回给 slice，fulfilled 时把它存到 store
      return { sessionId: session_id, account };
    } catch (err) {
      // 存错误信息
      const message =
        err.response?.data?.status_message || err.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    sessionId: null,
    account: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  reducers: {
    logout(state) {
      state.sessionId = null;
      state.account = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.sessionId = payload.sessionId;
        state.account   = payload.account;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error  = payload;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
