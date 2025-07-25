import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeHeader() {
  return (
    <View style={styles.container}>
      {/* Left: Leaf icon + Title */}
      <View style={styles.leftSection}>
        <Ionicons name="leaf" size={24} color="white" style={styles.iconSpacing} />
        <Text style={styles.title}>Smart Krishi</Text>
      </View>

      {/* Right: Notification + Search */}
      <View style={styles.rightSection}>
        <Ionicons name="notifications" size={24} color="white" style={styles.iconSpacing} />
        <Ionicons name="search" size={24} color="white" />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
