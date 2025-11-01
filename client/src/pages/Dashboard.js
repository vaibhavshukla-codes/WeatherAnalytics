import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { logout } from '../redux/slices/authSlice';
import { fetchFavorites } from '../redux/slices/favoritesSlice';
import { fetchWeatherData } from '../redux/slices/weatherSlice';
import { toggleTemperatureUnit } from '../redux/slices/settingsSlice';
import CityCard from '../components/CityCard';
import CitySearch from '../components/CitySearch';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { favorites } = useSelector(state => state.favorites);
  const { temperatureUnit } = useSelector(state => state.settings);

  const [anchorEl, setAnchorEl] = useState(null);
  const [cityWeathers, setCityWeathers] = useState({});

  useEffect(() => {
    // Ensure we're authenticated and fetch favorites
    dispatch(fetchFavorites());
  }, [dispatch]);

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after unmount
    
    const fetchWeathers = async () => {
      // Use Promise.all for parallel fetching instead of sequential
      const weatherPromises = favorites
        .filter(fav => fav.coordinates?.lat && fav.coordinates?.lon)
        .map(async (favorite) => {
          try {
            const response = await dispatch(fetchWeatherData({
              lat: favorite.coordinates.lat,
              lon: favorite.coordinates.lon
            }));
            if (isMounted && response.payload) {
              return { id: favorite._id, data: response.payload };
            }
          } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              console.error('Error fetching weather:', error);
            }
          }
          return null;
        });

      const results = await Promise.all(weatherPromises);
      
      if (isMounted) {
        const updatedWeathers = {};
        results.forEach(result => {
          if (result) {
            updatedWeathers[result.id] = result.data;
          }
        });
        setCityWeathers(prev => ({ ...prev, ...updatedWeathers }));
      }
    };

    if (favorites.length > 0) {
      fetchWeathers();
    }

    return () => {
      isMounted = false; // Cleanup: prevent state updates after unmount
    };
  }, [favorites, dispatch]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await dispatch(logout());
    navigate('/login');
  };

  const handleToggleUnit = () => {
    dispatch(toggleTemperatureUnit());
    handleMenuClose();
  };

  const handleCityClick = (cityId) => {
    navigate(`/city/${cityId}`);
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Weather Analytics
          </Typography>
          <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
            <Avatar src={user?.picture} alt={user?.name}>{user?.name?.[0]}</Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleToggleUnit}>
              Switch to {temperatureUnit === 'celsius' ? '°F' : '°C'}
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, pb: 10 }}>
        <Typography variant="h4" gutterBottom>
          My Cities
        </Typography>

        {favorites.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60vh',
              textAlign: 'center'
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No cities added yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add your first city to start tracking weather
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {favorites.map((favorite) => (
              <Grid item xs={12} sm={6} md={4} key={favorite._id}>
                <CityCard
                  favorite={favorite}
                  weatherData={cityWeathers[favorite._id]}
                  temperatureUnit={temperatureUnit}
                  onClick={() => handleCityClick(favorite._id)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <CitySearch />
    </Box>
  );
};

export default Dashboard;
