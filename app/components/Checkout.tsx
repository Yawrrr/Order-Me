import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../FirebaseConfig";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import { Image } from "react-native";
import { useAuth } from "@/context/AuthContext";

// Define types for cart items
type CartItem = {
  id: string;
  imageUrl: string;
  name: string;
  quantity: number;
  price: number;
  totalPrice: number;
};

export default function Checkout() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth(); // Access user data
  const [selectedAddress, setSelectedAddress] = useState(user?.address || "No Address Found");
  const auth = FIREBASE_AUTH;
  const router = useRouter();

  // Fetch cart data
  const fetchCartData = async () => {
    const userEmail = auth.currentUser?.email;
    if (!userEmail) return;

    try {
      const cartRef = collection(FIREBASE_DB, "carts");
      const cartQuery = query(cartRef, where("email", "==", userEmail));
      const snapshot = await getDocs(cartQuery);

      const cartItems: CartItem[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<CartItem, "id">),
      }));

      setCartItems(cartItems);

      // Calculate total price
      const total = cartItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
      setTotalPrice(total);
    } catch (error) {
      console.error("Error fetching cart data: ", error);
    }
  };

  // Fetch user address from users collection
  const fetchUserAddress = async () => {
    const userEmail = auth.currentUser?.email;
    if (!userEmail) {
      console.log("No authenticated user found.");
      return;
    }
  
    try {
      const userRef = collection(FIREBASE_DB, "users");
      const userQuery = query(userRef, where("email", "==", userEmail));
      const snapshot = await getDocs(userQuery);
  
      console.log("Query executed, documents found: ", snapshot.size);
  
      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        console.log("Fetched user data: ", userData);
  
        const address = userData?.address || "No Address Found";
        setSelectedAddress(address);
        console.log("Fetched Address: ", address);
      } else {
        console.log("No user document found for email: ", userEmail);
        setSelectedAddress("No Address Found");
      }
    } catch (error) {
      console.error("Error fetching user address: ", error);
      setSelectedAddress("Error fetching address");
    }
  };
  

  // Confirm the order
  const confirmOrder = async () => {
    const userEmail = auth.currentUser?.email;
    if (!userEmail) return;

    setLoading(true);

    try {
      const ordersRef = collection(FIREBASE_DB, "orders");
      await addDoc(ordersRef, {
        email: userEmail,
        items: cartItems,
        totalPrice,
        address: selectedAddress,
        timestamp: new Date(),
        status: "Pending",
      });

      Alert.alert("Success", "Your order has been placed!");
      router.push("/home");
    } catch (error) {
      console.error("Error confirming order: ", error);
      Alert.alert("Error", "Failed to place the order.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (auth.currentUser) {
      fetchCartData(); // Fetch cart items from Firestore
    }
    
    // Use `user` to set the address
    if (user?.address) {
      setSelectedAddress(user.address);
    } else {
      console.log("No address found in user context");
    }
  }, [auth.currentUser, user]);
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Checkout</Text>
      </View>

      {/* Display selected address */}
      <View style={styles.addressContainer}>
        <Text style={styles.addressTitle}>Delivery Address</Text>
        <Text style={styles.selectedAddress}>{selectedAddress}</Text>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image
              source={
                item.imageUrl
                  ? { uri: item.imageUrl }
                  : { uri: "https://via.placeholder.com/150" }
              }
              style={styles.itemImage}
            />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
              <Text style={styles.itemPrice}>RM {item.totalPrice.toFixed(2)}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.totalPrice}>Total: RM {totalPrice.toFixed(2)}</Text>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={confirmOrder}
          disabled={loading}
        >
          <Text style={styles.confirmButtonText}>
            {loading ? "Processing..." : "Confirm Order"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "flex-start",
    justifyContent: "center",
    marginBottom: 10,
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 30,
    color: "orange",
    marginBottom: 5,
  },
  addressContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  selectedAddress: {
    fontSize: 16,
    color: "#555",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
  },
  itemQuantity: {
    fontSize: 14,
    color: "#555",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    alignItems: "center",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: "#FF6F61",
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
});
