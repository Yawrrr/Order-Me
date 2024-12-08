import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Alert, Text } from "react-native";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface User {
  address: string;
  email: string;
  phoneNumber: string;
  role: string;
  username: string;
  restaurantName: string;
  category:string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean | undefined;
  authInitialized: boolean;
  setUser: (user: User | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, phoneNumber: string, address: string) => Promise<void>;
  logout: () => Promise<void>;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: undefined,
  authInitialized: false,
  setUser: () => {},
  signIn: async () => {},
  signUp: async () => {},
  logout: async () => {},
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (authUser) => {
      if (authUser) {
        setIsAuthenticated(true);
        try {
          const userRef = doc(FIREBASE_DB, "users", authUser.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUser(userData);
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.log("Error fetching user data: ", error.message);
          } else {
            console.log("An unknown error occurred");
          }
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setAuthInitialized(true);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("Sign In Error:", error.message);
        Alert.alert("Sign In Error", error.message);
      } else {
        console.log("An unknown sign-in error occurred");
        Alert.alert("Sign In Error", "An unknown error occurred.");
      }
    }
  };

  const signUp = async (email: string, password: string, phoneNumber: string, address: string) => {
    try {
      const response = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      await setDoc(doc(FIREBASE_DB, "users", response.user.uid), {
        email,
        phoneNumber,
        address,
        username: "",
        role: "user",
      });
      alert("Sign up successful!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("Sign Up Error:", error.message);
        alert("Sign up failed: " + error.message);
      } else {
        console.log("An unknown sign-up error occurred");
        alert("Sign up failed due to an unknown error.");
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert("Log out failed: " + error.message);
      } else {
        alert("Log out failed due to an unknown error.");
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, authInitialized, setUser, signIn, signUp, logout }}>
      {authInitialized ? children : <Text>Loading...</Text>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};

