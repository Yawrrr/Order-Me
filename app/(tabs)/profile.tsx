import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";

const Profile = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/sign-in')
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileImageContainer}>
        <Image
          source={require("../../assets/images/yuting_profile.jpg")}
          style={styles.profileImage}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.infoText}>Yuting</Text>

        <Text style={styles.label}>Phone</Text>
        <Text style={styles.infoText}>+60 123-456-789</Text>

        <Text style={styles.label}>Address</Text>
        <Text style={styles.infoText}>
          123, Jalan Example, Pontian, Johor, Malaysia
        </Text>
      </View>
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    padding: 20,
  },
  profileImageContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  infoContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    color: "#888",
    marginTop: 10,
  },
  infoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  saveButton: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  logoutButton: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#FF6347",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});
