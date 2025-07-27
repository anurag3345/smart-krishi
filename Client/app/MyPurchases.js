import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import { purchasedCrops } from '../constants/data';

export default function MyPurchasesScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>🧺 My Purchases</Text>
      <Text style={styles.subheading}>Here are the crops you&apos;ve bought</Text>

      {purchasedCrops.map((item) => (
        <Card key={item.id} style={styles.card} mode="elevated">
          <View style={styles.cardContent}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.details}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.info}>📦 Quantity: {item.quantity}</Text>
              <Text style={styles.info}>👨‍🌾 From: {item.broughtFrom}</Text>
              <Text style={styles.info}>📌 Status: {item.status}</Text>
              <Text style={styles.amount}>💰 Total: {item.totalAmount}</Text>
            </View>
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    backgroundColor: '#ffffff',
    paddingBottom: 32,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 4,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
  },
  details: {
    flex: 1,
    justifyContent: 'space-around',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  info: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  amount: {
    fontSize: 15,
    color: '#1b5e20',
    fontWeight: '600',
    marginTop: 6,
  },
});
