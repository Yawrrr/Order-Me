import { StyleSheet, Text, TouchableOpacity, Touchable, View } from "react-native";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";

const Addresses = () => {

  const{user} = useAuth();

  const goBack = () => {
    router.back();
  }

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backbtn} onPress={goBack}>
          <Ionicons name="chevron-back-outline" size={16} color="black" />
          <Text>Back</Text>
        </TouchableOpacity>
        <View>
          <Text>My Addresses</Text>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Addresses;

const styles = StyleSheet.create({
  container:{
    flex: 1,
    flexDirection:"column",
    padding: 16,
  },
  backbtn:{
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "20%",
    marginBottom: 16,
  },
  icon:{
    // height: 16,
    // width: 16,
  }
});
