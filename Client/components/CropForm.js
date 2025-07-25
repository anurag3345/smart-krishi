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
  Image,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Checkbox from "expo-checkbox";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome5 } from "@expo/vector-icons";

const categoryOptions = ["Vegetables", "Fruits", "Grains"];
const unitOptions = ["kg", "ton"];

export default function CropForm({ visible, onClose, onSubmit }) {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("Vegetables");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [location, setLocation] = useState("");
  const [deliveryHome, setDeliveryHome] = useState(false);
  const [deliveryPickup, setDeliveryPickup] = useState(false);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!visible) {
      setProductName("");
      setCategory("Vegetables");
      setQuantity("");
      setUnit("kg");
      setPricePerUnit("");
      setLocation("");
      setDeliveryHome(false);
      setDeliveryPickup(false);
      setDescription("");
      setImage(null);
    }
  }, [visible]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "You need to grant gallery permissions to select images.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
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
      Alert.alert("Permission Denied", "You need to grant camera permissions to take photos.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const handleSubmit = () => {
    if (!productName.trim()) {
      Alert.alert("Validation", "Please enter product name");
      return;
    }
    const quantityNum = Number(quantity);
    if (!quantity || isNaN(quantityNum) || quantityNum <= 20) {
      Alert.alert("Validation", "Quantity must be a number greater than 20");
      return;
    }
    if (!pricePerUnit || isNaN(Number(pricePerUnit))) {
      Alert.alert("Validation", "Please enter valid price per unit");
      return;
    }
    if (!location.trim()) {
      Alert.alert("Validation", "Please enter location");
      return;
    }

    const formData = {
      productName,
      category,
      quantity,
      unit,
      pricePerUnit,
      location,
      deliveryHome,
      deliveryPickup,
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
            <Text style={styles.heading}>List Your Product</Text>

            {/* Product Name */}
            <Text style={styles.label}>Product Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Tomatoes"
              value={productName}
              onChangeText={setProductName}
              autoCorrect={false}
            />

            {/* Category */}
            <Text style={styles.label}>Category</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={category}
                onValueChange={(val) => setCategory(val)}
                style={styles.picker}
                itemStyle={{ color: "#000", fontSize: 16 }}
                mode="dropdown"
              >
                {categoryOptions.map((cat) => (
                  <Picker.Item label={cat} value={cat} key={cat} />
                ))}
              </Picker>
            </View>

            {/* Quantity and Unit */}
            <Text style={styles.label}>Quantity Available</Text>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, { flex: 2, marginRight: 8 }]}
                placeholder="100"
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
              />
              <View style={[styles.pickerWrapper, { flex: 1 }]}>
                <Picker
                  selectedValue={unit}
                  onValueChange={(val) => setUnit(val)}
                  style={styles.picker}
                  itemStyle={{ color: "#000", fontSize: 16 }}
                  mode="dropdown"
                >
                  {unitOptions.map((unitOpt) => (
                    <Picker.Item label={unitOpt} value={unitOpt} key={unitOpt} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Price Per Unit */}
            <Text style={styles.label}>Price Per Unit (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="20"
              keyboardType="numeric"
              value={pricePerUnit}
              onChangeText={setPricePerUnit}
            />

            {/* Location */}
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Delivery or pickup location"
              value={location}
              onChangeText={setLocation}
            />

            {/* Delivery Options */}
            <Text style={styles.label}>Delivery Options</Text>
            <View style={styles.checkboxRow}>
              <Checkbox value={deliveryHome} onValueChange={setDeliveryHome} style={styles.checkbox} />
              <Text style={styles.checkboxLabel}>Home Delivery</Text>
            </View>
            <View style={styles.checkboxRow}>
              <Checkbox value={deliveryPickup} onValueChange={setDeliveryPickup} style={styles.checkbox} />
              <Text style={styles.checkboxLabel}>Pickup</Text>
            </View>

            {/* Upload Image */}
            <Text style={styles.label}>Upload Image</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {image ? (
                <Image source={{ uri: image }} style={{ width: 70, height: 70, borderRadius: 8, marginRight: 10 }} />
              ) : (
                <View style={styles.placeholderIcon}>
                  <FontAwesome5 name="seedling" size={32} color="#888" />
                </View>
              )}
              <View style={{ flexDirection: "column" }}>
                <TouchableOpacity style={[styles.uploadBtn, { marginBottom: 6 }]} onPress={pickImage}>
                  <Text style={styles.uploadBtnText}>Choose Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.uploadBtn} onPress={takePhoto}>
                  <Text style={styles.uploadBtnText}>Take Photo</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Description */}
            <Text style={styles.label}>Description (optional)</Text>
            <TextInput
              style={[styles.input, { height: 80, marginTop: 4 }]}
              placeholder="Optional details like freshness, organic, etc."
              multiline
              value={description}
              onChangeText={setDescription}
            />

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.submitBtn]} onPress={handleSubmit}>
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
  backgroundColor: "#fafafa",
  marginBottom: 8,
},

picker: {
  height: 55,
  width: "100%",
  color: "#000",
  marginTop: Platform.OS === "android" ? -8 : 0, // fixes Android alignment
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
