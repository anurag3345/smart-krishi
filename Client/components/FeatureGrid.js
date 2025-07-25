import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export default function FeatureGrid({ items }) {
  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <View key={item.id} style={[styles.item, { backgroundColor: item.bgColor }]}>
          <Ionicons name={item.icon} size={28} color="#333" />
          <Text style={styles.label}>{item.title}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  item: {
    width: '48%', // roughly half minus margin
    margin: '1%',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
});
