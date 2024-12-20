import { StyleSheet, View, Text, Image, ListRenderItem } from "react-native";
import React, { useEffect, useState } from "react";
import {

  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { ListingType } from "@/type/listingType";
import { saveWishlist, getWishlist } from "@/app/utility/storage";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { colors } from "@/constants/colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FIREBASE_DB } from "@/FirebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

type Props = {
  listings: ListingType[];
  category: string;
};

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

const RestaurantListing = ({ listings, category }: Props) => {
  const [filteredListings, setFilteredListings] =
    useState<ListingType[]>(listings);
  const [wishlist, setWishlist] = useState<ListingType[]>([]);
  const [loading, setLoading] = useState(false);
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [currentRestaurantName, setCurrentRestaurantName] = useState<string>("");

   // New state to track quantities
   const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  // Load wishlist on mount
  useEffect(() => {
    const loadWishlist = async () => {
      const savedWishlist = await getWishlist();
      setWishlist(savedWishlist);
    };
    loadWishlist();
  }, []);

  // Fetch data from Firestore when component mounts
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const restaurantsRef = collection(FIREBASE_DB, "restaurants");
        let q = query(restaurantsRef);

        if (category !== "All") {
          q = query(restaurantsRef, where("category", "==", category));
        }

        const snapshot = await getDocs(q);
        const restaurantsData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.restaurantName,
            imageUrl: data.restaurantImage,
            category: data.category,
            location: data.location || "Unknown",
            rating: data.rating || "No ratings",
            cuisine: data.cuisine || "Unknown",
            priceRange: data.priceRange || "Unknown",
            isOpen: data.isOpen || true,
            description: data.description || "No description available",
          };
        });

        setFilteredListings(restaurantsData);
      } catch (error) {
        console.error("Error fetching restaurants: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [category]);


  const handleWishlistToggle = async (item: ListingType) => {
    const isAlreadyInWishlist = wishlist.some(
      (wishlistItem) => wishlistItem.id === item.id
    );
    let updatedWishlist;

    if (isAlreadyInWishlist) {
      updatedWishlist = wishlist.filter((wishlistItem) => wishlistItem.id !== item.id);
      Alert.alert("Removed", `${item.name} has been removed from your wishlist.`);
    } else {
      updatedWishlist = [...wishlist, item];
      Alert.alert("Added", `${item.name} has been added to your wishlist.`);
    }

    setWishlist(updatedWishlist);
    await saveWishlist(updatedWishlist);
  };

  // Fetch menu items for a restaurant
  const fetchMenuItems = async (restaurantName: string) => {
    setLoading(true);
    setCurrentRestaurantName(restaurantName);

    try {
      const itemsRef = collection(FIREBASE_DB, "items");
      const q = query(itemsRef, where("restaurantName", "==", restaurantName));
      const snapshot = await getDocs(q);

      const fetchedMenuItems = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MenuItem[];

      setMenuItems(fetchedMenuItems);
      // Initialize quantities for each menu item
      const initialQuantities = fetchedMenuItems.reduce((acc, item) => {
        acc[item.id] = 0;
        return acc;
      }, {} as { [key: string]: number });
      setQuantities(initialQuantities);

      setMenuModalVisible(true);
    } catch (error) {
      console.error("Error fetching menu items: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Increment quantity
  const incrementQuantity = (id: string) => {
    setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  // Decrement quantity
  const decrementQuantity = (id: string) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] > 0 ? prev[id] - 1 : 0,
    }));
  };

  // Handle Add to Cart
  const handleAddToCart = () => {
    const itemsToAdd = menuItems.filter((item) => quantities[item.id] > 0);
    console.log("Items added to cart:", itemsToAdd);
    Alert.alert("Cart Updated", `${itemsToAdd.length} item(s) added to your cart.`);
    setMenuModalVisible(false); // Close the modal after adding
  };

  const renderItems = ({ item }: { item: ListingType }) => {
    const isInWishlist = wishlist.some(
      (wishlistItem) => wishlistItem.id === item.id
    );

    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => fetchMenuItems(item.name)} // Fetch menu when clicked
        >
          <Image source={{ uri: item.imageUrl }} style={styles.restaurantImage} />
          <Text style={styles.itemTxt} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.locationContainer}>
            <View style={styles.location}>
              <FontAwesome5 name="map-marker-alt" size={18} color={colors.secondary[200]} />
              <Text style={styles.itemLocationTxt} numberOfLines={1} ellipsizeMode="tail">
                {item.location}
              </Text>
            </View>

            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>{item.rating}</Text>
              <Ionicons name="star" size={16} color={colors.secondary[200]} />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.favorite}
          onPress={() => handleWishlistToggle(item)}
        >
          <Ionicons
            name={isInWishlist ? "heart" : "heart-outline"}
            size={20}
            color={isInWishlist ? "red" : "black"}
          />
        </TouchableOpacity>
      </GestureHandlerRootView>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      <FlatList
        data={loading ? [] : filteredListings}
        renderItem={renderItems}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
       {/* Modal for Menu Items */}
       <Modal
        visible={menuModalVisible}
        animationType="slide"
        onRequestClose={() => setMenuModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>{currentRestaurantName} Menu</Text>
          <FlatList
            data={menuItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.menuItemCard}>
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
                <View style={styles.menuItemInfo}>
                  <Text style={styles.menuItemName}>{item.name}</Text>
                  <Text style={styles.menuItemDescription}>{item.description}</Text>
                  <Text style={styles.menuItemPrice}>RM {item.price}</Text>
                </View>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity onPress={() => decrementQuantity(item.id)}>
                    <Text style={styles.quantityButton}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantities[item.id]}</Text>
                  <TouchableOpacity onPress={() => incrementQuantity(item.id)}>
                    <Text style={styles.quantityButton}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
           <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Text style={styles.addToCartText}>Add To Cart</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
};

