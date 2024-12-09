import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ScrollView
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc, collection, query, where, getDocs, setDoc } from "firebase/firestore";
import { FIREBASE_DB } from "@/FirebaseConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

const EditDetails: React.FC = () => {
  const { user, setUser, authInitialized } = useAuth();

  if (!authInitialized) return <Text>Loading...</Text>;

  // States for both personal and vendor details
  const [username, setUsername] = useState(user?.username || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [address, setAddress] = useState(user?.address || "");
  const [restaurantName, setRestaurantName] = useState(user?.restaurantName || "");
  const [category, setCategory] = useState(user?.category || "mix rice");
  const [loading, setLoading] = useState(false);

  
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
  
      const updatedUser = { username, phoneNumber, address, restaurantName, category };
      await updateDoc(userDocRef, updatedUser);
      setUser({ ...user, ...updatedUser });
  
      // Update or create restaurant details
      const restaurantsCollection = collection(FIREBASE_DB, "restaurants");
      const restaurantQuery = query(restaurantsCollection, where("owner", "==", user.email));
      const restaurantSnapshot = await getDocs(restaurantQuery);
  
      if (!restaurantSnapshot.empty) {
        const restDoc = restaurantSnapshot.docs[0];
        const restaurantDocRef = doc(FIREBASE_DB, "restaurants", restDoc.id);
        await updateDoc(restaurantDocRef, { restaurantName, category, owner: user.email });
      } else {
        const newRestaurantDocRef = doc(restaurantsCollection);
        await setDoc(newRestaurantDocRef, { restaurantName, category, owner: user.email });
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
  
  

  return (
    <ScrollView 
        showsVerticalScrollIndicator={false}
      >
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
      <ScrollView 
        showsVerticalScrollIndicator={false}
      ></ScrollView>
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
});
