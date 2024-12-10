import { Image, StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity } from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from 'expo-router';
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
  const onCatChanged = (category: string) => {
    console.log("Category:", category);
    setCategory(category);
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
            {/* Row container for Image and Menu icon */}
            <View style={styles.rowContainer}>
              <TouchableOpacity onPress={() => {}}>
                <Ionicons name="menu" size={20} color={colors.black.DEFAULT} style={styles.menuIcon} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {}}>
                <Image
                  source={favicon}
                  style={styles.testImage}
                  onError={(error) => console.error('Test image error:', error.nativeEvent.error)}
                  onLoad={() => console.log('Test image loaded')}
                />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.heading}>Order Me</Text>
            
            {/* Wrapper for search input and filter icon */}
            <View style={styles.searchWrapper}>
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={colors.black.DEFAULT} style={styles.searchIcon} />
                <TextInput
                  placeholder="Search..."
                  style={styles.searchInput}
                />
              </View>
              <TouchableOpacity onPress={() => {}}>
                <Ionicons name="filter" size={20} color='white' style={styles.filterIcon} />
              </TouchableOpacity>
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
     // Extra padding at the bottom for better scrolling experience
  },
  content: {
    flex: 1,
    padding: 16,
  },
  rowContainer: {
    flexDirection: 'row', // Arrange items in a row
    alignItems: 'center', // Center items vertically in the row
  },
  testImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#e1e1e1',
    marginLeft: 280, // Adjust based on your layout needs
    marginRight: 10,
  },
  menuIcon: {
    marginLeft: 5,
  },
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.secondary.DEFAULT,
    marginTop: 10,
    marginLeft: 5,
  },
  searchWrapper: {
    flexDirection: 'row', // Align searchContainer and filter icon in a row
    alignItems: 'center',
    marginTop: 15,
  },
  searchContainer: {
    flexDirection: 'row', // Align icon and input horizontally
    alignItems: 'center',
    backgroundColor: 'white', // Light gray background for input field
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: 300, // Adjust as needed
  },
  searchIcon: {
    marginRight: 8, // Space between icon and input
  },
  searchInput: {
    flex: 1, // Take up remaining space
    fontSize: 16,
    color: colors.black.DEFAULT,
  },
  filterIcon: {
    marginLeft: 15,
    backgroundColor: colors.secondary.DEFAULT,
    padding: 12,
    borderRadius: 10,
    // Add space between searchContainer and filter icon
  },
  title: {
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