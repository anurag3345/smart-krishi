import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Checkbox from "expo-checkbox";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome5 } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';

const categoryOptions = ["Tractor", "Tiller", "Harvester"];
const { width: screenWidth } = Dimensions.get('window');

// Toast Component
const Toast = ({ visible, message, onHide }) => {
  const slideAnim = useState(new Animated.Value(-300))[0];

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(slideAnim, {
          toValue: -300,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide();
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.toast}>
        <FontAwesome5 name="check-circle" size={20} color="#4CAF50" />
        <Text style={styles.toastText}>{message}</Text>
      </View>
    </Animated.View>
  );
};

export default function MachineForm({ visible, onClose, onSubmit }) {
  const [toolName, setToolName] = useState("");
  const [category, setCategory] = useState("Tractor");
  const [rentalPrice, setRentalPrice] = useState("");
  const [availabilityFrom, setAvailabilityFrom] = useState(new Date());
  const [availabilityTo, setAvailabilityTo] = useState(new Date());
  const [location, setLocation] = useState("");
  const [pickup, setPickup] = useState(false);
  const [delivery, setDelivery] = useState(false);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);

  useEffect(() => {
    if (!visible) {
      setToolName("");
      setCategory("Tractor");
      setRentalPrice("");
      setAvailabilityFrom(new Date());
      setAvailabilityTo(new Date());
      setLocation("");
      setPickup(false);
      setDelivery(false);
      setDescription("");
      setImage(null);
      setIsSubmitting(false);
    }
  }, [visible]);

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handleFromDateChange = (event, selectedDate) => {
    setShowFromDatePicker(false);
    if (selectedDate) {
      setAvailabilityFrom(selectedDate);
      // Ensure 'to' date is not before 'from' date
      if (selectedDate > availabilityTo) {
        setAvailabilityTo(selectedDate);
      }
    }
  };

  const handleToDateChange = (event, selectedDate) => {
    setShowToDatePicker(false);
    if (selectedDate) {
      // Ensure 'to' date is not before 'from' date
      if (selectedDate >= availabilityFrom) {
        setAvailabilityTo(selectedDate);
      } else {
        Alert.alert("Invalid Date", "End date cannot be before start date");
      }
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "You need to grant gallery permissions to select images."
      );
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.cancelled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "You need to grant camera permissions to take photos."
      );
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });
    if (!result.cancelled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!toolName.trim()) {
      Alert.alert("Validation", "Please enter tool name");
      return;
    }
    if (!rentalPrice || isNaN(Number(rentalPrice))) {
      Alert.alert("Validation", "Enter valid rental price");
      return;
    }
    if (!availabilityFrom) {
      Alert.alert("Validation", "Please select availability start date");
      return;
    }
    if (!availabilityTo) {
      Alert.alert("Validation", "Please select availability end date");
      return;
    }
    if (!location.trim()) {
      Alert.alert("Validation", "Please enter location");
      return;
    }
    if (!pickup && !delivery) {
      Alert.alert(
        "Validation",
        "Select at least one pickup/delivery option"
      );
      return;
    }

    setIsSubmitting(true);

    const formData = {
      toolName,
      category,
      rentalPrice,
      duration: "hour",
      availabilityFrom: formatDate(availabilityFrom),
      availabilityTo: formatDate(availabilityTo),
      location,
      pickup,
      delivery,
      description,
      imageUri: image,
    };

    try {
      await onSubmit(formData);
      setShowToast(true);
      
      // Close modal after a short delay to show the toast
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      Alert.alert("Error", "Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  return (
    <>
      <Toast
        visible={showToast}
        message="Machine listed successfully!"
        onHide={() => setShowToast(false)}
      />
      
      <Modal visible={visible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <ScrollView 
              keyboardShouldPersistTaps="handled" 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Header with improved design */}
              <View style={styles.header}>
                <View style={styles.headerIcon}>
                  <FontAwesome5 name="tractor" size={24} color="#4CAF50" />
                </View>
                <Text style={styles.heading}>List Your Machine</Text>
                <Text style={styles.subheading}>Share your agricultural equipment with others</Text>
              </View>

              {/* Tool Name */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Tool Name <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder='e.g., "Power Tiller"'
                  value={toolName}
                  onChangeText={setToolName}
                  autoCorrect={false}
                />
              </View>

              {/* Category */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Category <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={category}
                    onValueChange={setCategory}
                    style={styles.picker}
                    mode="dropdown"
                    itemStyle={styles.pickerItem}
                  >
                    {categoryOptions.map((cat) => (
                      <Picker.Item label={cat} value={cat} key={cat} />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Rental Price */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Rental Price (per hour) <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.priceInputContainer}>
                  <Text style={styles.currencySymbol}>₹</Text>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="500"
                    keyboardType="numeric"
                    value={rentalPrice}
                    onChangeText={setRentalPrice}
                  />
                </View>
              </View>

              {/* Availability Dates */}
              <View style={styles.dateRow}>
                <View style={[styles.inputContainer, styles.dateInput]}>
                  <Text style={styles.label}>
                    Available From <Text style={styles.required}>*</Text>
                  </Text>
                  <TouchableOpacity
                    style={styles.dateInputButton}
                    onPress={() => setShowFromDatePicker(true)}
                  >
                    <FontAwesome5 name="calendar-alt" size={16} color="#4CAF50" />
                    <Text style={styles.dateInputText}>
                      {formatDate(availabilityFrom)}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <View style={[styles.inputContainer, styles.dateInput]}>
                  <Text style={styles.label}>
                    Available To <Text style={styles.required}>*</Text>
                  </Text>
                  <TouchableOpacity
                    style={styles.dateInputButton}
                    onPress={() => setShowToDatePicker(true)}
                  >
                    <FontAwesome5 name="calendar-alt" size={16} color="#4CAF50" />
                    <Text style={styles.dateInputText}>
                      {formatDate(availabilityTo)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Date Pickers */}
              {showFromDatePicker && (
                <DateTimePicker
                  value={availabilityFrom}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleFromDateChange}
                  minimumDate={new Date()}
                />
              )}
              
              {showToDatePicker && (
                <DateTimePicker
                  value={availabilityTo}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleToDateChange}
                  minimumDate={availabilityFrom}
                />
              )}

              {/* Location */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Location <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Where the tool is available"
                  value={location}
                  onChangeText={setLocation}
                />
              </View>

              {/* Pickup/Delivery Options */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Pickup/Delivery Options <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.checkboxContainer}>
                  <TouchableOpacity 
                    style={[styles.checkboxCard, pickup && styles.checkboxCardActive]} 
                    onPress={() => setPickup(!pickup)}
                  >
                    <Checkbox value={pickup} onValueChange={setPickup} style={styles.checkbox} />
                    <View style={styles.checkboxContent}>
                      <FontAwesome5 name="hand-paper" size={16} color={pickup ? "#4CAF50" : "#888"} />
                      <Text style={[styles.checkboxLabel, pickup && styles.checkboxLabelActive]}>
                        Pickup Available
                      </Text>
                    </View>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.checkboxCard, delivery && styles.checkboxCardActive]} 
                    onPress={() => setDelivery(!delivery)}
                  >
                    <Checkbox value={delivery} onValueChange={setDelivery} style={styles.checkbox} />
                    <View style={styles.checkboxContent}>
                      <FontAwesome5 name="truck" size={16} color={delivery ? "#4CAF50" : "#888"} />
                      <Text style={[styles.checkboxLabel, delivery && styles.checkboxLabelActive]}>
                        Delivery Available
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Upload Image */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Upload Images</Text>
                {image ? (
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: image }} style={styles.selectedImage} />
                    <TouchableOpacity style={styles.removeImageBtn} onPress={removeImage}>
                      <FontAwesome5 name="times" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.placeholderContainer}>
                    <View style={styles.placeholderIcon}>
                      <FontAwesome5 name="tools" size={32} color="#888" />
                      <Text style={styles.placeholderText}>No image selected</Text>
                    </View>
                  </View>
                )}

                <View style={styles.photoButtonsContainer}>
                  <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                    <FontAwesome5 name="image" size={18} color="#4CAF50" style={styles.buttonIcon} />
                    <Text style={styles.photoButtonText}>Choose Photo</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
                    <FontAwesome5 name="camera" size={18} color="#4CAF50" style={styles.buttonIcon} />
                    <Text style={styles.photoButtonText}>Take Photo</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Rental Terms */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Rental Terms</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Deposit, late fee, maintenance requirements, etc."
                  multiline
                  value={description}
                  onChangeText={setDescription}
                  textAlignVertical="top"
                />
              </View>

              {/* Buttons */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.btn, styles.cancelBtn]}
                  onPress={onClose}
                  disabled={isSubmitting}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <View style={styles.loadingContainer}>
                      <Text style={styles.submitText}>Submitting...</Text>
                    </View>
                  ) : (
                    <>
                      <FontAwesome5 name="check" size={16} color="#fff" style={styles.buttonIcon} />
                      <Text style={styles.submitText}>List Machine</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // Toast Styles
  toastContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 9999,
  },
  toast: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    minWidth: 200,
  },
  toastText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#00000080",
    justifyContent: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    maxHeight: "90%",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  scrollContent: {
    padding: 24,
  },

  // Header Styles
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 8,
  },
  subheading: {
    fontSize: 14,
    color: "#666",
    textAlign: 'center',
  },

  // Input Styles
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: "600",
    color: "#333",
    fontSize: 16,
  },
  required: {
    color: '#f44336',
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 16 : 14,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
    color: "#333",
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },

  // Price Input Styles
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    backgroundColor: "#FAFAFA",
    paddingLeft: 16,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    paddingVertical: Platform.OS === "ios" ? 16 : 14,
    paddingRight: 16,
    fontSize: 16,
    color: "#333",
  },

  // Date Input Styles
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInput: {
    flex: 1,
  },
  dateInputButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 16 : 14,
    backgroundColor: "#FAFAFA",
  },
  dateInputText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
    flex: 1,
  },

  // Picker Styles
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#FAFAFA",
  },
  picker: {
    height: Platform.OS === "ios" ? 200 : 50,
    color: "#333",
  },
  pickerItem: {
    fontSize: 16,
    color: "#333",
  },

  // Checkbox Styles
  checkboxContainer: {
    gap: 12,
  },
  checkboxCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
  },
  checkboxCardActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E8',
  },
  checkbox: {
    marginRight: 12,
    borderRadius: 4,
  },
  checkboxContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
  },
  checkboxLabelActive: {
    color: "#2E7D32",
    fontWeight: '600',
  },

  // Image Styles
  imageContainer: {
    position: "relative",
    alignSelf: "flex-start",
    marginVertical: 12,
  },
  selectedImage: {
    width: 140,
    height: 140,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
  },
  removeImageBtn: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#f44336",
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  placeholderContainer: {
    marginVertical: 12,
  },
  placeholderIcon: {
    width: 140,
    height: 140,
    borderRadius: 16,
    backgroundColor: "#FAFAFA",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 12,
    color: "#888",
    textAlign: "center",
  },

  // Photo Button Styles
  photoButtonsContainer: {
    flexDirection: "row",
    marginTop: 16,
    gap: 12,
  },
  photoButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#4CAF50",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  photoButtonText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "600",
  },

  // Action Button Styles
  buttonRow: {
    flexDirection: "row",
    marginTop: 32,
    gap: 16,
  },
  btn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
  },
  cancelBtn: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  cancelText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 16,
  },
  submitBtn: {
    backgroundColor: "#4CAF50",
  },
  submitBtnDisabled: {
    backgroundColor: "#A5D6A7",
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});