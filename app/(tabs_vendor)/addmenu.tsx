import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { addDoc } from "firebase/firestore";
import { itemsRef } from "../../FirebaseConfig"; // Adjust path if necessary

const AddMenu = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState(""); // For URL input

  const handleAddItem = async () => {
    try {
      if (!name || !description || !price || (!imageUri && !imageUrl)) {
        Alert.alert("Error", "Please fill in all fields.");
        return;
      }

      // If no image URI is selected, use the image URL entered by the user
      const finalImageUrl = imageUri || imageUrl;

      await addDoc(itemsRef, {
        name,
        description,
        price: parseFloat(price), // Ensure price is stored as a number
        imageUrl: finalImageUrl, // Use the selected or entered image URL
      });

      Alert.alert("Success", "Item added successfully!");
      setName("");
      setDescription("");
      setPrice("");
      setImageUri(null); // Reset image URI
      setImageUrl(""); // Reset image URL input
    } catch (error) {
      console.error("Error adding item: ", error);
      Alert.alert("Error", "Failed to add item.");
    }
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Denied", "You need to allow access to your photos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1, // High-quality image
      });

      // Check if an image was selected
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri); // Use `assets` array to get the image URI
      } else {
        Alert.alert("Selection Cancelled", "No image was selected.");
      }
    } catch (error) {
      console.error("Error picking image: ", error);
      Alert.alert("Error", "Failed to pick an image.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.form}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Menu Item</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Enter Item Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Enter Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
        />

        {/* New input for Image URL */}
        <TextInput
          style={styles.input}
          placeholder="Enter Item Image URL"
          value={imageUrl}
          onChangeText={setImageUrl}
        />

        {/* Add "OR" text between the two options */}
        <Text style={styles.orText}>OR</Text>

        {/* Option to pick an image from the gallery */}
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Text style={styles.imagePickerText}>Pick Image From Gallery</Text>
        </TouchableOpacity>

        {/* Display selected image */}
        {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}

        <Button title="ADD MENU ITEM" onPress={handleAddItem} color="orange" />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  form: {
    paddingVertical: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 30,
    color: "orange",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  descriptionInput: {
    height: 150,
    textAlignVertical: "top",
  },
  imagePicker: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  imagePickerText: {
    color: "orange",
    fontSize: 16,
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  orText: {
    textAlign: "center",
    fontSize: 18,
    marginVertical: 10,
    color: "#888",
  },
});

export default AddMenu;
