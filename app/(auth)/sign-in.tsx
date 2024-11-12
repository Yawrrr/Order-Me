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
import React, {useRef, useState} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import CustomTextInput from "@/components/CustomTextInput";
import { Link, router } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";


const Login = () => {
  const {signIn, isAuthenticated} = useAuth();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  
  const handleSignIn = () =>{
    console.log(emailRef.current, "and " , passwordRef.current)
    signIn(emailRef.current, passwordRef.current);
    if(isAuthenticated){
      router.replace('/home'); 
    }
  }
  
  return (
    <SafeAreaView style={{ height: "100%" }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.info}>
              <Image source={images.man} style={styles.image} />
              <Text>Let's sign in to continue order me</Text>
            </View>
            <View style={styles.form}>
              <CustomTextInput
                placeholder="Email"
                onChangeText={(email) => (emailRef.current = email)}
              />
              <CustomTextInput
                secureTextEntry
                placeholder="Password"
                onChangeText={(password) => (passwordRef.current = password)}
              />
              <CustomButton
                title="Sign In"
                handleOnPress={handleSignIn}// Disables button when loading
              />
            </View>
            <View style={styles.line} />
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

export default Login;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: "100%",
  },
  form: {
    gap: 14,
  },
  info: {
    marginTop: 24,
    maxHeight: 360,
    alignItems: "center",
  },
  image: {
    resizeMode: "contain",
    maxHeight: 267,
  },
  signUp: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  line: {
    borderWidth: 0.5,
    borderColor: "grey",
    marginTop: 16,
  },
});