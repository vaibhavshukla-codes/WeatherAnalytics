import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Check if user is authenticated
export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/auth/me`, { 
      withCredentials: true,
      validateStatus: (status) => status < 500 // Don't throw on 401, only on server errors
    });
    
    // If 401, user is not authenticated
    if (response.status === 401) {
      return rejectWithValue(null);
    }
    
    return response.data;
  } catch (error) {
    // 401 is expected when user is not logged in - don't treat as error
    if (error.response?.status === 401 || error.response?.status === undefined) {
      return rejectWithValue(null); // Return null to indicate not authenticated
    }
    // Only log real errors (500+)
    console.error('Auth check error:', error);
    return rejectWithValue(error.message);
  }
});

// Logout
export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
  } catch (error) {
    // Even if logout fails on server, clear local state
    if (process.env.NODE_ENV === 'development') {
      console.error('Logout error:', error);
    }
    return rejectWithValue(null);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    isLoading: true
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  }
});

export const { setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
