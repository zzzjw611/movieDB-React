// src/components/Pagination.jsx
import React from 'react';
import { Pagination as MuiPagination } from '@mui/material';

export default function Pagination({ count, page, onChange }) {
  return (
    <MuiPagination
      count={count}
      page={page}
      onChange={onChange}
      color="primary"
    />
  );
}
