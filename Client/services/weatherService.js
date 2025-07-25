import Constants from 'expo-constants'; // Import Expo Constants

// Access the OpenWeather API key from the extra field in app.config.js
const { OPENWEATHER_API_KEY } = Constants.manifest.extra;

// Function to fetch the current weather data
export const getWeather = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    const data = await response.json();
    return data; // Return the weather data
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error; // Throw the error to be handled elsewhere
  }
};

// Function to fetch the weather forecast (if needed)
export const getWeatherForecast = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    const data = await response.json();
    return data; // Return the forecast data
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    throw error; // Throw the error to be handled elsewhere
  }
};
