import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const weatherService = {
  searchCities: async (query) => {
    const response = await axios.get(`${API_URL}/weather/search`, {
      params: { q: query }
    });
    return response.data;
  },

  getWeatherData: async (lat, lon) => {
    const response = await axios.get(`${API_URL}/weather/all`, {
      params: { lat, lon }
    });
    return response.data;
  },

  getCurrentWeather: async (lat, lon) => {
    const response = await axios.get(`${API_URL}/weather/current`, {
      params: { lat, lon }
    });
    return response.data;
  },

  getForecast: async (lat, lon) => {
    const response = await axios.get(`${API_URL}/weather/forecast`, {
      params: { lat, lon }
    });
    return response.data;
  }
};
