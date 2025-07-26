import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons,  } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

const CropHealthScreen = () => {
  const router = useRouter();
  const [scannedImage, setScannedImage] = useState(null);
  const [showCameraOptions, setShowCameraOptions] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // State to store analyzed crops
  const [analyzedCrops, setAnalyzedCrops] = useState([]);

  // Initial static crops data
  const initialCropsData = [
    {
      id: 1,
      name: 'Tomato Field A',
      location: 'North Section',
      healthScore: 85,
      status: 'Healthy',
      statusColor: '#4CAF50',
      temperature: '7.5',
      issues: 'None detected',
      icon: '🍅',
      image: 'tomato-field',
      isAnalyzed: false,
      timestamp: new Date('2024-01-15'),
    },
    {
      id: 2,
      name: 'Wheat Field B',
      location: 'South 40 acres',
      healthScore: 61,
      status: 'At Risk',
      statusColor: '#FF9800',
      temperature: '6.1',
      issues: 'Nutrient deficiency',
      icon: '🌾',
      image: 'wheat-field',
      isAnalyzed: false,
      timestamp: new Date('2024-01-10'),
    },
  ];

  // Request camera permissions
  const requestCameraPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Camera permission is required to scan crops. Please enable it in settings.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  // Request media library permissions
  const requestMediaPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Photo library permission is required to select images. Please enable it in settings.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  // Handle camera capture
  const handleTakePhoto = async () => {
    setShowCameraOptions(false);
    
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setScannedImage(result.assets[0].uri);
        analyzeCropImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Camera error:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  // Handle gallery selection
  const handleSelectFromGallery = async () => {
    setShowCameraOptions(false);
    
    const hasPermission = await requestMediaPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setScannedImage(result.assets[0].uri);
        analyzeCropImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Gallery error:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  // Enhanced AI analysis function that stores results
  const analyzeCropImage = async (imageUri) => {
  try {
    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'crop.jpg',
    });

    const response = await fetch('http://192.168.91.198:5000/api/analysis', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(data.error || 'Failed to analyze crop');
    }

    const { disease, confidence, recommendations } = data;

    const healthScore = Math.floor(60 + Math.random() * 30); // 60-90 mock score

    let status = 'Healthy';
    let statusColor = '#4CAF50';
    if (healthScore < 70) {
      status = 'At Risk';
      statusColor = '#FF9800';
    }
    if (healthScore < 50) {
      status = 'Critical';
      statusColor = '#F44336';
    }

    const newAnalyzedCrop = {
      id: Date.now(),
      name: `Analyzed Crop ${analyzedCrops.length + 1}`,
      location: 'AI Scanned Area',
      healthScore,
      status,
      statusColor,
      temperature: (Math.random() * 2 + 6).toFixed(1),
      issues: disease,
      imageUri,
      isAnalyzed: true,
      timestamp: new Date(),
      analysisResults: {
        disease,
        confidence,
        recommendations,
      },
    };

    setAnalyzedCrops(prev => [newAnalyzedCrop, ...prev]);
    setIsAnalyzing(false);

    Alert.alert(
      'Analysis Complete',
      `Issues:\n• ${disease}\n\nRecommendations:\n• ${recommendations.join('\n• ')}\n\nConfidence: ${confidence}%`,
      [
        { text: 'Save Report', onPress: () => console.log('Report saved') },
        { text: 'OK' },
      ]
    );
  } catch (err) {
    console.error(err);
    setIsAnalyzing(false);
    Alert.alert('Error', err.message || 'Something went wrong');
  }
};




  // Handle scan button press
  const handleScanPress = () => {
    setShowCameraOptions(true);
  };

  // Combine analyzed crops with initial data, with analyzed crops first
  const getAllCrops = () => {
    return [...analyzedCrops, ...initialCropsData];
  };

  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Nutrient Deficiency Detected',
      description: 'Nitrogen levels are below optimal in Wheat Field B. Immediate fertilization recommended.',
      time: '2 hours ago',
      severity: 'Medium Priority',
      color: '#FF9800',
    },
    {
      id: 2,
      type: 'info',
      title: 'Pest Activity Detected',
      description: 'Minor insect activity in Tomato Field A. Immediate monitoring recommended.',
      time: '5 hours ago',
      severity: 'Low Priority',
      color: '#2196F3',
    },
  ];

  const recommendations = [
    {
      id: 1,
      title: 'Smart Treatment Plan',
      description: 'AI-generated personalized treatment recommendations for your crops.',
      icon: 'lightbulb',
      action: 'Get Recommendations',
    },
  ];

  const HealthScoreCircle = ({ score, size = 60 }) => {
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    
    let color = '#4CAF50';
    if (score < 70) color = '#FF9800';
    if (score < 50) color = '#F44336';

    return (
      <View style={[styles.scoreCircle, { width: size, height: size }]}>
        <Text style={[styles.scoreText, { fontSize: size * 0.25 }]}>{score}%</Text>
      </View>
    );
  };

  const CropHealthCard = ({ crop }) => (
    <TouchableOpacity style={styles.cropHealthCard} activeOpacity={0.7}>
      {/* Top section with name, location and status */}
      <View style={styles.cropHealthHeader}>
        <View style={styles.cropNameContainer}>
          <Text style={styles.cropHealthName}>{crop.name}</Text>
          <Text style={styles.cropLocation}>{crop.location}</Text>
          {crop.isAnalyzed && (
            <View style={styles.analyzedBadge}>
              <Ionicons name="sparkles" size={12} color="#673AB7" />
              <Text style={styles.analyzedText}>AI Analyzed</Text>
            </View>
          )}
        </View>
        <View style={[styles.statusBadge, { backgroundColor: crop.statusColor }]}>
          <Text style={styles.statusText}>{crop.status}</Text>
        </View>
      </View>
      
      {/* Bottom section with icon/image, pH, and issues in same row */}
      <View style={styles.cropMetricsRow}>
        <View style={styles.cropIconContainer}>
          {crop.isAnalyzed && crop.imageUri ? (
            <Image source={{ uri: crop.imageUri }} style={styles.cropImage} />
          ) : (
            <Text style={styles.cropCardIcon}>{crop.icon}</Text>
          )}
        </View>
        
        <View style={styles.metricContainer}>
          <Text style={styles.metricValue}>{crop.temperature}</Text>
          <Text style={styles.metricLabel}>pH Level</Text>
        </View>
        
        <View style={styles.issuesContainer}>
          <Text style={[
            styles.issuesText, 
            { color: crop.issues === 'None detected' ? '#4CAF50' : '#FF9800' }
          ]}>
            {crop.issues.length > 15 ? crop.issues.substring(0, 15) + '...' : crop.issues}
          </Text>
          <Text style={styles.metricLabel}>Issues</Text>
        </View>
        
        <TouchableOpacity style={styles.expandButton}>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const AlertCard = ({ alert }) => (
    <TouchableOpacity style={styles.alertCard} activeOpacity={0.7}>
      <View style={[styles.alertIcon, { backgroundColor: alert.color + '20' }]}>
        <Ionicons 
          name={alert.type === 'warning' ? 'warning' : 'information-circle'} 
          size={20} 
          color={alert.color} 
        />
      </View>
      
      <View style={styles.alertContent}>
        <Text style={styles.alertTitle}>{alert.title}</Text>
        <Text style={styles.alertDescription}>{alert.description}</Text>
        <View style={styles.alertFooter}>
          <Text style={styles.alertTime}>{alert.time}</Text>
          <Text style={[styles.alertSeverity, { color: alert.color }]}>{alert.severity}</Text>
        </View>
      </View>
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
          <Text style={styles.headerTitle}>Crop Health Monitor</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="notifications" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="settings" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* AI Health Assistant */}
        <View style={styles.aiAssistantCard}>
          <View style={styles.aiAssistantContent}>
            <View style={styles.aiIconContainer}>
              <Ionicons name="sparkles" size={24} color="#673AB7" />
            </View>
            <View style={styles.aiTextContent}>
              <Text style={styles.aiAssistantTitle}>AI Health Assistant</Text>
              <Text style={styles.aiAssistantSubtitle}>
                Real-time crop monitoring & personalized recommendations
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Health Scan */}
        <TouchableOpacity style={styles.quickScanCard} onPress={handleScanPress}>
          <View style={styles.quickScanContent}>
            <View style={styles.scanIconContainer}>
              <Ionicons name="scan" size={24} color="#4CAF50" />
            </View>
            <View style={styles.scanTextContent}>
              <Text style={styles.quickScanTitle}>Quick Health Scan</Text>
              <Text style={styles.quickScanSubtitle}>
                Upload crop image for AI analysis
              </Text>
            </View>
          </View>
          <View style={styles.scanButton}>
            <Text style={styles.scanButtonText}>
              {isAnalyzing ? 'Analyzing...' : 'Scan now'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Show scanned image if available */}
        {scannedImage && (
          <View style={styles.scannedImageContainer}>
            <Text style={styles.scannedImageTitle}>Last Scanned Image</Text>
            <Image source={{ uri: scannedImage }} style={styles.scannedImage} />
            {isAnalyzing && (
              <View style={styles.analyzingOverlay}>
                <Ionicons name="sync" size={24} color="#4CAF50" />
                <Text style={styles.analyzingText}>AI is analyzing your crop...</Text>
              </View>
            )}
          </View>
        )}

        {/* Current Health Status */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Current Health Status</Text>
        </View>

        <View style={styles.healthStatusContainer}>
          <View style={styles.statusCard}>
            <View style={styles.statusIndicator}>
              <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.statusLabel}>Overall Health</Text>
            </View>
            <Text style={styles.statusValue}>85%</Text>
          </View>
          
          <View style={styles.statusCard}>
            <View style={styles.statusIndicator}>
              <View style={[styles.statusDot, { backgroundColor: '#FF9800' }]} />
              <Text style={styles.statusLabel}>Risk Level</Text>
            </View>
            <Text style={styles.statusValue}>Low</Text>
          </View>
        </View>

        {/* Active Alerts */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Alerts</Text>
          <Text style={styles.alertCount}>2 Alerts</Text>
        </View>

        {alerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}

        {/* My Crops Health */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Crops Health</Text>
          <Text style={styles.cropCount}>{getAllCrops().length} Crops</Text>
        </View>

        {getAllCrops().map((crop) => (
          <CropHealthCard key={crop.id} crop={crop} />
        ))}

        {/* AI Recommendations */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>AI Recommendations</Text>
        </View>

        {recommendations.map((rec) => (
          <TouchableOpacity key={rec.id} style={styles.recommendationCard}>
            <View style={styles.recommendationIcon}>
              <Ionicons name={rec.icon} size={24} color="#4CAF50" />
            </View>
            <View style={styles.recommendationContent}>
              <Text style={styles.recommendationTitle}>{rec.title}</Text>
              <Text style={styles.recommendationDescription}>{rec.description}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Get Detailed Treatment Plan Button */}
        <TouchableOpacity style={styles.treatmentPlanButton}>
          <Text style={styles.treatmentPlanButtonText}>Get Detailed Treatment Plan</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Camera Options Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCameraOptions}
        onRequestClose={() => setShowCameraOptions(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.cameraOptionsContainer}>
            <Text style={styles.cameraOptionsTitle}>Scan Crop</Text>
            <Text style={styles.cameraOptionsSubtitle}>Choose how you want to capture your crop image</Text>
            
            <TouchableOpacity style={styles.cameraOption} onPress={handleTakePhoto}>
              <View style={styles.cameraOptionIcon}>
                <Ionicons name="camera" size={24} color="#4CAF50" />
              </View>
              <View style={styles.cameraOptionText}>
                <Text style={styles.cameraOptionTitle}>Take Photo</Text>
                <Text style={styles.cameraOptionDescription}>Use camera to capture crop image</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.cameraOption} onPress={handleSelectFromGallery}>
              <View style={styles.cameraOptionIcon}>
                <Ionicons name="images" size={24} color="#4CAF50" />
              </View>
              <View style={styles.cameraOptionText}>
                <Text style={styles.cameraOptionTitle}>Choose from Gallery</Text>
                <Text style={styles.cameraOptionDescription}>Select existing photo from gallery</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelOptionButton} 
              onPress={() => setShowCameraOptions(false)}
            >
              <Text style={styles.cancelOptionText}>Cancel</Text>
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
    paddingTop: 22,
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  aiAssistantCard: {
    backgroundColor: '#673AB7',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  aiAssistantContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  aiTextContent: {
    flex: 1,
  },
  aiAssistantTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  aiAssistantSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  quickScanCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickScanContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  scanIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  scanTextContent: {
    flex: 1,
  },
  quickScanTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  quickScanSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  scanButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  // Scanned image styles
  scannedImageContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scannedImageTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  scannedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  analyzingOverlay: {
    position: 'absolute',
    top: 40,
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  alertCount: {
    fontSize: 14,
    color: '#F44336',
    fontWeight: '500',
  },
  cropCount: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  healthStatusContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statusCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusLabel: {
    fontSize: 12,
    color: '#666',
  },
  statusValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  alertCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    lineHeight: 16,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertTime: {
    fontSize: 10,
    color: '#999',
  },
  alertSeverity: {
    fontSize: 10,
    fontWeight: '600',
  },
  // Updated crop health card styles
  cropHealthCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cropHealthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cropNameContainer: {
    flex: 1,
    marginRight: 12,
  },
  cropHealthName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cropLocation: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  analyzedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#673AB7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  analyzedText: {
    fontSize: 8,
    color: 'white',
    fontWeight: '600',
    marginLeft: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  // New styles for aligned metrics row
  cropMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  cropIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cropCardIcon: {
    fontSize: 20,
  },
  cropImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  healthScoreContainer: {
    alignItems: 'center',
    flex: 1,
  },
  scoreCircle: {
    borderRadius: 20,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  scoreText: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  metricContainer: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  issuesContainer: {
    alignItems: 'center',
    flex: 1,
  },
  issuesText: {
    fontSize: 12,
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 2,
  },
  expandButton: {
    padding: 8,
  },
  recommendationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  recommendationDescription: {
    fontSize: 12,
    color: '#666',
  },
  treatmentPlanButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  treatmentPlanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Camera options modal styles
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  cameraOptionsContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  cameraOptionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  cameraOptionsSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  cameraOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 12,
  },
  cameraOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cameraOptionText: {
    flex: 1,
  },
  cameraOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  cameraOptionDescription: {
    fontSize: 12,
    color: '#666',
  },
  cancelOptionButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelOptionText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CropHealthScreen;