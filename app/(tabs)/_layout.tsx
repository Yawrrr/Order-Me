import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack, Tabs } from "expo-router";

const TabLayout = () => {
  return (
    <>
      <Tabs>
        <Tabs.Screen name="home" options={{
          headerShown: false
        }}/>
        <Tabs.Screen name="cart" options={{
          headerShown: false,
        }}/>
        <Tabs.Screen name="message" options={{
          headerShown: false
        }}/>
        <Tabs.Screen name="profile" options={{
          headerShown: false
        }}/>
      </Tabs>
    </>
  );
};

export default TabLayout;

const styles = StyleSheet.create({});
