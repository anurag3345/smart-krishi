import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLocation } from '../store/locationSlice';  // Import Redux action
import * as Location from 'expo-location';  // Import Expo Location API

const LocationFetcher = () => {
  const dispatch = useDispatch();  // Initialize dispatch

  useEffect(() => {
    const fetchLocation = async () => {
      // Request location permission for the foreground
      const { status } = await Location.requestForegroundPermissionsAsync();  // Correct permission method
      if (status === 'granted') {
        // Fetch current location if permission is granted
        const location = await Location.getCurrentPositionAsync({});
        dispatch(setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }));
      } else {
        console.log('Location permission denied');
      }
    };

    fetchLocation();  // Fetch location when the component mounts
  }, [dispatch]);  // Empty dependency array to fetch only once

  return null;  // No UI rendering required, just fetch location and update Redux store
};

export default LocationFetcher;  // Export the LocationFetcher component
