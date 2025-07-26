import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import { cropPurchases } from '../constants/data'; 

const RecentlyBrought = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🛒 Recently Bought</Text>
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {cropPurchases.map((item, index) => (
          <Card key={index} style={styles.card} mode="elevated">
            <View style={styles.cardContent}>
              <Image source={item.image} style={styles.image} />
              <View style={styles.details}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.info}>Quantity: {item.quantity}</Text>
                <Text style={styles.info}>Person: {item.personName}</Text>
                <Text style={styles.info}>Status: <Text style={[styles.status, statusStyles[item.status]]}>{item.status}</Text></Text>
                <Text style={styles.amount}>Total: {item.totalAmount}</Text>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const statusStyles = {
  Delivered: { color: '#4caf50' },  // green
  Pending: { color: '#ff9800' },    // orange
  Cancelled: { color: '#f44336' },  // red
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginBottom:10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  card: {
    width: 280,
    marginRight: 16,
    borderRadius: 14,
    backgroundColor: '#f6fdf7',
    elevation: 4,
    marginBottom:10,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 16,
  },
  details: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2e7d32',
    marginBottom: 6,
  },
  info: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  status: {
    fontWeight: '700',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1b5e20',
    marginTop: 8,
  },
});

export default RecentlyBrought;
