import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  getDefaultIcon,
  CROP_LIFECYCLE,
  CROP_CARE_STEPS,
  CROP_WEATHER,
  GROWTH_DURATION,
  CROP_TIPS,
} from '../constants/crop-data'; // Import from data.js file

const CropDetailsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // State for tracking completed care tasks
  const [completedTasks, setCompletedTasks] = useState([]);

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
  const lifecycle = CROP_LIFECYCLE[lowerCrop] || [];
  const careSteps = CROP_CARE_STEPS[lowerCrop] || [];

  // Get current stage index based on crop status
  const getCurrentStageIndex = () => {
    if (!crop.status) return 0;
    return lifecycle.findIndex(stage => 
      stage.stage.toLowerCase().includes(crop.status.toLowerCase())
    ) || 0;
  };

  const currentStageIndex = getCurrentStageIndex();

  const getStatusInfo = (crop) => {
    return {
      text: crop.status || 'Growing',
      color: crop.statusColor || '#4CAF50',
    };
  };

  const toggleTaskCompletion = (taskId) => {
    setCompletedTasks(prev => {
      if (prev.includes(taskId)) {
        return prev.filter(id => id !== taskId);
      } else {
        return [...prev, taskId];
      }
    });
  };

  const handleEditCrop = () => {
    Alert.alert(
      'Edit Crop',
      'Edit functionality will be implemented in the next update.',
      [{ text: 'OK' }]
    );
  };

  const statusInfo = getStatusInfo(crop);

  // Get current stage care tasks
  const currentStageTasks = careSteps.filter(task => 
    lifecycle[currentStageIndex] && 
    task.stage === lifecycle[currentStageIndex].stage
  );

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
              <Text style={styles.value}>{lifecycle[currentStageIndex]?.stage || 'Growing'}</Text>
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

        {/* Lifecycle Progress Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Growth Lifecycle</Text>
          <View style={styles.lifecycleContainer}>
            {lifecycle.map((stage, index) => (
              <View key={index} style={styles.lifecycleStage}>
                <View style={styles.stageLeft}>
                  <View style={[
                    styles.stageIndicator,
                    {
                      backgroundColor: index <= currentStageIndex ? '#4CAF50' : '#e0e0e0',
                    }
                  ]}>
                    {index < currentStageIndex ? (
                      <Ionicons name="checkmark" size={16} color="white" />
                    ) : index === currentStageIndex ? (
                      <View style={styles.currentStageIndicator} />
                    ) : (
                      <Text style={styles.stageNumber}>{index + 1}</Text>
                    )}
                  </View>
                  {index < lifecycle.length - 1 && (
                    <View style={[
                      styles.stageLine,
                      { backgroundColor: index < currentStageIndex ? '#4CAF50' : '#e0e0e0' }
                    ]} />
                  )}
                </View>
                <View style={[
                  styles.stageContent,
                  { opacity: index <= currentStageIndex ? 1 : 0.6 }
                ]}>
                  <Text style={[
                    styles.stageTitle,
                    { color: index === currentStageIndex ? '#4CAF50' : '#333' }
                  ]}>
                    {stage.stage}
                  </Text>
                  <Text style={styles.stageDuration}>{stage.duration}</Text>
                  <Text style={styles.stageDescription}>{stage.description}</Text>
                  {index === currentStageIndex && (
                    <View style={styles.currentStageTag}>
                      <Text style={styles.currentStageText}>Current Stage</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Care & Reminders Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Care & Reminders</Text>
          <Text style={styles.sectionSubtitle}>
            Tasks for current stage: {lifecycle[currentStageIndex]?.stage}
          </Text>
          
          <View style={styles.careTasksContainer}>
            {currentStageTasks.length > 0 ? (
              currentStageTasks.map((task) => (
                <TouchableOpacity
                  key={task.id}
                  style={[
                    styles.careTaskItem,
                    completedTasks.includes(task.id) && styles.completedTask
                  ]}
                  onPress={() => toggleTaskCompletion(task.id)}
                >
                  <View style={styles.taskLeft}>
                    <View style={[
                      styles.taskCheckbox,
                      {
                        backgroundColor: completedTasks.includes(task.id) ? '#4CAF50' : 'transparent',
                        borderColor: completedTasks.includes(task.id) ? '#4CAF50' : '#ddd',
                      }
                    ]}>
                      {completedTasks.includes(task.id) && (
                        <Ionicons name="checkmark" size={16} color="white" />
                      )}
                    </View>
                    <View style={styles.taskContent}>
                      <Text style={[
                        styles.taskText,
                        completedTasks.includes(task.id) && styles.completedTaskText
                      ]}>
                        {task.task}
                      </Text>
                      <View style={styles.taskMeta}>
                        <View style={[
                          styles.priorityBadge,
                          {
                            backgroundColor: task.priority === 'high' ? '#FF5722' :
                              task.priority === 'medium' ? '#FF9800' : '#4CAF50'
                          }
                        ]}>
                          <Text style={styles.priorityText}>
                            {task.priority.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noTasksContainer}>
                <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
                <Text style={styles.noTasksText}>
                  No specific tasks for this stage
                </Text>
                <Text style={styles.noTasksSubtext}>
                  Continue with general care practices
                </Text>
              </View>
            )}
          </View>

          {/* General Quick Reminders */}
          {(crop.waterDays || crop.fertilizeDays || crop.waterToday) && (
            <View style={styles.quickReminders}>
              <Text style={styles.quickRemindersTitle}>Quick Reminders</Text>
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
          )}
        </View>

        {/* Environmental Conditions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Environmental Conditions</Text>
          <View style={styles.weatherCard}>
            <Ionicons name="partly-sunny-outline" size={24} color="#FF9800" />
            <Text style={styles.weatherText}>{CROP_WEATHER[lowerCrop] || 'Moderate climate'}</Text>
          </View>
          
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
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontStyle: 'italic',
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
  // Lifecycle Styles
  lifecycleContainer: {
    paddingVertical: 8,
  },
  lifecycleStage: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  stageLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  stageIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  currentStageIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  stageNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  stageLine: {
    width: 2,
    height: 40,
    marginTop: 4,
  },
  stageContent: {
    flex: 1,
    paddingBottom: 16,
  },
  stageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  stageDuration: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  stageDescription: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 20,
  },
  currentStageTag: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  currentStageText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  // Care Tasks Styles
  careTasksContainer: {
    gap: 12,
  },
  careTaskItem: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  completedTask: {
    backgroundColor: '#f1f8e9',
    borderLeftColor: '#81C784',
    opacity: 0.8,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  taskCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  taskContent: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 8,
    lineHeight: 22,
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  noTasksContainer: {
    alignItems: 'center',
    padding: 24,
  },
  noTasksText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
    marginTop: 12,
  },
  noTasksSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  // Quick Reminders
  quickReminders: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  quickRemindersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 12,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    marginBottom: 8,
  },
  reminderText: {
    fontSize: 14,
    color: '#424242',
    marginLeft: 12,
    fontWeight: '500',
  },
  // Other existing styles
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
});

export default CropDetailsScreen;