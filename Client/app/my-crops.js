import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

// No CropDetails import here because it's now a separate screen

const MyCrops = () => {
  const router = useRouter();

  // Main crops state, initialized with your crops
  const [crops, setCrops] = useState([
    {
      id: 1,
      name: 'Tomato',
      variety: 'Roma Variety',
      status: 'Flowering',
      statusColor: '#4CAF50',
      progress: 75,
      progressColor: '#4CAF50',
      planted: 'March 1, 2024',
      expectedHarvest: 'June 20, 2024',
      waterDays: 2,
      fertilizeDays: 5,
      icon: '🍅',
      needsAttention: false,
    },
    {
      id: 2,
      name: 'Rice',
      variety: 'Basmati',
      status: 'Growing',
      statusColor: '#FF9800',
      progress: 45,
      progressColor: '#FF9800',
      planted: 'March 1, 2024',
      expectedHarvest: 'August 15, 2024',
      waterToday: true,
      icon: '🌾',
      needsAttention: true,
    },
    {
      id: 3,
      name: 'Corn',
      variety: 'Sweet Corn',
      status: 'Ready',
      statusColor: '#4CAF50',
      progress: 100,
      progressColor: '#4CAF50',
      planted: 'February 10, 2024',
      expectedHarvest: 'May 5, 2024',
      readyForHarvest: true,
      icon: '🌽',
      needsAttention: false,
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);

  // Form states for adding new crop
  const [newCropName, setNewCropName] = useState('wheat');
  const [newSowingDate, setNewSowingDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const cropIcons = {
    wheat: '🌾',
    maize: '🌽',
    potato: '🥔',
    onion: '🧅',
    rice: '🍚',
  };

  const cropVarieties = {
    wheat: 'Common Wheat',
    maize: 'Sweet Corn',
    potato: 'Russet',
    onion: 'Yellow Onion',
    rice: 'Basmati',
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setNewSowingDate(selectedDate);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const addCrop = () => {
    if (!newCropName || !newSowingDate) {
      alert('Please select a crop and a sowing date');
      return;
    }

    const newId = crops.length ? crops[crops.length - 1].id + 1 : 1;

    const newCrop = {
      id: newId,
      name: newCropName.charAt(0).toUpperCase() + newCropName.slice(1),
      variety: cropVarieties[newCropName] || '',
      status: 'Planted',
      statusColor: '#2196F3',
      progress: 0,
      progressColor: '#2196F3',
      planted: formatDate(newSowingDate),
      icon: cropIcons[newCropName] || '🌱',
      needsAttention: false,
    };

    setCrops((prev) => [...prev, newCrop]);
    setModalVisible(false);
    setNewCropName('wheat');
    setNewSowingDate(new Date());
  };

  // Crop Card component: On press, navigate to CropDetails screen passing crop data as JSON string
  const CropCard = ({ crop }) => (
    <TouchableOpacity
      style={styles.cropCard}
      activeOpacity={0.7}
      onPress={() =>
        router.push({
          pathname: '/crop-details',
          params: { crop: JSON.stringify(crop) },
        })
      }
    >
      <View style={styles.cropHeader}>
        <View style={styles.cropTitleRow}>
          <Text style={styles.cropIcon}>{crop.icon}</Text>
          <View style={styles.cropInfo}>
            <Text style={styles.cropName}>{crop.name}</Text>
            <Text style={styles.cropVariety}>{crop.variety}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: crop.statusColor }]}>
            <Text style={styles.statusText}>{crop.status}</Text>
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="ellipsis-vertical" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.progressSection}>
        <Text style={styles.progressLabel}>Growth Progress</Text>
        <Text style={styles.progressPercentage}>{crop.progress}%</Text>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${crop.progress}%`, backgroundColor: crop.progressColor },
            ]}
          />
        </View>
      </View>

      <View style={styles.cropDetails}>
        <View style={styles.detailColumn}>
          <Text style={styles.detailLabel}>Planted:</Text>
          <Text style={styles.detailValue}>{crop.planted}</Text>
        </View>
        {crop.expectedHarvest && (
          <View style={styles.detailColumn}>
            <Text style={styles.detailLabel}>Expected Harvest:</Text>
            <Text style={styles.detailValue}>{crop.expectedHarvest}</Text>
          </View>
        )}
      </View>

      {crop.readyForHarvest && (
        <TouchableOpacity style={styles.harvestButton}>
          <Text style={styles.harvestButtonText}>Harvest Now</Text>
        </TouchableOpacity>
      )}

      {(crop.waterDays || crop.fertilizeDays || crop.waterToday) && (
        <View style={styles.remindersSection}>
          {crop.waterToday && (
            <View style={styles.reminderItem}>
              <Ionicons name="warning" size={16} color="#FF5722" />
              <Text style={styles.reminderText}>Needs water today</Text>
            </View>
          )}
          {crop.waterDays && (
            <View style={styles.reminderItem}>
              <Ionicons name="water" size={16} color="#2196F3" />
              <Text style={styles.reminderText}>Water in {crop.waterDays} days</Text>
            </View>
          )}
          {crop.fertilizeDays && (
            <View style={styles.reminderItem}>
              <MaterialIcons name="scatter-plot" size={16} color="#4CAF50" />
              <Text style={styles.reminderText}>Fertilize in {crop.fertilizeDays} days</Text>
            </View>
          )}
        </View>
      )}

      <TouchableOpacity style={styles.expandButton}>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Crops</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton} onPress={() => setModalVisible(true)}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={styles.tabCard}>
          <Text style={[styles.tabCount, styles.activeTabCount]}>{crops.length}</Text>
          <Text style={[styles.tabText, styles.activeTabText]}>Active Crops</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabCard}>
          <Text style={[styles.tabCount, styles.orangeCount]}>1</Text>
          <Text style={styles.tabText}>Ready Soon</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabCard}>
          <Text style={[styles.tabCount, styles.redCount]}>1</Text>
          <Text style={styles.tabText}>Need Attention</Text>
        </TouchableOpacity>
      </View>

      {/* Add New Crop Banner */}
      <TouchableOpacity style={styles.addCropBanner} onPress={() => setModalVisible(true)}>
        <View style={styles.addCropContent}>
          <Ionicons name="add-circle" size={24} color="#4CAF50" />
          <View style={styles.addCropText}>
            <Text style={styles.addCropTitle}>Add New Crop</Text>
            <Text style={styles.addCropSubtitle}>Start tracking a new cultivation</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </TouchableOpacity>

      {/* Your Crops Header */}
      <View style={styles.yourCropsHeader}>
        <Text style={styles.yourCropsTitle}>Your Crops</Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="swap-vertical" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Crops List */}
      <ScrollView style={styles.cropsList} showsVerticalScrollIndicator={false}>
        {crops.map((crop) => (
          <CropCard key={crop.id} crop={crop} />
        ))}

        {/* Bottom Action Buttons */}
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="notifications" size={20} color="#4CAF50" />
            <Text style={styles.actionButtonText}>Set Reminders</Text>
            <Text style={styles.actionButtonSubtext}>Water & fertilize</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="eye" size={20} color="#4CAF50" />
            <Text style={styles.actionButtonText}>View Analytics</Text>
            <Text style={styles.actionButtonSubtext}>Growth insights</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal for Adding New Crop */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Crop</Text>

            <Text style={styles.label}>Select Crop</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={newCropName}
                onValueChange={(itemValue) => setNewCropName(itemValue)}
              >
                <Picker.Item label="Wheat" value="wheat" />
                <Picker.Item label="Maize" value="maize" />
                <Picker.Item label="Potato" value="potato" />
                <Picker.Item label="Onion" value="onion" />
                <Picker.Item label="Rice" value="rice" />
              </Picker>
            </View>

            <Text style={styles.label}>Select Sowing Date</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerText}>{formatDate(newSowingDate)}</Text>
              <Ionicons name="calendar" size={20} color="#4CAF50" />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={newSowingDate}
                mode="date"
                display="default"
                onChange={onChangeDate}
                maximumDate={new Date()}
              />
            )}

            <TouchableOpacity style={styles.addCropButton} onPress={addCrop}>
              <Text style={styles.addCropButtonText}>Add Crop</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.addCropButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.addCropButtonText, { color: '#4CAF50' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 25,
  },
  header: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 16,
  },
  tabContainer: {
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  tabCard: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  activeTabCard: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  activeTabText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  tabCount: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeTabCount: {
    color: '#4CAF50',
  },
  orangeCount: {
    color: '#FF9800',
  },
  redCount: {
    color: '#F44336',
  },
  addCropBanner: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addCropContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addCropText: {
    marginLeft: 12,
  },
  addCropTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  addCropSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  yourCropsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  yourCropsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  filterButtons: {
    flexDirection: 'row',
  },
  filterButton: {
    marginLeft: 12,
  },
  cropsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  cropCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cropHeader: {
    marginBottom: 12,
  },
  cropTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cropIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  cropInfo: {
    flex: 1,
  },
  cropName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cropVariety: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  statusText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  menuButton: {
    padding: 4,
  },
  progressSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  cropDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailColumn: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  harvestButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  harvestButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  remindersSection: {
    marginBottom: 12,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  reminderText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  expandButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 32,
  },
  actionButton: {
    backgroundColor: 'white',
    flex: 0.48,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  actionButtonSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 20,
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  addCropButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  addCropButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
});

export default MyCrops;
