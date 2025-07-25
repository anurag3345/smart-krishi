import { StyleSheet, Text, View } from 'react-native';

export default function TipCard({ tips }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Farming Tips & News</Text>
      {tips.map((tip) => (
        <View key={tip.id} style={styles.card}>
          <Text style={styles.title}>{tip.title}</Text>
          <Text style={styles.desc}>{tip.description}</Text>
          <Text style={styles.date}>{tip.date}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingBottom: 30 },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  card: {
    backgroundColor: '#fffde7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: { fontWeight: '600', fontSize: 16 },
  desc: { fontSize: 13, color: '#444', marginVertical: 4 },
  date: { fontSize: 11, color: '#888' },
});
