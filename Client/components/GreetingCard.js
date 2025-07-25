import { StyleSheet, Text, View } from 'react-native';

export default function GreetingCard({ user }) {
  return (
    <View style={styles.card}>
      <Text style={styles.hello}>नमस्ते (Namaste),</Text>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.tip}>{user.tip}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#4daf51',
    padding: 20,
    borderRadius: 12,
    margin: 16,
  },
  hello: { color: '#fff', fontSize: 16 },
  name: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  tip: { color: '#fff', marginTop: 4,fontSize:14 ,fontWeight:'bold'},
});