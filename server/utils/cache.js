const NodeCache = require('node-cache');

// Cache configuration: 60 seconds TTL
const cache = new NodeCache({ 
  stdTTL: 60, // 60 seconds
  checkperiod: 30 
});

/**
 * Get data from cache
 */
const getFromCache = (key) => {
  return cache.get(key);
};

/**
 * Set data in cache
 */
const setInCache = (key, value, ttl = 60) => {
  return cache.set(key, value, ttl);
};

/**
 * Check if key exists in cache
 */
const hasInCache = (key) => {
  return cache.has(key);
};

/**
 * Generate cache key for weather data
 */
const generateWeatherKey = (lat, lon, type) => {
  return `weather_${lat}_${lon}_${type}`;
};

module.exports = {
  cache,
  getFromCache,
  setInCache,
  hasInCache,
  generateWeatherKey
};
