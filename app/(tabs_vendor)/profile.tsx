import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, Switch, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import images from "@/constants/images";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { doc, updateDoc, collection, query, where, getDocs} from "firebase/firestore";
import { FIREBASE_DB } from "@/FirebaseConfig";


const Profile = () => {
  const { logout, user } = useAuth();
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(false); // Default to closed
  const [loading, setLoading] = useState(true);
  
  const handleLogout = async () => {
    await logout();
    router.replace("/sign-in");
  };

  const navigateToCustomer = () => {
    router.push("/home");
  };

  useEffect(() => {
    const fetchRestaurantStatus = async () => {
      try {
        if (!user?.email) {
          console.error("User email is unavailable.");
          return;
        }

        const restaurantsCollection = collection(FIREBASE_DB, "restaurants");
        const restaurantQuery = query(restaurantsCollection, where("owner", "==", user.email));
        const restaurantSnapshot = await getDocs(restaurantQuery);

        if (!restaurantSnapshot.empty) {
          const restaurantDoc = restaurantSnapshot.docs[0];
          const restaurantData = restaurantDoc.data();
          setIsRestaurantOpen(restaurantData.isOpen); // Set the initial value from Firestore
        } else {
          console.error("Restaurant document not found for the user.");
        }
      } catch (error) {
        console.error("Error fetching restaurant status: ", error);
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };

    fetchRestaurantStatus();
  }, [user]);
  const toggleRestaurantStatus = async () => {
    try {
      const newStatus = !isRestaurantOpen; // Toggle the current status
      setIsRestaurantOpen(newStatus);

      if (!user?.email) {
        console.error("User email is unavailable.");
        return;
      }

      const restaurantsCollection = collection(FIREBASE_DB, "restaurants");
      const restaurantQuery = query(restaurantsCollection, where("owner", "==", user.email));
      const restaurantSnapshot = await getDocs(restaurantQuery);

      if (!restaurantSnapshot.empty) {
        const restaurantDoc = restaurantSnapshot.docs[0];
        const restaurantDocRef = doc(FIREBASE_DB, "restaurants", restaurantDoc.id);

        // Update the `isOpen` status in Firestore
        await updateDoc(restaurantDocRef, { isOpen: newStatus });
        Alert.alert("Success", `Restaurant status updated to ${newStatus ? "Open" : "Closed"}.`);
      } else {
        console.error("Restaurant document not found for the user.");
      }
    } catch (error) {
      console.error("Error updating restaurant status: ", error);
      Alert.alert("Error", "Failed to update restaurant status. Please try again.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  const username = user?.username ?? user?.email;
  const email = user?.email;
  const phoneNumber = user?.phoneNumber;
  const address = user?.addresses?.find((addr) => addr.primary)?.address;
  const profileImage = user?.profileImage;
  const restaurantName = user?.restaurantName;
  const restaurantAddress = user?.restaurantAddress;
  const restaurantImage = user?.restaurantImage;
  const category = user?.category;
  const qrType = user?.qrType;
  const qrCode = user?.qrCode;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ padding: 25, paddingTop: 15 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <View style={styles.headerActions}>
            <MaterialIcons
              name="food-bank"
              size={36}
              color="orange"
              style={styles.iconSpacing}
              onPress={navigateToCustomer}
            />
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
                : require("../../assets/images/defaultProfile.png") // Use a placeholder URL
            }
            style={styles.profileImage}
          />
          <Text className="mt-4" style={styles.infoText}>
            {username}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.infoText}>{email}</Text>

          <Text style={styles.label}>Phone</Text>
          <Text style={styles.infoText}>+60 {phoneNumber}</Text>

          <Text style={styles.label}>Address</Text>
          <Text style={styles.infoText}>{address}</Text>

          <Text style={styles.label}>Restaurant Name</Text>
          <Text style={styles.infoText}>{restaurantName}</Text>

          <Text style={styles.label}>Restaurant Address</Text>
          <Text style={styles.infoText}>{restaurantAddress}</Text>

          <Text style={styles.label}>Category</Text>
          <Text style={styles.infoText}>{category}</Text>

          <Text style={styles.label}>Restaurant Status</Text>
          <View style={styles.statusContainer}>
            <Text style={styles.infoText}>{isRestaurantOpen ? "Opened" : "Closed"}</Text>
            <Switch
              value={isRestaurantOpen}
              onValueChange={toggleRestaurantStatus}
              thumbColor={isRestaurantOpen ? "green" : "red"}
              trackColor={{ false: "#ddd", true: "lightgreen" }}
            />
          </View>

          <Text style={styles.label}>Restaurant Image</Text>
          <Image
            source={
              restaurantImage
                ? { uri: restaurantImage }
                : { uri: "https://via.placeholder.com/150" } // Use a placeholder URL
            }
            style={styles.restaurantImage}
          />
          
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push("../components/EditVendor")}
        >
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </ScrollView>
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
  iconSpacing: {
    marginRight: 20,
  },
  restaurantImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginTop: 10,
    resizeMode: "cover",
  },
  qrCode: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  modalContent: {
    width: "90%",
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "100%",
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 30,
    right: 30,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 50,
    padding: 5,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
