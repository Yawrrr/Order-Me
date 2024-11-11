import images from "@/constants/images";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean | undefined;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    phoneNum: number,
    address: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: undefined,
  signIn: async () => {},
  signUp: async () => {},
  logout: async () => {},
};

type AuthContextProviderProps = {
  children: ReactNode;
};
interface User {}

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<User|null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const auth = FIREBASE_AUTH;
  const defaultImage = images.defaultProfile;

  useEffect(() => {
    //check auth state
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });
    return () => unsub();
  });

  const signIn = async (email: string, password: string) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error);
      alert("Sign in failed: " + error);
    } finally {
    }
  };

  const signUp = async (
    email: string,
    password: string,
    phoneNum: number,
    address: string
  ) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User: ", response?.user);
      await setDoc(doc(FIREBASE_DB, "users", response?.user?.uid), {
        email,
        phoneNum,
        defaultImage,
        address,
      });
      alert("Sign up successful!");
    } catch (error) {
      console.log(error);
      alert("Sign up failed:" + error);
    } finally {
    }
  };

  const logout = async () => {
    try {
      const response = await signOut(FIREBASE_AUTH);
      console.log(response);
      setIsAuthenticated(false);
    } catch (error) {
      alert("Log out failed:" + error);
    }
  };

  return (
    <AuthContext.Provider value={{user, isAuthenticated, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be wrap in AuthContextProvider");
  }
  return value;
};
