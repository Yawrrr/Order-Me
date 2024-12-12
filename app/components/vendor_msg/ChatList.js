import { View, FlatList, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { FIREBASE_DB } from "@/FirebaseConfig";  // Import Firestore configuration
import { collection, getDocs } from 'firebase/firestore';
import ChatItem from './ChatItem';

export default function ChatList({users, currentUser}) {
  const router = useRouter();

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
            currentUser={currentUser}
            item={item}
            index={index}
          />
        )}
      />
    </View>
  );
}