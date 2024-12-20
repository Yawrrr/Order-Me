import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../FirebaseConfig";
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// Define types for cart items and quantities
type CartItem = {
  id: string;
  name: string;
  quantity: number;
  imageUrl: string; 
  price: number;
  totalPrice: number;
};

export default function Cart() {
  const [userCart, setUserCart] = useState<CartItem[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const currentRestaurantName = "Example Restaurant"; // Replace with actual restaurant name

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
        ...(doc.data() as Omit<CartItem, "id">), // Cast data to CartItem excluding id
      }));

      // Initialize quantities
      const initialQuantities = cartItems.reduce((acc, item) => {
        acc[item.id] = item.quantity;
        return acc;
      }, {} as { [key: string]: number });

      setQuantities(initialQuantities);
      setUserCart(cartItems);
    } catch (error) {
      console.error("Error fetching cart data: ", error);
    }
  };

  // Update the updateCartItem function to handle price calculation
  const updateCartItem = async (itemId: string, quantity: number, price: number) => {
    const userEmail = auth.currentUser?.email;
    if (!userEmail) return;
  
    setLoading(true); // Indicate that Firestore is being updated
  
    try {
      // Calculate the new price based on the quantity
      const newPrice = price * quantity;
      const cartDocRef = doc(FIREBASE_DB, "carts", itemId);
  
      if (quantity === 0) {
        // Remove the item if quantity is zero
        await deleteDoc(cartDocRef);
      } else {
        // Update the item's quantity and price in Firestore
        await updateDoc(cartDocRef, { quantity, price: newPrice });
      }
    } catch (error) {
      console.error("Error updating cart item: ", error);
      Alert.alert("Error", "Failed to update item.");
    } finally {
      setLoading(false); // End loading state
    }
  };
  

// Update the incrementQuantity and decrementQuantity functions
const incrementQuantity = (id: string, price: number) => {
  setQuantities((prev) => {
    const newQuantities = { ...prev, [id]: prev[id] + 1 };
    updateCartItem(id, newQuantities[id], price); // Update Firestore with the new quantity and price
    return newQuantities;
  });
};

const decrementQuantity = (id: string, price: number) => {
  setQuantities((prev) => {
    const newQuantities = { ...prev, [id]: Math.max(prev[id] - 1, 0) }; // Prevent negative quantities
    updateCartItem(id, newQuantities[id], price); // Update Firestore with the new quantity and price
    return newQuantities;
  });
};


  const deleteCartItem = async (itemId: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to remove this item from your cart?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            const userEmail = auth.currentUser?.email;
            if (!userEmail) return;

            setLoading(true);

            try {
              // Reference to the cart document using the itemId
              const cartDocRef = doc(FIREBASE_DB, "carts", itemId);
              
              // Delete the item from Firestore
              await deleteDoc(cartDocRef);
              console.log("Item deleted successfully");

              // Refresh the cart data
              fetchCartData();
              Alert.alert("Success", "Item deleted successfully!");
            } catch (error) {
              console.error("Error deleting cart item: ", error);
              Alert.alert("Error", "Failed to delete item.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Cart</Text>
      </View>

      <FlatList
        data={userCart}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image 
              source={item.imageUrl ? { uri: item.imageUrl } : { uri: "https://via.placeholder.com/150" }} 
              style={styles.itemImage} 
            /> 
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>
                  RM {(item.totalPrice || 0).toFixed(2)}
                </Text>
              
              <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={() => decrementQuantity(item.id, item.price)}>
                  <Text style={styles.quantityButton}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantities[item.id]}</Text>
                <TouchableOpacity onPress={() => incrementQuantity(item.id, item.price)}>
                  <Text style={styles.quantityButton}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* Delete Icon */}
            <TouchableOpacity onPress={() => deleteCartItem(item.id)} style={styles.deleteIcon}>
              <MaterialIcons name="delete-forever" size={25} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: "orange",
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
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
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemPrice: {
    fontSize: 14,
    color: "green",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    fontSize: 20,
    padding: 10,
    color: "#007BFF",
  },
  quantityText: {
    fontSize: 16,
    paddingHorizontal: 10,
  },
  deleteIcon: {
    marginLeft: 10,
  },
});
