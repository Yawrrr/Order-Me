import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc, query, where, getDocs, collection } from "firebase/firestore";
import { FIREBASE_DB } from "@/FirebaseConfig";

interface User {
  email: string;
  username?: string;
  phoneNumber?: string;
  address?: string;
}

const EditProfile: React.FC = () => {
  const { user, setUser } = useAuth(); // Access setUser from context

  const [username, setUsername] = useState(user?.username || user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [address, setAddress] = useState(user?.address || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user?.email) {
      Alert.alert("Error", "User email is missing.");
      return;
    }

    setLoading(true);
    try {
      // Query Firebase to find the document based on email
      const usersRef = collection(FIREBASE_DB, "users");
      const q = query(usersRef, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);

      // Ensure that the user document exists
      if (querySnapshot.empty) {
        Alert.alert("Error", "User not found.");
        return;
      }

      const userDoc = querySnapshot.docs[0]; // Assuming the email is unique
      const userRef = doc(FIREBASE_DB, "users", userDoc.id);

      // Update the document
      await updateDoc(userRef, { username, phoneNumber, address });
      setUser({ ...user, username, phoneNumber, address }); // Update context
      router.back();
    } catch (error) {
      console.error("Failed to update profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Text>Loading...</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Username</Text>
      <TextInput style={styles.input} value={username} onChangeText={setUsername} />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} />

      <Text style={styles.label}>Address</Text>
      <TextInput style={styles.input} value={address} onChangeText={setAddress} />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Saving..." : "Save"}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  label: {
    fontSize: 16,
    color: "#888",
    marginTop: 10,
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
  saveButton: {
    paddingVertical: 15,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});
