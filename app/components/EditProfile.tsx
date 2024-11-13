import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc, query, where, getDocs, collection } from "firebase/firestore";
import { FIREBASE_DB } from "@/FirebaseConfig";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'

const EditProfile: React.FC = () => {
  const { user, setUser, authInitialized } = useAuth();
  const navigation = useNavigation(); 

  if (!authInitialized) return <Text>Loading...</Text>; 
  const [username, setUsername] = useState(user?.username || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [address, setAddress] = useState(user?.address || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user) {
      Alert.alert("Error", "User data is unavailable.");
      return;
    }

    setLoading(true);
    try {
      const usersRef = collection(FIREBASE_DB, "users");
      const q = query(usersRef, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert("Error", "User not found.");
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userRef = doc(FIREBASE_DB, "users", userDoc.id);

      await updateDoc(userRef, { username, phoneNumber, address });
      setUser({ ...user, username, phoneNumber, address });
      Alert.alert("Profile", "Profile updated successfully.");
    } catch (error) {
      console.error("Failed to update profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ height: "100%", padding: 25, paddingTop: 15 }}>
       <View style={styles.header}>
       <Ionicons
        name="arrow-back-outline"
        size={25}
        color="black"
        onPress={() => navigation.goBack()} 
       /> 
       <Text style={styles.headerText}> Edit Profile</Text>
       </View>
      
      <SafeAreaView style={styles.container2}>
      

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
  container2: {
    flex: 1,
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
