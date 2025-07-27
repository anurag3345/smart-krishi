import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../../store/languageSlice';
import { alertsList } from '../../constants/data';

export default function AlertsScreen() {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.language.value);
  const [readAlerts, setReadAlerts] = useState(new Set());
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleLanguageToggle = () => {
    dispatch(setLanguage(language === 'EN' ? 'NP' : 'EN'));
  };

  const translateText = (enText, npText) => {
    return language === 'EN' ? enText : npText;
  };

  const handleAlertPress = (item) => {
    setSelectedAlert(item);
    setModalVisible(true);
    setReadAlerts(prev => new Set([...prev, item.id]));
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedAlert(null);
  };

  const getAlertTypeColor = (type) => {
    const colors = {
      warning: { bg: '#FFF4E6', icon: '#FF8C00', accent: '#FFD4A3', border: '#FF8C00' },
      success: { bg: '#E8F8F5', icon: '#00C896', accent: '#B3E5DB', border: '#00C896' },
      info: { bg: '#E6F3FF', icon: '#0084FF', accent: '#B3D9FF', border: '#0084FF' },
      error: { bg: '#FFEBEB', icon: '#FF3B30', accent: '#FFB3B3', border: '#FF3B30' },
      urgent: { bg: '#F0E6FF', icon: '#8B5CF6', accent: '#D1B3FF', border: '#8B5CF6' },
      default: { bg: '#F8F9FA', icon: '#6C757D', accent: '#DEE2E6', border: '#6C757D' },
    };
    return colors[type] || colors.default;
  };

  const renderAlertItem = ({ item, index }) => {
    const alertTypes = ['warning', 'success', 'info', 'error', 'urgent'];
    const alertType = item.type || alertTypes[index % alertTypes.length];
    const colors = getAlertTypeColor(alertType);
    const isRead = readAlerts.has(item.id);
    
    return (
      <TouchableOpacity 
        style={[
          styles.alertCard, 
          { 
            backgroundColor: colors.bg,
            borderLeftWidth: 4,
            borderLeftColor: colors.border,
            opacity: isRead ? 0.7 : 1,
          }
        ]}
        activeOpacity={0.7}
        onPress={() => handleAlertPress(item)}
      >
        <View style={styles.cardContent}>
          <View style={[styles.iconContainer, { backgroundColor: colors.icon }]}>
            <Ionicons name={item.icon} size={20} color="#FFFFFF" />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {translateText(item.title, item.titleNP || item.title)}
            </Text>
            <View style={styles.timeRow}>
              <Ionicons name="time-outline" size={12} color="#666" />
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
          
          <View style={styles.actionContainer}>
            {!isRead && (
              <View style={[styles.statusDot, { backgroundColor: colors.icon }]} />
            )}
            <View style={[styles.chevronContainer, { backgroundColor: colors.accent }]}>
              <Ionicons name="chevron-forward" size={14} color={colors.icon} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const unreadCount = alertsList.length - readAlerts.size;

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <Ionicons name="notifications" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.heading}>
                {translateText('Alerts & Notifications', 'अलर्ट र सूचनाहरू')}
              </Text>
              <Text style={styles.subHeading}>
                {translateText(
                  `${unreadCount} new notifications`,
                  `${unreadCount} नयाँ सूचनाहरू`
                )}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            onPress={handleLanguageToggle}
            style={styles.languageButton}
            activeOpacity={0.8}
          >
            <Ionicons name="language" size={16} color="#4CAF50" />
            <Text style={styles.languageText}>{language}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Alerts List */}
      <View style={styles.listContainer}>
        <FlatList
          data={alertsList}
          keyExtractor={(item) => item.id}
          renderItem={renderAlertItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="notifications-off-outline" size={48} color="#999" />
              </View>
              <Text style={styles.emptyTitle}>
                {translateText('No Notifications', 'कुनै सूचनाहरू छैनन्')}
              </Text>
              <Text style={styles.emptySubtitle}>
                {translateText(
                  "You're all caught up! New alerts will appear here.",
                  'तपाईं सबै अप टु डेट हुनुहुन्छ! नयाँ अलर्टहरू यहाँ देखा पर्नेछन्।'
                )}
              </Text>
            </View>
          )}
        />
      </View>

      {/* Alert Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {translateText('Notification Details', 'सूचना विवरण')}
              </Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            {selectedAlert && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.modalAlertHeader}>
                  <View style={[
                    styles.modalIcon, 
                    { backgroundColor: getAlertTypeColor(selectedAlert.type || 'default').icon }
                  ]}>
                    <Ionicons name={selectedAlert.icon} size={24} color="#FFFFFF" />
                  </View>
                  <Text style={styles.modalAlertTitle}>
                    {translateText(selectedAlert.title, selectedAlert.titleNP || selectedAlert.title)}
                  </Text>
                </View>
                
                <View style={styles.modalTimeContainer}>
                  <Ionicons name="time-outline" size={16} color="#666" />
                  <Text style={styles.modalTime}>{selectedAlert.time}</Text>
                </View>
                
                <Text style={styles.modalDescription}>
                  {translateText(
                    selectedAlert.description || 'This is a detailed description of the notification. It provides more context about what this alert means and any actions you might need to take.',
                    selectedAlert.descriptionNP || 'यो सूचनाको विस्तृत विवरण हो। यसले यो अलर्टको अर्थ र तपाईंले लिनुपर्ने कुनै कार्यहरूको बारेमा थप सन्दर्भ प्रदान गर्छ।'
                  )}
                </Text>
              </ScrollView>
            )}
            
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.okButton} onPress={closeModal}>
                <Text style={styles.okButtonText}>
                  {translateText('OK', 'ठीक छ')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7FF',
    paddingTop:15,
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subHeading: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  languageText: {
    color: '#4CAF50',
    fontWeight: '600',
    fontSize: 13,
    marginLeft: 4,
  },
  listContainer: {
    flex: 1,
    marginTop: -12,
  },
  listContent: {
    padding: 20,
    paddingTop: 24,
  },
  alertCard: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    lineHeight: 20,
    marginBottom: 4,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginLeft: 4,
  },
  actionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  chevronContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    padding: 20,
  },
  modalAlertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modalAlertTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  modalTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  modalTime: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    fontWeight: '500',
  },
  modalDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'justify',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  okButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  okButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});