import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TextInput, Button, Alert } from "react-native";
import { getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { itemsRef } from '../../FirebaseConfig'; // Adjust the import based on your folder structure

// Define the Item type
interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

const MenuScreen = () => {
  // Define the state
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedPrice, setEditedPrice] = useState("");
  const [editedImageUrl, setEditedImageUrl] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(itemsRef);
        const fetchedItems = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Item[];
        setItems(fetchedItems);
      } catch (error) {
        console.error("Error fetching items: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Handle deleting an item
  const handleDeleteItem = async (id: string) => {
    try {
      await deleteDoc(doc(itemsRef, id));
      setItems(items.filter(item => item.id !== id)); // Remove item from state after deletion
      Alert.alert("Success", "Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item: ", error);
      Alert.alert("Error", "Failed to delete item.");
    }
  };

  // Handle editing an item
  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setEditedName(item.name);
    setEditedDescription(item.description);
    setEditedPrice(item.price.toString());
    setEditedImageUrl(item.imageUrl);
  };

  // Save edited item
  const handleSaveChanges = async () => {
    if (!editedName || !editedDescription || !editedPrice || !editedImageUrl) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const itemDoc = doc(itemsRef, editingItem?.id || '');
      await updateDoc(itemDoc, {
        name: editedName,
        description: editedDescription,
        price: parseFloat(editedPrice),
        imageUrl: editedImageUrl,
      });
      setItems(items.map(item =>
        item.id === editingItem?.id ? { ...item, name: editedName, description: editedDescription, price: parseFloat(editedPrice), imageUrl: editedImageUrl } : item
      ));
      setEditingItem(null);
      Alert.alert("Success", "Item updated successfully!");
    } catch (error) {
      console.error("Error updating item: ", error);
      Alert.alert("Error", "Failed to update item.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Menu</Text>

      {editingItem ? (
        <View style={styles.editForm}>
          <TextInput
            style={styles.input}
            placeholder="Item Name"
            value={editedName}
            onChangeText={setEditedName}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={editedDescription}
            onChangeText={setEditedDescription}
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            value={editedPrice}
            onChangeText={setEditedPrice}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Image URL"
            value={editedImageUrl}
            onChangeText={setEditedImageUrl}
          />
          <Button title="Save Changes" onPress={handleSaveChanges} color="orange" />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardContent}>
                {/* Display image from the URL */}
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
                <View style={styles.itemInfo}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                  <Text style={styles.price}>RM {item.price}</Text>
                </View>
              </View>
              <View style={styles.actions}>
                <Button title="Edit" onPress={() => handleEditItem(item)} color="green" />
                <Button title="Delete" onPress={() => handleDeleteItem(item.id)} color="red" />
              </View>
            </View>
          )}
        />
      )}
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
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFA500",  // Orange color
    textAlign: "center",
    marginVertical: 20,
    
  },
  editForm: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  card: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  cardContent: {
    flexDirection: "row",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    color: "#007BFF",
  },
  actions: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "flex-end", // Align buttons to the right
    gap: 10, // Space between the buttons
  },
  input: {
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
});


export default MenuScreen;
