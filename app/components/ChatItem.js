import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRouter } from "expo-router";
import { FIREBASE_DB } from "@/FirebaseConfig";  // Import Firestore config
import { doc, getDoc } from 'firebase/firestore';  // Firestore methods for fetching data

export default function ChatItem({ item, noBoarder }) {
  const [userData, setUserData] = useState(null);  // State to hold user profile data
  const [lastMessage, setLastMessage] = useState('');  // State to hold last message
  const router = useRouter();

  useEffect(() => {
    // Fetch user data from Firestore using user ID
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(FIREBASE_DB, 'users', item.id);  // Reference to the user document
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setUserData(userDoc.data());  // Set user data from Firestore
        } else {
          console.log('No such user!');
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Fetch last message from messages collection
    const fetchLastMessage = async () => {
      try {
        // Example: Replace with your logic to get the last message for each chat
        const lastMessageText = "Example: Display last message";  // Placeholder for now
        setLastMessage(lastMessageText);
      } catch (error) {
        console.error("Error fetching last message:", error);
      }
    };

    fetchUserData();
    fetchLastMessage();
  }, [item.id]);  // Fetch data when item.id changes

  const openChatRoom = () => {
    router.push({ pathname: '/components/ChatRoom', params: item });
  };

  return (
    <TouchableOpacity
      onPress={openChatRoom}
      style={[
        styles.chatItemContainer,
        noBoarder && styles.noBorder
      ]}
    >
      <Image
        source={userData?.profileUrl ? { uri: userData.profileUrl } : require('../../assets/images/profile.jpeg')} // Use profile URL or fallback image
        style={styles.profileImage}
      />
      <View style={styles.textContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.usernameText}>
            {userData?.username || 'Name'}
          </Text>
          <Text style={styles.timeText}>
            {item?.lastMessageTime || 'Time'}
          </Text>
        </View>
        <Text style={styles.lastMessageText}>
          {lastMessage || 'Example: Display last message'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = {
  chatItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
    paddingBottom: hp(1),
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',  // Light border color for separation
  },
  noBorder: {
    borderBottomWidth: 0,  // Remove border if `noBoarder` is true
  },
  profileImage: {
    width: hp(6),
    height: hp(6),
    borderRadius: 50, // Circular profile image
    shadowColor: '#000', // Shadow for image
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  textContainer: {
    flex: 1,
    marginLeft: wp(3),
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(0.5),
  },
  usernameText: {
    fontSize:14,
    fontFamily: 'Poppins-Bold',
    color: '#333',  // Dark text for username
  },
  timeText: {
    fontSize: hp(1.6),
    fontFamily: 'Poppins-Regular',
    color: '#A0AEC0',  // Lighter text for time
  },
  lastMessageText: {
    fontSize: hp(1.6),
    fontFamily: 'Poppins-Regular',
    color: '#4A5568',  // Neutral color for last message text
  },
};
