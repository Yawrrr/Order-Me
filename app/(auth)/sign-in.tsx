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
import React, {useState} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import CustomTextInput from "@/components/CustomTextInput";
import { Link, router } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  
  const signIn = async () => {
    setLoading(true);
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log(user);
      router.replace('../home'); 
    } catch (error) {
      console.log(error);
      alert('Sign in failed: '+error);
    } finally {
      setLoading(false);
    }
  };

  
  
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
                value={email}
                placeholder="Email"
                onChangeText={(text) => setEmail(text)}
              />
              <CustomTextInput
                secureTextEntry
                value={password}
                placeholder="Password"
                onChangeText={(text) => setPassword(text)}
              />
              <CustomButton
                title="Sign In"
                handleOnPress={() => signIn()}// Disables button when loading
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