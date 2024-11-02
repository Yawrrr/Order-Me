import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import icons from "@/constants/images";
import CustomButton from "../components/CustomButton";
import { router } from "expo-router";
const App = () => {
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.info}>
          <Image source={icons.logo}></Image>
          <Text>Welcome to Order Me!</Text>
        </View>
        <CustomButton
          title="Continue with Email"
          handleOnPress={() => router.replace("/sign-in")}
        ></CustomButton>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: "center",
    height: "100%",
    gap: 16
  },
  info: {
    alignItems: "center",
    marginBottom: 64
  },
});
