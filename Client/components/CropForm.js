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
  Animated,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Checkbox from "expo-checkbox";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome5 } from "@expo/vector-icons";
import { listProduct } from '../services/product'; 
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animation values
  const slideAnim = useState(new Animated.Value(300))[0];
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (visible) {
      // Animate modal in
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      // Reset form when modal closes
      resetForm();
    }
  }, [visible]);

  const resetForm = () => {
    setProductName("");
    setCategory("Vegetables");
    setQuantity("");
    setPricePerUnit("");
    setLocation("");
    setDeliveryHome(false);
    setDeliveryPickup(false);
    setDescription("");
    setImage(null);
    setIsSubmitting(false);
    
    // Reset animations
    slideAnim.setValue(300);
    fadeAnim.setValue(0);
  };

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
    
    console.log("Image picker result:", result);
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      console.log("Setting image URI:", imageUri);
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
    
    console.log("Camera result:", result);
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      console.log("Setting camera image URI:", imageUri);
      setImage(imageUri);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!productName.trim()) {
      Alert.alert("Validation Error", "Please enter product name", [
        { text: "OK", style: "default" }
      ]);
      return;
    }
    
    const quantityNum = Number(quantity);
    if (!quantity || isNaN(quantityNum) || quantityNum <= 20) {
      Alert.alert("Validation Error", "Quantity must be a number greater than 20", [
        { text: "OK", style: "default" }
      ]);
      return;
    }
    
    if (!pricePerUnit || isNaN(Number(pricePerUnit))) {
      Alert.alert("Validation Error", "Please enter valid price per unit", [
        { text: "OK", style: "default" }
      ]);
      return;
    }
    
    if (!location.trim()) {
      Alert.alert("Validation Error", "Please enter location", [
        { text: "OK", style: "default" }
      ]);
      return;
    }

    setIsSubmitting(true);

    // Prepare the form data for API call
    const apiFormData = {
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
      user_id: "some_user_id_here", // This should be replaced with actual user_id from context
    };

    try {
      // Call the API function with the form data
      await listProduct(apiFormData);

      // Show success toast
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: '✅ Product Listed Successfully!',
        text2: 'Your product is now available for buyers to see.',
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 60,
        bottomOffset: 40,
      });

      // Call the parent component's onSubmit function to update local state
      if (onSubmit) {
        onSubmit(apiFormData);
      }

      // Close the form after submitting
      closeModal();
    } catch (error) {
      // Show error toast
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: '❌ Listing Failed',
        text2: error.message || 'Something went wrong. Please try again later.',
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 60,
        bottomOffset: 40,
      });
      
      console.error('Error listing product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    // Animate modal out
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      })
    ]).start(() => {
      onClose();
    });
  };

  return (
    <Modal visible={visible} animationType="none" transparent>
      <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardContainer}
        >
          <Animated.View 
            style={[
              styles.modalContent, 
              { transform: [{ translateY: slideAnim }] }
            ]}
          >
            {/* Header */}
            <View style={styles.headerContainer}>
              <View style={styles.headerIcon}>
                <FontAwesome5 name="seedling" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.heading}>List Your Product</Text>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <FontAwesome5 name="times" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              style={styles.scrollContent}
            >
              {/* Product Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  <FontAwesome5 name="apple-alt" size={14} color="#4CAF50" /> Product Name
                </Text>
                <TextInput
                  style={[styles.input, productName ? styles.inputFilled : null]}
                  placeholder="e.g., Fresh Tomatoes"
                  value={productName}
                  onChangeText={setProductName}
                  autoCorrect={false}
                  placeholderTextColor="#999"
                />
              </View>

              {/* Category */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  <FontAwesome5 name="list" size={14} color="#4CAF50" /> Category
                </Text>
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
              </View>

              {/* Quantity and Price Row */}
              <View style={styles.rowContainer}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>
                    <FontAwesome5 name="weight" size={14} color="#4CAF50" /> Quantity (kg)
                  </Text>
                  <TextInput
                    style={[styles.input, quantity ? styles.inputFilled : null]}
                    placeholder="100"
                    keyboardType="numeric"
                    value={quantity}
                    onChangeText={setQuantity}
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>
                    <FontAwesome5 name="rupee-sign" size={14} color="#4CAF50" /> Price (₹/kg)
                  </Text>
                  <TextInput
                    style={[styles.input, pricePerUnit ? styles.inputFilled : null]}
                    placeholder="20"
                    keyboardType="numeric"
                    value={pricePerUnit}
                    onChangeText={setPricePerUnit}
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              {/* Location */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  <FontAwesome5 name="map-marker-alt" size={14} color="#4CAF50" /> Location
                </Text>
                <TextInput
                  style={[styles.input, location ? styles.inputFilled : null]}
                  placeholder="Enter delivery or pickup location"
                  value={location}
                  onChangeText={setLocation}
                  placeholderTextColor="#999"
                />
              </View>

              {/* Delivery Options */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  <FontAwesome5 name="truck" size={14} color="#4CAF50" /> Delivery Options
                </Text>
                <View style={styles.deliveryContainer}>
                  <TouchableOpacity 
                    style={[styles.deliveryOption, deliveryHome && styles.deliveryOptionActive]}
                    onPress={() => setDeliveryHome(!deliveryHome)}
                  >
                    <View style={styles.deliveryOptionContent}>
                      <FontAwesome5 
                        name="home" 
                        size={16} 
                        color={deliveryHome ? "#fff" : "#4CAF50"} 
                      />
                      <Text style={[
                        styles.deliveryOptionText, 
                        deliveryHome && styles.deliveryOptionTextActive
                      ]}>
                        Home Delivery
                      </Text>
                    </View>
                    <View style={[styles.customCheckbox, deliveryHome && styles.customCheckboxActive]}>
                      {deliveryHome && <FontAwesome5 name="check" size={12} color="#fff" />}
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.deliveryOption, deliveryPickup && styles.deliveryOptionActive]}
                    onPress={() => setDeliveryPickup(!deliveryPickup)}
                  >
                    <View style={styles.deliveryOptionContent}>
                      <FontAwesome5 
                        name="store" 
                        size={16} 
                        color={deliveryPickup ? "#fff" : "#4CAF50"} 
                      />
                      <Text style={[
                        styles.deliveryOptionText, 
                        deliveryPickup && styles.deliveryOptionTextActive
                      ]}>
                        Self Pickup
                      </Text>
                    </View>
                    <View style={[styles.customCheckbox, deliveryPickup && styles.customCheckboxActive]}>
                      {deliveryPickup && <FontAwesome5 name="check" size={12} color="#fff" />}
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Upload Image */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  <FontAwesome5 name="camera" size={14} color="#4CAF50" /> Product Image
                </Text>
                {!image ? (
                  <View style={styles.imageUploadContainer}>
                    <View style={styles.uploadPlaceholder}>
                      <View style={styles.uploadIconContainer}>
                        <FontAwesome5 name="image" size={32} color="#4CAF50" />
                      </View>
                      <Text style={styles.placeholderTitle}>Add Product Photo</Text>
                      <Text style={styles.placeholderSubtitle}>Help buyers see your product</Text>
                    </View>
                    <View style={styles.uploadButtonsRow}>
                      <TouchableOpacity style={styles.choosePhotoBtn} onPress={pickImage}>
                        <FontAwesome5 name="images" size={16} color="#fff" />
                        <Text style={styles.uploadBtnText}>Gallery</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.takePhotoBtn} onPress={takePhoto}>
                        <FontAwesome5 name="camera" size={16} color="#fff" />
                        <Text style={styles.uploadBtnText}>Camera</Text>
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
                      <TouchableOpacity 
                        style={styles.removeImageOverlay}
                        onPress={() => setImage(null)}
                      >
                        <FontAwesome5 name="times" size={14} color="#fff" />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.imageActions}>
                      <TouchableOpacity style={styles.changeImageBtn} onPress={pickImage}>
                        <FontAwesome5 name="edit" size={14} color="#fff" />
                        <Text style={styles.imageActionText}>Change</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.removeImageBtn} 
                        onPress={() => setImage(null)}
                      >
                        <FontAwesome5 name="trash" size={14} color="#fff" />
                        <Text style={styles.imageActionText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>

              {/* Description */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  <FontAwesome5 name="align-left" size={14} color="#4CAF50" /> Description (Optional)
                </Text>
                <TextInput
                  style={[styles.textArea, description ? styles.inputFilled : null]}
                  placeholder="Tell buyers about freshness, organic certification, special qualities..."
                  multiline
                  numberOfLines={4}
                  value={description}
                  onChangeText={setDescription}
                  placeholderTextColor="#999"
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actionContainer}>
              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={closeModal}
                disabled={isSubmitting}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]} 
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FontAwesome5 name="spinner" size={16} color="#fff" />
                    <Text style={styles.submitText}>Listing...</Text>
                  </>
                ) : (
                  <>
                    <FontAwesome5 name="check" size={16} color="#fff" />
                    <Text style={styles.submitText}>List Product</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "95%",
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    position: "relative",
  },
  headerIcon: {
    position: "absolute",
    left: 24,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2c3e50",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    right: 24,
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    borderWidth: 2,
    borderColor: "#e8f5e8",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 16 : 12,
    fontSize: 16,
    backgroundColor: "#fafffe",
    color: "#2c3e50",
    transition: "all 0.2s ease",
  },
  inputFilled: {
    borderColor: "#4CAF50",
    backgroundColor: "#f8fff8",
  },
  textArea: {
    borderWidth: 2,
    borderColor: "#e8f5e8",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fafffe",
    color: "#2c3e50",
    minHeight: 100,
  },
  pickerWrapper: {
    borderWidth: 2,
    borderColor: "#e8f5e8",
    borderRadius: 12,
    backgroundColor: "#fafffe",
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === "ios" ? 180 : 50,
    width: "100%",
    color: "#2c3e50",
    backgroundColor: "transparent",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  deliveryContainer: {
    gap: 12,
  },
  deliveryOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderWidth: 2,
    borderColor: "#e8f5e8",
    borderRadius: 12,
    backgroundColor: "#fafffe",
  },
  deliveryOptionActive: {
    borderColor: "#4CAF50",
    backgroundColor: "#4CAF50",
  },
  deliveryOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  deliveryOptionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2c3e50",
  },
  deliveryOptionTextActive: {
    color: "#fff",
  },
  customCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  customCheckboxActive: {
    backgroundColor: "#fff",
    borderColor: "#fff",
  },
  imageUploadContainer: {
    alignItems: "center",
    padding: 32,
    backgroundColor: "#f8fff8",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#e8f5e8",
    borderStyle: "dashed",
  },
  uploadPlaceholder: {
    alignItems: "center",
    marginBottom: 24,
  },
  uploadIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#e8f5e8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  placeholderSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  uploadButtonsRow: {
    flexDirection: "row",
    gap: 16,
  },
  choosePhotoBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    elevation: 3,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  takePhotoBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6B35",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    elevation: 3,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  uploadBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  imagePreviewContainer: {
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8fff8",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e8f5e8",
  },
  imageWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  previewImage: {
    width: 180,
    height: 180,
    borderRadius: 16,
    resizeMode: "cover",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  removeImageOverlay: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(220, 53, 69, 0.9)",
    borderRadius: 16,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  imageActions: {
    flexDirection: "row",
    gap: 12,
  },
  changeImageBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28a745",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  removeImageBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dc3545",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  imageActionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  actionContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    gap: 16,
  },
  cancelBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  cancelText: {
    color: "#6c757d",
    fontWeight: "600",
    fontSize: 16,
  },
  submitBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#4CAF50",
    gap: 8,
    elevation: 4,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  submitBtnDisabled: {
    backgroundColor: "#95d5b2",
    elevation: 2,
  },
  submitText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});