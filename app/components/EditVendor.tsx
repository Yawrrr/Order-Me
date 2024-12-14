import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc, collection, query, where, getDocs, setDoc } from "firebase/firestore";
import { FIREBASE_DB } from "@/FirebaseConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { launchImageLibrary } from 'react-native-image-picker';
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";

const EditDetails: React.FC = () => {
  const { user, setUser, authInitialized } = useAuth();

  if (!authInitialized) return <Text>Loading...</Text>;

  // States for both personal and vendor details
  const [username, setUsername] = useState(user?.username || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [address, setAddress] = useState(user?.address || "");
  const [restaurantName, setRestaurantName] = useState(user?.restaurantName || "");
  const [category, setCategory] = useState(user?.category || "mix rice");
  const [restaurantImage, setRestaurantImage] = useState<string | null>(null); // State for base64 image
  const [loading, setLoading] = useState(false);

  // Fetch the restaurant image if available
  useEffect(() => {
    const fetchRestaurantImage = async () => {
      if (user?.email) {
        const restaurantsCollection = collection(FIREBASE_DB, "restaurants");
        const restaurantQuery = query(restaurantsCollection, where("owner", "==", user.email));
        const restaurantSnapshot = await getDocs(restaurantQuery);

        if (!restaurantSnapshot.empty) {
          const restaurantDoc = restaurantSnapshot.docs[0];
          const restaurantData = restaurantDoc.data();
          setRestaurantImage(restaurantData.restaurantImage || null); // Set the image if exists
        }
      }
    };

    fetchRestaurantImage();
  }, [user?.email]);

  const handleSave = async () => {
    if (!user) {
      Alert.alert("Error", "User data is unavailable.");
      return;
    }

    if (!username || !restaurantName) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      // Update user details
      const usersRef = collection(FIREBASE_DB, "users");
      const userQuery = query(usersRef, where("email", "==", user.email));
      const userSnapshot = await getDocs(userQuery);

      if (userSnapshot.empty) {
        Alert.alert("Error", "User not found.");
        setLoading(false);
        return;
      }

      const userDoc = userSnapshot.docs[0];
      const userDocRef = doc(FIREBASE_DB, "users", userDoc.id);

      const updatedUser = { username, phoneNumber, address, restaurantName, category, restaurantImage };
      await updateDoc(userDocRef, updatedUser);
      setUser({ ...user, ...updatedUser });

      // Update or create restaurant details
      const restaurantsCollection = collection(FIREBASE_DB, "restaurants");
      const restaurantQuery = query(restaurantsCollection, where("owner", "==", user.email));
      const restaurantSnapshot = await getDocs(restaurantQuery);

      if (!restaurantSnapshot.empty) {
        const restDoc = restaurantSnapshot.docs[0];
        const restaurantDocRef = doc(FIREBASE_DB, "restaurants", restDoc.id);
        await updateDoc(restaurantDocRef, { restaurantName, category, owner: user.email, restaurantImage });
      } else {
        const newRestaurantDocRef = doc(restaurantsCollection);
        await setDoc(newRestaurantDocRef, { restaurantName, category, owner: user.email, restaurantImage });
      }

      Alert.alert("Profile", "Details updated successfully.", [
        { text: "OK", onPress: () => router.push("../(tabs_vendor)/profile") }, // Navigate to profile
      ]);
    } catch (error) {
      console.error("Failed to update details:", error);
      Alert.alert("Error", "Failed to update details.");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      // Request permission for media library
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Denied", "You need to allow access to your photos.");
        return;
      }

      // Launch image picker to select a photo
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1, // High-quality image
      });

      // Check if image selection was canceled
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setRestaurantImage(uri);

        // Resize the image (if needed)
        const resizedImage = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: 600 } }], // Resize to width of 600px (adjust as needed)
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Compress the image
        );

        // Convert resized image to Base64
        const base64 = await FileSystem.readAsStringAsync(resizedImage.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Set the image as Base64 encoded string
        setRestaurantImage(`data:image/jpeg;base64,${base64}`);
      } else {
        Alert.alert("Selection Cancelled", "No image was selected.");
      }
    } catch (error) {
      console.error("Error picking image: ", error);
      Alert.alert("Error", "Failed to pick an image.");
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <SafeAreaView style={{ flex: 1, height: "100%", padding: 25, paddingTop: 15 }}>
        <View style={styles.header}>
          <Ionicons
            name="arrow-back-outline"
            size={25}
            color="black"
            onPress={() => router.back()}
          />
          <Text style={styles.headerText}>Edit Details</Text>
        </View>

        <SafeAreaView style={styles.container}>
          {/* Personal Details */}
          <Text style={styles.sectionTitle}>Personal Details</Text>

          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
          />

          {/* Vendor Details */}
          <Text style={styles.sectionTitle}>Vendor Details</Text>

          <Text style={styles.label}>Restaurant Name</Text>
          <TextInput
            style={styles.input}
            value={restaurantName}
            onChangeText={setRestaurantName}
          />

          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Mix Rice" value="Mix Rice" />
              <Picker.Item label="Indian Food" value="Indian Food" />
              <Picker.Item label="Western Food" value="Western Food" />
              <Picker.Item label="Vegetarian" value="Vegetarian" />
              <Picker.Item label="Others" value="Others" />
            </Picker>
          </View>

          <Text style={styles.label}>Restaurant Image</Text>
<TouchableOpacity onPress={pickImage}>
  <View style={styles.imagePicker}>
    {restaurantImage ? (
      <Image source={{ uri: restaurantImage }} style={styles.image} />
    ) : (
      <Text>Pick an image</Text>
    )}
  </View>
</TouchableOpacity>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "Saving..." : "Save"}</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaView>
    </ScrollView>
  );
};

export default EditDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
    color: "orange",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "orange",
    marginBottom: 10,
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    color: "#888",
    marginTop: 5,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 20,
  },
  picker: {
    height: 40,
    fontSize: 16,
  },
  saveButton: {
    paddingVertical: 15,
    backgroundColor: "orange",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  imagePicker: {
    width: 150, // Square width
    height: 150, // Square height (same as width)
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden", // Ensure content fits within the border
  },
  image: {
    width: "100%",
    height: "100%", // Ensures it fills the square container
    resizeMode: "cover", // Maintains the aspect ratio while filling the container
  },
  
  
});
