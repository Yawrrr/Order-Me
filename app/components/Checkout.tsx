import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../FirebaseConfig";
import { collection, query, where, getDocs, addDoc, deleteDoc } from "firebase/firestore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import { ScrollView } from "react-native";

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
  const [paymentImage, setPaymentImage] = useState<string | null>(null);
  const [receiptImage, setReceiptImage] = useState<string | null>(null);

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
    if (user?.paymentImage) {
      setPaymentImage(user.paymentImage);
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
      const ordersRef = collection(FIREBASE_DB, "orders");
      
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
    if (!userEmail || !receiptImage) {
      Alert.alert("Error", "Please upload a payment receipt.");
      return;
    }

    setLoading(true);

    try {
      const ordersRef = collection(FIREBASE_DB, "orders");
      await addDoc(ordersRef, {
        email: userEmail,
        items: cartItems,
        totalPrice,
        address: selectedAddress,
        receiptImage, // Add the receipt image here
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

  const pickImage = async (setImage: React.Dispatch<React.SetStateAction<string | null>>) => {
      try {
        // Request permission for media library
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
          Alert.alert("Permission Denied", "You need to allow access to your photos.");
          return;
        }
  
        // Launch image picker to select a photo
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
        });
  
        if (!result.canceled && result.assets && result.assets.length > 0) {
          const uri = result.assets[0].uri;
  
          // Resize the image
          const resizedImage = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 600 } }],
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
          );
  
          // Convert resized image to Base64
          const base64 = await FileSystem.readAsStringAsync(resizedImage.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
  
          // Set the image as Base64 encoded string
          setImage(`data:image/jpeg;base64,${base64}`);
        } else {
          Alert.alert("Selection Cancelled", "No image was selected.");
        }
      } catch (error) {
        console.error("Error picking image: ", error);
        Alert.alert("Error", "Failed to pick an image.");
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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}></ScrollView>
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

      {/* QR Code Payment Section */}
      <View style={styles.qrCodeContainer}>
        <Text style={styles.qrCodeTitle}>Pay via QR Code</Text>
        <Image
          source={
            user?.paymentImage
              ? { uri: user.paymentImage }
              : { uri: "https://via.placeholder.com/150" }
          }
          style={styles.qrCodeImage}
        />
        <Text style={styles.receiptTitle}>Upload Payment Receipt</Text>
        {receiptImage && (
          <Image source={{ uri: receiptImage }} style={styles.receiptImage} />
        )}
        <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(setReceiptImage)}>
          <Text style={styles.uploadButtonText}>Upload Receipt</Text>
        </TouchableOpacity>
      </View>

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
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    alignItems: "center",
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
  qrCodeContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  qrCodeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  qrCodeImage: {
    width: 200,
    height: 200,
    marginBottom: 15,
  },
  receiptTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  receiptImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  uploadButton: {
    marginTop: 10,
    backgroundColor: "orange",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});