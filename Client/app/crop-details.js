import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const CROP_IMAGES = {
  wheat: 'https://img.icons8.com/emoji/96/wheat-emoji.png',
  maize: 'https://img.icons8.com/emoji/96/corn-emoji.png',
  potato: 'https://img.icons8.com/emoji/96/potato-emoji.png',
  onion: 'https://img.icons8.com/emoji/96/onion-emoji.png',
  rice: 'https://img.icons8.com/emoji/96/rice-emoji.png',
};

const CROP_STAGES = {
  wheat: 'Tillering',
  maize: 'V6 stage',
  potato: 'Tuber initiation',
  onion: 'Bulbing',
  rice: 'Panicle initiation',
};

const CROP_TIPS = {
  wheat: [
    'Irrigate every 7-10 days.',
    'Control weeds in early stages.',
    'Apply nitrogen at tillering stage.',
  ],
  maize: [
    'Monitor for leaf blight.',
    'Apply fertilizer at V6.',
    'Irrigate twice a week.',
  ],
  potato: [
    'Hill the plants for better yield.',
    'Avoid waterlogging.',
    'Check for late blight regularly.',
  ],
  onion: [
    'Keep fields weed-free.',
    'Avoid overwatering to prevent rot.',
    'Light irrigation at bulb development.',
  ],
  rice: [
    'Maintain 2-3cm standing water.',
    'Watch for blast and brown spot.',
    'Fertilize at panicle initiation.',
  ],
};

const CROP_WEATHER = {
  wheat: 'Cool, dry climate (15-25°C)',
  maize: 'Warm, moist climate (16-27°C)',
  potato: 'Cool, frost-free (15-21°C)',
  onion: 'Mild, dry climate (12-24°C)',
  rice: 'Warm, humid (20-35°C)',
};

const CropDetailsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  let crop = null;
  try {
    crop = params.crop ? JSON.parse(params.crop) : null;
  } catch {
    crop = null;
  }

  if (!crop) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={{ fontSize: 18, color: '#666' }}>
          No crop data available
        </Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#4CAF50" />
          <Text style={{ color: '#4CAF50', marginLeft: 8 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const lowerCrop = crop.name.toLowerCase();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crop Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.row}>
          <Image
            source={{ uri: CROP_IMAGES[lowerCrop] || CROP_IMAGES['wheat'] }}
            style={styles.cropImage}
            resizeMode="contain"
          />
          <Text style={styles.cropName}>{crop.name}</Text>
        </View>

        <Text style={styles.varietyText}>{crop.variety}</Text>

        <View style={styles.sectionRow}>
          <Text style={styles.label}>Current Stage:</Text>
          <Text style={styles.value}>{CROP_STAGES[lowerCrop] || 'Growing'}</Text>
        </View>
        <View style={styles.sectionRow}>
          <Text style={styles.label}>Planted Date:</Text>
          <Text style={styles.value}>{crop.planted}</Text>
        </View>
        <View style={styles.sectionRow}>
          <Text style={styles.label}>Expected Harvest:</Text>
          <Text style={styles.value}>
            {crop.expectedHarvest ? crop.expectedHarvest : '-'}
          </Text>
        </View>
        <View style={styles.sectionRow}>
          <Text style={styles.label}>Weather Favorable:</Text>
          <Text style={styles.value}>{CROP_WEATHER[lowerCrop]}</Text>
        </View>

        <Text style={styles.tipsLabel}>Tips & Suggestions:</Text>
        {CROP_TIPS[lowerCrop]?.map((tip, idx) => (
          <Text key={idx} style={styles.tipItem}>
            {'\u2022'} <Text>{tip}</Text>
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop:20,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    justifyContent: 'space-between',
  },
  backIcon: {
    width: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#447137',
  },
  contentContainer: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cropImage: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  cropName: {
    fontSize: 22,
    fontWeight: '600',
    flex: 1,
    color: '#4CAF50',
    textAlign: 'right',
  },
  varietyText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
    marginLeft: 5,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    color: '#444',
    fontWeight: '600',
    fontSize: 15,
  },
  value: {
    color: '#555',
    fontSize: 15,
  },
  tipsLabel: {
    marginTop: 12,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  tipItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
    marginLeft: 7,
  },
});

export default CropDetailsScreen;
