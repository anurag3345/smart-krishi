import React, { useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../../context/AuthContext';
import { profileInfo, profileOptions } from '../../constants/data'; // Adjust path as needed

export default function Profile() {
  const { signOut, user } = useContext(AuthContext);
  const router = useRouter();

  // Navigation mapping based on label names
  const getNavigationRoute = (label) => {
    const routeMap = {
      'My Crops': '/my-crops',
      'My Orders': '/RentMachine',
      'Notifications': '/(tabs)/alerts',
      'Billing & Payments': '/billing',
      'Settings': '/settings',
      'Help & Support': '/jtasupportscreen',
    };

    return routeMap[label] || null;
  };

  // Handle special cases that don't require navigation
  const handleSpecialCases = (label) => {
    switch (label) {
      case 'Rate App':
        Alert.alert(
          'Rate App',
          'Would you like to rate our app on the store?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Rate Now',
              onPress: () => {
                // Implement app store rating logic here
                Alert.alert('Thank you!', 'Redirecting to app store...');
              },
            },
          ]
        );
        return true;

      case 'Share App':
        Alert.alert(
          'Share App',
          'Share this amazing app with your friends!',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Share',
              onPress: () => {
                // Implement share functionality here
                Alert.alert('Sharing', 'Opening share options...');
              },
            },
          ]
        );
        return true;

      default:
        return false;
    }
  };

  const handleOptionPress = (optionId) => {
    const option = profileOptions.find(o => o.id === optionId);
    if (!option) return;

    const { label } = option;

    // Handle logout separately
    if (label === 'Logout') {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: async () => {
              try {
                await signOut();
                router.replace('/(auth)/Login');
              } catch (error) {
                Alert.alert('Error', 'Failed to logout. Please try again.');
              }
            },
          },
        ],
        { cancelable: true }
      );
      return;
    }

    // Handle special cases (Rate App, Share App, etc.)
    if (handleSpecialCases(label)) {
      return;
    }

    // Get navigation route
    const route = getNavigationRoute(label);
    
    if (route) {
      try {
        router.push(route);
      } catch (error) {
        // If navigation fails (screen doesn't exist), show coming soon alert
        Alert.alert(
          'Coming Soon', 
          `${label} feature is under development and will be available soon!`
        );
      }
    } else {
      // Fallback for unmapped options
      Alert.alert(
        'Coming Soon', 
        `${label} feature is under development and will be available soon!`
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={profileInfo.avatar} style={styles.avatar} />
        <Text style={styles.name}>{user?.name}</Text>
      </View>

      <ScrollView
        style={styles.optionsContainer}
        contentContainerStyle={{ paddingVertical: 10 }}
        showsVerticalScrollIndicator={false}
      >
        {profileOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.optionItem}
            activeOpacity={0.7}
            onPress={() => handleOptionPress(option.id)}
          >
            <View style={styles.iconWrapper}>
              <Ionicons name={option.icon} size={24} color="#4CAF50" />
            </View>
            <Text style={styles.optionLabel}>{option.label}</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#999"
              style={styles.forwardIcon}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fdf7',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#e8f5e9',
    borderBottomWidth: 1,
    borderBottomColor: '#c8e6c9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#4caf50',
    marginBottom: 12,
    backgroundColor: '#fff',
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  optionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#e0f2f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionLabel: {
    flex: 1,
    fontSize: 17,
    color: '#333',
    fontWeight: '500',
  },
  forwardIcon: {
    marginLeft: 8,
  },
});