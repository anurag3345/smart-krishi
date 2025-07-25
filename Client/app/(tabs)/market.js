import { FlatList, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { marketProducts } from '../../constants/data';

export default function MarketScreen() {
  return (
    <View style={styles.container}>
      <TextInput placeholder="Search products..." style={styles.search} />
      <FlatList
        data={marketProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{item.price}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop:25 
  },
  search: {
    margin: 16,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#e8f5e9',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 14,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: '#388e3c',
    marginTop: 4,
  },
});
