import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import images from "@/constants/images";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';// Import FontAwesome for the vendor icon

const Profile = () => {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/sign-in');
  };

  const navigateToVendor = () => {
    router.push('/menu'); // Replace with the correct vendor-side route
  };

  const username = user?.username ? user?.username : user?.email;
  const email = user?.email;
  const profileImage = user?.profileImage;
  const phoneNumber = user?.phoneNumber;
  const address = user?.address;

  return (
    <SafeAreaView style={{ height: "100%", padding: 25, paddingTop: 15, }}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.headerActions}>
        
      <MaterialIcons
        name="store" // Shop icon
        size={30}
        color="orange"
        style={styles.iconSpacing}
        onPress={navigateToVendor}
      />
          {/* Logout Icon */}
          <MaterialIcons
            name="logout"
            size={30}
            color="#E10000"
            onPress={handleLogout}
          />
        </View>
      </View>
      <View className="items-center" style={styles.profileImageContainer}>
        <Image
                    source={
                      profileImage
                        ? { uri: profileImage }
                         : require('../../assets/images/defaultProfile.png') // Use a placeholder URL
                    }
                    style={styles.profileImage}
                    />
        <Text className="mt-4" style={styles.infoText}>{username}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.infoText}>{email}</Text>

        <Text style={styles.label}>Phone</Text>
        <Text style={styles.infoText}>+60 {phoneNumber}</Text>

        <Text style={styles.label}>Address</Text>
        <Text style={styles.infoText}>{address}</Text>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => router.push("../components/EditProfile")}
      >
        <Text style={styles.editText}>Edit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 30,
    color: "orange",
  },
  profileImageContainer: {
    marginTop: 20,
    marginBottom: 8,
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
  editButton: {
    paddingVertical: 10,
    backgroundColor: "orange",
    borderRadius: 15,
    alignItems: "center",
    marginTop: 8,
  },
  editText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  headerIcon: {
    marginLeft: 15,
  },
  iconSpacing: {
    marginRight: 20, // Space between the two icons
  },
});
