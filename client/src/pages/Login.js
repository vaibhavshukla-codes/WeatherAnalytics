import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  Avatar,
  Alert,
  AlertTitle
} from '@mui/material';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { API_BASE_URL } from '../utils/apiConfig';

const Login = () => {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const [errorDescription, setErrorDescription] = useState(null);

  useEffect(() => {
    // Check for error in URL parameters (from OAuth callback)
    const errorParam = searchParams.get('error');
    const descriptionParam = searchParams.get('description');
    const messageParam = searchParams.get('message');

    if (errorParam) {
      setError(errorParam);
      setErrorDescription(descriptionParam || messageParam || 'An error occurred during sign-in');
      
      // Clean up URL by removing error parameters
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [searchParams]);

  const handleGoogleLogin = () => {
    // Clear any previous errors
    setError(null);
    setErrorDescription(null);
    
    // Auto-detects backend URL based on current hostname
    // Works from localhost AND network IPs
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  };

  const getErrorMessage = () => {
    if (!error) return null;

    const errorMessages = {
      'redirect_uri_mismatch': 'OAuth configuration error. Please contact support.',
      'access_denied': 'Sign-in was cancelled. Please try again.',
      'oauth_failed': 'Authentication failed. Please try again.',
      'no_code': 'Authorization failed. Please try again.',
      'no_user': 'User creation failed. Please try again.',
      'auth_failed': 'Authentication failed. Please try again.'
    };

    return errorMessages[error] || errorDescription || 'An error occurred during sign-in';
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 64, height: 64 }}>
            <CloudQueueIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography component="h1" variant="h4" gutterBottom>
            Weather Analytics
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Sign in to access your weather dashboard and analytics
          </Typography>
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ width: '100%', mb: 2 }}
              icon={<ErrorOutlineIcon />}
            >
              <AlertTitle>Sign-In Error</AlertTitle>
              {getErrorMessage()}
            </Alert>
          )}
          
          <Button
            variant="contained"
            fullWidth
            onClick={handleGoogleLogin}
            sx={{ mt: 2 }}
          >
            Sign in with Google
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
