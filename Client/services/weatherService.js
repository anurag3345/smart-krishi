import Constants from "expo-constants";

const getApiKey = () => {
  try {
    const apiKey =
      Constants.expoConfig?.extra?.OPENWEATHER_API_KEY ||
      Constants.manifest?.extra?.OPENWEATHER_API_KEY ||
      process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      throw new Error("OpenWeather API key not found");
    }

    return apiKey;
  } catch (error) {
    console.error("API Key Error:", error);
    throw new Error("Failed to retrieve OpenWeather API key.");
  }
};

const OPENWEATHER_API_KEY = getApiKey();

export const getWeather = async (latitude, longitude) => {
  try {
    if (!latitude || !longitude)
      throw new Error("Latitude and longitude are required.");

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    if (!res.ok) throw new Error(`Weather API Error: ${res.statusText}`);

    const data = await res.json();

    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      rainfall: data.rain?.["1h"] || 0, // fallback to 0 mm if not available
      condition: data.weather[0].description,
      icon: data.weather[0].icon,
    };
  } catch (err) {
    console.error("Fetch Weather Error:", err);
    throw err;
  }
};

export const getWeatherForecast = async (latitude, longitude) => {
  try {
    if (!latitude || !longitude)
      throw new Error("Latitude and longitude are required.");

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    if (!res.ok) throw new Error(`Forecast API Error: ${res.statusText}`);

    const data = await res.json();
    return data.list;
  } catch (err) {
    console.error("Fetch Forecast Error:", err);
    throw err;
  }
};
