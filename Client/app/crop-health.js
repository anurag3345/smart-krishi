import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const CropHealthScreen = () => {
  const router = useRouter();

  const cropHealthData = [
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
    },
  ];

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
      <View style={styles.cropImageContainer}>
        <Text style={styles.cropCardIcon}>{crop.icon}</Text>
      </View>
      
      <View style={styles.cropHealthInfo}>
        <View style={styles.cropHealthHeader}>
          <View>
            <Text style={styles.cropHealthName}>{crop.name}</Text>
            <Text style={styles.cropLocation}>{crop.location}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: crop.statusColor }]}>
            <Text style={styles.statusText}>{crop.status}</Text>
          </View>
        </View>
        
        <View style={styles.cropHealthMetrics}>
          <View style={styles.healthScoreSection}>
            <HealthScoreCircle score={crop.healthScore} size={50} />
            <Text style={styles.healthScoreLabel}>Health Score</Text>
          </View>
          
          <View style={styles.metricsColumn}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{crop.temperature}</Text>
              <Text style={styles.metricLabel}>pH Level</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.issuesText}>{crop.issues}</Text>
              <Text style={styles.metricLabel}>Issues</Text>
            </View>
          </View>
        </View>
      </View>
      
      <TouchableOpacity style={styles.expandButton}>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </TouchableOpacity>
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
        <TouchableOpacity style={styles.quickScanCard}>
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
            <Text style={styles.scanButtonText}>Scan now</Text>
          </View>
        </TouchableOpacity>

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
        </View>

        {cropHealthData.map((crop) => (
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  cropHealthCard: {
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
  cropImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cropCardIcon: {
    fontSize: 24,
  },
  cropHealthInfo: {
    flex: 1,
  },
  cropHealthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
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
  cropHealthMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthScoreSection: {
    alignItems: 'center',
    marginRight: 20,
  },
  scoreCircle: {
    borderRadius: 25,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  scoreText: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  healthScoreLabel: {
    fontSize: 10,
    color: '#666',
  },
  metricsColumn: {
    flex: 1,
  },
  metricItem: {
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  metricLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  issuesText: {
    fontSize: 12,
    color: '#4CAF50',
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
});

export default CropHealthScreen;