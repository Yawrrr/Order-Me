import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from "react-native";
import { getDocs } from "firebase/firestore";
import { itemsRef } from '../../FirebaseConfig'; // Adjust the number of `../` based on your folder structure

// Define the Item type
interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

const MenuScreen = () => {
  // Define the state with the correct type
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(itemsRef);
        const fetchedItems = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Item[];  // Type assertion to Item array
        setItems(fetchedItems);
      } catch (error) {
        console.error("Error fetching items: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="orange" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Menu</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Left-side Image */}
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            
            {/* Right-side content */}
            <View style={styles.textContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.price}>RM {item.price}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "orange", // Theme color for header
    textAlign: "center",
    marginBottom: 20, // Space below the header
  },
  card: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    flexDirection: "row", // Align image and text horizontally
    alignItems: "center", // Vertically center content
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16, // Add space between image and text
  },
  textContainer: {
    flex: 1, // Make the text container take up the remaining space
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black", // Theme color
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    color: "orange", // Use a bright orange/red color for the price
  },
});

export default MenuScreen;
