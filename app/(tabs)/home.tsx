import { Image, StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity } from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Stack } from 'expo-router';
import favicon from '../../assets/images/profile.jpeg';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from "@/constants/colors";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RestaurantListing from "../../components/RestaurantListing";
import restaurantData from '@/data/restaurants.json';
import groupData from '@/data/groups.json';
import GroupListings from "@/components/GroupListings";


type Category = {
  title: string;
  iconName: string;
};
const Categories: Category[] = [
  { title: "All", iconName: "food" },
  { title: "Mix Rice", iconName: "rice" },
  { title: "Indian Food", iconName: "food" },
  { title: "Western Food", iconName: "food" },
  { title: "Vegetarian", iconName: "food" },
  { title: "Others", iconName: "fruit-watermelon" },
];

const Home = () => {
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const onCatChanged = (category: string) => {
    console.log("Category:", category);
    setCategory(category);
  };

  const handleSearchNavigate = () => {
    if (searchQuery.trim()) {
      router.push({ pathname: "../components/search", params: { query: searchQuery } });
    }
  };
  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            headerTransparent: true,
            headerTitle: "",
            headerRight: () => (
              <TouchableOpacity onPress={() => {}}>
                <Ionicons name="menu" size={20} color={colors.black.DEFAULT} />
              </TouchableOpacity>
            ),
          }}
        />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.rowContainer}>
              <TouchableOpacity onPress={() => {}}>
                <Ionicons name="menu" size={25} color={colors.black.DEFAULT} style={styles.menuIcon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push("/components/wishlist")}>
                <Ionicons
                  name="heart"
                  size={30}
                  color='red'
                  style={styles.testImage}
                />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.heading}>Order Me</Text>
            
            <View style={styles.searchWrapper}>
              <View style={styles.searchContainer}>
                
                <TextInput
      placeholder="Search..."
      value={searchQuery}               
      onChangeText={setSearchQuery}    
      style={styles.searchInput}
      onSubmitEditing={handleSearchNavigate}
    />
    <TouchableOpacity onPress={handleSearchNavigate}>
      <Ionicons name="search" size={20} color={colors.black.DEFAULT} style={styles.searchIcon} />
    </TouchableOpacity>
    </View>
            </View>
            <CategoryButtons onCategoryChanged={onCatChanged} />
            <RestaurantListing listings={restaurantData} category={category} />
            <GroupListings listings={groupData} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Home;

type Props = {
  onCategoryChanged: (category: string) => void;
};
const CategoryButtons = ({ onCategoryChanged }: Props) => {
  const scrollRef = useRef<ScrollView>(null);
  const itemRef = useRef<(TouchableOpacity | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSelectCategory = (index: number) => {
  setActiveIndex(index);
  const selected = itemRef.current[index];
  selected?.measure((x: number, y: number, width: number, height: number, pageX: number) => {
    scrollRef.current?.scrollTo({ x: pageX - 10, animated: true });
  });
  onCategoryChanged(Categories[index].title);
};

  return (
    <View>
      <Text style={styles.title}>Categories</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={scrollRef}
        contentContainerStyle={{
          gap: 20,
          paddingVertical: 10,
          marginBottom: 10,
        }}
      >
        {Categories.map((item, index) => (
          <TouchableOpacity
            key={index}
            ref={(el) => (itemRef.current[index] = el!)}
            onPress={() => handleSelectCategory(index)}
            style={activeIndex === index ? styles.categoryBtnActive : styles.categoryBtn}
          >
            <MaterialCommunityIcons
              name={item.iconName as any}
              size={20}
              color={activeIndex === index ? colors.white.DEFAULT : colors.black.DEFAULT}
            />
            <Text style={activeIndex === index ? styles.categoryBtnActiveText : styles.categoryBtnText}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollContent: {
    paddingBottom: 20,
    
  },
  content: {
    flex: 1,
    padding: 16,
  },
  rowContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  testImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor:'white',
    padding:5,
   marginTop:20,
    marginLeft: 270, 
    marginRight: 10,
  },
  menuIcon: {
    backgroundColor:'white',
    width: 40,
    height: 40,
    borderRadius: 10,
    padding:8,
   marginTop:20,
   
 
  },
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.secondary.DEFAULT,
    marginTop: 10,
    marginLeft: 5,
  },
  searchWrapper: {
    flexDirection: 'row', 
    alignItems: 'center',
    marginTop: 15,
  },
  searchContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: 'white', 
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: 350,
    marginLeft:5, 
  },
  searchIcon: {
    marginRight: 8, 
  },
  searchInput: {
    flex: 1, 
    fontSize: 16,
    color: colors.black.DEFAULT,
  },
  title: {
    marginTop:10,
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.black.DEFAULT,
  },
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: "#333333",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  categoryBtnText: {
    marginLeft: 3,
    color: 'black',
    fontWeight: 'bold',
  },
  categoryBtnActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary.DEFAULT,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: "#333333",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  categoryBtnActiveText: {
    marginLeft: 3,
    color: 'white',
    fontWeight: 'bold',
  },
});