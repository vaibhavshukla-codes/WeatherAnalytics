import { createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    temperatureUnit: 'celsius'
  },
  reducers: {
    setTemperatureUnit: (state, action) => {
      state.temperatureUnit = action.payload;
    },
    toggleTemperatureUnit: (state) => {
      state.temperatureUnit = state.temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius';
    }
  }
});

export const { setTemperatureUnit, toggleTemperatureUnit } = settingsSlice.actions;
export default settingsSlice.reducer;
