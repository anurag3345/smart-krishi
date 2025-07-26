import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

// We'll use the icon from the crop data instead of static images
const getDefaultIcon = (cropName) => {
  const defaultIcons = {
    wheat: '🌾',
    maize: '🌽',
    corn: '🌽',
    potato: '🥔',
    onion: '🧅',
    rice: '🍚',
    tomato: '🍅',
    carrot: '🥕',
    cabbage: '🥬',
  };
  return defaultIcons[cropName?.toLowerCase()] || '🌱';
};

const CROP_STAGES = {
  wheat: 'Tillering',
  maize: 'V6 stage',
  potato: 'Tuber initiation',
  onion: 'Bulbing',
  rice: 'Panicle initiation',
  tomato: 'Flowering',
  carrot: 'Root development',
  cabbage: 'Head formation',
};

const CROP_TIPS = {
  wheat: [
    'Irrigate every 7-10 days during growing season.',
    'Control weeds in early stages for better yield.',
    'Apply nitrogen fertilizer at tillering stage.',
    'Monitor for rust and aphids regularly.',
  ],
  maize: [
    'Monitor for leaf blight and corn borer.',
    'Apply fertilizer at V6 stage for optimal growth.',
    'Irrigate twice a week during dry periods.',
    'Ensure adequate spacing between plants.',
  ],
  potato: [
    'Hill the plants regularly for better tuber yield.',
    'Avoid waterlogging to prevent root rot.',
    'Check for late blight and Colorado beetle regularly.',
    'Harvest when leaves start yellowing.',
  ],
  onion: [
    'Keep fields weed-free throughout growing season.',
    'Avoid overwatering to prevent bulb rot.',
    'Apply light irrigation during bulb development.',
    'Stop watering 2-3 weeks before harvest.',
  ],
  rice: [
    'Maintain 2-3cm standing water in fields.',
    'Watch for blast and brown spot diseases.',
    'Apply fertilizer at panicle initiation stage.',
    'Drain fields before harvest for easier cutting.',
  ],
  tomato: [
    'Provide support stakes for climbing varieties.',
    'Water consistently to prevent blossom end rot.',
    'Prune suckers for better fruit development.',
    'Monitor for hornworms and aphids.',
  ],
  carrot: [
    'Ensure loose, well-draining soil for straight roots.',
    'Thin seedlings to prevent overcrowding.',
    'Keep soil consistently moist but not waterlogged.',
    'Harvest when shoulders are 3/4 inch diameter.',
  ],
  cabbage: [
    'Provide consistent moisture for head formation.',
    'Apply mulch to retain soil moisture.',
    'Monitor for cabbage worms and aphids.',
    'Harvest when heads feel firm and solid.',
  ],
};

const CROP_WEATHER = {
  wheat: 'Cool, dry climate (15-25°C)',
  maize: 'Warm, moist climate (16-27°C)',
  potato: 'Cool, frost-free (15-21°C)',
  onion: 'Mild, dry climate (12-24°C)',
  rice: 'Warm, humid (20-35°C)',
  tomato: 'Warm, sunny climate (18-27°C)',
  carrot: 'Cool, temperate (16-21°C)',
  cabbage: 'Cool, moist climate (15-20°C)',
};

const GROWTH_DURATION = {
  wheat: '120-150 days',
  maize: '90-120 days',
  potato: '70-120 days',
  onion: '90-120 days',
  rice: '120-150 days',
  tomato: '80-100 days',
  carrot: '70-80 days',
  cabbage: '80-100 days',
};

const CropDetailsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  let crop = null;
  try {
    crop = params.crop ? JSON.parse(params.crop) : null;
  } catch (error) {
    console.error('Error parsing crop data:', error);
    crop = null;
  }

  if (!crop) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="warning-outline" size={48} color="#ff9800" />
        <Text style={styles.emptyText}>No crop data available</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#4CAF50" />
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const lowerCrop = crop.name ? crop.name.toLowerCase() : '';

// const calculateDaysPlanted = (plantedDate) => {
//   if (!plantedDate) return 'Not specified';
  
//   try {
//     // Parse the planted date - handle the format from my-crops.js: "July 26, 2025"
//     const plantedDateObj = new Date(plantedDate);
    
//     // Check if date parsing was successful
//     if (isNaN(plantedDateObj.getTime())) {
//       return 'Invalid date';
//     }
    
//     // Get today's date
//     const today = new Date();
    
//     // Calculate difference in milliseconds
//     const timeDifference = today.getTime() - plantedDateObj.getTime();
    
