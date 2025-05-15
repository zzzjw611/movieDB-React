import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Box,
  Rating
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({
  movie,
  isFavorite,
  userRating,
  onToggleFavorite
}) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ maxWidth: 250 }}>
      <CardMedia
        component="img"
        height="375"
        image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        onClick={() => navigate(`/movies/${movie.id}`)}
        sx={{ cursor: 'pointer' }}
      />
      <CardContent>
        <Typography
          variant="subtitle1"
          component="div"
          onClick={() => navigate(`/movies/${movie.id}`)}
          sx={{ cursor: 'pointer' }}
        >
          {movie.title}
        </Typography>
      </CardContent>
      <CardActions>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Rating
            name="avg-rating"
            value={movie.vote_average / 2}
            precision={0.5}
            readOnly
            size="small"
          />
          <Typography variant="body2">
            {movie.vote_average.toFixed(1)}
          </Typography>
        </Box>
        {userRating != null && (
          <Typography variant="body2" sx={{ ml: 1 }}>
            Your Rating: {userRating}/10
          </Typography>
        )}
        <Box sx={{ flexGrow: 1 }} />
        <IconButton
          color="error"
          onClick={onToggleFavorite}
          disabled={!onToggleFavorite}
        >
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default MovieCard;
