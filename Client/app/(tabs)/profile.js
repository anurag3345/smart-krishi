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
  const { signOut } = useContext(AuthContext);
  const router = useRouter();

  const handleOptionPress = (optionId) => {
    if (optionId === '7') {
      // Logout confirmation
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: async () => {
              await signOut();
              router.replace('/(auth)/login');
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      // You can handle other options here, for now just show alert
      Alert.alert('Coming Soon', `You clicked ${profileOptions.find(o => o.id === optionId)?.label}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={profileInfo.avatar} style={styles.avatar} />
        <Text style={styles.name}>{profileInfo.name}</Text>
      </View>

      <ScrollView
        style={styles.optionsContainer}
        contentContainerStyle={{ paddingVertical: 10 }}
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
