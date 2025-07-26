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
import { listProduct } from '../services/product'; 
import Toast from 'react-native-toast-message';

const categoryOptions = ["Vegetables", "Fruits", "Grains"];

export default function CropForm({ visible, onClose, onSubmit }) {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("Vegetables");
  const [quantity, setQuantity] = useState("");
  const [unit] = useState("kg"); // Fixed unit as kg
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
      allowsEditing: true,
      aspect: [1, 1],
    });
    
    console.log("Image picker result:", result); // Debug log
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      console.log("Setting image URI:", imageUri); // Debug log
      setImage(imageUri);
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
      allowsEditing: true,
      aspect: [1, 1],
    });
    
    console.log("Camera result:", result); // Debug log
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      console.log("Setting camera image URI:", imageUri); // Debug log
      setImage(imageUri);
    }
  };

  const handleSubmit = async () => {
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

  // Prepare the form data
  const formData = {
    name: productName,
    type: category,
    quantity: quantity,
    unit: unit,
    price: pricePerUnit,
    location: location,
    delivery_home: deliveryHome,
    delivery_pickup: deliveryPickup,
    description: description,
    image_url: image,
    user_id: "some_user_id_here", // Replace with actual user_id
  };

  try {
    // Call the API function with the form data
    setLoading(true);
    await listProduct(formData);

    // Show success toast
    Toast.show({
      type: 'success',
      position: 'bottom',
      text1: 'Product Listed!',
      text2: 'Your product has been listed successfully.',
      visibilityTime: 4000,
      autoHide: true,
    });
  } catch (error) {
    // Show error toast
    Toast.show({
      type: 'error',
      position: 'bottom',
      text1: 'Error',
      text2: 'Something went wrong. Please try again.',
      visibilityTime: 4000,
      autoHide: true,
    });
  } finally {
    setLoading(false);
  }

  // Close the form after submitting
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

            {/* Quantity */}
            <Text style={styles.label}>Quantity Available (kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="100"
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
            />

            {/* Price Per Unit */}
            <Text style={styles.label}>Price Per Unit (₹/kg)</Text>
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
            {console.log("Current image state:", image)}
            {!image ? (
              <View style={styles.imageUploadContainer}>
                <View style={styles.uploadPlaceholder}>
                  <FontAwesome5 name="image" size={48} color="#bbb" />
                  <Text style={styles.placeholderText}>No image selected</Text>
                </View>
                <View style={styles.uploadButtonsRow}>
                  <TouchableOpacity style={[styles.uploadBtn, styles.choosePhotoBtn]} onPress={pickImage}>
                    <FontAwesome5 name="images" size={18} color="#fff" />
                    <Text style={styles.uploadBtnText}>Choose Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.uploadBtn, styles.takePhotoBtn]} onPress={takePhoto}>
                    <FontAwesome5 name="camera" size={18} color="#fff" />
                    <Text style={styles.uploadBtnText}>Take Photo</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.imagePreviewContainer}>
                <View style={styles.imageWrapper}>
                  <Image 
                    source={{ uri: image }} 
                    style={styles.previewImage}
                    onError={(error) => {
                      console.log("Image load error:", error);
                      Alert.alert("Error", "Failed to load image");
                    }}
                    onLoad={() => console.log("Image loaded successfully")}
                  />
                  <View style={styles.imageOverlay}>
                    <TouchableOpacity 
                      style={styles.overlayButton}
                      onPress={() => setImage(null)}
                    >
                      <FontAwesome5 name="times" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.imageActions}>
                  <TouchableOpacity style={[styles.uploadBtn, styles.changeImageBtn]} onPress={pickImage}>
                    <FontAwesome5 name="edit" size={16} color="#fff" />
                    <Text style={styles.uploadBtnText}>Change</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.uploadBtn, styles.removeImageBtn]} 
                    onPress={() => setImage(null)}
                  >
                    <FontAwesome5 name="trash" size={16} color="#fff" />
                    <Text style={styles.uploadBtnText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

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
    overflow: 'hidden', // Ensures content stays within borders
  },
  picker: {
    height: Platform.OS === "ios" ? 180 : 50,
    width: "100%",
    color: "#000",
    backgroundColor: "transparent",
  },
  unitPicker: {
    height: Platform.OS === "ios" ? 180 : 50,
    width: "100%",
    color: "#000",
    backgroundColor: "transparent",
    // Specific fixes for unit picker visibility
    ...(Platform.OS === "android" && {
      marginTop: -8,
      marginBottom: -8,
    }),
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    gap: 8,
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
  imageUploadContainer: {
    alignItems: "center",
    marginVertical: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: "#e9ecef",
    borderStyle: "dashed",
  },
  uploadPlaceholder: {
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 20,
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 16,
    color: "#6c757d",
    fontWeight: "500",
  },
  uploadButtonsRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    justifyContent: "center",
  },
  choosePhotoBtn: {
    backgroundColor: "#007AFF",
    flex: 1,
    maxWidth: 140,
  },
  takePhotoBtn: {
    backgroundColor: "#FF6B35",
    flex: 1,
    maxWidth: 140,
  },
  imagePreviewContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  imageWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
    resizeMode: "cover",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  imageOverlay: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  overlayButton: {
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  imageActions: {
    flexDirection: "row",
    gap: 12,
  },
  changeImageBtn: {
    backgroundColor: "#28a745",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  removeImageBtn: {
    backgroundColor: "#dc3545",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});