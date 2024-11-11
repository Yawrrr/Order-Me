import { Keyboard, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View, Image } from "react-native";
import React, {useState} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import CustomButton from "@/components/CustomButton";
import CustomTextInput from "@/components/CustomTextInput";
import images from "@/constants/images";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

const signUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  
  const register = async () => {
    setLoading(true);
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      console.log(user);
      alert('Sign up successful!');
      router.replace('/home');
    } catch (error) {
      console.log(error);
      alert('Sign up failed:'+ error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{height: "100%"}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.info}>
              <Image source={images.man} style={styles.image}></Image>
              <Text>Let's create an account to continue order me</Text>
            </View>
            <View style={styles.form}>
              <CustomTextInput 
              value={email} 
              placeholder="Email"  
              onChangeText={(text) => setEmail(text)}
              />
              <CustomTextInput 
              value={password} 
              placeholder="Password" 
              onChangeText={(text) => setPassword(text)}
              />
              <CustomTextInput 
              value={password} 
              placeholder="Confirm Password" 
              onChangeText={(text) => setPassword(text)}
              />
              <CustomButton
                title="Sign Up"
                handleOnPress={() => register()}
              />
            </View>
            <View style={styles.line}/>
            <View style={styles.signUp}>
              <Text>Already have an account? </Text>
              <Link href='/sign-in' >Sign In</Link>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default signUp;

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