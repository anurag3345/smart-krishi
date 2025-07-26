import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function OrderProduct({ visible, onClose, product, onOrderSuccess }) {
  const [quantity, setQuantity] = useState("1");
  const [deliveryOption, setDeliveryOption] = useState("pickup"); // 'pickup' or 'delivery'
  const [notes, setNotes] = useState("");

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      setQuantity("1");
      setDeliveryOption("pickup");
      setNotes("");
    }
  }, [visible]);

  if (!product) return null;

  const basePrice = parseFloat(product.price.replace(/[₹\/kg]/g, ""));
  const totalPrice = basePrice * parseFloat(quantity || 0);
  const maxQuantity = product.available;

  const handleQuantityChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    if (numericValue === "" || (parseInt(numericValue) <= maxQuantity && parseInt(numericValue) > 0)) {
      setQuantity(numericValue);
    }
  };

  const incrementQuantity = () => {
    const currentQty = parseInt(quantity || 0);
    if (currentQty < maxQuantity) {
      setQuantity(String(currentQty + 1));
    }
  };

  const decrementQuantity = () => {
    const currentQty = parseInt(quantity || 0);
    if (currentQty > 1) {
      setQuantity(String(currentQty - 1));
    }
  };

  const handleOrderConfirm = () => {
    const orderQuantity = parseInt(quantity);
    
    if (!orderQuantity || orderQuantity <= 0) {
      Alert.alert("Error", "Please enter a valid quantity");
      return;
    }

    if (orderQuantity > maxQuantity) {
      Alert.alert("Error", `Only ${maxQuantity}${product.unit} available`);
      return;
    }

    Alert.alert(
      "Confirm Order",
      `Order ${orderQuantity}${product.unit} of ${product.name} for ₹${totalPrice.toFixed(2)}?\n\nDelivery: ${deliveryOption === 'pickup' ? 'Self Pickup' : 'Home Delivery'}`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Confirm",
          onPress: () => {
            onOrderSuccess(product.id, orderQuantity);
            Alert.alert(
              "Order Placed!", 
              `Your order for ${orderQuantity}${product.unit} of ${product.name} has been placed successfully.${deliveryOption === 'delivery' ? '\n\nDelivery will be arranged within 24 hours.' : '\n\nPlease collect from the farm location.'}`
            );
          }
        }
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header with Close Button */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Order Fresh Produce</Text>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={onClose}
            >
              <FontAwesome5 name="times" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Product Info */}
            <View style={styles.productSection}>
              <View style={styles.productIconContainer}>
                <FontAwesome5 
                  name={product.icon || "seedling"} 
                  size={28} 
                  color="#4CAF50" 
                />
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productDesc}>{product.desc}</Text>
                <Text style={styles.productPrice}>{product.price}</Text>
                <Text style={styles.availableStock}>
                  {maxQuantity}{product.unit} available
                </Text>
              </View>
            </View>

            {/* Quantity Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quantity</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity 
                  style={[styles.quantityButton, parseInt(quantity) <= 1 && styles.quantityButtonDisabled]}
                  onPress={decrementQuantity}
                  disabled={parseInt(quantity) <= 1}
                >
                  <FontAwesome5 name="minus" size={16} color={parseInt(quantity) <= 1 ? "#ccc" : "#666"} />
                </TouchableOpacity>
                
                <TextInput
                  style={styles.quantityInput}
                  value={quantity}
                  onChangeText={handleQuantityChange}
                  keyboardType="numeric"
                  textAlign="center"
                  maxLength={3}
                />
                <Text style={styles.unitText}>{product.unit}</Text>
                
                <TouchableOpacity 
                  style={[styles.quantityButton, parseInt(quantity) >= maxQuantity && styles.quantityButtonDisabled]}
                  onPress={incrementQuantity}
                  disabled={parseInt(quantity) >= maxQuantity}
                >
                  <FontAwesome5 name="plus" size={16} color={parseInt(quantity) >= maxQuantity ? "#ccc" : "#666"} />
                </TouchableOpacity>
              </View>
              {parseInt(quantity) >= maxQuantity && (
                <Text style={styles.maxQuantityText}>Maximum available quantity selected</Text>
              )}
            </View>

            {/* Delivery Options */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Delivery Option</Text>
              
              <TouchableOpacity
                style={[
                  styles.deliveryOption,
                  deliveryOption === "pickup" && styles.deliveryOptionSelected
                ]}
                onPress={() => setDeliveryOption("pickup")}
              >
                <View style={styles.deliveryOptionContent}>
                  <FontAwesome5 
                    name="store" 
                    size={20} 
                    color={deliveryOption === "pickup" ? "#4CAF50" : "#666"} 
                  />
                  <View style={styles.deliveryOptionText}>
                    <Text style={[
                      styles.deliveryOptionTitle,
                      deliveryOption === "pickup" && styles.deliveryOptionTitleSelected
                    ]}>
                      Self Pickup
                    </Text>
                    <Text style={styles.deliveryOptionDesc}>
                      Pick up from farm location • Free
                    </Text>
                  </View>
                </View>
                <View style={[
                  styles.radioButton,
                  deliveryOption === "pickup" && styles.radioButtonSelected
                ]}>
                  {deliveryOption === "pickup" && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.deliveryOption,
                  deliveryOption === "delivery" && styles.deliveryOptionSelected
                ]}
                onPress={() => setDeliveryOption("delivery")}
              >
                <View style={styles.deliveryOptionContent}>
                  <FontAwesome5 
                    name="truck" 
                    size={20} 
                    color={deliveryOption === "delivery" ? "#4CAF50" : "#666"} 
                  />
                  <View style={styles.deliveryOptionText}>
                    <Text style={[
                      styles.deliveryOptionTitle,
                      deliveryOption === "delivery" && styles.deliveryOptionTitleSelected
                    ]}>
                      Home Delivery
                    </Text>
                    <Text style={styles.deliveryOptionDesc}>
                      Delivered to your doorstep • ₹50 delivery charge
                    </Text>
                  </View>
                </View>
                <View style={[
                  styles.radioButton,
                  deliveryOption === "delivery" && styles.radioButtonSelected
                ]}>
                  {deliveryOption === "delivery" && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {/* Special Notes */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Special Instructions (Optional)</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="Any specific requirements or notes..."
                placeholderTextColor="#999"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Order Summary */}
            <View style={styles.summarySection}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{product.name} ({quantity}{product.unit})</Text>
                <Text style={styles.summaryValue}>₹{(basePrice * parseFloat(quantity || 0)).toFixed(2)}</Text>
              </View>
              {deliveryOption === "delivery" && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Delivery Charge</Text>
                  <Text style={styles.summaryValue}>₹50.00</Text>
                </View>
              )}
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryTotalLabel}>Total Amount</Text>
                <Text style={styles.summaryTotalValue}>
                  ₹{(totalPrice + (deliveryOption === "delivery" ? 50 : 0)).toFixed(2)}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Footer with Action Buttons */}
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.confirmButton,
                (!quantity || parseInt(quantity) <= 0) && styles.confirmButtonDisabled
              ]}
              onPress={handleOrderConfirm}
              disabled={!quantity || parseInt(quantity) <= 0}
            >
              <FontAwesome5 name="shopping-cart" size={16} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.confirmButtonText}>
                Place Order
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    minHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  productSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  productIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  productDesc: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4CAF50",
    marginBottom: 4,
  },
  availableStock: {
    fontSize: 13,
    color: "#999",
  },
  section: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 8,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  quantityButtonDisabled: {
    backgroundColor: "#f0f0f0",
  },
  quantityInput: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginHorizontal: 20,
    minWidth: 60,
    textAlign: "center",
  },
  unitText: {
    fontSize: 16,
    color: "#666",
    marginRight: 20,
  },
  maxQuantityText: {
    fontSize: 12,
    color: "#ff9800",
    textAlign: "center",
    marginTop: 8,
  },
  deliveryOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  deliveryOptionSelected: {
    backgroundColor: "#e8f5e8",
    borderColor: "#4CAF50",
  },
  deliveryOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  deliveryOptionText: {
    marginLeft: 16,
    flex: 1,
  },
  deliveryOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  deliveryOptionTitleSelected: {
    color: "#4CAF50",
  },
  deliveryOptionDesc: {
    fontSize: 14,
    color: "#666",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonSelected: {
    borderColor: "#4CAF50",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
  },
  notesInput: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#333",
    minHeight: 80,
    textAlignVertical: "top",
  },
  summarySection: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 8,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  modalFooter: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  confirmButton: {
    flex: 2,
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginLeft: 10,
  },
  confirmButtonDisabled: {
    backgroundColor: "#ccc",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});