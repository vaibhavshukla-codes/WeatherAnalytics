import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Divider
} from '@mui/material';
import { formatTemperature, getTemperatureSymbol } from '../utils/conversions';

const DailyForecast = ({ forecast, temperatureUnit }) => {
  if (!forecast || !forecast.list || forecast.list.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            No daily forecast data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Group forecast data by day
  const groupedByDay = {};
  forecast.list.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
    if (!groupedByDay[date]) {
      groupedByDay[date] = [];
    }
    groupedByDay[date].push(item);
  });

  // Get average/min/max for each day
  const dailyData = Object.entries(groupedByDay).map(([date, items]) => {
    const temps = items.map(item => item.main?.temp || 0);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const avgTemp = temps.reduce((sum, temp) => sum + temp, 0) / temps.length;
    const middleItem = items[Math.floor(items.length / 2)];
    const mainCondition = middleItem?.weather?.[0] || { main: 'Clear', description: 'N/A' };
    
    return {
      date,
      minTemp,
      maxTemp,
      avgTemp,
      condition: mainCondition.main,
      description: mainCondition.description,
      humidity: middleItem?.main?.humidity || 0,
      windSpeed: middleItem?.wind?.speed || 0
    };
  });

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
          5-Day Forecast
        </Typography>
        {dailyData.map((day, index) => (
          <Box key={index}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                <Typography variant="h5" sx={{ minWidth: 50 }}>
                  {getWeatherIcon(day.condition)}
                </Typography>
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    {day.date}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {day.description}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ textAlign: 'right', minWidth: 150 }}>
                <Typography variant="body1" fontWeight="bold">
                  {formatTemperature(day.maxTemp, temperatureUnit)}
                  {getTemperatureSymbol(temperatureUnit)} / {formatTemperature(day.minTemp, temperatureUnit)}
                  {getTemperatureSymbol(temperatureUnit)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  💧 {day.humidity}% | 🌬️ {day.windSpeed} m/s
                </Typography>
              </Box>
            </Box>
            {index < dailyData.length - 1 && <Divider />}
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default DailyForecast;
