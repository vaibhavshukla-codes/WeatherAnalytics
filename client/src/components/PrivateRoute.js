import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuth } from '../redux/slices/authSlice';

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector(state => state.auth);

  // Re-check auth when component mounts (in case coming from OAuth redirect)
  useEffect(() => {
    // Check for token in URL first (OAuth redirect fallback)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    
    if (tokenFromUrl) {
      // Store token in cookie
      document.cookie = `token=${tokenFromUrl}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=None; Secure`;
      // Clean up URL immediately
      window.history.replaceState({}, '', window.location.pathname);
      // Force auth check
      dispatch(checkAuth());
    } else if (!isAuthenticated && !isLoading) {
      // Normal auth check
      dispatch(checkAuth());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount to avoid infinite loops

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
