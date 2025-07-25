import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import ForecastRow from './ForecastRow';

export default function WeatherCard({ weather }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Weather Forecast</Text>
      <View style={styles.mainRow}>
        <Ionicons name={weather.icon} size={30} color="#333" />
        <Text style={styles.temp}>{weather.temperature}</Text>
        <Text style={styles.condition}>{weather.condition}</Text>
      </View>
      <ForecastRow forecast={weather.forecast} />
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