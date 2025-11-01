import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Fetch favorites
export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/favorites`, { withCredentials: true });
      return response.data;
    } catch (error) {
      // If 401, user is not authenticated - return empty array
      if (error.response?.status === 401) {
        return [];
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch favorites');
    }
  }
);

// Add favorite
export const addFavorite = createAsyncThunk(
  'favorites/addFavorite',
  async (cityData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/favorites`, cityData, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add favorite');
    }
  }
);

// Remove favorite
export const removeFavorite = createAsyncThunk(
  'favorites/removeFavorite',
  async (cityId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/favorites/${cityId}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove favorite');
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    favorites: [],
    isLoading: false,
    error: null
  },
  reducers: {
    clearFavorites: (state) => {
      state.favorites = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // If error is array, it means we got empty array for unauthenticated
        if (Array.isArray(action.payload)) {
          state.favorites = [];
          state.error = null;
        }
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.favorites = action.payload;
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.favorites = action.payload;
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
