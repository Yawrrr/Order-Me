import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';

const TabLayout = () => {
  return (
    <>
      <Tabs screenOptions={{ tabBarActiveTintColor: 'orange' }}>
        <Tabs.Screen 
          name="menu" 
          options={{
            headerShown: false,
            title: 'Menu',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
            tabBarLabel: 'Menu',  // Explicitly setting label
          }} 
        />
        <Tabs.Screen 
          name="addmenu"  // New screen name
          options={{
            headerShown: false,
            title: 'AddMenu',
            tabBarIcon: ({ color }) => <FontAwesome size={24} name="plus" color={color} />,  // Add icon
            tabBarLabel: 'AddMenu',  // Explicitly setting label
          }} 
        />
        <Tabs.Screen 
          name="cart" 
          options={{
            headerShown: false,
            title: 'Order',
            tabBarIcon: ({ color }) => <Feather size={24} name="shopping-cart" color={color} />,
            tabBarLabel: 'Order',  // Explicitly setting label
          }} 
        />
        <Tabs.Screen 
          name="Profile" 
          options={{
            headerShown: false,
            title: 'Message',
            tabBarIcon: ({ color }) => <AntDesign name="message1" size={22} color={color} />,
            tabBarLabel: 'Message',  // Explicitly setting label
          }} 
        />

      </Tabs>
    </>
  );
};

export default TabLayout;

const styles = StyleSheet.create({});
