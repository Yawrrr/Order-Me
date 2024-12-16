import React, { useState, useEffect } from "react";
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
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons"; // Updated import for MaterialIcons
import { colors } from "@/constants/colors";
import { Link } from "expo-router";  // For navigation in expo-router
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRouter } from "expo-router"; // Import useRouter for back navigation

// Empty wishlist message component
const EmptyWishlistMessage = () => (
  <View style={styles.emptyWishlistContainer}>
    <Ionicons name="heart-outline" size={50} color={colors.secondary[200]} />
    <Text style={styles.emptyWishlistText}>Your wishlist is empty!</Text>
    <Text style={styles.emptyWishlistSubText}>Add items to your wishlist.</Text>
  </View>
);

const Wishlist = () => {
  const [wishlist, setWishlist] = useState<ListingType[]>([]);
  const { back } = useRouter(); // Access the router for navigation

  // Load wishlist items on mount
  useEffect(() => {
    const loadWishlist = async () => {
      const savedWishlist = await getWishlist();
      setWishlist(savedWishlist);
    };
    loadWishlist();
  }, []);

  // Toggle wishlist (for heart icon)
  const handleWishlistToggle = async (item: ListingType) => {
    const isAlreadyInWishlist = wishlist.some(
      (wishlistItem) => wishlistItem.id === item.id
    );
    let updatedWishlist;

    if (isAlreadyInWishlist) {
      updatedWishlist = wishlist.filter(
        (wishlistItem) => wishlistItem.id !== item.id
      );
      Alert.alert("Removed", `${item.name} has been removed from your wishlist.`);
    } else {
      updatedWishlist = [...wishlist, item];
      Alert.alert("Added", `${item.name} has been added to your wishlist.`);
    }

    setWishlist(updatedWishlist);
    await saveWishlist(updatedWishlist); // Persist wishlist to AsyncStorage
  };

  // Render item for each listing in wishlist
  const renderItems = ({ item }: { item: ListingType }) => {
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
      </GestureHandlerRootView>
    );
  };

  return (
    <View style={styles.container}>
      {/* Custom header with back button */}
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={back}>
          <MaterialIcons name="arrow-back-ios" size={28} color="black" /> {/* Improved back icon */}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wishlist</Text>
      </View>

      {/* If wishlist is empty, show the EmptyWishlistMessage */}
      {wishlist.length === 0 ? (
        <EmptyWishlistMessage />
      ) : (
        <FlatList
          data={wishlist}
          renderItem={renderItems}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false} // Vertical scrolling
        />
      )}
    </View>
  );
};

// Disable the default header
Wishlist.options = {
  headerShown: false, // Disable the default header
};

export default Wishlist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  customHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: colors.primary[200],
    elevation: 5, // Optional: Adds shadow to the header
  },
  headerTitle: {
    fontSize: 28, // Slightly larger font size for better readability
    fontWeight: "bold",
    color: colors.secondary.DEFAULT,
    marginLeft: 20,
    marginBottom:5
 
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 20,
    width: 220,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    position: "relative", // Make sure that the heart icon stays inside the card
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 30,
  },
  itemTxt: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.secondary[200],
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Ensures space between location and rating
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
  emptyWishlistContainer: {
    flex: 1,
   marginTop:100,
    alignItems: "center",
    padding: 20,
  },
  emptyWishlistText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.secondary[200],
    marginTop: 10,
  },
  emptyWishlistSubText: {
    fontSize: 14,
    color: colors.secondary[200],
    marginTop: 5,
  },
});
