// src/pages/Favorite.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites } from '../features/movies/moviesSlice';
import MovieCard from '../components/MovieCard';
import { Grid, Typography, Box, CircularProgress } from '@mui/material';
//
export default function Favorite() {
  const dispatch = useDispatch();
  const { favorites, cache, status } = useSelector(s => s.movies);
  const account = useSelector(s => s.auth.account);

  useEffect(() => {
    if (account) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, account]);

  if (!account) {
    return <Typography>请先登录查看收藏</Typography>;
  }
  if (status === 'loading') {
    return <Box textAlign="center"><CircularProgress /></Box>;
  }

  const movies = favorites.map(id => {
    return Object.values(cache).flatMap(pages =>
      pages[1]?.results.filter(m => m.id === id) || []
    )[0] || { id, title: 'Loading…', poster_path: '' };
  });

  return (
    <Grid container spacing={2} p={2}>
      {movies.map(movie => (
        <Grid item key={movie.id} xs={12} sm={6} md={3}>
          <MovieCard
            movie={movie}
            isFavorite={true}
          />
        </Grid>
      ))}
    </Grid>
  );
}
