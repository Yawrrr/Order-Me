import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
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
  const [filteredListings, setFilteredListings] = useState<ListingType[]>(listings);
  const [wishlist, setWishlist] = useState<ListingType[]>([]);
  const [loading, setLoading] = useState(false);
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [currentRestaurantName, setCurrentRestaurantName] = useState<string>("");

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

  // Toggle wishlist
  const handleWishlistToggle = async (item: ListingType) => {
    const isAlreadyInWishlist = wishlist.some((wishlistItem) => wishlistItem.id === item.id);
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
      setMenuModalVisible(true);
    } catch (error) {
      console.error("Error fetching menu items: ", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItems = ({ item }: { item: ListingType }) => {
    const isInWishlist = wishlist.some((wishlistItem) => wishlistItem.id === item.id);

    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => fetchMenuItems(item.name)} // Fetch menu when clicked
        >
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
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
              <View style={styles.card}>
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
                <View style={styles.itemInfo}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                  <Text style={styles.price}>RM {item.price}</Text>
                </View>
              </View>
            )}
          />
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
    marginBottom: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
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
});

