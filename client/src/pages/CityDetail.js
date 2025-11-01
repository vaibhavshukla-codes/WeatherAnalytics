import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchFavorites } from '../redux/slices/favoritesSlice';
import { fetchWeatherData } from '../redux/slices/weatherSlice';
import TemperatureChart from '../components/charts/TemperatureChart';
import PrecipitationChart from '../components/charts/PrecipitationChart';
import WindChart from '../components/charts/WindChart';
import HourlyForecast from '../components/HourlyForecast';
import DailyForecast from '../components/DailyForecast';
import { formatTemperature, getTemperatureSymbol } from '../utils/conversions';

const CityDetail = () => {
  const { cityId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { favorites } = useSelector(state => state.favorites);
  const { temperatureUnit } = useSelector(state => state.settings);
  
  const [selectedTab, setSelectedTab] = useState(0);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const favorite = favorites.find(f => f._id === cityId);

  useEffect(() => {
    // Fetch favorites if not found, but avoid infinite loop
    if (!favorite && favorites.length === 0) {
      dispatch(fetchFavorites());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  useEffect(() => {
    const fetchData = async () => {
      if (favorite && favorite.coordinates && favorite.coordinates.lat && favorite.coordinates.lon) {
        setIsLoading(true);
        try {
          const response = await dispatch(fetchWeatherData({
            lat: favorite.coordinates.lat,
            lon: favorite.coordinates.lon
          }));
          if (response.payload) {
            setCurrentWeather(response.payload.current);
            setForecast(response.payload.forecast);
          }
        } catch (error) {
          console.error('Error fetching weather:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [favorite, dispatch]);

  if (!favorite) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/dashboard')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {favorite.city}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <CircularProgress />
          </Box>
        ) : currentWeather ? (
          <>
            {/* Current Weather Card */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Typography variant="h1">
                        {getWeatherIcon(currentWeather.weather?.[0]?.main || 'Clear')}
                      </Typography>
                      <Box>
                      <Typography variant="h2" component="div">
                        {formatTemperature(currentWeather.main?.temp || 0, temperatureUnit)}
                        {getTemperatureSymbol(temperatureUnit)}
                      </Typography>
                        <Typography variant="h6" color="text.secondary">
                          {currentWeather.weather?.[0]?.description || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Feels Like
                        </Typography>
                        <Typography variant="body1">
                          {formatTemperature(currentWeather.main?.feels_like || 0, temperatureUnit)}
                          {getTemperatureSymbol(temperatureUnit)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Humidity
                        </Typography>
                        <Typography variant="body1">{currentWeather.main?.humidity || 0}%</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Wind Speed
                        </Typography>
                        <Typography variant="body1">{currentWeather.wind?.speed || 0} m/s</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Pressure
                        </Typography>
                        <Typography variant="body1">{currentWeather.main?.pressure || 0} hPa</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Visibility
                        </Typography>
                        <Typography variant="body1">
                          {currentWeather.visibility ? (currentWeather.visibility / 1000).toFixed(1) : 'N/A'} km
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          UV Index
                        </Typography>
                        <Typography variant="body1">{currentWeather.uvi || 'N/A'}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Tabs for different views */}
            <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)} sx={{ mb: 3 }}>
              <Tab label="Hourly Forecast" />
              <Tab label="Daily Forecast" />
              <Tab label="Temperature" />
              <Tab label="Precipitation" />
              <Tab label="Wind" />
            </Tabs>

            {/* Tab Content */}
            {selectedTab === 0 && forecast && (
              <HourlyForecast forecast={forecast} temperatureUnit={temperatureUnit} />
            )}
            {selectedTab === 1 && forecast && (
              <DailyForecast forecast={forecast} temperatureUnit={temperatureUnit} />
            )}
            {selectedTab === 2 && forecast && (
              <TemperatureChart forecast={forecast} temperatureUnit={temperatureUnit} />
            )}
            {selectedTab === 3 && forecast && (
              <PrecipitationChart forecast={forecast} />
            )}
            {selectedTab === 4 && forecast && (
              <WindChart forecast={forecast} />
            )}
          </>
        ) : (
          <Typography>No weather data available</Typography>
        )}
      </Container>
    </Box>
  );
};

export default CityDetail;
