const express = require('express');
const { authenticate } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get user's favorite cities
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.favorites || []);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Error fetching favorites' });
  }
});

// Add a favorite city
router.post('/', async (req, res) => {
  try {
    const { city, country, coordinates } = req.body;
    
    if (!city || !coordinates || typeof coordinates.lat !== 'number' || typeof coordinates.lon !== 'number') {
      return res.status(400).json({ message: 'City and valid coordinates (lat, lon) are required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.favorites) {
      user.favorites = [];
    }
    
    // Check if already favorited
    const exists = user.favorites.find(
      fav => fav.city === city && 
      fav.coordinates && 
      fav.coordinates.lat === coordinates.lat && 
      fav.coordinates.lon === coordinates.lon
    );

    if (exists) {
      return res.status(400).json({ message: 'City already in favorites' });
    }

    user.favorites.push({
      city,
      country: country || '',
      coordinates: {
        lat: coordinates.lat,
        lon: coordinates.lon
      }
    });

    await user.save();
    res.json(user.favorites);
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ message: 'Error adding favorite' });
  }
});

// Remove a favorite city
router.delete('/:cityId', async (req, res) => {
  try {
    const { cityId } = req.params;
    if (!cityId) {
      return res.status(400).json({ message: 'City ID is required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const initialLength = user.favorites.length;
    user.favorites = user.favorites.filter(fav => fav._id && fav._id.toString() !== cityId);
    
    if (user.favorites.length === initialLength) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    await user.save();
    
    res.json(user.favorites);
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ message: 'Error removing favorite' });
  }
});

// Update preferences
router.put('/preferences', async (req, res) => {
  try {
    const { temperatureUnit } = req.body;
    
    if (!temperatureUnit || !['celsius', 'fahrenheit'].includes(temperatureUnit)) {
      return res.status(400).json({ message: 'Invalid temperature unit' });
    }
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.preferences) {
      user.preferences = {};
    }
    
    user.preferences.temperatureUnit = temperatureUnit;
    await user.save();
    
    res.json(user.preferences);
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Error updating preferences' });
  }
});

module.exports = router;
