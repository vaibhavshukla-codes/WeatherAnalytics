import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { checkAuth } from './redux/slices/authSlice';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CityDetail from './pages/CityDetail';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector(state => state.auth);

  useEffect(() => {
    // Check for token in URL (from OAuth redirect) - remove immediately for security
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    
    if (tokenFromUrl) {
      // Decode token (was URL-encoded by backend)
      const decodedToken = decodeURIComponent(tokenFromUrl);
      
      // Store token in cookie as backup (primary is httpOnly cookie from backend)
      const isSecure = window.location.protocol === 'https:';
      const cookieString = `token=${decodedToken}; path=/; max-age=${7 * 24 * 60 * 60}; ${isSecure ? 'SameSite=None; Secure;' : 'SameSite=Lax;'}`;
      document.cookie = cookieString;
      
      // IMMEDIATELY remove token from URL for security (don't expose token in browser history/URL)
      window.history.replaceState({}, '', window.location.pathname);
      
      // Small delay to ensure cookie is set, then check auth
      setTimeout(() => {
        dispatch(checkAuth());
      }, 100);
    } else {
      // Normal auth check on mount (will use httpOnly cookie from backend)
      dispatch(checkAuth());
    }
    
    // Also check auth when window regains focus (after OAuth redirect)
    // But only check once per focus to avoid excessive calls
    let lastCheckTime = 0;
    const handleFocus = () => {
      const now = Date.now();
      // Throttle: only check if last check was more than 1 second ago
      if (now - lastCheckTime > 1000) {
        dispatch(checkAuth());
        lastCheckTime = now;
      }
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [dispatch]);

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '1.5rem'
        }}>
          Loading...
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}>
        <Routes>
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/city/:cityId" 
            element={
              <PrivateRoute>
                <CityDetail />
              </PrivateRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
