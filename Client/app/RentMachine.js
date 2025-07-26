import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import MachineForm from "../components/MachineForm"; // Adjust path accordingly
import RentProduct from "../components/RentProduct"; // Renamed from RentMachineOrder
import { useNavigation } from "expo-router";

const activeListing = {
  name: "Tractor Model X1",
  price: "₹500/hour",
  available: "10 hours/day",
  views: 7,
  inquiries: 2,
};

const initialRecentMachines = [
  {
    id: "m1",
    category: "Tractor",
    icon: "tractor",
    name: "Mini Tractor",
    desc: "Compact diesel, 18HP",
    price: "₹350/hr",
    available: 8, // Changed to number for calculation
    unit: "hr",
    maxHours: "5h/day",
    distance: "1.0 km",
    heart: false,
    specifications: {
      power: "18HP",
      fuelType: "Diesel",
      weight: "850kg",
      transmission: "Manual"
    }
  },
  {
    id: "m2",
    category: "Tiller",
    icon: "seedling",
    name: "Rotavator",
    desc: "Power tiller, 1.2m",
    price: "₹200/hr",
    available: 12,
    unit: "hr",
    maxHours: "8h/day",
    distance: "2.7 km",
    heart: true,
    specifications: {
      width: "1.2m",
      power: "8HP",
      fuelType: "Petrol",
      weight: "45kg"
    }
  },
  {
    id: "m3",
    category: "Harvester",
    icon: "truck",
    name: "Combine Harvester",
    desc: "Combine harvester, Diesel",
    price: "₹800/hr",
    available: 6,
    unit: "hr",
    maxHours: "4h/day",
    distance: "3.8 km",
    heart: false,
    specifications: {
      power: "75HP",
      fuelType: "Diesel",
      capacity: "2 tons/hr",
      weight: "3500kg"
    }
  },
];

const messages = [
  {
    id: "msg1",
    name: "Aashish Patel",
    msg: "Is the tractor available on weekend?",
    time: "4 min ago",
  },
];

const filterOptions = ["All", "Tractor", "Tiller", "Harvester", "Near Me"];

