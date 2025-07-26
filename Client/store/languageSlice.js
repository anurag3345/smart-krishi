import { createSlice } from '@reduxjs/toolkit';

const languageSlice = createSlice({
  name: 'language',
  initialState: {
    value: 'EN', // Default language is English
  },
  reducers: {
    toggleLanguage: (state) => {
      state.value = state.value === 'EN' ? 'NP' : 'EN'; // Toggle between EN and NP
    },
    setLanguage: (state, action) => {
      state.value = action.payload; // Set the language directly based on the action payload
    },
  },
});

export const { toggleLanguage, setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
