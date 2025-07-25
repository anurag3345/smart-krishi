import { StyleSheet, Text, View } from 'react-native';

export default function OfflineAlert() {
  return (
    <View style={styles.alert}>
      <Text style={styles.text}>You are offline. Some features may not be available.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  alert: {
    backgroundColor: '#ffebee',
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  text: {
    color: '#d32f2f',
    fontSize: 14,
    textAlign: 'center',
  },
});