import images from "@/constants/images";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";
import { useSegments } from "expo-router";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Alert } from "react-native";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean | undefined;
  setUser: (user: User | null) => void;  // Add setUser to the interface
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    phoneNum: string,
    address: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: undefined,
  setUser: () => {},  // Provide a default empty setUser function
  signIn: async () => {},
  signUp: async () => {},
  logout: async () => {},
};

type AuthContextProviderProps = {
  children: ReactNode;
};

interface User {
  address: string;
  email: string;
  phoneNumber: string;
  role: string;
  username: string;
}

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const auth = FIREBASE_AUTH;
  const segments = useSegments();

  useEffect(() => {
    // Check auth state
    const unsub = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setIsAuthenticated(true);
        try {
          const userRef = doc(FIREBASE_DB, "users", authUser.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUser({ ...userData });
          }
        } catch (error) {
          console.log("User document not found: ", error);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });
    return () => unsub();
  }, [segments[1] === "profile"]);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error);
      Alert.alert("Sign In", "Sign in failed: " + error);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    phoneNumber: string,
    address: string
  ) => {
    try {
      const defaultImage = images.defaultProfile;
      const username = "";
      const role = "user";
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User: ", response?.user);
      await setDoc(doc(FIREBASE_DB, "users", response?.user?.uid), {
        email,
        phoneNumber,
        defaultImage,
        address,
        username,
        role,
      });
      alert("Sign up successful!");
    } catch (error) {
      console.log(error);
      alert("Sign up failed:" + error);
    }
  };

  const logout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
    } catch (error) {
      alert("Log out failed:" + error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, setUser, signIn, signUp, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be wrapped in AuthContextProvider");
  }
  return value;
};


// import images from "@/constants/images";
// import { FIREBASE_AUTH, FIREBASE_DB} from "@/FirebaseConfig";
// import { useSegments } from "expo-router";
// import {
//   createUserWithEmailAndPassword,
//   onAuthStateChanged,
//   signInWithEmailAndPassword,
//   signOut,
// } from "firebase/auth";
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import {
//   createContext,
//   ReactNode,
//   useContext,
//   useEffect,
//   useState,
// } from "react";
// import { Alert } from "react-native";

// interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean | undefined;
//   signIn: (email: string, password: string) => Promise<void>;
//   signUp: (
//     email: string,
//     password: string,
//     phoneNum: string,
//     address: string
//   ) => Promise<void>;
//   logout: () => Promise<void>;
// }

// const defaultAuthContext: AuthContextType = {
//   user: null,
//   isAuthenticated: undefined,
//   signIn: async () => {},
//   signUp: async () => {},
//   logout: async () => {},
// };

// type AuthContextProviderProps = {
//   children: ReactNode;
// };
// interface User {
//   address: string;
//   email: string;
//   phoneNumber: string;
//   role: string;
//   username: string;
// }

// export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const auth = FIREBASE_AUTH;
//   const segments = useSegments();

//   useEffect(() => {
//     //check auth state
//     const unsub = onAuthStateChanged(auth, async (authUser) => {
//       if (authUser) {
//         setIsAuthenticated(true);
//         try {
//           const userRef = doc(FIREBASE_DB, "users", authUser.uid);
//           const userDoc = await getDoc(userRef);
//           if (userDoc.exists()) {
//             const userData = userDoc.data() as User;
//             setUser({...userData});
//           }
//         } catch (error) {
//           console.log("User document not found: ",error)
//         }
//       } else {
//         setIsAuthenticated(false);
//         setUser(null);
//       }
//     });
//     return () => unsub();
//   },[segments[1] == "profile"]);

//   const signIn = async (email: string, password: string) => {
//     try {
//       const response = await signInWithEmailAndPassword(auth, email, password);
//     } catch (error) {
//       console.log(error);
//       Alert.alert("Sign In", "Sign in failed: " + error);
//     } finally {
//     }
//   };

//   const signUp = async (
//     email: string,
//     password: string,
//     phoneNumber: string,
//     address: string
//   ) => {
//     try {
//       const defaultImage = images.defaultProfile;
//       const username = "";
//       const role = "user";
//       const response = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       console.log("User: ", response?.user);
//       await setDoc(doc(FIREBASE_DB, "users", response?.user?.uid), {
//         email,
//         phoneNumber,
//         defaultImage,
//         address,
//         username,
//         role,
//       });
//       alert("Sign up successful!");
//     } catch (error) {
//       console.log(error);
//       alert("Sign up failed:" + error);
//     } finally {
//     }
//   };

//   const logout = async () => {
//     try {
//       const response = await signOut(FIREBASE_AUTH);
//     } catch (error) {
//       alert("Log out failed:" + error);
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{ user, isAuthenticated, signIn, signUp, logout }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const value = useContext(AuthContext);

//   if (!value) {
//     throw new Error("useAuth must be wrap in AuthContextProvider");
//   }
//   return value;
// };
