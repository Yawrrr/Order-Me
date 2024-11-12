import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";

const profile = () => {

  const {logout} = useAuth();

  const handleLogout = async() => {
    await logout();
  }

  return (
    <SafeAreaView>
      <View >
        <Text>
          Profile Page
        </Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default profile;

const styles = StyleSheet.create({});
