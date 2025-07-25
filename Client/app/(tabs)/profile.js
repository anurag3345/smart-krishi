import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { profileInfo, profileOptions } from '../../constants/data';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Image source={{ uri: profileInfo.avatar }} style={styles.avatar} />
      <Text style={styles.name}>{profileInfo.name}</Text>

      <View style={styles.section}>
        {profileOptions.map((option) => (
          <TouchableOpacity key={option.id} style={styles.item}>
            <Ionicons name={option.icon} size={20} color="#333" style={styles.icon} />
            <Text style={styles.label}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
     flex: 1, 
     alignItems: 'center',
     backgroundColor: '#fff' },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    width: '90%',
    marginTop: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#f1f8e9',
    borderRadius: 10,
    marginBottom: 10,
  },
  icon: {
    marginRight: 12,
  },
  label: {
    fontSize: 16,
  },
});
