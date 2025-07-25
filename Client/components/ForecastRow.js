import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export default function ForecastRow({ forecast }) {
  return (
    <View style={styles.row}>
      {forecast.map((item, index) => (
        <View key={index} style={styles.column}>
          <Text>{item.time}</Text>
          <Ionicons name={item.icon} size={20} color="#333" />
          <Text>{item.temp}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  column: {
    alignItems: 'center',
  },
});