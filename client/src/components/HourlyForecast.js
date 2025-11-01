import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Grid
} from '@mui/material';
import { formatTemperature, getTemperatureSymbol } from '../utils/conversions';

const HourlyForecast = ({ forecast, temperatureUnit }) => {
  if (!forecast || !forecast.list || forecast.list.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            No hourly forecast data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const hourlyData = forecast.list.slice(0, 24); // First 24 hours

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
  };

  const getWeatherIcon = (condition) => {
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
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          24-Hour Forecast
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 2 }}>
          {hourlyData.map((item, index) => (
            <Box
              key={index}
              sx={{
                minWidth: 100,
                textAlign: 'center',
                padding: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {index === 0 ? 'Now' : formatTime(item.dt)}
              </Typography>
              <Typography variant="h5" sx={{ my: 1 }}>
                {getWeatherIcon(item.weather?.[0]?.main || 'Clear')}
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {formatTemperature(item.main?.temp || 0, temperatureUnit)}
                {getTemperatureSymbol(temperatureUnit)}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                {item.weather?.[0]?.description || 'N/A'}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default HourlyForecast;
