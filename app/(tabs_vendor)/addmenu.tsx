import React, { useState } from "react";
import { SafeAreaView, TextInput, Button, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native";

const AddMenu = () => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = () => {
    // Handle form submission (e.g., send data to API or save locally)
    console.log({
      productName,
      price,
      description,
      imageUrl
    });

    // Optionally, clear the form after submission
    setProductName('');
    setPrice('');
    setDescription('');
    setImageUrl('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.form}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Menu</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Enter Product Name"
          value={productName}
          onChangeText={setProductName}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Enter Price"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />
        
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter Description"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Enter Image URL"
          value={imageUrl}
          onChangeText={setImageUrl}
        />

        <Button
          title="Add Menu Item"
          onPress={handleSubmit}
          color="orange"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddMenu;

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
    color: "orange",
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top', // Makes the text start from the top of the input
  },
});
