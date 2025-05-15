import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Toolbar, IconButton, Typography, Button, Box } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import { Link, useNavigate } from 'react-router-dom';
//import { useSelector, useDispatch } from 'react-redux';
import LogoutIcon from '@mui/icons-material/Logout';
import { logout } from '../features/auth/authSlice';

const Header = () => {
  const account = useSelector((state) => state.auth.account);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" component={Link} to="/">
          <MovieIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          <Button color="inherit" component={Link} to="/">HOME</Button>
          <Button color="inherit" component={Link} to="/favorite">Favorite</Button>
          <Button color="inherit" component={Link} to="/rated">Rated</Button>
        </Box>
        {account ? (
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
            {account.username}
          </Button>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
