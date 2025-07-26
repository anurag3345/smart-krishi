import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Image, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { getWeather, getWeatherForecast } from '../services/weatherService';
import { translateWeather } from '../constants/weatherTranslations';
import { toNepaliDigits } from '../constants/numberTranslator';

const getTimeLabel = (dtStr, language) => {
  const hour = new Date(dtStr).getHours();
  const currentHour = new Date().getHours();

  let label = '';
  if (hour === currentHour) label = 'Now';
  else if (hour === 0) label = '12 AM';
  else if (hour < 12) label = `${hour} AM`;
  else if (hour === 12) label = '12 PM';
  else label = `${hour - 12} PM`;

  if (language === 'NP' && label !== 'Now') {
    // Convert only hour part to Nepali digits, keep AM/PM as is
    // e.g. "12 PM" => "१२ PM"
    const [hourPart, meridiem] = label.split(' ');
    const nepaliHour = toNepaliDigits(hourPart, language);
    return `${nepaliHour} ${meridiem}`;
  }
  return label;
};

export default function WeatherCard() {
  const { latitude, longitude } = useSelector((state) => state.location);
  const language = useSelector((state) => state.language.value);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (latitude === null || longitude === null) return;

    const fetchWeatherData = async () => {
      try {
        setError(null);

        const [current, forecastData] = await Promise.all([
          getWeather(latitude, longitude),
          getWeatherForecast(latitude, longitude),
        ]);

        const filteredForecast = forecastData
          .filter((item) =>
            [new Date().getHours(), 12, 15, 18].includes(
              new Date(item.dt_txt).getHours()
            )
          )
          .slice(0, 4);

        setWeather(current);
        setForecast(filteredForecast);
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError('❌ Failed to load weather data');
      }
    };

    fetchWeatherData();
  }, [latitude, longitude]);

  if (latitude === null || longitude === null) {
    return <Text style={styles.loading}>📍 Getting location...</Text>;
  }

  if (error) return <Text style={styles.error}>{error}</Text>;

  if (!weather || forecast.length === 0) {
    return <ActivityIndicator size="large" color="#007AFF" />;
  }

  const weatherIconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>
          {language === 'EN' ? 'Weather Forecast' : 'मौसम पूर्वानुमान'}
        </Text>
        <Text style={styles.viewMore}>
          {language === 'EN' ? 'View More' : 'थप हेर्नुहोस्'}
        </Text>
      </View>

      <Text style={styles.subtitle}>
        {language === 'EN' ? 'Today, Kathmandu' : 'आज, काठमाडौं'}
      </Text>

      <View style={styles.header}>
        <View>
          <Text style={styles.temp}>
            {toNepaliDigits(weather.temperature, language)}°C
          </Text>
          <Text style={styles.condition}>
            {translateWeather(weather.condition, language)}
          </Text>
        </View>
        <Image source={{ uri: weatherIconUrl }} style={styles.icon} />
      </View>

      <View style={styles.forecastContainer}>
        {forecast.map((item, index) => (
          <View key={index} style={styles.forecastItem}>
            <Text style={styles.time}>{getTimeLabel(item.dt_txt, language)}</Text>
            <Image
              source={{
                uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
              }}
              style={styles.forecastIcon}
            />
            <Text style={styles.forecastTemp}>
              {toNepaliDigits(Math.round(item.main.temp), language)}°C
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  viewMore: {
    fontSize: 14,
    color: '#007AFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  temp: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  condition: {
    fontSize: 14,
    color: '#666',
  },
  icon: {
    width: 70,
    height: 70,
  },
  forecastContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forecastItem: {
    alignItems: 'center',
    flex: 1,
  },
  time: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
  },
  forecastIcon: {
    width: 40,
    height: 40,
    marginBottom: 4,
  },
  forecastTemp: {
    fontSize: 14,
    fontWeight: '600',
  },
  loading: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
  },
});
