import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  InputAdornment,
  Box,
  Typography,
  Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { searchCities, clearSearchResults } from '../redux/slices/weatherSlice';
import { addFavorite } from '../redux/slices/favoritesSlice';

const CitySearch = () => {
  const dispatch = useDispatch();
  const { searchResults } = useSelector(state => state.weather);
  const { favorites } = useSelector(state => state.favorites);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length >= 2) {
        setIsSearching(true);
        dispatch(searchCities(query)).finally(() => setIsSearching(false));
      } else {
        dispatch(clearSearchResults());
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, dispatch]);

  const handleClose = () => {
    setOpen(false);
    setQuery('');
    dispatch(clearSearchResults());
  };

  const handleCityClick = async (city) => {
    // Check if already in favorites
    const exists = favorites.some(
      fav => fav.city === city.name && 
      fav.coordinates.lat === city.lat && 
      fav.coordinates.lon === city.lon
    );

    if (exists) {
      alert('City already in favorites');
      return;
    }

    await dispatch(addFavorite({
      city: city.name,
      country: city.country,
      coordinates: {
        lat: city.lat,
        lon: city.lon
      }
    }));

    handleClose();
  };

  return (
    <>
      {!open && (
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
        >
          <AddIcon />
        </Fab>
      )}

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        disableEnforceFocus={false}
        disableAutoFocus={false}
      >
        <DialogTitle>Add City</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Search city"
            fullWidth
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: isSearching && <CircularProgress size={20} />
            }}
          />
          
          {searchResults.length > 0 && (
            <List>
              {searchResults.map((city, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton onClick={() => handleCityClick(city)}>
                    <ListItemText
                      primary={city.name}
                      secondary={`${city.state || ''} ${city.country}`.trim()}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}

          {query.length >= 2 && searchResults.length === 0 && !isSearching && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                No cities found
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CitySearch;
