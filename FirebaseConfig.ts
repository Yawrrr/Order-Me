// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage"
import { getFirestore , collection} from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBL6LwDTxd_pDZ5nsaYwgbwDLoAX_tlATA",
  authDomain: "orderme-e403e.firebaseapp.com",
  projectId: "orderme-e403e",
  storageBucket: "orderme-e403e.firebasestorage.app",
  messagingSenderId: "847404701239",
  appId: "1:847404701239:web:a082140a90223e8c5011b2"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const FIREBASE_DB = getFirestore(FIREBASE_APP);

export const userRef = collection(FIREBASE_DB, "users");
export const roomRef = collection(FIREBASE_DB, "rooms");