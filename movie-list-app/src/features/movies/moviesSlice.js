
// src/features/movies/moviesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

console.log('TMDB Key:', process.env.REACT_APP_TMDB_API_KEY);

//放API
const API_BASE = 'https://api.themoviedb.org/3';
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

// 
export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async ({ category, page }, { getState, rejectWithValue }) => {
    try {
      const { movies } = getState();
      // 如果缓存中已有，直接返回
      if (movies.cache[category]?.[page]) {
        return { category, page, data: movies.cache[category][page] };
      }
      const { data } = await axios.get(`${API_BASE}/movie/${category}`, {
        params: { api_key: API_KEY, page }
      });
      return { category, page, data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 切换收藏状态
export const toggleFavorite = createAsyncThunk(
  'movies/toggleFavorite',
  async ({ movieId, isFavorite }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const params = {
        api_key: API_KEY,
        session_id: auth.sessionId
      };
      await axios.post(
        `${API_BASE}/account/${auth.account.id}/favorite`,
        { media_type: 'movie', media_id: movieId, favorite: isFavorite },
        { params }
      );
      return { movieId, isFavorite };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// rate部分
export const rateMovie = createAsyncThunk(
  'movies/rateMovie',
  async ({ movieId, rating }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const params = {
        api_key: API_KEY,
        session_id: auth.sessionId
      };
      await axios.post(
        `${API_BASE}/movie/${movieId}/rating`,
        { value: rating },
        { params }
      );
      return { movieId, rating };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 用户favourite部分
export const fetchFavorites = createAsyncThunk(
  'movies/fetchFavorites',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const { data } = await axios.get(
        `${API_BASE}/account/${auth.account.id}/favorite/movies`,
        { params: { api_key: API_KEY, session_id: auth.sessionId } }
      );
      return data.results;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 
export const fetchRated = createAsyncThunk(
  'movies/fetchRated',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const { data } = await axios.get(
        `${API_BASE}/account/${auth.account.id}/rated/movies`,
        { params: { api_key: API_KEY, session_id: auth.sessionId } }
      );
      return data.results;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState: {
    cache: {},      
    favorites: [],  // 收藏电影 ID 列表
    rated: [],      
    status: 'idle', 
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchMovies
      .addCase(fetchMovies.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, { payload }) => {
        const { category, page, data } = payload;
        state.status = 'succeeded';
        state.cache[category] = state.cache[category] || {};
        state.cache[category][page] = data;
      })
      .addCase(fetchMovies.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error = payload;
      })

      // toggleFavorite
      .addCase(toggleFavorite.fulfilled, (state, { payload }) => {
        const { movieId, isFavorite } = payload;
        if (isFavorite) {
          state.favorites.push(movieId);
        } else {
          state.favorites = state.favorites.filter((id) => id !== movieId);
        }
      })

      // rateMovie
      .addCase(rateMovie.fulfilled, (state, { payload }) => {
        const { movieId, rating } = payload;
        const idx = state.rated.findIndex((r) => r.movieId === movieId);
        if (idx >= 0) {
          state.rated[idx].rating = rating;
        } else {
          state.rated.push({ movieId, rating });
        }
      })

      // fetchFavorites
      .addCase(fetchFavorites.fulfilled, (state, { payload }) => {
        state.favorites = payload.map((m) => m.id);
      })

      // fetchRated
      .addCase(fetchRated.fulfilled, (state, { payload }) => {
        state.rated = payload.map((m) => ({
          movieId: m.id,
          rating: m.rating
        }));
      });
  }
});

export default moviesSlice.reducer;
