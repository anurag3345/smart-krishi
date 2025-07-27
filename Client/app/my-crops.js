import React, { useState, useEffect } from 'react';
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
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import cropLifecycle from '../constants/cropdata/cropLifecycles.json';
import weatherGuide from '../constants/cropdata/weatherGuide.json';

const MyCrops = () => {
  const router = useRouter();

  // Main crops state
  const [crops, setCrops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Default/initial crops data
  const getDefaultCrops = () => [
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
      isDefault: true,
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
      isDefault: true,
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
      isDefault: true,
    },
  ];

  // Load crops from AsyncStorage on component mount
  useEffect(() => {
    loadCrops();
  }, []);

  // Save crops to AsyncStorage whenever crops state changes
  useEffect(() => {
    if (!isLoading && crops.length > 0) {
      saveCrops();
    }
  }, [crops, isLoading]);

  const loadCrops = async () => {
    try {
      const storedCrops = await AsyncStorage.getItem('userCrops');
      if (storedCrops) {
        const parsedCrops = JSON.parse(storedCrops);
        setCrops(parsedCrops);
      } else {
        setCrops(getDefaultCrops());
      }
    } catch (error) {
      console.error('Error loading crops:', error);
      setCrops(getDefaultCrops());
    } finally {
      setIsLoading(false);
    }
  };

  const saveCrops = async () => {
    try {
      await AsyncStorage.setItem('userCrops', JSON.stringify(crops));
    } catch (error) {
      console.error('Error saving crops:', error);
    }
  };

  const clearAllData = async () => {
    try {
      await AsyncStorage.removeItem('userCrops');
      setCrops(getDefaultCrops());
      Alert.alert('Success', 'All data cleared successfully');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [newCropName, setNewCropName] = useState('Wheat');
  const [newSowingDate, setNewSowingDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const cropIcons = {
    Wheat: '🌾',
    Maize: '🌽',
    Potato: '🥔',
    Onion: '🧅',
    Rice: '🍚',
  };

  const cropVarieties = {
    Wheat: 'Common Wheat',
    Maize: 'Sweet Corn',
    Potato: 'Russet',
    Onion: 'Yellow Onion',
    Rice: 'Basmati',
  };

  const recommendedCrops = [
    { name: 'Wheat', icon: '🌾', description: 'Winter crop' },
    { name: 'Maize', icon: '🌽', description: 'Summer crop' },
    { name: 'Potato', icon: '🥔', description: 'Cool season' },
    { name: 'Onion', icon: '🧅', description: 'All season' },
    { name: 'Rice', icon: '🍚', description: 'Monsoon crop' },
    { name: 'Tomato', icon: '🍅', description: 'Greenhouse' },
    { name: 'Carrot', icon: '🥕', description: 'Root vegetable' },
    { name: 'Lettuce', icon: '🥬', description: 'Leafy green' },
  ];

  const getCurrentWeek = (sowingDate) => {
    const now = new Date();
    const sowDate = new Date(sowingDate);
    const diffInMs = now - sowDate;
    const diffInWeeks = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));
    return Math.max(diffInWeeks + 1, 1);
  };

  const getCurrentTemperature = async () => {
    return 28; // mock temperature
  };

  const calculateExpectedHarvest = (sowingDate, cropName) => {
    const lifecycle = cropLifecycle[cropName];
    if (!lifecycle || lifecycle.length === 0) return null;
    
    const totalWeeks = lifecycle[lifecycle.length - 1].week;
    const harvestDate = new Date(sowingDate);
    harvestDate.setDate(harvestDate.getDate() + (totalWeeks * 7));
    
    return formatDate(harvestDate);
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

  const addCrop = async () => {
    if (!newCropName || !newSowingDate) {
      Alert.alert('Error', 'Please select a crop and a sowing date');
      return;
    }

    try {
      const newId = crops.length ? Math.max(...crops.map(c => c.id)) + 1 : 1;
      const currentWeek = getCurrentWeek(newSowingDate);
      const lifecycle = cropLifecycle[newCropName];
      
      if (!lifecycle || lifecycle.length === 0) {
        Alert.alert('Error', `Lifecycle data not found for ${newCropName}`);
        return;
      }

      let currentStageObj = lifecycle.find((item) => item.week === currentWeek);
      
      if (!currentStageObj) {
        if (currentWeek > lifecycle[lifecycle.length - 1].week) {
          currentStageObj = lifecycle[lifecycle.length - 1];
        } else {
          currentStageObj = lifecycle[0];
        }
      }

      const currentStage = currentStageObj.stage;
      const weatherData = weatherGuide[newCropName]?.[currentStage];
      
      if (!weatherData) {
        Alert.alert('Error', `Weather data not found for ${newCropName} at ${currentStage} stage`);
        return;
      }

      const [minTemp, maxTemp] = weatherData.temp || [0, 100];
      const currentTemp = await getCurrentTemperature();
      const isFavorable = currentTemp >= minTemp && currentTemp <= maxTemp;
      const weatherTips = weatherData.tips || 'No specific tips available.';
      const totalWeeks = lifecycle[lifecycle.length - 1].week;
      const progress = Math.min((currentWeek / totalWeeks) * 100, 100);
      const expectedHarvest = calculateExpectedHarvest(newSowingDate, newCropName);

      const newCrop = {
        id: newId,
        name: newCropName,
        variety: cropVarieties[newCropName] || 'Standard Variety',
        status: currentStage,
        statusColor: isFavorable ? '#4CAF50' : '#F44336',
        progress: Math.round(progress),
        progressColor: isFavorable ? '#4CAF50' : '#F44336',
        planted: formatDate(newSowingDate),
        expectedHarvest: expectedHarvest,
        icon: cropIcons[newCropName] || '🌱',
        needsAttention: !isFavorable,
        tips: weatherTips,
        currentWeek: currentWeek,
        currentTemp: currentTemp,
        tempRange: [minTemp, maxTemp],
        readyForHarvest: currentStage.toLowerCase().includes('harvest') || currentStage.toLowerCase().includes('maturity'),
        waterDays: Math.floor(Math.random() * 7) + 1,
        fertilizeDays: Math.floor(Math.random() * 14) + 1,
        addedAt: new Date().getTime(),
        isRecentlyAdded: true,
      };

      setCrops((prev) => [newCrop, ...prev]);
      setModalVisible(false);
      setNewCropName('Wheat');
      setNewSowingDate(new Date());

      // Show toast notification
      Toast.show({
        type: 'success',
        text1: 'Crop Added Successfully',
        text2: `${newCropName} has been added to your farm`,
        position: 'top',
        topOffset: 50,
        visibilityTime: 3000,
        autoHide: true,
        props: {
          style: { 
            alignSelf: 'flex-end',
            marginRight: 20,
            width: '70%'
          }
        }
      });

    } catch (error) {
      console.error('Error adding crop:', error);
      Alert.alert('Error', 'Failed to add crop. Please try again.');
    }
  };

  const selectRecommendedCrop = (cropName) => {
    setNewCropName(cropName);
  };

  const getSortedCrops = () => {
    return [...crops].sort((a, b) => {
      if (a.isRecentlyAdded && !b.isRecentlyAdded) return -1;
      if (!a.isRecentlyAdded && b.isRecentlyAdded) return 1;
      if (a.addedAt && b.addedAt) return b.addedAt - a.addedAt;
      if (a.addedAt && !b.addedAt) return -1;
      if (!a.addedAt && b.addedAt) return 1;
      return a.id - b.id;
    });
  };

  const markRecentCropsAsSeen = () => {
    setCrops(prevCrops => 
      prevCrops.map(crop => ({
        ...crop,
        isRecentlyAdded: false
      }))
    );
  };

  useEffect(() => {
    const hasRecentCrops = crops.some(crop => crop.isRecentlyAdded);
    if (hasRecentCrops) {
      const timer = setTimeout(() => {
        markRecentCropsAsSeen();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [crops]);

  const getAttentionCount = () => {
    return crops.filter(crop => crop.needsAttention).length;
  };

  const getReadySoonCount = () => {
    return crops.filter(crop => 
      crop.progress >= 80 && crop.progress < 100 && !crop.readyForHarvest
    ).length;
  };

  const CropCard = ({ crop }) => (
    <TouchableOpacity
      style={[
        styles.cropCard,
        crop.isRecentlyAdded && styles.recentlyAddedCard
      ]}
      activeOpacity={0.7}
      onPress={() =>
        router.push({
          pathname: '/crop-details',
          params: { crop: JSON.stringify(crop) },
        })
      }
    >
      {crop.isRecentlyAdded && (
        <View style={styles.recentlyAddedBadge}>
          <Text style={styles.recentlyAddedText}>✨ Recently Added</Text>
        </View>
      )}

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

      {crop.currentTemp && crop.tempRange && (
        <View style={styles.weatherInfo}>
          <View style={styles.weatherRow}>
            <Ionicons name="thermometer" size={16} color={crop.statusColor} />
            <Text style={styles.weatherText}>
              {crop.currentTemp}°C (Optimal: {crop.tempRange[0]}-{crop.tempRange[1]}°C)
            </Text>
          </View>
          {crop.tips && (
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsLabel}>💡 Tips:</Text>
              <Text style={styles.tipsText}>{crop.tips}</Text>
            </View>
          )}
        </View>
      )}

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
          <TouchableOpacity style={styles.headerButton} onPress={clearAllData}>
            <Ionicons name="trash" size={24} color="white" />
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
          <Text style={[styles.tabCount, styles.orangeCount]}>{getReadySoonCount()}</Text>
          <Text style={styles.tabText}>Ready Soon</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabCard}>
          <Text style={[styles.tabCount, styles.redCount]}>{getAttentionCount()}</Text>
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
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading your crops...</Text>
          </View>
        ) : (
          <>
            {getSortedCrops().map((crop) => (
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
          </>
        )}
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
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Crop</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Select Crop</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={newCropName}
                  onValueChange={(itemValue) => setNewCropName(itemValue)}
                >
                  <Picker.Item label="Wheat" value="Wheat" />
                  <Picker.Item label="Maize" value="Maize" />
                  <Picker.Item label="Potato" value="Potato" />
                  <Picker.Item label="Onion" value="Onion" />
                  <Picker.Item label="Rice" value="Rice" />
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

              {/* Recommended Crops Section */}
              <View style={styles.recommendedSection}>
                <Text style={styles.recommendedTitle}>Recommended Crops</Text>
                <View style={styles.recommendedGrid}>
                  {recommendedCrops.map((crop, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.recommendedCard,
                        newCropName === crop.name && styles.selectedRecommendedCard
                      ]}
                      onPress={() => selectRecommendedCrop(crop.name)}
                    >
                      <Text style={styles.recommendedIcon}>{crop.icon}</Text>
                      <Text style={styles.recommendedName}>{crop.name}</Text>
                      <Text style={styles.recommendedDescription}>{crop.description}</Text>
                      {newCropName === crop.name && (
                        <View style={styles.selectedIndicator}>
                          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Toast Component */}
      <Toast />
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
  recentlyAddedCard: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  recentlyAddedBadge: {
    position: 'absolute',
    top: -8,
    right: 12,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  recentlyAddedText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
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
  weatherInfo: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  weatherText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  tipsContainer: {
    marginTop: 4,
  },
  tipsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  tipsText: {
    fontSize: 12,
    color: '#555',
    lineHeight: 16,
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
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: 4,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
  recommendedSection: {
    marginBottom: 20,
  },
  recommendedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  recommendedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  recommendedCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedRecommendedCard: {
    borderColor: '#4CAF50',
    backgroundColor: '#e8f5e8',
  },
  recommendedIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  recommendedName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  recommendedDescription: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  // Toast styles
  toastContainer: {
    position: 'absolute',
    right: 20,
    top: 50,
    width: '70%',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toastText1: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  toastText2: {
    fontSize: 14,
    color: 'white',
  }
});

export default MyCrops;