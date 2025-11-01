import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  IconButton,
  LinearProgress
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { removeFavorite } from '../redux/slices/favoritesSlice';
import { formatTemperature, getTemperatureSymbol } from '../utils/conversions';

const CityCard = ({ favorite, weatherData, temperatureUnit, onClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = !weatherData;

  const handleRemoveFavorite = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Remove ${favorite.city} from favorites?`)) {
      try {
        await dispatch(removeFavorite(favorite._id));
        // Don't navigate - stay on dashboard, favorites will update automatically
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to remove favorite:', error);
        }
      }
    }
  };

  const getWeatherIcon = (condition) => {
    // Simple icon mapping - in production, you'd use actual weather icons
    const iconMap = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️'
    };
    return iconMap[condition] || '🌤️';
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
      onClick={onClick}
    >
      {isLoading && <LinearProgress />}
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
          <Box>
            <Typography variant="h6" component="div">
              {favorite.city}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {favorite.country}
            </Typography>
          </Box>
          <IconButton 
            size="small" 
            onClick={handleRemoveFavorite}
            sx={{ color: 'error.main' }}
          >
            <FavoriteIcon />
          </IconButton>
        </Box>

        {weatherData && weatherData.current ? (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h3" component="span" sx={{ mr: 2 }}>
                {getWeatherIcon(weatherData.current.weather?.[0]?.main || 'Clear')}
              </Typography>
              <Box>
                <Typography variant="h4" component="div">
                  {formatTemperature(weatherData.current.main?.temp || 0, temperatureUnit)}
                  {getTemperatureSymbol(temperatureUnit)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {weatherData.current.weather?.[0]?.description || 'N/A'}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Feels like
                </Typography>
                <Typography variant="body2">
                  {formatTemperature(weatherData.current.main?.feels_like || 0, temperatureUnit)}
                  {getTemperatureSymbol(temperatureUnit)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Humidity
                </Typography>
                <Typography variant="body2">
                  {weatherData.current.main?.humidity || 0}%
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Wind
                </Typography>
                <Typography variant="body2">
                  {weatherData.current.wind?.speed || 0} m/s
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
            <Typography color="text.secondary">Loading weather...</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CityCard;