export default RestaurantListing;

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    marginRight: 20,
    marginBottom: 20,
    width: 220,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    padding: 10,
  },
  restaurantImage: {
    width: 180, 
    height: 180,
    borderRadius: 10,
    margin: 15, // Use a single margin property for uniform spacing.
    alignSelf: 'center', 
    resizeMode: 'cover', 
  },
  // Menu Item Image Style (different from restaurant image)
  image: {
    width: 100,
    height: 100, // Adjusted height for a smaller image
    borderRadius: 10, // Different border radius for menu items
    marginBottom: 15, // Add some margin for separation
  },
  itemInfo: {
    marginTop: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
  price: {
    fontSize: 16,
    color: "#007BFF",
  },
  favorite: {
    position: "absolute",
    top: 185,
    right: 30,
    backgroundColor: colors.secondary[100],
    padding: 10,
    borderRadius: 30,
    borderColor: "white",
    borderWidth: 2,
  },
  itemTxt: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.secondary[200],
    marginBottom: 10,
    marginLeft: 10,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Ensures space between location and rating
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, 
  },
  itemLocationTxt: {
    fontSize: 12,
    marginLeft: 5,
    flexShrink: 1,
    fontWeight: "bold", 
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    marginRight: 5,
    fontWeight: "bold",
  },
  menuItemCard: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    flexDirection: "row", // Align image and text horizontally
    alignItems: "center", // Align items vertically in the center
  },
  menuItemInfo: {
    flex: 1, // Take remaining space after image
    justifyContent: "flex-start", // Distribute space between name, description, and price
  },
  menuItemName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    marginLeft: 10, // Add some left margin to prevent text from sticking to the edge
  },
  menuItemDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
    marginLeft: 10, // Add left margin
  },
  menuItemPrice: {
    fontSize: 16,
    color: "#007BFF",
    marginLeft: 10, // Add left margin
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 10, // Align with other elements
  },
  
  quantityButton: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007BFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
  },
  
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 8,
  },
  
  addToCartButton: {
    backgroundColor: "orange",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    margin: 16,
  },
  
  addToCartText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  
});
