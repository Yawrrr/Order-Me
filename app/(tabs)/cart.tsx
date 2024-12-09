import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";



import { colors } from "../../constants/colors";

import { fonts } from "../../src/utils/font";

import StartNewCartCard from "../../components/MyCarts/StartNewCartCard";
import { FIREBASE_AUTH } from "../../FirebaseConfig";

export default function cart() {
  const [userCart, setUserCart] = useState("");

  const auth = FIREBASE_AUTH;

  return (
    <SafeAreaView style={{ height: "100%", padding: 25, paddingTop: 15 }}>
      <View style={styles.header}>
        <Text style={styles.title}>My Carts</Text>
      </View>

      {userCart?.length == 0 ? <StartNewCartCard /> : null}
    </SafeAreaView>
  );
}

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
