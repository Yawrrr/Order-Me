import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { ListingType } from "@/type/listingType";
import { saveWishlist, getWishlist } from "@/app/utility/storage";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { colors } from "@/constants/colors";
import { Link } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FIREBASE_DB } from "@/FirebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";



type Props = {
  listings: ListingType[];
  category: string;
};

const RestaurantListing = ({ listings, category }: Props) => {
  const [filteredListings, setFilteredListings] = useState<ListingType[]>(listings);
  const [wishlist, setWishlist] = useState<ListingType[]>([]);
  const [loading, setLoading] = useState(false);

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
      setLoading(true); // Start loading
      try {
        const restaurantsRef = collection(FIREBASE_DB, "restaurants"); // Access 'restaurants' collection
        let q = query(restaurantsRef);

        // Filter by category if specified
        if (category !== "All") {
          q = query(restaurantsRef, where("category", "==", category)); // Use 'where' filter
        }

        const snapshot = await getDocs(q); // Get documents based on query
        const restaurantsData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.restaurantName,
            imageUrl: data.restaurantImage,
            category: data.category,
            location: data.location || "Unknown", // Provide default value for location
            rating: data.rating || "No ratings",           // Provide default value for rating
            cuisine: data.cuisine || "Unknown",   // Provide default value for cuisine
            priceRange: data.priceRange || "Unknown", // Provide default value for price range
            isOpen: data.isOpen || true,          // Provide default value for isOpen
            description: data.description || "No description available", // Provide default value for description
          };
        });
        

        setFilteredListings(restaurantsData);
      } catch (error) {
        console.error("Error fetching restaurants: ", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchRestaurants();
  }, [category]);

  // Toggle wishlist
  const handleWishlistToggle = async (item: ListingType) => {
    const isAlreadyInWishlist = wishlist.some((wishlistItem) => wishlistItem.id === item.id);
    let updatedWishlist;
  
    if (isAlreadyInWishlist) {
      // Remove the item from the wishlist
      updatedWishlist = wishlist.filter((wishlistItem) => wishlistItem.id !== item.id);
      Alert.alert("Removed", `${item.name} has been removed from your wishlist.`);
    } else {
      // Add the item to the wishlist
      updatedWishlist = [...wishlist, item];
      Alert.alert("Added", `${item.name} has been added to your wishlist.`);
    }
  
    setWishlist(updatedWishlist);
    await saveWishlist(updatedWishlist); // Persist wishlist to AsyncStorage
  };
  const renderItems = ({ item }: { item: ListingType }) => {
    const isInWishlist = wishlist.some((wishlistItem) => wishlistItem.id === item.id);

    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Link href={`/listing/${item.id}`} asChild>
          <TouchableOpacity style={styles.card}>
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
        </Link>
        {/* Make the heart icon clickable separately */}
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
      <FlatList
        data={loading ? [] : filteredListings}
        renderItem={renderItems}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </GestureHandlerRootView>
  );
};

export default RestaurantListing;

const styles = StyleSheet.create({
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
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    marginLeft: 10,
    marginTop: 10,
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
    flex: 1, // Take available space in the row
  },
  itemLocationTxt: {
    fontSize: 12,
    marginLeft: 5,
    flexShrink: 1,
    fontWeight: "bold", // Allows the text to shrink if needed
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
});