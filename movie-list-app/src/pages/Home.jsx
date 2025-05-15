import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies, toggleFavorite } from '../features/movies/moviesSlice';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import {
  MenuItem,
  Select,
  Grid,
  Box,
  CircularProgress,
  Typography
} from '@mui/material';

const categories = [
  { key: 'now_playing', label: 'Now Playing' },
  { key: 'popular', label: 'Popular' },
  { key: 'top_rated', label: 'Top Rated' },
  { key: 'upcoming', label: 'Upcoming' }
];

export default function Home() {
  const dispatch = useDispatch();
  const { cache, status, error, favorites, rated } = useSelector(s => s.movies);
  const [category, setCategory] = useState('now_playing');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchMovies({ category, page }));
  }, [dispatch, category, page]);

  const pageData = cache[category]?.[page];

  return (
    <Box p={2}>
      <Select
        value={category}
        onChange={e => { setCategory(e.target.value); setPage(1); }}
      >
        {categories.map(c => (
          <MenuItem key={c.key} value={c.key}>{c.label}</MenuItem>
        ))}
      </Select>

      {status === 'loading' && <CircularProgress />}
      {status === 'failed' && <Typography color="error">{error}</Typography>}

      {pageData && (
        <>
          <Grid container spacing={2} mt={2}>
            {pageData.results.map(movie => (
              <Grid item key={movie.id} xs={12} sm={6} md={3}>
                <MovieCard
                  movie={movie}
                  isFavorite={favorites.includes(movie.id)}
                  userRating={rated.find(r => r.movieId === movie.id)?.rating}
                  onToggleFavorite={() =>
                    dispatch(toggleFavorite({
                      movieId: movie.id,
                      isFavorite: !favorites.includes(movie.id)
                    }))
                  }
                />
              </Grid>
            ))}
          </Grid>

          <Box mt={2} display="flex" justifyContent="center">
            <Pagination
              count={pageData.total_pages}
              page={page}
              onChange={(_, value) => setPage(value)}
            />
          </Box>
        </>
      )}
    </Box>
  );
}
