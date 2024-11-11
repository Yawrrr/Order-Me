// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdpTq9_vt3oI-UFDnH9SUAggkhXZ5eMAQ",
  authDomain: "orderme1-4e881.firebaseapp.com",
  projectId: "orderme1-4e881",
  storageBucket: "orderme1-4e881.firebasestorage.app",
  messagingSenderId: "557298488720",
  appId: "1:557298488720:web:70363db5905ed282928f15",
  measurementId: "G-ZY2GMC5L7Y"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
