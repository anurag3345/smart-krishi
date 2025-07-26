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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Checkbox from "expo-checkbox";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome5 } from "@expo/vector-icons";

const categoryOptions = ["Tractor", "Tiller", "Harvester"];

export default function MachineForm({ visible, onClose, onSubmit }) {
  const [toolName, setToolName] = useState("");
  const [category, setCategory] = useState("Tractor");
  const [rentalPrice, setRentalPrice] = useState("");
  const [availabilityFrom, setAvailabilityFrom] = useState("");
  const [availabilityTo, setAvailabilityTo] = useState("");
  const [location, setLocation] = useState("");
  const [pickup, setPickup] = useState(false);
  const [delivery, setDelivery] = useState(false);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!visible) {
      setToolName("");
      setCategory("Tractor");
      setRentalPrice("");
      setAvailabilityFrom("");
      setAvailabilityTo("");
      setLocation("");
      setPickup(false);
      setDelivery(false);
      setDescription("");
      setImage(null);
    }
  }, [visible]);

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

  const handleSubmit = () => {
    if (!toolName.trim()) {
      Alert.alert("Validation", "Please enter tool name");
      return;
    }
    if (!rentalPrice || isNaN(Number(rentalPrice))) {
      Alert.alert("Validation", "Enter valid rental price");
      return;
    }
    if (!availabilityFrom.trim()) {
      Alert.alert("Validation", "Please enter availability start date");
      return;
    }
    if (!availabilityTo.trim()) {
      Alert.alert("Validation", "Please enter availability end date");
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

    const formData = {
      toolName,
      category,
      rentalPrice,
      duration: "hour", // Fixed to hour as requested
      availabilityFrom,
      availabilityTo,
      location,
      pickup,
      delivery,
      description,
      imageUri: image,
    };

    onSubmit(formData);
    onClose();
  };

  const removeImage = () => {
    setImage(null);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Text style={styles.heading}>List Your Machine</Text>

            {/* Tool Name */}
            <Text style={styles.label}>Tool Name</Text>
            <TextInput
              style={styles.input}
              placeholder='e.g., "Power Tiller"'
              value={toolName}
              onChangeText={setToolName}
              autoCorrect={false}
            />

            {/* Category */}
            <Text style={styles.label}>Category</Text>
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

            {/* Rental Price - Removed duration picker, fixed to hour */}
            <Text style={styles.label}>Rental Price (per hour)</Text>
            <TextInput
              style={styles.input}
              placeholder="₹500"
              keyboardType="numeric"
              value={rentalPrice}
              onChangeText={setRentalPrice}
            />

            {/* Availability From */}
            <Text style={styles.label}>Availability From</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={availabilityFrom}
              onChangeText={setAvailabilityFrom}
            />

            {/* Availability To */}
            <Text style={styles.label}>Availability To</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={availabilityTo}
              onChangeText={setAvailabilityTo}
            />

            {/* Location */}
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Where the tool is available"
              value={location}
              onChangeText={setLocation}
            />

            {/* Pickup/Delivery Options */}
            <Text style={styles.label}>Pickup/Delivery Options</Text>
            <View style={styles.checkboxRow}>
              <Checkbox value={pickup} onValueChange={setPickup} style={styles.checkbox} />
              <Text style={styles.checkboxLabel}>Pickup</Text>
            </View>
            <View style={styles.checkboxRow}>
              <Checkbox value={delivery} onValueChange={setDelivery} style={styles.checkbox} />
              <Text style={styles.checkboxLabel}>Delivery</Text>
            </View>

            {/* Upload Image - Improved Design */}
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

            {/* Improved Photo Buttons */}
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

            {/* Rental Terms */}
            <Text style={styles.label}>Rental Terms</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Deposit, late fee, etc."
              multiline
              value={description}
              onChangeText={setDescription}
              textAlignVertical="top"
            />

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.btn, styles.cancelBtn]}
                onPress={onClose}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.submitBtn]}
                onPress={handleSubmit}
              >
                <Text style={styles.submitText}>Submit</Text>
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
    backgroundColor: "#00000080",
    justifyContent: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    maxHeight: "90%",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#2E7D32",
  },
  label: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: "600",
    color: "#333",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 16 : 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
  },
  picker: {
    height: Platform.OS === "ios" ? 200 : 50,
    color: "#222",
  },
  pickerItem: {
    fontSize: 16,
    color: "#222",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  checkbox: {
    marginRight: 12,
    borderRadius: 4,
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#444",
  },
  imageContainer: {
    position: "relative",
    alignSelf: "flex-start",
    marginVertical: 12,
  },
  selectedImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
  },
  removeImageBtn: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#f44336",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  placeholderContainer: {
    marginVertical: 12,
  },
  placeholderIcon: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    borderWidth: 2,
    borderColor: "#ddd",
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
  photoButtonsContainer: {
    flexDirection: "row",
    marginTop: 12,
    marginBottom: 8,
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
    borderRadius: 10,
    paddingVertical: 12,
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
  buttonRow: {
    flexDirection: "row",
    marginTop: 28,
    gap: 12,
  },
  btn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cancelBtn: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 16,
  },
  submitBtn: {
    backgroundColor: "#4CAF50",
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});