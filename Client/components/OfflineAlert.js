import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

export default function OfflineAlert() {
  const lang = useSelector((state) => state.language.value);

  return (
    <View style={styles.alert}>
      <Text style={styles.text}>
        {lang === 'EN'
          ? 'You are offline. Some features may not be available.'
          : 'तपाईं अफलाइन हुनुहुन्छ। केही सुविधाहरू उपलब्ध नहुन सक्छन्।'}
      </Text>
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
