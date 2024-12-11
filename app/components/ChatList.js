//View for customer, Display the user that registered a restaurant
import { View, FlatList, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { FIREBASE_DB } from "@/FirebaseConfig";  // Import Firestore configuration
import { collection, getDocs } from 'firebase/firestore';
import ChatItem from '../components/ChatItem';

export default function ChatList() {
  const router = useRouter();
  const [users, setUsers] = useState([]);  // State to hold the users data
  const [loading, setLoading] = useState(true);  // State to handle loading indicator

  useEffect(() => {
    // Function to fetch users from Firestore
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(FIREBASE_DB, 'users');  // Access 'users' collection
        const querySnapshot = await getDocs(usersCollection);
        const usersData = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(user => user.restaurantName);  // Filter users who have a restaurantName field
          
        setUsers(usersData);  // Update the state with fetched users
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);  // Hide the loading indicator after fetch
      }
    };
    
    fetchUsers();  // Call the fetch function
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />  {/* Show a loading spinner */}
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FlatList
        data={users}
        contentContainerStyle={{ flex: 1, paddingVertical: 25 }}
        keyExtractor={(item) => item.id}  // Use user ID as the key for each item
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <ChatItem
            noBoarder={index + 1 === users.length}
            router={router}
            item={item}
            index={index}
          />
        )}
      />
    </View>
  );
}