//     // Convert to days (1 day = 24 * 60 * 60 * 1000 milliseconds)
//     const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    
//     // Return appropriate message based on the difference
//     if (daysDifference === 0) {
//       return 'Today';
//     } else if (daysDifference === 1) {
//       return '1 day ago';
//     } else if (daysDifference > 1) {
//       return `${daysDifference} days ago`;
//     } else if (daysDifference === -1) {
//       return 'Tomorrow';
//     } else {
//       // Future date
//       return `In ${Math.abs(daysDifference)} days`;
//     }
    
//   } catch (error) {
//     console.error('Error calculating days:', error);
//     return 'Unable to calculate';
//   }
// };

  const getStatusInfo = (crop) => {
    // Use the status and statusColor from the crop data
    return {
      text: crop.status || 'Growing',
      color: crop.statusColor || '#4CAF50',
    };
  };

  // Get the current stage based on the crop's status
  const getCurrentStage = () => {
    return crop.status || CROP_STAGES[lowerCrop] || 'Growing';
  };

  const handleEditCrop = () => {
    Alert.alert(
      'Edit Crop',
      'Edit functionality will be implemented in the next update.',
      [{ text: 'OK' }]
    );
  };

  const handleDeleteCrop = () => {
    Alert.alert(
      'Delete Crop',
      'Are you sure you want to delete this crop?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => router.back() },
      ]
    );
  };

  const statusInfo = getStatusInfo(crop);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crop Details</Text>
        <TouchableOpacity onPress={handleEditCrop} style={styles.editIcon}>
          <Ionicons name="create-outline" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Crop Header Section */}
        <View style={styles.cropHeader}>
          <View style={styles.cropIconContainer}>
            <Text style={styles.cropIcon}>{crop.icon || getDefaultIcon(crop.name)}</Text>
          </View>
          <View style={styles.cropInfo}>
            <Text style={styles.cropName}>{crop.name || 'Unknown Crop'}</Text>
            <Text style={styles.varietyText}>{crop.variety || 'No variety specified'}</Text>
            <View style={styles.statusContainer}>
              <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
                <Text style={styles.statusText}>{statusInfo.text}</Text>
              </View>
              {crop.needsAttention && (
                <View style={styles.attentionBadge}>
                  <Ionicons name="warning" size={14} color="#FF5722" />
                  <Text style={styles.attentionText}>Needs Attention</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Basic Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Current Stage:</Text>
              <Text style={styles.value}>{getCurrentStage()}</Text>
            </View>
            
            {crop.currentWeek && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Current Week:</Text>
                <Text style={styles.value}>Week {crop.currentWeek}</Text>
              </View>
            )}
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>Planted Date:</Text>
              <Text style={styles.value}>{crop.planted || 'Not specified'}</Text>
            </View>
            
            {/* <View style={styles.infoRow}>
              <Text style={styles.label}>Days Since Planting:</Text>
              <Text style={styles.value}>{calculateDaysPlanted(crop.planted)}</Text>
            </View> */}
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>Expected Harvest:</Text>
              <Text style={styles.value}>{crop.expectedHarvest || 'Not specified'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>Growth Duration:</Text>
              <Text style={styles.value}>{GROWTH_DURATION[lowerCrop] || '90-120 days'}</Text>
            </View>
            
            {crop.area && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Area:</Text>
                <Text style={styles.value}>{crop.area}</Text>
              </View>
            )}
            
            {crop.location && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Location:</Text>
                <Text style={styles.value}>{crop.location}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Environmental Conditions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Environmental Conditions</Text>
          <View style={styles.weatherCard}>
            <Ionicons name="partly-sunny-outline" size={24} color="#FF9800" />
            <Text style={styles.weatherText}>{CROP_WEATHER[lowerCrop] || 'Moderate climate'}</Text>
          </View>
          
          {/* Show current temperature and range if available */}
          {crop.currentTemp && crop.tempRange && (
            <View style={styles.temperatureCard}>
              <View style={styles.tempRow}>
                <Ionicons name="thermometer" size={20} color={statusInfo.color} />
                <Text style={styles.tempLabel}>Current Temperature:</Text>
                <Text style={[styles.tempValue, { color: statusInfo.color }]}>
                  {crop.currentTemp}°C
                </Text>
              </View>
              <Text style={styles.tempRange}>
                Optimal Range: {crop.tempRange[0]}°C - {crop.tempRange[1]}°C
              </Text>
            </View>
          )}
        </View>

        {/* Progress Section */}
        {crop.progress !== undefined && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Growth Progress</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[
                  styles.progressFill, 
                  { 
                    width: `${crop.progress}%`,
                    backgroundColor: crop.progressColor || '#4CAF50'
                  }
                ]} />
              </View>
              <Text style={[
                styles.progressText,
                { color: crop.progressColor || '#4CAF50' }
              ]}>
                {crop.progress}% Complete
              </Text>
            </View>
          </View>
        )}

        {/* Care & Reminders Section */}
        {(crop.waterDays || crop.fertilizeDays || crop.waterToday) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Care & Reminders</Text>
            <View style={styles.remindersContainer}>
              {crop.waterToday && (
                <View style={styles.reminderCard}>
                  <Ionicons name="warning" size={20} color="#FF5722" />
                  <Text style={[styles.reminderText, { color: '#FF5722' }]}>
                    Needs water today
                  </Text>
                </View>
              )}
              {crop.waterDays && (
                <View style={styles.reminderCard}>
                  <Ionicons name="water" size={20} color="#2196F3" />
                  <Text style={styles.reminderText}>Water in {crop.waterDays} days</Text>
                </View>
              )}
              {crop.fertilizeDays && (
                <View style={styles.reminderCard}>
                  <Ionicons name="leaf" size={20} color="#4CAF50" />
                  <Text style={styles.reminderText}>Fertilize in {crop.fertilizeDays} days</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Custom Tips from Crop Analysis */}
        {crop.tips && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weather-Based Tips</Text>
            <View style={styles.customTipsContainer}>
              <Ionicons name="bulb-outline" size={20} color="#FF9800" />
              <Text style={styles.customTipsText}>{crop.tips}</Text>
            </View>
          </View>
        )}

        {/* Ready for Harvest Section */}
        {crop.readyForHarvest && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Harvest Status</Text>
            <View style={styles.harvestCard}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              <View style={styles.harvestInfo}>
                <Text style={styles.harvestTitle}>Ready for Harvest!</Text>
                <Text style={styles.harvestSubtitle}>Your crop has reached maturity</Text>
              </View>
              <TouchableOpacity style={styles.harvestButton}>
                <Ionicons name="cut" size={16} color="white" />
                <Text style={styles.harvestButtonText}>Harvest Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* General Tips & Suggestions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General Care Tips</Text>
          <View style={styles.tipsContainer}>
            {CROP_TIPS[lowerCrop]?.map((tip, idx) => (
              <View key={idx} style={styles.tipItem}>
                <Ionicons name="bulb-outline" size={16} color="#4CAF50" />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        {/* <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleEditCrop}>
            <Ionicons name="create-outline" size={20} color="#4CAF50" />
            <Text style={styles.actionButtonText}>Edit Crop</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]} 
            onPress={handleDeleteCrop}
          >
            <Ionicons name="trash-outline" size={20} color="#F44336" />
            <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
          </TouchableOpacity>
        </View> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButtonText: {
    color: '#4CAF50',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backIcon: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  editIcon: {
    padding: 4,
  },
  contentContainer: {
    padding: 16,
  },
  cropHeader: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cropImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  cropIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#f1f8e9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e8f5e8',
  },
  cropIcon: {
    fontSize: 48,
  },
  cropInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  cropName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 4,
  },
  varietyText: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 8,
  },
  healthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthLabel: {
    fontSize: 16,
    color: '#424242',
    fontWeight: '500',
  },
  healthValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  attentionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  attentionText: {
    fontSize: 11,
    color: '#FF5722',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 12,
  },
  infoGrid: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 16,
    color: '#424242',
    fontWeight: '500',
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: '#2e7d32',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  weatherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3e0',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  weatherText: {
    fontSize: 16,
    color: '#e65100',
    marginLeft: 12,
    fontWeight: '500',
  },
  temperatureCard: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  tempLabel: {
    fontSize: 14,
    color: '#424242',
    marginLeft: 8,
    flex: 1,
  },
  tempValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tempRange: {
    fontSize: 12,
    color: '#666',
    marginLeft: 28,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 8,
  },
  remindersContainer: {
    gap: 12,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  reminderText: {
    fontSize: 14,
    color: '#424242',
    marginLeft: 12,
    fontWeight: '500',
  },
  customTipsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff8e1',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  customTipsText: {
    fontSize: 14,
    color: '#e65100',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  harvestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f8e9',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  harvestInfo: {
    flex: 1,
    marginLeft: 12,
  },
  harvestTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 2,
  },
  harvestSubtitle: {
    fontSize: 14,
    color: '#4CAF50',
  },
  harvestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  harvestButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  notesContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  notesText: {
    fontSize: 16,
    color: '#424242',
    lineHeight: 24,
  },
  tipsContainer: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f1f8e9',
    padding: 12,
    borderRadius: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#2e7d32',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '500',
    marginLeft: 8,
  },
  deleteButton: {
    borderColor: '#F44336',
  },
  deleteButtonText: {
    color: '#F44336',
  },
});

export default CropDetailsScreen;