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
import CropForm from "../components/CropForm"; // Adjust path accordingly
import OrderCrop from "../components/OrderCrop"; // Import new OrderCrop component

const activeListing = {
  name: "Fresh Tomatoes",
  price: "₹45/kg",
  available: "50kg",
  views: 12,
  inquiries: 3,
};
const initialRecentProducts = [
  {
    id: "p1",
    category: "Vegetables",
    icon: "carrot",
    name: "Organic Carrots",
    desc: "Fresh from farm",
    price: "₹35/kg",
    available: "25",
    distance: "2.5 km",
    heart: false,
  },
  {
    id: "p2",
    category: "Vegetables",
    icon: "leaf",
    name: "Fresh Spinach",
    desc: "Pesticide-free",
    price: "₹25/kg",
    available: "15",
    distance: "1.2 km",
    heart: true,
  },
  {
    id: "p3",
    category: "Fruits",
    icon: "seedling",
    name: "Sweet Corn",
    desc: "Freshly harvested",
    price: "₹40/kg",
    available: "30",
    distance: "3.1 km",
    heart: false,
  },
];
const messages = [
  {
    id: "m1",
    name: "Shyam Maharjan",
    msg: "Interested in your tomatoes. Can we discuss?",
    time: "2 min ago",
  },
];

const filterOptions = ["All", "Vegetables", "Fruits", "Grains", "Near Me"];

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

export default function RentCrop() {
  const [products, setProducts] = useState(initialRecentProducts);
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);

  // State for OrderCrop popup
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const toggleHeart = (id) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, heart: !item.heart } : item
      )
    );
  };

  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchText.trim().toLowerCase());
    if (selectedFilter === "All" || selectedFilter === "Near Me") {
      return matchesSearch;
    }
    return matchesSearch && item.category === selectedFilter;
  });

  // Sort so hearted products appear first
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (a.heart === b.heart) return 0;
    return a.heart ? -1 : 1;
  });

  const handleFormSubmit = (formData) => {
    setProducts((prev) => [
      {
        id: `p${prev.length + 1}`,
        category: formData.category,
        icon:
          formData.imageUri && formData.imageUri.length > 0
            ? formData.imageUri
            : formData.category === "Vegetables"
            ? "carrot"
            : formData.category === "Fruits"
            ? "seedling"
            : "leaf",
        name: formData.productName,
        desc: formData.description || "",
        price: `₹${formData.pricePerUnit}/${formData.unit}`,
        available: formData.quantity, // pass quantity as number/string without unit for checking
        distance: "0 km",
        heart: false,
      },
      ...prev,
    ]);
  };

  // Open order modal with selected product data
  const onOrderPress = (product) => {
    setSelectedProduct(product);
    setOrderModalVisible(true);
  };

  // Close order modal
  const onOrderClose = () => {
    setOrderModalVisible(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 24 }}>
          {/* Search Bar */}
          <View style={styles.searchRow}>
            <FontAwesome5
              name="search"
              size={16}
              color="#8e8e8e"
              style={styles.iconLeft}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
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

          {/* Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipScroll}
            contentContainerStyle={{ paddingLeft: 12, paddingRight: 16 }}
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
            <FontAwesome5
              name="pepper-hot"
              size={22}
              color="#ea6d3c"
              style={{ marginRight: 12 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.listingTitle}>{activeListing.name}</Text>
              <Text style={styles.listingSub}>
                {activeListing.price} • {activeListing.available} available
              </Text>
              <View style={styles.metaRow}>
                <Text style={styles.active}>Active</Text>
                <Text style={styles.metaInfo}>
                  {activeListing.views} views • {activeListing.inquiries} inquiries
                </Text>
              </View>
            </View>
          </View>

          {/* List Your Product Button */}
          <TouchableOpacity
            style={styles.listProductBtn}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.listProductText}>List Your Product</Text>
            <FontAwesome5
              name="plus"
              size={16}
              color="#fff"
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>

          {/* Recent Products */}
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Recent Products</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {sortedProducts.length > 0 ? (
            sortedProducts.map((item) => (
              <View style={styles.productCard} key={item.id}>
                {item.icon && (item.icon.startsWith("http") || item.icon.startsWith("file://")) ? (
                  <Image
                    source={{ uri: item.icon }}
                    style={{ width: 28, height: 28, borderRadius: 5, marginRight: 12 }}
                  />
                ) : (
                  <FontAwesome5
                    name={item.icon || "seedling"}
                    size={22}
                    color="#a5d7a7"
                    style={{ marginRight: 12 }}
                  />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.productTitle}>{item.name}</Text>
                  <Text style={styles.productSub}>{item.desc}</Text>
                  <Text style={styles.productMeta}>
                    {item.price} {item.available} available
                  </Text>
                  <Text style={styles.distance}>{item.distance} away</Text>
                </View>
                <TouchableOpacity
                  onPress={() => toggleHeart(item.id)}
                  style={{ paddingHorizontal: 8 }}
                >
                  <FontAwesome5
                    name="heart"
                    size={18}
                    color={item.heart ? "#e74c3c" : "#bbb"}
                    solid={item.heart}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.contactBtn}
                  onPress={() => onOrderPress(item)}
                >
                  <Text style={{ color: "#fff", fontSize: 13 }}>Order Now</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={{ textAlign: "center", marginVertical: 16, color: "#999" }}>
              No products found
            </Text>
          )}

          {/* Recent Messages */}
          <Text style={styles.sectionTitle}>Recent Messages</Text>
          {messages.map((msg) => (
            <View key={msg.id} style={styles.msgRow}>
              <FontAwesome5
                name="user-circle"
                size={24}
                color="#bdbdbd"
                style={{ marginRight: 10 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.msgName}>{msg.name}</Text>
                <Text style={styles.msgTxt}>{msg.msg}</Text>
              </View>
              <Text style={styles.msgTime}>{msg.time}</Text>
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Crop Form Modal */}
      <CropForm
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Order Crop Modal */}
      <OrderCrop
        visible={orderModalVisible}
        onClose={onOrderClose}
        product={selectedProduct}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f7", paddingTop: 20},
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
