// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Favorite from './pages/Favorite';
import Rated from './pages/Rated';
import Login from './pages/Login';         
import MovieDetail from './pages/MovieDetail';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorite" element={<Favorite />} />
        <Route path="/rated" element={<Rated />} />
        <Route path="/login" element={<Login />} />
        <Route path="/movies/:movieId" element={<MovieDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
