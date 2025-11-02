const axios = require('axios');
const { getFromCache, setInCache, generateWeatherKey } = require('./cache');

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

if (!WEATHER_API_KEY) {
  console.warn('⚠️  WARNING: WEATHER_API_KEY is not set in environment variables');
}

/**
 * Fetch current weather data
 */
const getCurrentWeather = async (lat, lon) => {
  const cacheKey = generateWeatherKey(lat, lon, 'current');
  
  // Check cache first
  const cached = getFromCache(cacheKey);
  if (cached) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('📦 Serving from cache:', cacheKey);
    }
    return cached;
  }

  if (!WEATHER_API_KEY) {
    throw new Error('Weather API key is not configured');
  }

  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: WEATHER_API_KEY,
        units: 'metric'
      },
      timeout: 10000 // 10 second timeout
    });

    const data = {
      ...response.data,
      fetchedAt: new Date()
    };

    // Cache the data
    setInCache(cacheKey, data, 60);
    if (process.env.NODE_ENV !== 'production') {
      console.log('🌍 Fetched from API:', cacheKey);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching current weather:', error.message);
    if (error.response) {
      throw new Error(`Weather API error: ${error.response.data?.message || error.response.statusText}`);
    }
    throw new Error('Failed to fetch weather data');
  }
};

/**
 * Fetch forecast data (5 days, 3-hour intervals)
 */
const getForecast = async (lat, lon) => {
  const cacheKey = generateWeatherKey(lat, lon, 'forecast');
  
  // Check cache first
  const cached = getFromCache(cacheKey);
  if (cached) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('📦 Serving from cache:', cacheKey);
    }
    return cached;
  }

  if (!WEATHER_API_KEY) {
    throw new Error('Weather API key is not configured');
  }

  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: WEATHER_API_KEY,
        units: 'metric'
      },
      timeout: 10000 // 10 second timeout
    });

    const data = {
      ...response.data,
      fetchedAt: new Date()
    };

    // Cache the data
    setInCache(cacheKey, data, 60);
    if (process.env.NODE_ENV !== 'production') {
      console.log('🌍 Fetched from API:', cacheKey);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching forecast:', error.message);
    if (error.response) {
      throw new Error(`Forecast API error: ${error.response.data?.message || error.response.statusText}`);
    }
    throw new Error('Failed to fetch forecast data');
  }
};

/**
 * Search for cities by name
 */
const searchCities = async (query) => {
  const cacheKey = `city_search_${query.toLowerCase()}`;
  
  // Check cache first
  const cached = getFromCache(cacheKey);
  if (cached) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('📦 Serving from cache:', cacheKey);
    }
    return cached;
  }

  if (!WEATHER_API_KEY) {
    throw new Error('Weather API key is not configured');
  }

  try {
    const response = await axios.get('http://api.openweathermap.org/geo/1.0/direct', {
      params: {
        q: query,
        limit: 5,
        appid: WEATHER_API_KEY
      },
      timeout: 10000 // 10 second timeout
    });

    const data = response.data;

    // Cache the data (longer TTL for city searches)
    setInCache(cacheKey, data, 3600); // 1 hour
    if (process.env.NODE_ENV !== 'production') {
      console.log('🌍 Fetched from API:', cacheKey);
    }
    
    return data;
  } catch (error) {
    console.error('Error searching cities:', error.message);
    if (error.response) {
      throw new Error(`City search error: ${error.response.data?.message || error.response.statusText}`);
    }
    throw new Error('Failed to search cities');
  }
};

module.exports = {
  getCurrentWeather,
  getForecast,
  searchCities
};
