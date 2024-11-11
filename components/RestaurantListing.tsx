import { StyleSheet, View, Text,Image ,ListRenderItem} from 'react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import { ListingType } from '@/type/listingType';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { colors } from "@/constants/colors";
import { Link } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';

type Props = {
  listings: any[];
  category: string;
};

const RestaurantListing = ({ listings, category }: Props) => {
  const [filteredListings, setFilteredListings] = useState(listings);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('Update Listing');
    setLoading(true);
    filterListingsByCategory();
    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, [category, listings]);

  const filterListingsByCategory = () => {
    if (category === 'All') {
      setFilteredListings(listings);
    } else {
      const filtered = listings.filter((item) => item.category === category);
      setFilteredListings(filtered);
    }
  };

  const renderItems: ListRenderItem<ListingType> = ({ item }) => {
    return (
      
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Link href={`/listing/${item.id}`} asChild>
        <TouchableOpacity>
          <View style={styles.item}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={styles.favorite}>
              <Ionicons name="heart-outline" size={20} color="white" />
            </View>
            <Text style={styles.itemTxt} numberOfLines={1}>
              {item.name}
            </Text>

            {/* Container for location and rating */}
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
          </View>
        </TouchableOpacity>
      </Link>
      </GestureHandlerRootView>
    );
  };

  return (
    
    <GestureHandlerRootView style={{ flex: 1 }}>
    <View>
      <FlatList
        data={loading ? [] : filteredListings}
        renderItem={renderItems}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
    </GestureHandlerRootView>
  );
};


export default RestaurantListing;

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginRight: 20,
    width: 220,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 30,
  },
  favorite: {
    position: 'absolute',
    top: 185,
    right: 30,
    backgroundColor: colors.secondary[100],
    padding: 10,
    borderRadius: 30,
    borderColor: 'white',
    borderWidth: 2,
  },
  itemTxt: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.secondary[200],
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Ensures space between location and rating
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Take available space in the row
  },
  itemLocationTxt: {
    fontSize: 12,
    marginLeft: 5,
    flexShrink: 1,
    fontWeight:'bold' // Allows the text to shrink if needed
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    marginRight: 5,
   fontWeight:'bold'
  },
});
