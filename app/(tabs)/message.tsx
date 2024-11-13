import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const message = () => {
  return (
  <SafeAreaView style={{ height: "100%", padding: 25, paddingTop: 15 }}>
    <View style={styles.header}>
      <Text style={styles.title}>
        Message
      </Text>
    </View>
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
