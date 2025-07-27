import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { FavoriteFarmer } from '../constants/data';

const FavoriteFarmers = ({ title = "Favorite Farmers" }) => {
  const [showAll, setShowAll] = useState(false);

  // Always set favorite to true
  const initializedFavorites = FavoriteFarmer.map((item) => ({
    ...item,
    favorite: true,
  }));

  const visibleItems = showAll ? initializedFavorites : initializedFavorites.slice(0, 2);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{title}</Text>
      {visibleItems.map((item, index) => (
        <Card key={index} style={styles.card} mode="elevated">
          <View style={styles.cardContent}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.details}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.info}>📍 {item.location}</Text>
              <Text style={styles.info}>📞 {item.contact}</Text>
            </View>
            <View style={[styles.heartButton, { backgroundColor: '#ffe6e6' }]}>
              <Ionicons name="heart" size={22} color="red" />
            </View>
          </View>
        </Card>
      ))}

      {FavoriteFarmer.length > 2 && (
        <TouchableOpacity
          style={styles.viewMoreButton}
          onPress={() => setShowAll(!showAll)}
        >
          <Text style={styles.viewMoreText}>
            {showAll ? 'View Less ▲' : 'View More ▼'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FavoriteFarmers;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fdfdfd',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2e7d32',
    textAlign: 'left',
  },
  card: {
    marginBottom: 14,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderLeftWidth: 4,
    borderColor: '#81c784',
    backgroundColor: '#f9fdf9',
    borderRadius: 16,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 50,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#c8e6c9',
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    color: '#2e2e2e',
  },
  info: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  heartButton: {
    padding: 8,
    borderRadius: 20,
  },
  viewMoreButton: {
    marginTop: 10,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#e8f5e9',
    borderRadius: 20,
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2e7d32',
  },
});
