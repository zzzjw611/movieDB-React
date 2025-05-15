import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress
} from '@mui/material';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((s) => s.auth);

  return (
    <Box maxWidth={400} mx="auto" mt={5}>
      <Typography variant="h4" mb={2}>Login</Typography>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={Yup.object({
          username: Yup.string().required('必填'),
          password: Yup.string().required('必填')
        })}
        onSubmit={async (values, { setSubmitting, setFieldError }) => {
          try {
            const resultAction = await dispatch(login(values));
            unwrapResult(resultAction); // 如果 reject 会抛
            // sign in success
            navigate('/');
          } catch (errMsg) {
            // errMsg 就是 rejectWithValue 里传的那段 message
            setFieldError('username', errMsg);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field name="username">
              {({ field }) => (
                <TextField
                  {...field}
                  label="Username"
                  fullWidth
                  margin="normal"
                />
              )}
            </Field>
            <ErrorMessage name="username" component="div" style={{ color: 'red' }} />

            <Field name="password">
              {({ field }) => (
                <TextField
                  {...field}
                  type="password"
                  label="Password"
                  fullWidth
                  margin="normal"
                />
              )}
            </Field>
            <ErrorMessage name="password" component="div" style={{ color: 'red' }} />

            {isSubmitting || status === 'loading' ? (
              <Box textAlign="center" mt={2}>
                <CircularProgress />
              </Box>
            ) : (
              <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                Submit
              </Button>
            )}

            {status === 'failed' && (
              <Typography color="error" mt={2}>{error}</Typography>
            )}
          </Form>
        )}
      </Formik>
    </Box>
  );
}
