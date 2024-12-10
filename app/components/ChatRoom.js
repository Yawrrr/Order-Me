import { View, Text, TouchableOpacity, TextInput, Alert, StyleSheet, Image } from 'react-native'; 
import React, { useState, useEffect, useRef } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { FIREBASE_DB } from "@/FirebaseConfig";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import Feather from '@expo/vector-icons/Feather';
import { getRoomId } from '../../utils/common';
import { doc, setDoc, getDocs, Timestamp, collection, addDoc, query, onSnapshot, orderBy } from 'firebase/firestore'; 
import { useAuth } from "@/context/AuthContext";
import { Entypo, Ionicons } from '@expo/vector-icons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import MessageList from './MessageList';

export default function ChatRoom() {
  const item = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const textRef = useRef('');
  const inputRef = useRef(null);

  // useEffect(() => {
  //   createRoomIfNotExists();
  //   let roomId = getRoomId(user?.userEmail, item?.userEmail);
  //   const docRef = doc(FIREBASE_DB, "rooms", roomId);
  //   const messagesRef = collection(docRef, 'messages');
  //   const q = query(messagesRef, orderBy('createdAt', 'asc'));
  
  //   const unsub = onSnapshot(q, (snapshot) => {
  //     let allMessages = [];
  //     snapshot.forEach((doc) => {
  //       allMessages.push(doc.data()); // Push the entire message data
  //     });
  //     console.log("Message",messages);
  //     setMessages(allMessages); // Update the state with the full message data
  //   });
  
  //   return unsub;
  // }, []);

    
  // useEffect(() => {
  //   createRoomIfNotExists();
  //   let roomId = getRoomId(user?.userEmail, item?.userEmail);
  //   const docRef = doc(FIREBASE_DB, "rooms", roomId);
  //   const messagesRef = collection(docRef, 'messages'); //inside rooms collection
  //   const q = query(messagesRef, orderBy('createdAt', 'asc'));

  //   let unsub = onSnapshot(q, (snapshot) => {
  //     let allMessages = snapshot.docs.map(doc =>{
  //       return doc.data();
  //     });
  //     setMessages([...allMessages]);
  //   });

  //   return unsub;
  // }, []);
  useEffect(() => {
    createRoomIfNotExists();
    let roomId = getRoomId(user?.email, item?.email);
    const docRef = doc(FIREBASE_DB, 'rooms', roomId);
    const messagesRef = collection(docRef, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));
  
    const fetchMessages = async () => {
      try {
        const querySnapshot = await getDocs(q);
        let allMessages = querySnapshot.docs.map(doc => doc.data());
        setMessages(allMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
  
    fetchMessages();
  }, []);

  const createRoomIfNotExists = async () => {
    const roomId = getRoomId(user?.email, item?.email);
    console.log("Room ID:", roomId);
    console.log("Messages Ref:", messagesRef);

    await setDoc(doc(FIREBASE_DB, "rooms", roomId), {
      roomId,
      createdAt: Timestamp.fromDate(new Date()),
    });
  };

  const handleSendMessage = async () => {
    let message = textRef.current.trim();
    if (!message) return;
    try {
      let roomId = getRoomId(user?.email, item?.email);
      const docRef = doc(FIREBASE_DB, 'rooms', roomId);
      const messagesRef = collection(docRef, "messages");
      // Log to verify message creation
      console.log("Sending message:", message);

      textRef.current = "";
      if (inputRef) inputRef?.current.clear();

      const newDoc = await addDoc(messagesRef, {
        email: user?.email,
        text: message,
        senderName: user?.username,
        createdAt: Timestamp.fromDate(new Date())
      });
      console.log("Message sent", newDoc.id);
    } catch (error) {
      Alert.alert('Message', error.message);
    }
  };

console.log("Message:",messages);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ChatRoomHeader user={item} router={router} />
      
      <View style={styles.messageContainer}>
        <MessageList messages={messages} currentUser={user} />
      </View>

      {/* Message Input Section */}
      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            onChangeText={value => textRef.current = value}
            placeholder="Type message..."
            style={styles.textInput}
          />
          <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
            <Feather name="send" size={hp(2.7)} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const ChatRoomHeader = ({ user, router }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={() => router.back()} style={styles.leftHeader}>
      <Entypo name='chevron-left' size={hp(4)} color="#737373" />
    </TouchableOpacity>
    <View style={styles.userInfo}>
      {/* Optional: Profile Image */}
      {/* <Image
        source={{ uri: user?.profileUrl }}
        style={styles.profileImage}
      /> */}
      <Text style={styles.username}>{user?.username}</Text>
    </View>
    <TouchableOpacity style={styles.rightHeader}>
      <Ionicons name="call" size={hp(3)} color="#737373" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingTop: hp(6.5),
    paddingBottom: hp(1.5),
    paddingHorizontal: wp(5),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  username: {
    fontSize: hp(2.5),
    color: 'black',
    fontWeight: '500',
  },
  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  messageContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  inputWrapper: {
    marginBottom: hp(2.7),
    paddingHorizontal: wp(5),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
  },
  textInput: {
    flex: 1,
    fontSize: hp(2),
    color: '#333',
    paddingVertical: hp(1),
  },
  sendButton: {
    backgroundColor: 'orange', // Orange color
    padding: wp(2),
    borderRadius: 50,
    marginLeft: wp(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
 // Optional: Style for profile image if used
  // profileImage: {
  //   height: hp(5),
  //   width: hp(5),
  //   borderRadius: 50, // Circular profile image
  //   marginLeft: hp(1),
  // },
});


// import { View, Text, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native'; 
// import React, { useState, useEffect, useRef } from 'react';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import { useLocalSearchParams } from 'expo-router';
// import { FIREBASE_DB } from "@/FirebaseConfig";
// import ChatRoomHeader from './ChatRoomHeader';
// import MessageList from './MessageList';
// import { StatusBar } from "expo-status-bar";
// import { useRouter } from "expo-router";
// import Feather from '@expo/vector-icons/Feather';
// import { getRoomId } from '../../utils/common';
// import { doc, setDoc, Timestamp, collection, addDoc, query, onSnapshot, orderBy } from 'firebase/firestore';  // Added collection and addDoc
// import { useAuth } from "@/context/AuthContext";

// export default function ChatRoom() {
//   const item = useLocalSearchParams();
//   const { user } = useAuth();
//   const router = useRouter();
//   const [messages, setMessages] = useState([]);
//   const textRef = useRef('');
//   const inputRef = useRef(null);

//   useEffect(() => {
//     createRoomIfNotExists();
//     let roomId = getRoomId(user?.userEmail, item?.userEmail);
//     const docRef = doc(FIREBASE_DB, 'rooms', roomId);
//     const messagesRef = collection(docRef, 'messages');
//     const q = query(messagesRef, orderBy('createdAt', 'asc'));

//     const unsub = onSnapshot(q, (snapshot) => {
//       let allMessages = snapshot.docs.map(doc => doc.data());
//       setMessages([...allMessages]);
//     });

//     return unsub;
//   }, []);

//   const createRoomIfNotExists = async () => {
//     const roomId = getRoomId(user?.email, item?.email);
//     await setDoc(doc(FIREBASE_DB, "rooms", roomId), {
//       roomId,
//       createdAt: Timestamp.fromDate(new Date()),
//     });
//   };

//   const handleSendMessage = async () => {
//     let message = textRef.current.trim();
//     if (!message) return;
//     try {
//       let roomId = getRoomId(user?.email, item?.email);
//       const docRef = doc(FIREBASE_DB, 'rooms', roomId);
//       const messagesRef = collection(docRef, "messages");
//       textRef.current = "";
//       if (inputRef) inputRef?.current.clear();
//       await addDoc(messagesRef, {
//         email: user?.email,
//         text: message,
//         senderName: user?.username,
//         createdAt: Timestamp.fromDate(new Date())
//       });
//     } catch (error) {
//       Alert.alert('Message', error.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar style="dark" />
//       <ChatRoomHeader user={item} router={router} />
//       <View style={styles.divider} />
//       <View style={styles.messageContainer}>
//         <MessageList messages={messages} currentUser={user} />
//       </View>

//       {/* Message Input Section */}
//       <View style={styles.inputWrapper}>
//         <View style={styles.inputContainer}>
//           <TextInput
//             ref={inputRef}
//             onChangeText={value => textRef.current = value}
//             placeholder="Type message..."
//             style={styles.textInput}
//           />
//           <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
//             <Feather name="send" size={hp(2.7)} color="#fff" />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   divider: {
//     height: 90, //header
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   messageContainer: {
//     flex: 1,
//     backgroundColor: '#f9f9f9',
//   },
//   inputWrapper: {
//     marginBottom: hp(2.7),
//     paddingHorizontal: wp(5),
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 25,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     paddingVertical: hp(1),
//     paddingHorizontal: wp(4),
//   },
//   textInput: {
//     flex: 1,
//     fontSize: hp(2),
//     color: '#333',
//     paddingVertical: hp(1),
//   },
//   sendButton: {
//     backgroundColor: 'orange',  // Orange color
//     padding: wp(2),
//     borderRadius: 50,
//     marginLeft: wp(2),
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });
