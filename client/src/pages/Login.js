import React from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  Avatar
} from '@mui/material';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';

const Login = () => {
  const handleGoogleLogin = () => {
    // Always use port 5001 for backend (this project's backend)
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
    window.location.href = `${API_URL}/api/auth/google`;
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
