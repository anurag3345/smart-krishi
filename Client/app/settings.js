import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Switch,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AuthContext } from '../context/AuthContext';

const SettingsScreen = () => {
  const router = useRouter();
  const {user} = useContext(AuthContext)
  
  // Settings states
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [cropHealthAlerts, setCropHealthAlerts] = useState(true);
  const [marketPriceAlerts, setMarketPriceAlerts] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ne', name: 'नेपाली (Nepali)', flag: '🇳🇵' },
    { code: 'hi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
  ];

  const handleLanguageSelect = (selectedLanguage) => {
    setLanguage(selectedLanguage.name);
    setShowLanguageModal(false);
    Alert.alert(
      'Language Changed',
      `Language has been changed to ${selectedLanguage.name}. App will restart to apply changes.`,
      [{ text: 'OK' }]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            // Handle logout logic
            Alert.alert('Logged Out', 'You have been successfully logged out.');
          }
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Confirm Deletion',
              'Type "DELETE" to confirm account deletion.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Confirm', style: 'destructive' }
              ]
            );
          }
        },
      ]
    );
  };

  const SettingsSection = ({ title, children }) => (
    <View style={styles.settingsSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  const SettingsItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightComponent, 
    showArrow = true,
    iconColor = '#4CAF50',
    iconBackground = '#E8F5E8'
  }) => (
    <TouchableOpacity 
      style={styles.settingsItem} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingsItemLeft}>
        <View style={[styles.settingsIcon, { backgroundColor: iconBackground }]}>
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <View style={styles.settingsTextContainer}>
          <Text style={styles.settingsItemTitle}>{title}</Text>
          {subtitle && (
            <Text style={styles.settingsItemSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      <View style={styles.settingsItemRight}>
        {rightComponent}
        {showArrow && !rightComponent && (
          <Ionicons name="chevron-forward" size={20} color="#666" />
        )}
      </View>
    </TouchableOpacity>
  );

  const ToggleSwitch = ({ value, onValueChange }) => (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#e0e0e0', true: '#C8E6C9' }}
      thumbColor={value ? '#4CAF50' : '#f4f3f4'}
      ios_backgroundColor="#e0e0e0"
    />
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
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="help-circle" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>
  {user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()}
</Text>

            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name}</Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
              <View style={styles.profileBadge}>
                <Ionicons name="shield-checkmark" size={12} color="#4CAF50" />
                {user?.role === 'farmer' && <Text style={styles.profileBadgeText}>Verified Farmer</Text>}
                {user?.role === 'user' && <Text style={styles.profileBadgeText}>Verified User</Text>}
              </View>
            </View>
            <TouchableOpacity style={styles.editProfileButton}>
              <Ionicons name="create-outline" size={20} color="#4CAF50" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Settings */}
        <SettingsSection title="Account">
          <SettingsItem
            icon="person-outline"
            title="Edit Profile"
            subtitle="Update your personal information"
            onPress={() => {}}
          />
          <SettingsItem
            icon="key-outline"
            title="Change Password"
            subtitle="Update your account password"
            onPress={() => {}}
          />
          <SettingsItem
            icon="shield-checkmark-outline"
            title="Biometric Authentication"
            subtitle="Use fingerprint or face ID"
            rightComponent={
              <ToggleSwitch 
                value={biometricAuth} 
                onValueChange={setBiometricAuth} 
              />
            }
            showArrow={false}
          />
          <SettingsItem
            icon="cloud-upload-outline"
            title="Auto Backup"
            subtitle="Automatically backup your data"
            rightComponent={
              <ToggleSwitch 
                value={autoBackup} 
                onValueChange={setAutoBackup} 
              />
            }
            showArrow={false}
          />
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection title="Notifications">
          <SettingsItem
            icon="notifications-outline"
            title="Push Notifications"
            subtitle="Receive app notifications"
            iconColor="#FF9800"
            iconBackground="#FFF3E0"
            rightComponent={
              <ToggleSwitch 
                value={pushNotifications} 
                onValueChange={setPushNotifications} 
              />
            }
            showArrow={false}
          />
          <SettingsItem
            icon="mail-outline"
            title="Email Notifications"
            subtitle="Receive email updates"
            iconColor="#2196F3"
            iconBackground="#E3F2FD"
            rightComponent={
              <ToggleSwitch 
                value={emailNotifications} 
                onValueChange={setEmailNotifications} 
              />
            }
            showArrow={false}
          />
          <SettingsItem
            icon="cloudy-outline"
            title="Weather Alerts"
            subtitle="Get weather warnings"
            iconColor="#00BCD4"
            iconBackground="#E0F2F1"
            rightComponent={
              <ToggleSwitch 
                value={weatherAlerts} 
                onValueChange={setWeatherAlerts} 
              />
            }
            showArrow={false}
          />
          <SettingsItem
            icon="leaf-outline"
            title="Crop Health Alerts"
            subtitle="Disease and pest warnings"
            iconColor="#4CAF50"
            iconBackground="#E8F5E8"
            rightComponent={
              <ToggleSwitch 
                value={cropHealthAlerts} 
                onValueChange={setCropHealthAlerts} 
              />
            }
            showArrow={false}
          />
          <SettingsItem
            icon="trending-up-outline"
            title="Market Price Alerts"
            subtitle="Price change notifications"
            iconColor="#9C27B0"
            iconBackground="#F3E5F5"
            rightComponent={
              <ToggleSwitch 
                value={marketPriceAlerts} 
                onValueChange={setMarketPriceAlerts} 
              />
            }
            showArrow={false}
          />
        </SettingsSection>

        {/* App Preferences */}
        <SettingsSection title="Preferences">
          <SettingsItem
            icon="language-outline"
            title="Language"
            subtitle={language}
            iconColor="#FF5722"
            iconBackground="#FBE9E7"
            onPress={() => setShowLanguageModal(true)}
          />
          <SettingsItem
            icon="moon-outline"
            title="Dark Mode"
            subtitle="Use dark theme"
            iconColor="#424242"
            iconBackground="#F5F5F5"
            rightComponent={
              <ToggleSwitch 
                value={darkMode} 
                onValueChange={setDarkMode} 
              />
            }
            showArrow={false}
          />
          <SettingsItem
            icon="location-outline"
            title="Location Services"
            subtitle="For weather and crop recommendations"
            iconColor="#E91E63"
            iconBackground="#FCE4EC"
            onPress={() => {}}
          />
          <SettingsItem
            icon="download-outline"
            title="Storage & Cache"
            subtitle="Manage app storage"
            iconColor="#607D8B"
            iconBackground="#ECEFF1"
            onPress={() => {}}
          />
        </SettingsSection>

        {/* Support */}
        <SettingsSection title="Support">
          <SettingsItem
            icon="help-circle-outline"
            title="Help Center"
            subtitle="FAQs and tutorials"
            iconColor="#3F51B5"
            iconBackground="#E8EAF6"
            onPress={() => {}}
          />
          <SettingsItem
            icon="chatbubble-outline"
            title="Contact Support"
            subtitle="Get help from our team"
            iconColor="#00BCD4"
            iconBackground="#E0F2F1"
            onPress={() => {}}
          />
          <SettingsItem
            icon="star-outline"
            title="Rate App"
            subtitle="Share your feedback"
            iconColor="#FFD700"
            iconBackground="#FFFDE7"
            onPress={() => {}}
          />
          <SettingsItem
            icon="share-outline"
            title="Share App"
            subtitle="Recommend to friends"
            iconColor="#4CAF50"
            iconBackground="#E8F5E8"
            onPress={() => {}}
          />
        </SettingsSection>

        {/* About */}
        <SettingsSection title="About">
          <SettingsItem
            icon="information-circle-outline"
            title="About App"
            subtitle="Version 2.1.0"
            iconColor="#2196F3"
            iconBackground="#E3F2FD"
            onPress={() => setShowAboutModal(true)}
          />
          <SettingsItem
            icon="document-text-outline"
            title="Terms of Service"
            subtitle="Legal terms and conditions"
            iconColor="#795548"
            iconBackground="#EFEBE9"
            onPress={() => {}}
          />
          <SettingsItem
            icon="lock-closed-outline"
            title="Privacy Policy"
            subtitle="How we handle your data"
            iconColor="#607D8B"
            iconBackground="#ECEFF1"
            onPress={() => {}}
          />
          <SettingsItem
            icon="checkmark-circle-outline"
            title="Licenses"
            subtitle="Open source licenses"
            iconColor="#4CAF50"
            iconBackground="#E8F5E8"
            onPress={() => {}}
          />
        </SettingsSection>

        {/* Danger Zone */}
        <SettingsSection title="Account Actions">
          <SettingsItem
            icon="log-out-outline"
            title="Logout"
            subtitle="Sign out of your account"
            iconColor="#FF9800"
            iconBackground="#FFF3E0"
            onPress={handleLogout}
          />
          <SettingsItem
            icon="trash-outline"
            title="Delete Account"
            subtitle="Permanently delete your account"
            iconColor="#F44336"
            iconBackground="#FFEBEE"
            onPress={handleDeleteAccount}
          />
        </SettingsSection>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showLanguageModal}
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.languageModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity 
                style={styles.modalClose}
                onPress={() => setShowLanguageModal(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  language === lang.name && styles.selectedLanguageOption
                ]}
                onPress={() => handleLanguageSelect(lang)}
              >
                <Text style={styles.languageFlag}>{lang.flag}</Text>
                <Text style={[
                  styles.languageName,
                  language === lang.name && styles.selectedLanguageName
                ]}>
                  {lang.name}
                </Text>
                {language === lang.name && (
                  <Ionicons name="checkmark" size={20} color="#4CAF50" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* About Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAboutModal}
        onRequestClose={() => setShowAboutModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.aboutModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>About FarmAssist</Text>
              <TouchableOpacity 
                style={styles.modalClose}
                onPress={() => setShowAboutModal(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.aboutContent}>
              <View style={styles.appLogo}>
                <Ionicons name="leaf" size={48} color="#4CAF50" />
              </View>
              <Text style={styles.appName}>FarmAssist</Text>
              <Text style={styles.appVersion}>Version 2.1.0</Text>
              
              <Text style={styles.aboutDescription}>
                Your comprehensive agricultural companion powered by AI. FarmAssist helps farmers monitor crop health, get expert advice, and make informed decisions for better yields.
              </Text>
              
              <View style={styles.aboutStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>10K+</Text>
                  <Text style={styles.statLabel}>Active Users</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>500+</Text>
                  <Text style={styles.statLabel}>Crop Diseases</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>50+</Text>
                  <Text style={styles.statLabel}>JTA Partners</Text>
                </View>
              </View>
              
              <Text style={styles.copyright}>
                © 2024 FarmAssist. All rights reserved.
              </Text>
            </View>
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
  headerButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  // Profile Section
  profileSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileAvatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  profileBadgeText: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 4,
  },
  editProfileButton: {
    padding: 8,
  },
  // Settings Sections
  settingsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginLeft: 16,
  },
  sectionContent: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsTextContainer: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  settingsItemSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  settingsItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Modal Styles
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  languageModalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: '50%',
  },
  aboutModalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalClose: {
    padding: 4,
  },
  // Language Modal
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedLanguageOption: {
    backgroundColor: '#f8f9fa',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  selectedLanguageName: {
    fontWeight: '600',
    color: '#4CAF50',
  },
  // About Modal
  aboutContent: {
    padding: 20,
    alignItems: 'center',
  },
  appLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  aboutDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  aboutStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  copyright: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default SettingsScreen;