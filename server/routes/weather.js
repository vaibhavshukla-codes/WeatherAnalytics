const express = require('express');
const { getCurrentWeather, getForecast, searchCities } = require('../utils/weatherApi');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Search cities
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json([]);
    }

    const results = await searchCities(q);
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Error searching cities' });
  }
});

// Get current weather
router.get('/current', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const weather = await getCurrentWeather(lat, lon);
    res.json(weather);
  } catch (error) {
    console.error('Current weather error:', error);
    res.status(500).json({ message: 'Error fetching current weather' });
  }
});

// Get forecast
router.get('/forecast', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const forecast = await getForecast(lat, lon);
    res.json(forecast);
  } catch (error) {
    console.error('Forecast error:', error);
    res.status(500).json({ message: 'Error fetching forecast' });
  }
});

// Get combined weather data (current + forecast)
router.get('/all', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const [current, forecast] = await Promise.all([
      getCurrentWeather(lat, lon),
      getForecast(lat, lon)
    ]);

    res.json({
      current,
      forecast
    });
  } catch (error) {
    console.error('Combined weather error:', error);
    res.status(500).json({ message: 'Error fetching weather data' });
  }
});

module.exports = router;
