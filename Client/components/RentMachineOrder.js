import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function RentMachineDetail({ machine, onClose }) {
  const [totalHours, setTotalHours] = useState("1");
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (!machine) return;

    // Extract price number from string like "₹350/hr" or "₹500/hour"
    const priceMatch = machine.price.match(/₹(\d+)/);
    let pricePerHour = priceMatch ? parseInt(priceMatch[1], 10) : 0;
    let hours = parseFloat(totalHours) || 0;

    setTotalAmount(pricePerHour * hours);
  }, [totalHours, machine]);

  if (!machine) return null;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={100}
      style={detailStyles.container}
    >
      <ScrollView contentContainerStyle={detailStyles.contentContainer}>
        {/* Close Button */}
        <TouchableOpacity style={detailStyles.closeBtn} onPress={onClose}>
          <FontAwesome5 name="times" size={24} color="#333" />
        </TouchableOpacity>

        {/* Machine Image/Icon */}
        {machine.icon && (machine.icon.startsWith("http") || machine.icon.startsWith("file://")) ? (
          <Image source={{ uri: machine.icon }} style={detailStyles.image} />
        ) : (
          <FontAwesome5
            name={machine.icon || "seedling"}
            size={100}
            color="#4CAF50"
            style={{ marginBottom: 20 }}
          />
        )}

        <Text style={detailStyles.name}>{machine.name}</Text>
        <Text style={detailStyles.price}>{machine.price}</Text>
        <Text style={detailStyles.distance}>{machine.distance} away</Text>

        {/* Total Hours Input */}
        <View style={detailStyles.inputGroup}>
          <Text style={detailStyles.label}>Total Hours</Text>
          <TextInput
            style={detailStyles.input}
            keyboardType="numeric"
            value={totalHours}
            onChangeText={(text) => {
              // Allow only numbers (with decimal)
              if (/^\d*\.?\d*$/.test(text)) setTotalHours(text);
            }}
            placeholder="Enter hours"
          />
        </View>

        {/* Total Amount Display */}
        <Text style={detailStyles.totalAmount}>
          Total Amount: ₹{totalAmount.toFixed(2)}
        </Text>

        {/* Rent Now Button */}
        <TouchableOpacity
          style={detailStyles.rentBtn}
          onPress={() => alert(`Rented ${machine.name} for ${totalHours} hours 🚜`)}
        >
          <Text style={detailStyles.rentBtnText}>Rent Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const detailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "android" ? 30 : 60,
    paddingHorizontal: 20,
  },
  contentContainer: {
    alignItems: "center",
  },
  closeBtn: {
    position: "absolute",
    top: Platform.OS === "android" ? 10 : 40,
    right: 20,
    zIndex: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 6,
    textAlign: "center",
  },
  price: {
    fontSize: 18,
    color: "#4CAF50",
    marginBottom: 4,
  },
  distance: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  totalAmount: {
    fontSize: 18,
    color: "#222",
    marginBottom: 30,
  },
  rentBtn: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  rentBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
