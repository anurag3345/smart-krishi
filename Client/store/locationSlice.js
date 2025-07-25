import { createSlice } from '@reduxjs/toolkit';

// Initial state for the location
const initialState = {
  latitude: null,
  longitude: null,
};

// Create a slice for location
export const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (state, action) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
    clearLocation: (state) => {
      state.latitude = null;
      state.longitude = null;
    },
  },
});

// Export the actions for use in components
export const { setLocation, clearLocation } = locationSlice.actions;

// Export the reducer to be added to the store
export default locationSlice.reducer;
