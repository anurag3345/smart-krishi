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
  Platform,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function RentProduct({ visible, onClose, machine, onRentSuccess }) {
  const [duration, setDuration] = useState("1");
  const [deliveryOption, setDeliveryOption] = useState("pickup"); // 'pickup' or 'delivery'
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notes, setNotes] = useState("");

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      setDuration("1");
      setDeliveryOption("pickup");
      setStartDate(new Date());
      setStartTime(new Date());
      setNotes("");
    }
  }, [visible]);

  if (!machine) return null;

  const basePrice = parseFloat(machine.price.replace(/[₹\/hr]/g, ""));
  const totalPrice = basePrice * parseFloat(duration || 0);
  const maxDuration = machine.available;

  const handleDurationChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    if (numericValue === "" || (parseInt(numericValue) <= maxDuration && parseInt(numericValue) > 0)) {
      setDuration(numericValue);
    }
  };

  const incrementDuration = () => {
    const currentDuration = parseInt(duration || 0);
    if (currentDuration < maxDuration) {
      setDuration(String(currentDuration + 1));
    }
  };

  const decrementDuration = () => {
    const currentDuration = parseInt(duration || 0);
    if (currentDuration > 1) {
      setDuration(String(currentDuration - 1));
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  const formatTime = (time) => {
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowDatePicker(Platform.OS === 'ios');
    setStartDate(currentDate);
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || startTime;
    setShowTimePicker(Platform.OS === 'ios');
    setStartTime(currentTime);
  };

  const handleRentConfirm = () => {
    const rentDuration = parseInt(duration);
    
    if (!rentDuration || rentDuration <= 0) {
      Alert.alert("Error", "Please enter a valid duration");
      return;
    }

    if (rentDuration > maxDuration) {
      Alert.alert("Error", `Only ${maxDuration} ${machine.unit} available`);
      return;
    }

    const deliveryCharge = deliveryOption === 'delivery' ? 200 : 0;
    const totalAmount = totalPrice + deliveryCharge;

    Alert.alert(
      "Confirm Rental",
      `Rent ${machine.name} for ${rentDuration} ${machine.unit} at ₹${totalAmount.toFixed(2)}?\n\nStart: ${formatDate(startDate)} at ${formatTime(startTime)}\nService: ${deliveryOption === 'pickup' ? 'Self Pickup' : 'Equipment Delivery'}`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Confirm",
          onPress: () => {
            onRentSuccess(machine.id, rentDuration);
            Alert.alert(
              "Rental Confirmed!", 
              `Your rental for ${machine.name} has been confirmed for ${rentDuration} ${machine.unit}.${deliveryOption === 'delivery' ? '\n\nEquipment will be delivered to your location.' : '\n\nPlease collect from the specified location.'}\n\nRental starts: ${formatDate(startDate)} at ${formatTime(startTime)}`
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
            <Text style={styles.modalTitle}>Rent Agricultural Equipment</Text>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={onClose}
            >
              <FontAwesome5 name="times" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Equipment Info */}
            <View style={styles.productSection}>
              <View style={styles.productIconContainer}>
                <FontAwesome5 
                  name={machine.icon || "tools"} 
                  size={28} 
                  color="#3b82f6" 
                />
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{machine.name}</Text>
                <Text style={styles.productDesc}>{machine.desc}</Text>
                <Text style={styles.productPrice}>{machine.price}</Text>
                <Text style={styles.availableStock}>
                  {maxDuration}{machine.unit} available • {machine.maxHours}
                </Text>
              </View>
            </View>

            {/* Equipment Specifications */}
            {machine.specifications && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Specifications</Text>
                <View style={styles.specsContainer}>
                  {Object.entries(machine.specifications).map(([key, value]) => (
                    <View key={key} style={styles.specRow}>
                      <Text style={styles.specLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
                      <Text style={styles.specValue}>{value}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Duration Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Rental Duration</Text>
              <View style={styles.durationContainer}>
                <TouchableOpacity 
                  style={[styles.durationButton, parseInt(duration) <= 1 && styles.durationButtonDisabled]}
                  onPress={decrementDuration}
                  disabled={parseInt(duration) <= 1}
                >
                  <FontAwesome5 name="minus" size={16} color={parseInt(duration) <= 1 ? "#cbd5e1" : "#64748b"} />
                </TouchableOpacity>
                
                <TextInput
                  style={styles.durationInput}
                  value={duration}
                  onChangeText={handleDurationChange}
                  keyboardType="numeric"
                  textAlign="center"
                  maxLength={2}
                />
                <Text style={styles.unitText}>{machine.unit}</Text>
                
                <TouchableOpacity 
                  style={[styles.durationButton, parseInt(duration) >= maxDuration && styles.durationButtonDisabled]}
                  onPress={incrementDuration}
                  disabled={parseInt(duration) >= maxDuration}
                >
                  <FontAwesome5 name="plus" size={16} color={parseInt(duration) >= maxDuration ? "#cbd5e1" : "#64748b"} />
                </TouchableOpacity>
              </View>
              {parseInt(duration) >= maxDuration && (
                <Text style={styles.maxDurationText}>Maximum available duration selected</Text>
              )}
            </View>

            {/* Schedule Selection with Date Picker */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Rental Schedule</Text>
              <View style={styles.scheduleContainer}>
                <View style={styles.scheduleRow}>
                  <Text style={styles.scheduleLabel}>Start Date:</Text>
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <FontAwesome5 name="calendar-alt" size={16} color="#22c55e" style={{ marginRight: 8 }} />
                    <Text style={styles.datePickerText}>{formatDate(startDate)}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.scheduleRow}>
                  <Text style={styles.scheduleLabel}>Start Time:</Text>
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <FontAwesome5 name="clock" size={16} color="#22c55e" style={{ marginRight: 8 }} />
                    <Text style={styles.datePickerText}>{formatTime(startTime)}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={startDate}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onDateChange}
                  minimumDate={new Date()}
                />
              )}

              {showTimePicker && (
                <DateTimePicker
                  testID="timePicker"
                  value={startTime}
                  mode="time"
                  is24Hour={false}
                  display="default"
                  onChange={onTimeChange}
                />
              )}
            </View>

            {/* Service Options */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Service Option</Text>
              
              <TouchableOpacity
                style={[
                  styles.deliveryOption,
                  deliveryOption === "pickup" && styles.deliveryOptionSelected
                ]}
                onPress={() => setDeliveryOption("pickup")}
              >
                <View style={styles.deliveryOptionContent}>
                  <FontAwesome5 
                    name="warehouse" 
                    size={20} 
                    color={deliveryOption === "pickup" ? "#22c55e" : "#64748b"} 
                  />
                  <View style={styles.deliveryOptionText}>
                    <Text style={[
                      styles.deliveryOptionTitle,
                      deliveryOption === "pickup" && styles.deliveryOptionTitleSelected
                    ]}>
                      Self Pickup
                    </Text>
                    <Text style={styles.deliveryOptionDesc}>
                      Pick up equipment from location • Free
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
                    color={deliveryOption === "delivery" ? "#22c55e" : "#64748b"} 
                  />
                  <View style={styles.deliveryOptionText}>
                    <Text style={[
                      styles.deliveryOptionTitle,
                      deliveryOption === "delivery" && styles.deliveryOptionTitleSelected
                    ]}>
                      Equipment Delivery
                    </Text>
                    <Text style={styles.deliveryOptionDesc}>
                      Equipment delivered to your farm • ₹200 delivery charge
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
              <Text style={styles.sectionTitle}>Special Requirements (Optional)</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="Any specific requirements, operator needed, fuel arrangements..."
                placeholderTextColor="#94a3b8"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Rental Summary */}
            <View style={styles.summarySection}>
              <Text style={styles.summaryTitle}>Rental Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{machine.name} ({duration}{machine.unit})</Text>
                <Text style={styles.summaryValue}>₹{(basePrice * parseFloat(duration || 0)).toFixed(2)}</Text>
              </View>
              {deliveryOption === "delivery" && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Delivery & Setup</Text>
                  <Text style={styles.summaryValue}>₹200.00</Text>
                </View>
              )}
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryTotalLabel}>Total Amount</Text>
                <Text style={styles.summaryTotalValue}>
                  ₹{(totalPrice + (deliveryOption === "delivery" ? 200 : 0)).toFixed(2)}
                </Text>
              </View>
              <Text style={styles.summaryNote}>
                * Security deposit may be required at pickup/delivery
              </Text>
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
                (!duration || parseInt(duration) <= 0) && styles.confirmButtonDisabled
              ]}
              onPress={handleRentConfirm}
              disabled={!duration || parseInt(duration) <= 0}
            >
              <FontAwesome5 name="calendar-check" size={16} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.confirmButtonText}>
                Confirm Rental
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
    minHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    flex: 1,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f1f5f9",
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
    borderBottomColor: "#e2e8f0",
  },
  productIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#dcfce7",
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
    color: "#1e293b",
    marginBottom: 4,
  },
  productDesc: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#22c55e",
    marginBottom: 4,
  },
  availableStock: {
    fontSize: 13,
    color: "#94a3b8",
  },
  section: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 16,
  },
  specsContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  specLabel: {
    fontSize: 14,
    color: "#64748b",
    flex: 1,
  },
  specValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    flex: 1,
    textAlign: "right",
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 8,
  },
  durationButton: {
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
  durationButtonDisabled: {
    backgroundColor: "#f1f5f9",
  },
  durationInput: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginHorizontal: 20,
    minWidth: 60,
    textAlign: "center",
  },
  unitText: {
    fontSize: 16,
    color: "#64748b",
    marginRight: 20,
  },
  maxDurationText: {
    fontSize: 12,
    color: "#22c55e",
    textAlign: "center",
    marginTop: 8,
  },
  scheduleContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
  },
  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  scheduleLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    width: 100,
  },
  datePickerButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  datePickerText: {
    fontSize: 14,
    color: "#1e293b",
    fontWeight: "500",
  },
  deliveryOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  deliveryOptionSelected: {
    backgroundColor: "#dcfce7",
    borderColor: "#22c55e",
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
    color: "#1e293b",
    marginBottom: 4,
  },
  deliveryOptionTitleSelected: {
    color: "#22c55e",
  },
  deliveryOptionDesc: {
    fontSize: 14,
    color: "#64748b",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonSelected: {
    borderColor: "#22c55e",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#22c55e",
  },
  notesInput: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1e293b",
    minHeight: 80,
    textAlignVertical: "top",
  },
  summarySection: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
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
    color: "#64748b",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1e293b",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#cbd5e1",
    marginVertical: 8,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#22c55e",
  },
  summaryNote: {
    fontSize: 12,
    color: "#94a3b8",
    fontStyle: "italic",
    marginTop: 8,
    textAlign: "center",
  },
  modalFooter: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    backgroundColor: "#fff",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748b",
  },
  confirmButton: {
    flex: 2,
    backgroundColor: "#22c55e",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginLeft: 10,
  },
  confirmButtonDisabled: {
    backgroundColor: "#cbd5e1",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});