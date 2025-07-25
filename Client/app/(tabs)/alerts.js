import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, StyleSheet, Text, View, Platform } from 'react-native';
import { alertsList } from '../../constants/data'; // Adjust this import path as needed

export default function AlertsScreen() {
  return (
    <View style={styles.container}>
      {/* Heading */}
      <Text style={styles.heading}>Alerts & Notifications</Text>

      <FlatList
        data={alertsList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.alertCard, { backgroundColor: item.color + 'cc' }]}>
            <View style={styles.iconContainer}>
              <Ionicons name={item.icon} size={28} color="#2c3e50" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>
              <View style={styles.timeRow}>
                <Ionicons
                  name="time-outline"
                  size={14}
                  color="#555"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.time}>{item.time}</Text>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    paddingTop: 15,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    paddingHorizontal: 16,
    marginBottom: 12,
    textAlign: 'center',
    paddingTop: 20,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,  // slightly increased for smoother card corners
    padding: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,  // half of width/height = circle
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    backgroundColor: 'white', // shadow visible on solid background
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2c3e50',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  time: {
    fontSize: 13,
    color: '#555',
    fontWeight: '600',
  },
  separator: {
    height: 12,
  },
});
