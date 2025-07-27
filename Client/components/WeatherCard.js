import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Image, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
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
    return (
      <View style={styles.loadingCard}>
        <Ionicons name="location-outline" size={24} color="#666" />
        <Text style={styles.loadingText}>Getting location...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorCard}>
        <Ionicons name="alert-circle-outline" size={24} color="#F44336" />
        <Text style={styles.errorText}>Failed to load weather data</Text>
      </View>
    );
  }

  if (!weather || forecast.length === 0) {
    return (
      <View style={styles.loadingCard}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading weather...</Text>
      </View>
    );
  }

  const weatherIconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

  return (
    <View style={styles.card}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name="partly-sunny" size={20} color="#FFFFFF" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>
              {language === 'EN' ? 'Weather Forecast' : 'मौसम पूर्वानुमान'}
            </Text>
            <Text style={styles.subtitle}>
              {language === 'EN' ? 'Today, Kathmandu' : 'आज, काठमाडौं'}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.viewMoreButton}>
          <Text style={styles.viewMoreText}>
            {language === 'EN' ? 'View More' : 'थप हेर्नुहोस्'}
          </Text>
          <Ionicons name="chevron-forward" size={14} color="#2196F3" />
        </TouchableOpacity>
      </View>

      {/* Current Weather Section */}
      <View style={styles.currentWeather}>
        <View style={styles.tempSection}>
          <Text style={styles.temperature}>
            {toNepaliDigits(weather.temperature, language)}°
          </Text>
          <Text style={styles.condition}>
            {translateWeather(weather.condition, language)}
          </Text>
        </View>
        <View style={styles.weatherIconContainer}>
          <Image source={{ uri: weatherIconUrl }} style={styles.weatherIcon} />
        </View>
      </View>

      {/* Forecast Section */}
      <View style={styles.forecastSection}>
        <Text style={styles.forecastTitle}>
          {language === 'EN' ? 'Today\'s Forecast' : 'आजको पूर्वानुमान'}
        </Text>
        <View style={styles.forecastContainer}>
          {forecast.map((item, index) => (
            <View key={index} style={styles.forecastItem}>
              <Text style={styles.forecastTime}>
                {getTimeLabel(item.dt_txt, language)}
              </Text>
              <Image
                source={{
                  uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
                }}
                style={styles.forecastIcon}
              />
              <Text style={styles.forecastTemp}>
                {toNepaliDigits(Math.round(item.main.temp), language)}°
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  viewMoreText: {
    fontSize: 13,
    color: '#2196F3',
    fontWeight: '500',
    marginRight: 4,
  },
  currentWeather: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: '#F8FAFE',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  tempSection: {
    flex: 1,
  },
  temperature: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  condition: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  weatherIconContainer: {
    alignItems: 'center',
  },
  weatherIcon: {
    width: 80,
    height: 80,
  },
  forecastSection: {
    marginTop: 8,
  },
  forecastTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  forecastContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forecastItem: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#FAFBFC',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginHorizontal: 2,
  },
  forecastTime: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 8,
  },
  forecastIcon: {
    width: 36,
    height: 36,
    marginBottom: 8,
  },
  forecastTemp: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  loadingCard: {
    marginHorizontal: 20,
    marginVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  errorCard: {
    marginHorizontal: 20,
    marginVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  errorText: {
    marginTop: 12,
    fontSize: 14,
    color: '#F44336',
    textAlign: 'center',
  },
});