import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image, Alert, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";

const menu = () => {
  const [image, setImage] = useState(null);

  const imagePicker = async () => {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need access to your media library to pick an image!");
      return;
    }

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Correct usage
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Save image URI
    } else {
      console.log("Image selection canceled.");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.headerText}>Add Item</Text>
      </View>
      <TextInput placeholder="Enter Item Name" style={styles.inputStyle} />
      <TextInput placeholder="Enter Description" style={styles.inputStyle} numberOfLines={5} multiline={true} />
      <TextInput placeholder="Enter Price" style={styles.inputStyle} />
      <TextInput placeholder="Enter Image Url" style={styles.inputStyle} />
      <Text style={{ alignSelf: "center", marginTop: 20 }}>OR</Text>
      <TouchableOpacity style={styles.pickBtn} onPress={imagePicker}>
        <Text>Pick Image From Gallery</Text>
      </TouchableOpacity>

      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: 200, height: 200, alignSelf: "center", marginTop: 20, borderRadius: 10 }}
        />
      )}

      <TouchableOpacity style={styles.uploadBtn}>
        <Text>Upload Item</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default menu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 20, // Padding to ensure content doesn't get cut off at the bottom
  },
  header: {
    height: 60,
    width: "100%",
    backgroundColor: "white",
    elevation: 5,
    paddingLeft: 20,
    justifyContent: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "700",
  },
  inputStyle: {
    width: "90%",
    height: 50,
    borderRadius: 10,
    borderWidth: 0.5,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 30,
    alignSelf: "center",
  },
  pickBtn: {
    width: "90%",
    height: 50,
    borderWidth: 0.5,
    borderRadius: 10,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  uploadBtn: {
    backgroundColor: "#FF5722", // Replace if colors.secondary.DEFAULT is invalid
    width: "90%",
    height: 50,
    borderRadius: 10,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20,
  },
});
