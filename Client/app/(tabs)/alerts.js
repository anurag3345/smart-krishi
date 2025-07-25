import { Ionicons } from '@expo/vector-icons';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { alertsList } from '../../constants/data';

export default function AlertsScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={alertsList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.alertCard, { backgroundColor: item.color }]}>
            <Ionicons name={item.icon} size={24} color="#333" style={styles.icon} />
            <View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
     backgroundColor: '#fff' ,
     marginTop:25
    },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  icon: {
    marginRight: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  time: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
