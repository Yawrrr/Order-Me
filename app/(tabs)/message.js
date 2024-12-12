import { StyleSheet, Text, View } from "react-native";
import React, {useEffect, useState} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import ChatList from '../components/ChatList';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import { userRef } from "@/FirebaseConfig";
import { doc, updateDoc, query, where, getDocs, collection, QuerySnapshot } from "firebase/firestore";

const message = () => {
  const { logout, user } = useAuth();
  const [users, setUsers] = useState([]);
  useEffect(()=>{
    if(user?.email)
      getUsers();
  },[])
  const getUsers = async ()=>{
    //fetch users
    const q =query(userRef, where('email', '!=', user?.email));
    const querySnapshot = await getDocs(q);
    let data = [];
    querySnapshot.forEach(doc=>{
      data.push({...doc.data()});
    });
      setUsers(data);
  }
  return (
  <SafeAreaView style={{ height: "100%", padding: 25, paddingTop: 15 }}>
    <View style={styles.header}>
      <Text style={styles.title}>
        Message
      </Text>
    </View>
    {users.length >0?(
      <ChatList currentUser={user} users={users} />
    ) : (
      <View className="flex items-center" style={{top: hp(30)}}></View>
    )
    }
  </SafeAreaView>
  );
};
export default message;
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 30,
    color: "orange",
  },
});