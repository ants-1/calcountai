import React, { createContext, useState, useEffect, Dispatch, SetStateAction, ReactNode } from "react";
import { UserType } from "../types/UserType";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { useRouter } from "expo-router";

interface AuthResponse {
  token: string;
  user: UserType;
}

interface AuthContextType {
  token: string | null;
  user: UserType | null;
  isAuth: boolean;
  setToken: Dispatch<SetStateAction<string | null>>;
  setUser: Dispatch<SetStateAction<UserType | null>>;
  setIsAuth: Dispatch<SetStateAction<boolean>>;
  login: (email: string, password: string) => Promise<void>;
  signUp: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  isAuth: false,
  setToken: () => null,
  setUser: () => null,
  setIsAuth: () => false,
  login: async () => { return; },
  signUp: async () => { return; },
  logout: async () => { return; },
});

const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);

  const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;
  const router = useRouter();

  useEffect(() => {
    if (token) {
      AsyncStorage.setItem("token", token);
      setIsAuth(true);
    } else {
      AsyncStorage.removeItem("token");
      setIsAuth(false);
    }
  }, [token]);

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      } else {
        const data: AuthResponse = await response.json();
        console.log("Login success:", data);
        setToken(data.token);
        setUser(data.user);
        router.push("/(tabs)/dashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      Alert.alert("Error", error.message || "Failed to login. Please try again.");
    }
  };

  // Sign-up function
  const signUp = async (firstName: string, lastName: string, email: string, password: string): Promise<void> => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/auth/sign-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      if (!response.ok) {
        throw new Error("Sign-up failed");
      } else {
        const data: AuthResponse = await response.json();
        console.log("Sign-up success:", data);
        setToken(data.token);
        setUser(data.user);
        router.push("/(auth)/goal-info");
      }
    } catch (error: any) {
      console.error("Sign-up error:", error);
      Alert.alert("Error", error.message || "Failed to sign up. Please try again.");
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setToken(null);
    setUser(null);
    setIsAuth(false);
    await AsyncStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuth,
        setToken,
        setUser,
        setIsAuth,
        login,
        signUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
