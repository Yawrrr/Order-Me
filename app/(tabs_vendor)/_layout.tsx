import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack, Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';

const TabLayout = () => {
  return (
    <>
      <Tabs screenOptions={{ tabBarActiveTintColor: 'orange' }}>
        <Tabs.Screen name="menu" options={{
          headerShown: false,
          title: 'Menu',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />
          
        }}/>
        <Tabs.Screen name="cart" options={{
          headerShown: false,
          title: 'Order',
          tabBarIcon: ({ color }) => <Feather size={24} name="shopping-cart" color={color} />
        }}/>
        <Tabs.Screen name="Profile" options={{
          headerShown: false,
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color}  />
        }}/>
       
      </Tabs>
    </>
  );
};

export default TabLayout;

const styles = StyleSheet.create({});
