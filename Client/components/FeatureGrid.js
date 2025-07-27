import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const { width } = Dimensions.get('window');

export default function FeatureGrid({ items }) {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const language = useSelector((state) => state.language.value);

  const getTitle = (item) => {
    const translations = {
      "My Crops": language === "NP" ? "मेरो बाली" : "My Crops",
      "Crop Health": language === "NP" ? "बाली स्वास्थ्य" : "Crop Health",
      "Sell Produce": language === "NP" ? "बिक्री गर्नुहोस्" : "Sell Produce",
      "Rent Tools": language === "NP" ? "उपकरण भाडामा" : "Rent Tools",
      "Buy Produce": language === "NP" ? "किन्नुहोस्" : "Buy Produce",
    };
    return translations[item.title] || item.title;
  };

  const handlePress = (title) => {
    if (title === "My Crops") {
      router.push("/my-crops");
    } else if (title === "Crop Health") {
      router.push("/crop-health");
    } else if (title === "Sell Produce") {
      router.push("/RentCrop");
    } else if (title === "My Purchases") {
      router.push("/RentCrop");
    } else {
      router.push("/RentMachine");
    }
  };

  const getColors = (index) => {
    const colorSchemes = [
      { icon: '#4CAF50', bg: '#E8F5E8' }, // Green
      { icon: '#F44336', bg: '#FFEBEE' }, // Red
      { icon: '#FF9800', bg: '#FFF3E0' }, // Orange
      { icon: '#2196F3', bg: '#E3F2FD' }, // Blue
    ];
    return colorSchemes[index % colorSchemes.length];
  };

  // 🔒 Filter items based on role
  const filteredItems = items.filter((item) => {
    if (user?.role === "user") {
      return item.title === "My Crops" || item.title === "My Purchases";
    } else if (user?.role === "farmer") {
      return ["My Crops", "Crop Health", "Sell Produce", "Rent Tools"].includes(item.title);
    }
    return false; // Show nothing if role not matched
  });

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {filteredItems.map((item, index) => {
          const colors = getColors(index);
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, { backgroundColor: colors.bg }]}
              onPress={() => handlePress(item.title)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: colors.icon }]}>
                <Ionicons name={item.icon} size={24} color="#FFFFFF" />
              </View>

              <Text style={styles.title}>{getTitle(item)}</Text>

              <View style={styles.arrow}>
                <Ionicons name="chevron-forward" size={16} color="#666" />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: (width - 56) / 2,
    height: 120,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    lineHeight: 20,
    flex: 1,
  },
  arrow: {
    position: 'absolute',
    bottom: 16,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
