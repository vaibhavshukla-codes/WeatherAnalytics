import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../utils/apiConfig';

// Fetch weather data
export const fetchWeatherData = createAsyncThunk(
  'weather/fetchWeatherData',
  async ({ lat, lon }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/weather/all`, {
        params: { lat, lon }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch weather data');
    }
  }
);

// Search cities
export const searchCities = createAsyncThunk(
  'weather/searchCities',
  async (query, { rejectWithValue }) => {
    if (!query || query.length < 2) {
      return [];
    }
    try {
      const response = await axios.get(`${API_URL}/weather/search`, {
        params: { q: query }
      });
      return response.data || [];
    } catch (error) {
      console.error('Search cities error:', error);
      return []; // Return empty array on error instead of throwing
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    currentWeather: null,
    forecast: null,
    searchResults: [],
    selectedCity: null,
    isLoading: false,
    error: null
  },
  reducers: {
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearWeather: (state) => {
      state.currentWeather = null;
      state.forecast = null;
      state.selectedCity = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.currentWeather = action.payload.current;
        state.forecast = action.payload.forecast;
        state.isLoading = false;
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(searchCities.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      })
      .addCase(searchCities.rejected, (state, action) => {
        state.searchResults = [];
        state.error = action.payload;
      });
  }
});

export const { setSelectedCity, clearSearchResults, clearWeather } = weatherSlice.actions;
export default weatherSlice.reducer;
