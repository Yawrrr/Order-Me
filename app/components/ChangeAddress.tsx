import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  GestureHandlerRootView,
  Gesture,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { router } from "expo-router";

const ChangeAddress = () => {

  return (
    <GestureHandlerRootView>
      <SafeAreaView>
        <View>
          <TouchableWithoutFeedback onPress={router.back}>
            <Text>back</Text>
          </TouchableWithoutFeedback>
          <Text>Change Address</Text>
        </View>
        <View></View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default ChangeAddress;

const styles = StyleSheet.create({});
