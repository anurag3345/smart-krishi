import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { setLanguage } from '../store/languageSlice';
import { toNepaliDigits } from '../constants/numberTranslator';

export default function HomeHeader() {
  const dispatch = useDispatch();
  const router = useRouter();
  const language = useSelector((state) => state.language.value);
  const notificationCount = 3;

  const handleLanguageToggle = () => {
    dispatch(setLanguage(language === 'EN' ? 'NP' : 'EN'));
  };

  const handleNotificationPress = () => {
    router.push('/(tabs)/alerts');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/logo.png')} 
              style={styles.logo}
            />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {language === 'EN' ? 'Smart Krishi' : 'स्मार्ट कृषि'}
            </Text>
            <Text style={styles.subtitle}>
              {language === 'EN' ? 'Smart Farming Solutions' : 'स्मार्ट कृषि समाधान'}
            </Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity 
            onPress={handleLanguageToggle}
            style={styles.languageButton}
            activeOpacity={0.8}
          >
            <Ionicons name="language" size={16} color="#4CAF50" />
            <Text style={styles.languageText}>{language}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.notificationButton} 
            activeOpacity={0.8}
            onPress={handleNotificationPress}
          >
            <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {toNepaliDigits(notificationCount, language)}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4CAF50',
    paddingTop: 20, // Account for status bar
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  languageText: {
    color: '#4CAF50',
    fontWeight: '600',
    fontSize: 13,
    marginLeft: 4,
  },
  notificationButton: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#F44336',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
});