import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const message = () => {
  return (
  <SafeAreaView>
    <View>
      <Text>
        Message Page
      </Text>
    </View>
  </SafeAreaView>
  );
};

export default message;

const styles = StyleSheet.create({});
