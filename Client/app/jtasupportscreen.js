import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Linking,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const JTASupportScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [sortBy, setSortBy] = useState('rating'); // rating, experience, name

  // JTA data
  const localJTAs = [
    {
      id: 1,
      name: 'Ramesh Kumar Sharma',
      designation: 'Senior JTA - Field Crops',
      area: 'Kathmandu Valley, Bhaktapur',
      specialization: 'Rice, Wheat, Maize cultivation',
      phone: '+977-9841234567',
      email: 'ramesh.jta@gov.np',
      experience: '8 years',
      languages: 'Nepali, English',
      availability: 'Mon-Fri: 9AM-5PM',
      rating: 4.8,
      totalConsultations: 156,
      responseTime: '< 2 hours',
      status: 'Available',
    },
    {
      id: 2,
      name: 'Sita Devi Poudel',
      designation: 'JTA - Horticulture',
      area: 'Lalitpur, Kathmandu South',
      specialization: 'Vegetables, Fruit cultivation',
      phone: '+977-9856789012',
      email: 'sita.jta@gov.np',
      experience: '6 years',
      languages: 'Nepali, Hindi',
      availability: 'Mon-Sat: 8AM-4PM',
      rating: 4.6,
      totalConsultations: 98,
      responseTime: '< 3 hours',
      status: 'Available',
    },
    {
      id: 3,
      name: 'Prakash Bahadur Thapa',
      designation: 'JTA - Plant Protection',
      area: 'Kirtipur, Chandragiri',
      specialization: 'Pest control, Disease management',
      phone: '+977-9807654321',
      email: 'prakash.jta@gov.np',
      experience: '10 years',
      languages: 'Nepali, English',
      availability: 'Mon-Fri: 10AM-6PM',
      rating: 4.9,
      totalConsultations: 203,
      responseTime: '< 1 hour',
      status: 'Busy',
    },
    {
      id: 4,
      name: 'Maya Gurung',
      designation: 'JTA - Organic Farming',
      area: 'Tokha, Budhanilkantha',
      specialization: 'Organic certification, Sustainable farming',
      phone: '+977-9823456789',
      email: 'maya.jta@gov.np',
      experience: '5 years',
      languages: 'Nepali, English',
      availability: 'Tue-Sat: 9AM-5PM',
      rating: 4.7,
      totalConsultations: 67,
      responseTime: '< 4 hours',
      status: 'Available',
    },
    {
      id: 5,
      name: 'Suresh Adhikari',
      designation: 'JTA - Livestock & Poultry',
      area: 'Madhyapur Thimi, Bhaktapur',
      specialization: 'Animal husbandry, Poultry farming',
      phone: '+977-9812345678',
      email: 'suresh.jta@gov.np',
      experience: '7 years',
      languages: 'Nepali, English',
      availability: 'Mon-Fri: 8AM-5PM',
      rating: 4.5,
      totalConsultations: 124,
      responseTime: '< 2 hours',
      status: 'Available',
    },
  ];

  const specializations = ['All', 'Field Crops', 'Horticulture', 'Plant Protection', 'Organic Farming', 'Livestock & Poultry'];

  // Handle JTA contact
  const handleJTAContact = (jta, contactMethod) => {
    if (contactMethod === 'phone') {
      Linking.openURL(`tel:${jta.phone}`);
    } else if (contactMethod === 'email') {
      Linking.openURL(`mailto:${jta.email}`);
    }
  };

  // Handle consultation booking
  const handleBookConsultation = (jta) => {
    Alert.alert(
      'Book Consultation',
      `Would you like to book a consultation with ${jta.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Book Now', 
          onPress: () => {
            Alert.alert(
              'Consultation Booked',
              `Your consultation with ${jta.name} has been scheduled. You will receive a confirmation call within ${jta.responseTime}.`
            );
          }
        },
      ]
    );
  };

  // Filter and sort JTAs
  const getFilteredAndSortedJTAs = () => {
    let filtered = localJTAs;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(jta => 
        jta.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        jta.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        jta.specialization.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by specialization
    if (selectedSpecialization !== 'All') {
      filtered = filtered.filter(jta => 
        jta.specialization.includes(selectedSpecialization) ||
        jta.designation.includes(selectedSpecialization)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'experience':
          return parseInt(b.experience) - parseInt(a.experience);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const JTACard = ({ jta }) => (
    <View style={styles.jtaCard}>
      {/* Header with avatar and basic info */}
      <View style={styles.jtaHeader}>
        <View style={styles.jtaAvatar}>
          <Text style={styles.jtaAvatarText}>{jta.name.charAt(0)}</Text>
        </View>
        <View style={styles.jtaInfo}>
          <View style={styles.jtaNameRow}>
            <Text style={styles.jtaName}>{jta.name}</Text>
            <View style={[styles.statusBadge, { 
              backgroundColor: jta.status === 'Available' ? '#4CAF50' : '#FF9800' 
            }]}>
              <Text style={styles.statusText}>{jta.status}</Text>
            </View>
          </View>
          <Text style={styles.jtaDesignation}>{jta.designation}</Text>
          <View style={styles.jtaRating}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.jtaRatingText}>{jta.rating}</Text>
            <Text style={styles.jtaExperience}>• {jta.experience} exp</Text>
            <Text style={styles.jtaConsultations}>• {jta.totalConsultations} consultations</Text>
          </View>
        </View>
      </View>

      {/* Details section */}
      <View style={styles.jtaDetails}>
        <View style={styles.jtaDetailRow}>
          <Ionicons name="location" size={14} color="#666" />
          <Text style={styles.jtaDetailText}>{jta.area}</Text>
        </View>
        <View style={styles.jtaDetailRow}>
          <Ionicons name="leaf" size={14} color="#666" />
          <Text style={styles.jtaDetailText}>{jta.specialization}</Text>
        </View>
        <View style={styles.jtaDetailRow}>
          <Ionicons name="time" size={14} color="#666" />
          <Text style={styles.jtaDetailText}>{jta.availability}</Text>
        </View>
        <View style={styles.jtaDetailRow}>
          <Ionicons name="chatbubble" size={14} color="#666" />
          <Text style={styles.jtaDetailText}>Response time: {jta.responseTime}</Text>
        </View>
        <View style={styles.jtaDetailRow}>
          <Ionicons name="language" size={14} color="#666" />
          <Text style={styles.jtaDetailText}>{jta.languages}</Text>
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.jtaActions}>
        <TouchableOpacity 
          style={styles.jtaActionButton}
          onPress={() => handleJTAContact(jta, 'phone')}
        >
          <Ionicons name="call" size={16} color="#4CAF50" />
          <Text style={styles.jtaActionText}>Call</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.jtaActionButton}
          onPress={() => handleJTAContact(jta, 'email')}
        >
          <Ionicons name="mail" size={16} color="#4CAF50" />
          <Text style={styles.jtaActionText}>Email</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.jtaActionButton, styles.bookButton]}
          onPress={() => handleBookConsultation(jta)}
          disabled={jta.status === 'Busy'}
        >
          <Ionicons name="calendar" size={16} color="white" />
          <Text style={styles.bookButtonText}>
            {jta.status === 'Busy' ? 'Busy' : 'Book'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const SpecializationChip = ({ specialization, isSelected, onPress }) => (
    <TouchableOpacity
      style={[
        styles.specializationChip,
        isSelected && styles.selectedSpecializationChip
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.specializationChipText,
        isSelected && styles.selectedSpecializationChipText
      ]}>
        {specialization}
      </Text>
    </TouchableOpacity>
  );

  const filteredJTAs = getFilteredAndSortedJTAs();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2196F3" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>JTA Support</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="filter" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search and Filter Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, area, or specialization..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {/* Specialization filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.specializationContainer}
        >
          {specializations.map((spec) => (
            <SpecializationChip
              key={spec}
              specialization={spec}
              isSelected={selectedSpecialization === spec}
              onPress={() => setSelectedSpecialization(spec)}
            />
          ))}
        </ScrollView>

        {/* Sort options */}
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[styles.sortOption, sortBy === 'rating' && styles.selectedSortOption]}
              onPress={() => setSortBy('rating')}
            >
              <Text style={[styles.sortOptionText, sortBy === 'rating' && styles.selectedSortOptionText]}>
                Rating
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortOption, sortBy === 'experience' && styles.selectedSortOption]}
              onPress={() => setSortBy('experience')}
            >
              <Text style={[styles.sortOptionText, sortBy === 'experience' && styles.selectedSortOptionText]}>
                Experience
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortOption, sortBy === 'name' && styles.selectedSortOption]}
              onPress={() => setSortBy('name')}
            >
              <Text style={[styles.sortOptionText, sortBy === 'name' && styles.selectedSortOptionText]}>
                Name
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      {/* Results header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredJTAs.length} JTA{filteredJTAs.length !== 1 ? 's' : ''} found
        </Text>
        <View style={styles.availableCount}>
          <View style={styles.availableDot} />
          <Text style={styles.availableText}>
            {filteredJTAs.filter(jta => jta.status === 'Available').length} Available
          </Text>
        </View>
      </View>

      {/* JTA List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredJTAs.length > 0 ? (
          filteredJTAs.map((jta) => (
            <JTACard key={jta.id} jta={jta} />
          ))
        ) : (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search" size={48} color="#ccc" />
            <Text style={styles.noResultsTitle}>No JTAs found</Text>
            <Text style={styles.noResultsText}>
              Try adjusting your search criteria or filters
            </Text>
            <TouchableOpacity 
              style={styles.clearFiltersButton}
              onPress={() => {
                setSearchQuery('');
                setSelectedSpecialization('All');
              }}
            >
              <Text style={styles.clearFiltersText}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Emergency Contact Button */}
      {/* <View style={styles.emergencyContainer}>
        <TouchableOpacity style={styles.emergencyButton}>
          <Ionicons name="call" size={20} color="white" />
          <Text style={styles.emergencyText}>Emergency Agricultural Helpline</Text>
          <Text style={styles.emergencyNumber}>1234</Text>
        </TouchableOpacity>
      </View> */}
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
    backgroundColor: '#2196F3',
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
  searchSection: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  specializationContainer: {
    marginBottom: 16,
  },
  specializationChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  selectedSpecializationChip: {
    backgroundColor: '#2196F3',
  },
  specializationChipText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  selectedSpecializationChipText: {
    color: 'white',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  sortOption: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  selectedSortOption: {
    backgroundColor: '#2196F3',
  },
  sortOptionText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  selectedSortOptionText: {
    color: 'white',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  availableCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availableDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 4,
  },
  availableText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  // JTA Card styles
  jtaCard: {
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
  jtaHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jtaAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  jtaAvatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  jtaInfo: {
    flex: 1,
  },
  jtaNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  jtaName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 8,
    color: 'white',
    fontWeight: '600',
  },
  jtaDesignation: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  jtaRating: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  jtaRatingText: {
    fontSize: 12,
    color: '#333',
    marginLeft: 2,
    fontWeight: '600',
  },
  jtaExperience: {
    fontSize: 10,
    color: '#666',
    marginLeft: 4,
  },
  jtaConsultations: {
    fontSize: 10,
    color: '#666',
    marginLeft: 4,
  },
  jtaDetails: {
    marginBottom: 16,
  },
  jtaDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  jtaDetailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  jtaActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 12,
  },
  jtaActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flex: 0.3,
    justifyContent: 'center',
  },
  jtaActionText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
    marginLeft: 4,
  },
  bookButton: {
    backgroundColor: '#2196F3',
  },
  bookButtonText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
  },
  // No results styles
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  clearFiltersButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  clearFiltersText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  // Emergency contact styles
  emergencyContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  emergencyButton: {
    backgroundColor: '#F44336',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  emergencyText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    marginRight: 8,
  },
  emergencyNumber: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default JTASupportScreen;