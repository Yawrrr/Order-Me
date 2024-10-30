import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors } from "../src/utils/colors";
import { fonts } from "../src/utils/fonts";
import { useNavigation } from "@react-navigation/native";

import { Link } from 'expo-router';

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.navigate("LOGIN");
    
  };

  const handleSignup = () => {
    navigation.navigate("SIGNUP");

  };
  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/logo.png")} style={styles.logo} />
      <Image source={require("../assets/images/man.png")} style={styles.bannerImage} />
      <Text style={styles.title}>OrderMe</Text>
      <Text style={styles.subTitle}>
      A mobile application that facilitates students to make online purchases of various food and beverages to be delivered to their doorstep. 
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.loginButtonWrapper,
            { backgroundColor: colors.primary },
          ]}
          onPress={handleLogin}
        >
          <Link href="/LoginScreen">
      <Text style={styles.loginButtonText}>Login</Text>
    </Link>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.loginButtonWrapper]}
          onPress={handleSignup}
        >
          <Link href="/SignupScreen">
      <Text style={styles.signupButtonText}>Sign Up</Text>
    </Link>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
  },
  logo: {
    height: 70,
    width: 100,
    marginVertical: 30,
  },
  bannerImage: {
    marginVertical: 20,
    height: 250,
    width: 231,
  },
  title: {
    fontSize: 40,
    fontFamily: fonts.SemiBold,
    paddingHorizontal: 20,
    textAlign: "center",
    color: colors.primary,
    marginTop: 40,
  },
  subTitle: {
    fontSize: 18,
    paddingHorizontal: 20,
    textAlign: "center",
    color: colors.secondary,
    fontFamily: fonts.Medium,
    marginVertical: 20,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    borderWidth: 2,
    borderColor: colors.primary,
    width: "80%",
    height: 60,
    borderRadius: 100,
  },
  loginButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    borderRadius: 98,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.SemiBold,
  },
  signupButtonText: {
    fontSize: 18,
    fontFamily: fonts.SemiBold,
  },
});
