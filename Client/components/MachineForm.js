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
const durationOptions = ["hour", "day", "week"];

export default function MachineForm({ visible, onClose, onSubmit }) {
  const [toolName, setToolName] = useState("");
  const [category, setCategory] = useState("Tractor");
  const [rentalPrice, setRentalPrice] = useState("");
  const [duration, setDuration] = useState("hour");
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
      setDuration("hour");
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
    if (!result.cancelled) {
      setImage(result.uri);
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
    if (!result.cancelled) {
      setImage(result.uri);
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
      duration,
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

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <ScrollView keyboardShouldPersistTaps="handled">
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
              >
                {categoryOptions.map((cat) => (
                  <Picker.Item label={cat} value={cat} key={cat} />
                ))}
              </Picker>
            </View>

            {/* Rental Price */}
            <Text style={styles.label}>Rental Price</Text>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, { flex: 2, marginRight: 8 }]}
                placeholder="₹500"
                keyboardType="numeric"
                value={rentalPrice}
                onChangeText={setRentalPrice}
              />
              <View style={[styles.pickerWrapper, { flex: 1 }]}>
                <Picker
                  selectedValue={duration}
                  onValueChange={setDuration}
                  style={styles.picker}
                  mode="dropdown"
                >
                  {durationOptions.map((dur) => (
                    <Picker.Item label={dur} value={dur} key={dur} />
                  ))}
                </Picker>
              </View>
            </View>

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

            {/* Upload Image */}
            <Text style={styles.label}>Upload Images</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={{ width: 70, height: 70, borderRadius: 8, marginRight: 10 }}
                />
              ) : (
                <View style={styles.placeholderIcon}>
                  <FontAwesome5 name="tools" size={32} color="#888" />
                </View>
              )}
              <View style={{ flexDirection: "column" }}>
                <TouchableOpacity
                  style={[styles.uploadBtn, { marginBottom: 6 }]}
                  onPress={pickImage}
                >
                  <Text style={styles.uploadBtnText}>Choose Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.uploadBtn} onPress={takePhoto}>
                  <Text style={styles.uploadBtnText}>Take Photo</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Rental Terms */}
            <Text style={styles.label}>Rental Terms</Text>
            <TextInput
              style={[styles.input, { height: 80, marginTop: 4 }]}
              placeholder="Deposit, late fee, etc."
              multiline
              value={description}
              onChangeText={setDescription}
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
    backgroundColor: "#00000090",
    justifyContent: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    maxHeight: "90%",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    marginTop: 12,
    marginBottom: 6,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 14 : 8,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fafafa",
  },
  picker: {
    height: 40,
    color: "#222",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  checkbox: {
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#444",
  },
  uploadBtn: {
    marginTop: 6,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  uploadBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 24,
    justifyContent: "space-between",
  },
  btn: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#ccc",
    marginRight: 12,
  },
  cancelText: {
    color: "#333",
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
  placeholderIcon: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
});
