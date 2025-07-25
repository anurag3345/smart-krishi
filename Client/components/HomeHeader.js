import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeHeader() {
  const [language, setLanguage] = useState('EN');
  const notificationCount = 3;

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'EN' ? 'NP' : 'EN'));
  };

  return (
    <View style={styles.container}>
      {/* Left: Leaf icon + Title */}
      <View style={styles.leftSection}>
        <Ionicons name="leaf" size={24} color="white" style={styles.iconSpacing} />
        <Text style={styles.title}>Smart Krishi</Text>
      </View>

      {/* Right: Language Toggle + Notification with Badge */}
      <View style={styles.rightSection}>
        <TouchableOpacity onPress={toggleLanguage} style={styles.languageButton}>
          <Text style={styles.languageText}>{language}</Text>
        </TouchableOpacity>

        <View style={styles.notificationWrapper}>
          <Ionicons name="notifications" size={24} color="white" />
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notificationCount}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginTop: 25,
    backgroundColor: '#4daf51',
    borderRadius: 10,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSpacing: {
    marginRight: 8,
  },
  languageButton: {
    backgroundColor: '#ffffff',
    borderColor: '#4daf51',
    borderWidth: 1.2,
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  languageText: {
    color: '#4daf51',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  notificationWrapper: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: 'red',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
