import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from "react-native";

export default function OrderCrop({ visible, onClose, product }) {
  const [buyQuantity, setBuyQuantity] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  // Reset on modal open/close
  useEffect(() => {
    if (!visible) {
      setBuyQuantity("");
      setTotalPrice(0);
    }
  }, [visible]);

  // Calculate total price whenever buyQuantity or product changes
  useEffect(() => {
    if (!product) {
      setTotalPrice(0);
      return;
    }
    const qtyNum = parseFloat(buyQuantity);
    if (!isNaN(qtyNum) && qtyNum > 0) {
      // Extract numeric price from product.price (e.g. "₹45/kg")
      const priceMatch = product.price.match(/₹(\d+(\.\d+)?)/);
      const pricePerUnit = priceMatch ? parseFloat(priceMatch[1]) : 0;
      setTotalPrice(pricePerUnit * qtyNum);
    } else {
      setTotalPrice(0);
    }
  }, [buyQuantity, product]);

  // Early return null if no product to avoid error
  if (!product) return null;

  const handleBuyNow = () => {
    const qtyNum = parseFloat(buyQuantity);
    const availableQty = parseFloat(product.available);
    if (!qtyNum || qtyNum <= 0) {
      Alert.alert("Invalid Quantity", "Enter a valid quantity to buy.");
      return;
    }
    if (availableQty && qtyNum > availableQty) {
      Alert.alert(
        "Quantity Exceeded",
        `Available quantity is only ${product.available}`
      );
      return;
    }
    Alert.alert(
      "Purchase Successful",
      `You bought ${qtyNum} ${product.price.split("/")[1] || "units"} of ${product.name} for ₹${totalPrice.toFixed(
        2
      )}`
    );
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.heading}>Order Crop</Text>

            {/* Crop Image */}
            <View style={styles.imageWrapper}>
              {product.icon && (product.icon.startsWith("http") || product.icon.startsWith("file://")) ? (
                <Image source={{ uri: product.icon }} style={styles.cropImage} />
              ) : (
                <View style={styles.placeholderIcon}>
                  <Text style={{ fontSize: 40, color: "#888" }}>🌱</Text>
                </View>
              )}
            </View>

            {/* Crop Name */}
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{product.name}</Text>

            {/* Category */}
            <Text style={styles.label}>Category</Text>
            <Text style={styles.value}>{product.category}</Text>

            {/* Available Quantity */}
            <Text style={styles.label}>Available Quantity</Text>
            <Text style={styles.value}>{product.available}</Text>

            {/* Price per Unit */}
            <Text style={styles.label}>Price Per Unit</Text>
            <Text style={styles.value}>{product.price}</Text>

            {/* Buy Quantity */}
            <Text style={styles.label}>Buy Quantity</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Enter quantity to buy"
              value={buyQuantity}
              onChangeText={(text) => {
                if (/^\d*\.?\d*$/.test(text)) {
                  setBuyQuantity(text);
                }
              }}
            />

            {/* Total Price */}
            <Text style={styles.label}>Total Price</Text>
            <Text style={[styles.value, { fontWeight: "bold" }]}>₹{totalPrice.toFixed(2)}</Text>

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.buyBtn]} onPress={handleBuyNow}>
                <Text style={styles.buyText}>Buy Now</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#00000090",
    justifyContent: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    maxHeight: "90%",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  imageWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  cropImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  placeholderIcon: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 4,
    fontSize: 16,
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 14 : 8,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: "#fafafa",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 24,
    justifyContent: "space-between",
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#ccc",
    marginRight: 10,
  },
  cancelText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
  },
  buyBtn: {
    backgroundColor: "#4CAF50",
  },
  buyText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
