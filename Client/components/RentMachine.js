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
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import MachineForm from "./MachineForm"; // Adjust path accordingly
import RentMachineDetail from "./RentMachineOrder"; // Import the new detail component

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
    available: "5h/day",
    distance: "1.0 km",
    heart: false,
  },
  {
    id: "m2",
    category: "Tiller",
    icon: "seedling",
    name: "Rotavator",
    desc: "Power tiller, 1.2m",
    price: "₹200/hr",
    available: "8h/day",
    distance: "2.7 km",
    heart: true,
  },
  {
    id: "m3",
    category: "Harvester",
    icon: "truck",
    name: "Harvester",
    desc: "Combine harvester, Diesel",
    price: "₹800/hr",
    available: "4h/day",
    distance: "3.8 km",
    heart: false,
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
      <Text style={[styles.chipLabel, active && styles.chipActiveLabel]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function RentMachine() {
  const [machines, setMachines] = useState(initialRecentMachines);
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);

  // New state for selected machine detail
  const [selectedMachine, setSelectedMachine] = useState(null);

  const toggleHeart = (id) => {
    setMachines((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, heart: !item.heart } : item
      )
    );
  };

  const filteredMachines = machines.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchText.trim().toLowerCase());
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
        available: `${formData.availabilityFrom} to ${formData.availabilityTo}`,
        distance: "0 km",
        heart: false,
      },
      ...prev,
    ]);
    setModalVisible(false);
  };

  // If a machine is selected for detail, render that and hide main list
  if (selectedMachine) {
    return (
      <RentMachineDetail
        machine={selectedMachine}
        onClose={() => setSelectedMachine(null)}
      />
    );
  }

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 24 }}>
          {/* Search Row */}
          <View style={styles.searchRow}>
            <FontAwesome5 name="search" size={16} color="#8e8e8e" style={styles.iconLeft} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search machines..."
              placeholderTextColor="#bdbdbd"
              value={searchText}
              onChangeText={setSearchText}
              autoCorrect={false}
              autoCapitalize="none"
              clearButtonMode="while-editing"
            />
            <FontAwesome5 name="sliders-h" size={16} color="#8e8e8e" style={styles.iconRight} />
          </View>

          {/* Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipScroll}
            contentContainerStyle={{ paddingLeft: 12, paddingRight: 16 }}
          >
            {filterOptions.map((label) => (
              <Chip key={label} label={label} active={selectedFilter === label} onPress={setSelectedFilter} />
            ))}
          </ScrollView>

          {/* My Active Listings */}
          <Text style={styles.sectionTitle}>My Active Listings</Text>
          <View style={styles.listingCard}>
            <FontAwesome5 name="tractor" size={22} color="#6c97eb" style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.listingTitle}>{activeListing.name}</Text>
              <Text style={styles.listingSub}>
                {activeListing.price} • {activeListing.available}
              </Text>
              <View style={styles.metaRow}>
                <Text style={styles.active}>Active</Text>
                <Text style={styles.metaInfo}>
                  {activeListing.views} views • {activeListing.inquiries} inquiries
                </Text>
              </View>
            </View>
          </View>

          {/* List Your Machine Button */}
          <TouchableOpacity style={styles.listProductBtn} onPress={() => setModalVisible(true)}>
            <Text style={styles.listProductText}>List Your Machine</Text>
            <FontAwesome5 name="plus" size={16} color="#fff" style={{ marginLeft: 8 }} />
          </TouchableOpacity>

          {/* Recent Machines */}
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Recent Machines</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {sortedMachines.length > 0 ? (
            sortedMachines.map((item) => (
              <View style={styles.productCard} key={item.id}>
                {item.icon && (item.icon.startsWith("http") || item.icon.startsWith("file://")) ? (
                  <Image source={{ uri: item.icon }} style={{ width: 28, height: 28, borderRadius: 5, marginRight: 12 }} />
                ) : (
                  <FontAwesome5 name={item.icon || "seedling"} size={22} color="#a5d7a7" style={{ marginRight: 12 }} />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.productTitle}>{item.name}</Text>
                  <Text style={styles.productSub}>{item.desc}</Text>
                  <Text style={styles.productMeta}>
                    {item.price} {item.available}
                  </Text>
                  <Text style={styles.distance}>{item.distance} away</Text>
                </View>
                <TouchableOpacity onPress={() => toggleHeart(item.id)} style={{ paddingHorizontal: 8 }}>
                  <FontAwesome5 name="heart" size={18} color={item.heart ? "#e74c3c" : "#bbb"} solid={item.heart} />
                </TouchableOpacity>
                {/* Updated Rent Now: On press open detail */}
                <TouchableOpacity
                  style={styles.contactBtn}
                  onPress={() => setSelectedMachine(item)}
                >
                  <Text style={{ color: "#fff", fontSize: 13 }}>Rent Now</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={{ textAlign: "center", marginVertical: 16, color: "#999" }}>
              No machines found
            </Text>
          )}

          {/* Recent Messages */}
          <Text style={styles.sectionTitle}>Recent Messages</Text>
          {messages.map((msg) => (
            <View key={msg.id} style={styles.msgRow}>
              <FontAwesome5 name="user-circle" size={24} color="#bdbdbd" style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.msgName}>{msg.name}</Text>
                <Text style={styles.msgTxt}>{msg.msg}</Text>
              </View>
              <Text style={styles.msgTime}>{msg.time}</Text>
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Machine Form Modal */}
      <MachineForm visible={modalVisible} onClose={() => setModalVisible(false)} onSubmit={handleFormSubmit} />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f7", paddingTop: 0 },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 10,
    margin: 16,
    paddingHorizontal: 10,
  },
  iconLeft: { marginRight: 7 },
  iconRight: { marginLeft: 7 },
  searchInput: { flex: 1, height: 38, fontSize: 16, color: "#222" },
  chipScroll: { marginBottom: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    backgroundColor: "#ececec",
    borderRadius: 13,
    marginRight: 8,
    alignSelf: "center",
  },
  chipActive: { backgroundColor: "#4CAF50" },
  chipLabel: { color: "#555" },
  chipActiveLabel: { color: "#fff" },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  listingCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 14,
    shadowColor: "#ddd",
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 10,
  },
  listingTitle: { fontSize: 15, fontWeight: "bold", color: "#333" },
  listingSub: { color: "#888", marginBottom: 2 },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  metaInfo: { fontSize: 12, color: "#888", marginLeft: 7 },
  active: { fontSize: 12, color: "#4CAF50", fontWeight: "bold", marginRight: 7 },
  listProductBtn: {
    margin: 16,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  listProductText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  viewAll: { color: "#449d44", fontWeight: "bold", fontSize: 14, marginRight: 16 },
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
    borderRadius: 12,
    padding: 14,
    marginBottom: 11,
    elevation: 1,
  },
  productTitle: { fontWeight: "bold", fontSize: 15 },
  productSub: { color: "#555" },
  productMeta: { fontSize: 12, color: "#888", marginBottom: 2 },
  distance: { fontSize: 11, color: "#a2a2a2" },
  contactBtn: {
    backgroundColor: "#4CAF50",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 7,
    marginLeft: 7,
  },
  msgRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 9,
    marginTop: 8,
  },
  msgName: { fontWeight: "bold", color: "#222" },
  msgTxt: { color: "#555", fontSize: 13 },
  msgTime: { color: "#bdbdbd", fontSize: 11 },
});
