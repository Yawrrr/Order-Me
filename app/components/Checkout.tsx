import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../FirebaseConfig";
import { collection, query, where, getDocs, addDoc, deleteDoc } from "firebase/firestore";
import { useLocalSearchParams, useRouter } from "expo-router";
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
  const [selectedAddress, setSelectedAddress] =
    useState<string>("No Address Found");
  const auth = FIREBASE_AUTH;
  const router = useRouter();
  const params = useLocalSearchParams();
  
  useEffect(() => {
    if (user?.addresses) {
      const primary =
        user.addresses.find((addr) => addr.primary)?.address ||
        "No Address Found";
      setSelectedAddress(primary);
    }
  }, [user]);

  useEffect(() => {
    if (params.selectedAddress) {
      setSelectedAddress(params.selectedAddress as string);
    }
  }, [params]);

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
      const total = cartItems.reduce(
        (sum, item) => sum + (item.totalPrice || 0),
        0
      );
      setTotalPrice(total);
    } catch (error) {
      console.error("Error fetching cart data: ", error);
    }
  };

  // Function to clear cart items
  const clearCartItems = async () => {
    const userEmail = auth.currentUser?.email;
    if (!userEmail) return;

    try {
      const cartRef = collection(FIREBASE_DB, "carts");
      const cartQuery = query(cartRef, where("email", "==", userEmail));
      const snapshot = await getDocs(cartQuery);

      const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error clearing cart items: ", error);
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

      await clearCartItems(); // Clear cart items after order is placed

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
    if (user?.addresses) {
      setSelectedAddress(
        user?.addresses?.find((addr) => addr.primary)?.address ??
          "No Address Found"
      );
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
        <View style={styles.addressWrapper}>
          <View style={styles.selectedAddressContainer}>
            <Text
              style={styles.selectedAddress}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {selectedAddress}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.newAddressButton}
            onPress={() => router.push({
              pathname: "../components/ChangeAddress",
              params: {
                currentAddress: selectedAddress,
              },
            })}
          >
            <Text style={styles.newAddressText}>Change Address</Text>
          </TouchableOpacity>
        </View>
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
              <Text style={styles.itemPrice}>
                RM {item.totalPrice.toFixed(2)}
              </Text>
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
  addressWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  newAddressButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "orange",
    borderRadius: 8,
  },
  selectedAddressContainer: {
    flex: 1, // Allow this container to take up remaining space
    marginRight: 10, // Add spacing between the text and the button
    flexShrink: 1, // Prevent overflow by shrinking if needed
  },
  newAddressText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
});
