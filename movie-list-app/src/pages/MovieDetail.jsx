// src/pages/MovieDetail.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
//import { useDispatch, useSelector } from 'react-redux';
import { rateMovie } from '../features/movies/moviesSlice';
import {
  Box,
  Typography,
  CircularProgress,
  Rating,
  Button
} from '@mui/material';

export default function MovieDetail() {
  const { movieId } = useParams();
  const dispatch = useDispatch();
  const { rated } = useSelector(s => s.movies);
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState(
    rated.find(r => r.movieId === +movieId)?.rating || 0
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
      params: { api_key: process.env.REACT_APP_TMDB_API_KEY }
    })
      .then(res => setMovie(res.data))
      .finally(() => setLoading(false));
  }, [movieId]);

  if (loading) return <CircularProgress />;
  if (!movie) return <Typography>未找到该影片</Typography>;

  const handleRate = () => {
    dispatch(rateMovie({ movieId: +movieId, rating })).then(() => {
      
    });
  };

  return (
    <Box p={2}>
      <Typography variant="h3">{movie.title}</Typography>
      <Typography variant="body1" mt={1}>{movie.overview}</Typography>

      <Box mt={3} display="flex" alignItems="center" gap={2}>
        <Rating
          name="user-rating"
          value={rating}
          onChange={(_, val) => setRating(val)}
        />
        <Button variant="contained" onClick={handleRate}>Rate it</Button>
      </Box>

      <Typography mt={2}>
        {rating > 0 ? `Your Rating: ${rating}` : 'Not yet rated'}
      </Typography>
    </Box>
  );
}
