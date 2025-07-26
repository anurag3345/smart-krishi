import { configureStore } from '@reduxjs/toolkit';
import languageReducer from './languageSlice';
import locationReducer from './locationSlice';

export const store = configureStore({
  reducer: {
    language: languageReducer,
    location: locationReducer,
  },
});
