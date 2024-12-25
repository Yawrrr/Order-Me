import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import images from "@/constants/images";
import MaterialIcons from "@expo/vector-icons/MaterialIcons"; // Import FontAwesome for the vendor icon

const Breakline = () => {
  return <View style={styles.breakline}>
  </View>
}

const Profile = () => {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/sign-in");
  };

  const navigateToVendor = () => {
    router.push("/menu"); // Replace with the correct vendor-side route
  };

  const username = user?.username ? user?.username : user?.email;
  const email = user?.email;
  const profileImage = user?.profileImage;
  const phoneNumber = user?.phoneNumber;
  const address = user?.addresses?.find((addr) => addr.primary)?.address;

  return (
    <SafeAreaView style={{ height: "100%", padding: 25, paddingTop: 15 }}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <TouchableOpacity
        style={styles.infoContainer}
        onPress={() => router.push("../components/EditProfile")}
      >
        <View style={styles.profileImageContainer}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require("../../assets/images/defaultProfile.png") // Use a placeholder URL
            }
            style={styles.profileImage}
          />
        </View>
        <View style={styles.infoDetail}>
          <Text className="mt-4" style={styles.username}>
            {username? username : email}
          </Text>
          <Text style={styles.userEmail}>{username ? email : phoneNumber}</Text>
        </View>
        {/* 
        <Text style={styles.label}>Address</Text>
        <Text style={styles.username}>{address}</Text> */}
      </TouchableOpacity>
      <View>
          <Text style={styles.label}>My Addresses</Text>
      </View>
      <Breakline/>
      <TouchableOpacity onPress={navigateToVendor}>
          <Text style={styles.label}>Change to Vendor</Text>
      </TouchableOpacity>
      <Breakline/>
      <View>
          <Text style={styles.label}>Logout</Text>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  breakline:{
    width: "100%",
    backgroundColor: "#CCC",
    height: 1.5,
    marginVertical: 16
  },
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
    justifyContent: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#ddd",
    marginRight: 24,
  },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    maxHeight: "16%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  infoDetail: {
    // backgroundColor: "red",
    flex: 1,
    justifyContent: "space-around",
  },
  label: {
    fontSize: 16,
    marginLeft: 16,
    fontWeight: "500"
    
  },
  username: {
    // backgroundColor: "blue",
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginTop: 0,
  },
  userEmail: {
    fontSize: 16,
    color: "#333",
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
