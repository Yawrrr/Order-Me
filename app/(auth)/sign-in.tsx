import {
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import CustomTextInput from "@/components/CustomTextInput";
import { colors } from "@/constants/colors";
import { Link, router } from "expo-router";
import CustomButton from "@/components/CustomButton";

const signIn = () => {
  return (
    <SafeAreaView style={{height: "100%"}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.info}>
              <Image source={images.man} style={styles.image}></Image>
              <Text>Let's sign in to continue order me</Text>
            </View>
            <View style={styles.form}>
              <CustomTextInput placeholder="Email"></CustomTextInput>
              <CustomTextInput placeholder="Password"></CustomTextInput>
              <CustomButton
                title="Sign In"
                handleOnPress={() => {
                  router.replace('/home')
                }}
              ></CustomButton>
            </View>
            <View style={styles.line}>
            </View>
            <View style={styles.signUp}>
              <Text>Don't have an account? </Text>
              <Link href='/sign-up' >Sign Up</Link>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default signIn;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: "100%",
    // backgroundColor: 'green'
  },
  form: {
    gap: 14,
    // backgroundColor: 'blue'
  },
  info: {
    marginTop: 24,
    maxHeight: 360,
    // backgroundColor: 'red',
    alignItems: "center",
  },
  image: {
    resizeMode: "contain",
    maxHeight: 267,
  },
  signUp:{
    marginTop : 8,
    flexDirection : 'row',
    justifyContent : 'center'
  },
  line:{
    borderWidth:0.5,
    borderColor : "grey",
    marginTop: 16,
  }
});
