import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { router } from "expo-router";

const profile = () => {
  return (
    <SafeAreaView>
      <View >
        <Text>
          Profile Page
        </Text>
        <TouchableOpacity onPress={() => {router.replace('/sign-in')}}>
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
