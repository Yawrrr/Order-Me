import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import { Ionicons ,MaterialIcons} from "@expo/vector-icons";
import { colors } from "@/constants/colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useLocalSearchParams, router } from "expo-router";
import restaurantData from "@/data/restaurants.json";
import { ListingType } from "@/type/listingType";
import { useRouter } from "expo-router";


const search = () => {
  const { query } = useLocalSearchParams<{ query: string }>();
  const [searchResults, setSearchResults] = useState<ListingType[]>([]);
  const [inputQuery, setInputQuery] = useState<string>(query || "");
const { back } = useRouter(); 
  useEffect(() => {
    performSearch();
  }, [inputQuery]);

  const performSearch = () => {
    if (inputQuery) {
      const filteredResults = restaurantData.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(inputQuery.toLowerCase())
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  };

  const renderItem = ({ item }: { item: ListingType }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/listing/${item.id}`)} 
    >
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.location}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}> 
        <TouchableOpacity onPress={back}>
          <MaterialIcons name="arrow-back-ios" size={28} color="black" style={styles.backIcon}/> 
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Search restaurants..."
            value={inputQuery}
            onChangeText={setInputQuery}
            style={styles.searchInput}
          />
          <TouchableOpacity onPress={performSearch}>
            <Ionicons name="search" size={24} color={colors.black.DEFAULT} />
          </TouchableOpacity>
        </View>
        {searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.noResultContainer}>
            <Text style={styles.noResultText}>No restaurants found</Text>
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  details: {
    marginLeft: 10,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.secondary.DEFAULT,
  },
  location: {
    fontSize: 14,
    color: colors.black.DEFAULT,
    marginTop: 5,
  },
  noResultContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noResultText: {
    fontSize: 18,
    color: colors.black.DEFAULT,
  },
  backIcon:{
    paddingTop: 20,
    paddingBottom: 10,
    marginBottom:5 
  },
});
