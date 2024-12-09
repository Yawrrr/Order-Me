import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert, SafeAreaView, ScrollView, Text } from "react-native";
import { addDoc } from "firebase/firestore";
import { itemsRef } from '../../FirebaseConfig'; // Adjust the number of `../` based on your folder structure

const AddMenu = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // New state for image URL

  const handleAddItem = async () => {
    try {
      if (!name || !description || !price || !imageUrl) { // Check if imageUrl is filled
        Alert.alert("Error", "Please fill in all fields.");
        return;
      }
      await addDoc(itemsRef, {
        name,
        description,
        price: parseFloat(price), // Ensure price is stored as a number
        imageUrl, // Add imageUrl to the document
      });
      Alert.alert("Success", "Item added successfully!");
      setName("");
      setDescription("");
      setPrice("");
      setImageUrl(""); // Reset imageUrl
    } catch (error) {
      console.error("Error adding item: ", error);
      Alert.alert("Error", "Failed to add item.");
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
          placeholder="Enter Product Name"
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
          style={[styles.input, styles.descriptionInput]} // Apply both input and description styles
          placeholder="Enter Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5} // Set number of lines for description box
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Image URL"
          value={imageUrl}
          onChangeText={setImageUrl} // Handle the image URL input
        />
        <Button title="ADD MENU LIST" onPress={handleAddItem} color="orange" />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
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
    color: "orange", // Title in orange color
  },
  input: {
    height: 50,
    borderColor: '#ccc', // Orange border
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  // Additional styling for the description input
  descriptionInput: {
    height: 150, // Larger height for the description box
    textAlignVertical: "top", // Ensures text starts from the top of the input
  },
});

export default AddMenu;