function Chip({ label, active, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={() => onPress(label)}
    >
      <Text style={[styles.chipLabel, active && styles.chipActiveLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function RentMachine({ navigation }) {
  const [machines, setMachines] = useState(initialRecentMachines);
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigation();

  // State for RentProduct popup
  const [rentModalVisible, setRentModalVisible] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);

  const toggleHeart = (id) => {
    setMachines((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, heart: !item.heart } : item
      )
    );
  };

  const filteredMachines = machines.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchText.trim().toLowerCase());
    if (selectedFilter === "All" || selectedFilter === "Near Me") {
      return matchesSearch;
    }
    return matchesSearch && item.category === selectedFilter;
  });

  const sortedMachines = [...filteredMachines].sort((a, b) => {
    if (a.heart === b.heart) return 0;
    return a.heart ? -1 : 1;
  });

  const handleFormSubmit = (formData) => {
    setMachines((prev) => [
      {
        id: `m${prev.length + 1}`,
        category: formData.category,
        icon:
          formData.imageUri && formData.imageUri.length > 0
            ? formData.imageUri
            : formData.category === "Tractor"
            ? "tractor"
            : formData.category === "Tiller"
            ? "seedling"
            : "truck",
        name: formData.toolName,
        desc: formData.description || "",
        price: `₹${formData.rentalPrice}/${formData.duration}`,
        available: parseInt(formData.availableHours) || 8,
        unit: formData.duration === "hour" ? "hr" : "day",
        maxHours: `${formData.availabilityFrom} to ${formData.availabilityTo}`,
        distance: "0 km",
        heart: false,
        specifications: {
          power: formData.power || "N/A",
          fuelType: formData.fuelType || "N/A",
          weight: formData.weight || "N/A"
        }
      },
      ...prev,
    ]);
    setModalVisible(false);
  };

  // Open rent modal with selected machine data
  const onRentPress = (machine) => {
    setSelectedMachine(machine);
    setRentModalVisible(true);
  };

  // Close rent modal
  const onRentClose = () => {
    setRentModalVisible(false);
    setSelectedMachine(null);
  };

  // Handle successful rental - decrease available hours
  const handleRentSuccess = (machineId, rentedHours) => {
    setMachines((prev) =>
      prev.map((item) =>
        item.id === machineId
          ? { ...item, available: Math.max(0, item.available - rentedHours) }
          : item
      )
    );
    setRentModalVisible(false);
    setSelectedMachine(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigate.pop(1)}
        >
          <FontAwesome5 name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Agricultural Equipment Rental</Text>
        <TouchableOpacity style={styles.menuButton}>
          <FontAwesome5 name="ellipsis-v" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView 
          keyboardShouldPersistTaps="handled" 
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchRow}>
              <FontAwesome5
                name="search"
                size={16}
                color="#8e8e8e"
                style={styles.iconLeft}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search agricultural equipment..."
                placeholderTextColor="#bdbdbd"
                value={searchText}
                onChangeText={setSearchText}
                autoCorrect={false}
                autoCapitalize="none"
                clearButtonMode="while-editing"
              />
              <FontAwesome5
                name="sliders-h"
                size={16}
                color="#8e8e8e"
                style={styles.iconRight}
              />
            </View>
          </View>

          {/* Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipScroll}
            contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}
          >
            {filterOptions.map((label) => (
              <Chip
                key={label}
                label={label}
                active={selectedFilter === label}
                onPress={setSelectedFilter}
              />
            ))}
          </ScrollView>

          {/* My Active Listings */}
          <Text style={styles.sectionTitle}>My Active Listings</Text>
          <View style={styles.listingCard}>
            <View style={styles.listingIconContainer}>
              <FontAwesome5
                name="tractor"
                size={24}
                color="#fff"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.listingTitle}>{activeListing.name}</Text>
              <Text style={styles.listingSub}>
                {activeListing.price} • {activeListing.available}
              </Text>
              <View style={styles.metaRow}>
                <View style={styles.activeStatus}>
                  <Text style={styles.activeText}>Active</Text>
                </View>
                <Text style={styles.metaInfo}>
                  {activeListing.views} views • {activeListing.inquiries} inquiries
                </Text>
              </View>
            </View>
          </View>

          {/* List Your Machine Button */}
          <TouchableOpacity
            style={styles.listProductBtn}
            onPress={() => setModalVisible(true)}
          >
            <FontAwesome5
              name="plus"
              size={18}
              color="#fff"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.listProductText}>List Your Equipment</Text>
          </TouchableOpacity>

          {/* Available Equipment */}
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Available Equipment</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {sortedMachines.length > 0 ? (
            sortedMachines.map((item) => (
              <View style={styles.productCard} key={item.id}>
                <View style={styles.productIconContainer}>
                  {item.icon && (item.icon.startsWith("http") || item.icon.startsWith("file://")) ? (
                    <Image
                      source={{ uri: item.icon }}
                      style={styles.productImage}
                    />
                  ) : (
                    <FontAwesome5
                      name={item.icon || "tools"}
                      size={24}
                      color="#4CAF50"
                    />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.productTitle}>{item.name}</Text>
                  <Text style={styles.productSub}>{item.desc}</Text>
                  <Text style={styles.productMeta}>
                    {item.price} • {item.available}{item.unit} available
                  </Text>
                  <View style={styles.distanceRow}>
                    <FontAwesome5 name="map-marker-alt" size={12} color="#999" />
                    <Text style={styles.distance}>{item.distance} away</Text>
                  </View>
                </View>
                <View style={styles.productActions}>
                  <TouchableOpacity
                    onPress={() => toggleHeart(item.id)}
                    style={styles.heartButton}
                  >
                    <FontAwesome5
                      name="heart"
                      size={18}
                      color={item.heart ? "#e74c3c" : "#ddd"}
                      solid={item.heart}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.rentButton,
                      item.available <= 0 && styles.rentButtonDisabled
                    ]}
                    onPress={() => onRentPress(item)}
                    disabled={item.available <= 0}
                  >
                    <Text style={[
                      styles.rentButtonText,
                      item.available <= 0 && styles.rentButtonTextDisabled
                    ]}>
                      {item.available <= 0 ? "Not Available" : "Rent Now"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <FontAwesome5 name="tools" size={48} color="#ddd" />
              <Text style={styles.emptyStateText}>No equipment found</Text>
              <Text style={styles.emptyStateSubtext}>Try adjusting your search or filters</Text>
            </View>
          )}

          {/* Recent Messages */}
          <Text style={styles.sectionTitle}>Recent Messages</Text>
          {messages.map((msg) => (
            <TouchableOpacity key={msg.id} style={styles.msgRow}>
              <View style={styles.avatarContainer}>
                <FontAwesome5
                  name="user"
                  size={16}
                  color="#fff"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.msgName}>{msg.name}</Text>
                <Text style={styles.msgTxt}>{msg.msg}</Text>
              </View>
              <View style={styles.msgTimeContainer}>
                <Text style={styles.msgTime}>{msg.time}</Text>
                <View style={styles.unreadIndicator} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Machine Form Modal */}
      <MachineForm
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Rent Product Modal */}
      <RentProduct
        visible={rentModalVisible}
        onClose={onRentClose}
        machine={selectedMachine}
        onRentSuccess={handleRentSuccess}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
    justifyContent: "center",
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
    justifyContent: "center",
  },
  container: { 
    flex: 1, 
    backgroundColor: "#f8f9fa",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconLeft: { marginRight: 10 },
  iconRight: { marginLeft: 10 },
  searchInput: { 
    flex: 1, 
    height: 44, 
    fontSize: 16, 
    color: "#333",
  },
  chipScroll: { 
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginRight: 10,
    alignSelf: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  chipActive: { 
    backgroundColor: "#4CAF50",
    elevation: 2,
  },
  chipLabel: { 
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  chipActiveLabel: { 
    color: "#fff",
    fontWeight: "600",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#333",
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  listingCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  listingIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  listingTitle: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#333",
    marginBottom: 4,
  },
  listingSub: { 
    color: "#666", 
    marginBottom: 6,
    fontSize: 14,
  },
  metaRow: { 
    flexDirection: "row", 
    alignItems: "center",
  },
  activeStatus: {
    backgroundColor: "#e8f5e8",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  activeText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "600",
  },
  metaInfo: { 
    fontSize: 12, 
    color: "#999",
  },
  listProductBtn: {
    margin: 16,
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  listProductText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 16,
  },
  viewAll: { 
    color: "#4CAF50", 
    fontWeight: "600", 
    fontSize: 14, 
    marginRight: 16,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff3e0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  productImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  productTitle: { 
    fontWeight: "bold", 
    fontSize: 16,
    color: "#333",
    marginBottom: 2,
  },
  productSub: { 
    color: "#666",
    fontSize: 14,
    marginBottom: 4,
  },
  productMeta: { 
    fontSize: 13, 
    color: "#4CAF50",
    fontWeight: "600",
    marginBottom: 4,
  },
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  distance: { 
    fontSize: 12, 
    color: "#999",
    marginLeft: 4,
  },
  productActions: {
    alignItems: "center",
  },
  heartButton: {
    padding: 8,
    marginBottom: 8,
  },
  rentButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  rentButtonDisabled: {
    backgroundColor: "#ddd",
  },
  rentButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  rentButtonTextDisabled: {
    color: "#999",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  msgRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  msgName: { 
    fontWeight: "bold", 
    color: "#333",
    fontSize: 15,
    marginBottom: 2,
  },
  msgTxt: { 
    color: "#666", 
    fontSize: 14,
  },
  msgTimeContainer: {
    alignItems: "flex-end",
  },
  msgTime: { 
    color: "#999", 
    fontSize: 12,
    marginBottom: 4,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
  },
});