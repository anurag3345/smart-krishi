import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { getWeather } from '../services/weatherService'; // Import the weather service

export default function WeatherCard() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  // Fetch weather data when the component mounts
  useEffect(() => {
    const fetchWeather = async () => {
      const latitude = 37.7749; // Example latitude
      const longitude = -122.4194; // Example longitude

      try {
        const data = await getWeather(latitude, longitude); // Call the service function
        setWeather({
          icon: 'ios-sunny', // Example icon, replace with actual data
          temperature: `${data.main.temp}°C`,
          condition: data.weather[0].description,
          forecast: data.list, // Use the appropriate data from the response
        });
      } catch (error) {
        setError('Failed to load weather data');
      }
    };

    fetchWeather();
  }, []);

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!weather) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Weather Forecast</Text>
      <View style={styles.mainRow}>
        <Ionicons name={weather.icon} size={30} color="#333" />
        <Text style={styles.temp}>{weather.temperature}</Text>
        <Text style={styles.condition}>{weather.condition}</Text>
      </View>
      {/* Add the forecast display if needed */}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    padding: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  temp: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  condition: {
    fontSize: 14,
    color: '#555',
  },
});
