import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRouter } from "expo-router";
import { FIREBASE_DB } from "@/FirebaseConfig";  // Import Firestore config
import { doc, getDoc, collection,orderBy,query,onSnapshot, limit } from 'firebase/firestore';  // Firestore methods for fetching data
import { formatDate, getRoomId } from '../../utils/common';

export default function ChatItem({ item, router, noBoarder,currentUser  }) {
  const [lastMessage, setLastMessage] = useState('');  // State to hold last message
  
  useEffect(() => {
    // Fetch user data from Firestore using user ID
    let roomId = getRoomId(currentUser?.email, item?.email);
    const docRef = doc(FIREBASE_DB, "rooms", roomId);
    const messagesRef = collection(docRef, 'messages'); //inside rooms collection
    const q = query(messagesRef, orderBy('createdAt', 'desc'));


    let unsub = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        let allMessages = snapshot.docs.map(doc =>{
          return doc.data();
        });
        setLastMessage(allMessages[0]? allMessages[0]: null);
      }
      
    });
    return unsub;
  }, []);

  
  
  
  const openChatRoom = () => {
    router.push({ pathname: '/components/ChatRoom', params: item });
  };

  const renderTime =()=>{
    if(lastMessage){
      console.log("last msg: ", lastMessage?.createdAt);
      let date =lastMessage?.createdAt;
      return formatDate(new Date(date?.seconds * 1000));
    }
    return 'Time';
  }

  
  

  const renderLastMessage =()=>{
    if(typeof lastMessage == 'undefined') return 'Loading...';
    if(lastMessage){
      if(currentUser?.email == lastMessage?.email) return "You: " +lastMessage?.text;
      return lastMessage?.text;
    }else{
      return 'Say Hi 👋';
    }
  }


  return (
    <TouchableOpacity
      onPress={openChatRoom}
      style={[
        styles.chatItemContainer,
        noBoarder && styles.noBorder
      ]}
    >
      <Image
        source={item?.profileUrl ? { uri: item.profileUrl } : require('../../assets/images/profile.jpeg')} // Use profile URL or fallback image
        style={styles.profileImage}
      />
      <View style={styles.textContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.usernameText}>
            {item?.username || 'Name'}
          </Text>
          <Text style={styles.timeText}>
            {renderTime()}
          </Text>
        </View>
        <Text style={styles.lastMessageText}>
          {renderLastMessage()}
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
    borderBottomWidth: 0,  // Remove border if noBoarder is true
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