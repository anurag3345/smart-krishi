import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function FeatureGrid({ items }) {
  const router = useRouter();

  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.item, { backgroundColor: item.bgColor }]}
          onPress={() => {
            if (item.title === 'My Crops') {
              router.push('/my-crops'); 
            } else if (item.title === 'Crop Health'){
              router.push('/crop-health')
            } else if(item.title === 'Sell Produce'){
              router.push('/RentCrop')
            }else{
              router.push('/RentMachine')
            }
          }}
        >
          <Ionicons name={item.icon} size={28} color="#333" />
          <Text style={styles.label}>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  item: {
    width: '48%',
    margin: '1%',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});
