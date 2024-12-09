import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image } from "react-native";

const Menu = () => {
  // Updated menu items
  const menuItems = [
    {
      id: 1,
      name: "Fried Rice",
      price: "RM 12.00",
      description: "A delicious stir-fried rice with vegetables, eggs, and a savory sauce.",
      imageUrl: "https://via.placeholder.com/150?text=Fried+Rice"
    },
    {
      id: 2,
      name: "Fried Noodle",
      price: "RM 13.50",
      description: "A flavorful stir-fried noodle dish with vegetables, eggs, and your choice of protein.",
      imageUrl: "https://via.placeholder.com/150?text=Fried+Noodle"
    },
    {
      id: 3,
      name: "Fried Beehoon",
      price: "RM 11.50",
      description: "Stir-fried rice vermicelli with vegetables, eggs, and a light soy-based sauce.",
      imageUrl: "https://via.placeholder.com/150?text=Fried+Beehoon"
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Menu</Text>
      </View>

      <ScrollView contentContainerStyle={styles.menuContainer}>
        {menuItems.map((item) => (
          <View key={item.id} style={styles.menuItem}>
            {/* Image comes first */}
            <Image source={{ uri: item.imageUrl }} style={styles.menuImage} />
            <View style={styles.menuDetails}>
              <Text style={styles.menuName}>{item.name}</Text>
              <Text style={styles.menuPrice}>{item.price}</Text>
              <Text style={styles.menuDescription}>{item.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Menu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 30,
    color: "orange",
  },
  menuContainer: {
    paddingBottom: 20,
  },
  menuItem: {
    flexDirection: "row", // Image and details are arranged horizontally
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
  },
  menuImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  menuDetails: {
    flex: 1,
  },
  menuName: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: "#333",
  },
  menuPrice: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: "orange",
    marginVertical: 5,
  },
  menuDescription: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#777",
  },
});
