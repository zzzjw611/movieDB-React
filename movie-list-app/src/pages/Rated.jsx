// src/pages/Rated.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRated } from '../features/movies/moviesSlice';
import MovieCard from '../components/MovieCard';
import { Grid, Typography, Box, CircularProgress } from '@mui/material';

export default function Rated() {
  const dispatch = useDispatch();
  const { rated, cache, status } = useSelector(s => s.movies);
  const account = useSelector(s => s.auth.account);

  useEffect(() => {
    if (account) {
      dispatch(fetchRated());
    }
  }, [dispatch, account]);

  if (!account) {
    return <Typography>请先登录查看评分</Typography>;
  }
  if (status === 'loading') {
    return <Box textAlign="center"><CircularProgress /></Box>;
  }

  const movies = rated.map(({ movieId, rating }) => {
    const movie = Object.values(cache).flatMap(pages =>
      pages[1]?.results.filter(m => m.id === movieId) || []
    )[0] || { id: movieId, title: 'Loading…', poster_path: '' };
    return { ...movie, userRating: rating };
  });

  return (
    <Grid container spacing={2} p={2}>
      {movies.map(movie => (
        <Grid item key={movie.id} xs={12} sm={6} md={3}>
          <MovieCard
            movie={movie}
            isFavorite={false}
            userRating={movie.userRating}
          />
        </Grid>
      ))}
    </Grid>
  );
}
