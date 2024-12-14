import AsyncStorage from '@react-native-async-storage/async-storage';
import { ListingType } from "@/type/listingType";

// Save wishlist to AsyncStorage
export const saveWishlist = async (wishlist: ListingType[]) => {
  try {
    console.log('Saving wishlist:', wishlist); // Debugging
    await AsyncStorage.setItem('wishlist', JSON.stringify(wishlist));
  } catch (error) {
    console.error('Error saving wishlist to AsyncStorage: ', error);
  }
};

// Get wishlist from AsyncStorage
export const getWishlist = async (): Promise<ListingType[]> => {
  try {
    const wishlistData = await AsyncStorage.getItem('wishlist');
    const parsedData = wishlistData ? JSON.parse(wishlistData) : [];
    console.log('Fetched wishlist from AsyncStorage:', parsedData); // Debugging
    return parsedData;
  } catch (error) {
    console.error('Error fetching wishlist from AsyncStorage: ', error);
    return [];
  }
};

