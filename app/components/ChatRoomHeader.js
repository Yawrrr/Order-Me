import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import { Entypo } from '@expo/vector-icons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ChatRoomHeader({ user, router }) {
  return (
    <Stack.Screen
      options={{
        title: '',
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,  // Removes shadow on Android
        },
        headerLeft: () => (
          <View className="flex-row items-center gap-4">
            <TouchableOpacity onPress={() => router.back()}>
              <Entypo name='chevron-left' size={hp(4)} color="#737373" />
            </TouchableOpacity>
            <View className="flex-row items-center gap-3">
              {/* <Image
                source={{ uri: user?.profileUrl }} // Assuming 'profileUrl' is a URI string
                style={{
                  height: hp(5),
                  width: hp(5),
                  borderRadius: 50, // Ensuring the image is circular
                  marginLeft: hp(1),
                }}
              /> */}
              <Text style={{ fontSize: hp(2.5), color: 'black' }} className="font-medium">
                {user?.username}
              </Text>
            </View>
          </View>
        ),
        headerRight: () => (
          <View className="flex-row items-center gap-8">
            <Ionicons name="call" size={hp(3)} color={'#737373'} />
          </View>
        ),
      }}
    />
  );
}
