import React, { createContext, useState, useEffect, Dispatch, SetStateAction, ReactNode } from "react";
import { UserType } from "../types/UserType";
import { Alert, Platform } from "react-native";
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
  tokenExpiration: number | null;
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
  tokenExpiration: null,
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
  const [tokenExpiration, setTokenExpiration] = useState<number | null>(null);

  const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;
  const router = useRouter();

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = Platform.OS === "web" ? localStorage.getItem("token") : await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        setIsAuth(true);
      }
    };
    fetchToken();
  }, [setToken, setIsAuth]);

  useEffect(() => {
    if (token) {
      if (Platform.OS === "web") {
        localStorage.setItem("token", token);
      } else {
        AsyncStorage.setItem("token", token);
      }
      setIsAuth(true);
    } else {
      if (Platform.OS === "web") {
        localStorage.removeItem("token");
      } else {
        AsyncStorage.removeItem("token");
      }
      setIsAuth(false);
    }
  }, [token]);

  useEffect(() => {
    const getUserToken = async () => {
      try {
        const response = await fetch(`${BACKEND_API_URL}/auth/user-token`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          logout();
          return;
        }

        const data = await response.json();
        setUser(data.user);
        setIsAuth(true);
      } catch (error) {
        setUser(null);
        setIsAuth(false);
        console.log(error);
      }
    };

    const getTokenExpirationTime = () => {
      if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = decodedToken.exp * 1000;
        setTokenExpiration(expirationTime);

        const currentTime = Date.now();
        if (expirationTime < currentTime) {
          logout();
        } else {
          const timeUntilExpiration = expirationTime - currentTime;
          setTimeout(logout, timeUntilExpiration);
        }
      }
    };

    if (token) {
      getUserToken();
      getTokenExpirationTime();
    }
  }, [token]);

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
        setToken(data.token);
        setUser(data.user);
        router.push("/(tabs)/dashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      if (Platform.OS === "web") {
        alert(`Error: \n` + error.message || "Failed to login. Please try again.");
      } else {
        Alert.alert("Error", error.message || "Failed to login. Please try again.");
      }
    }
  };

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
        setToken(data.token);
        setUser(data.user);
        router.push("/(auth)/goal-info");
      }
    } catch (error: any) {
      console.error("Sign-up error:", error);
      if (Platform.OS === "web") {
        alert("Error \n" + error.message || "Failed to sign up. Please try again.");
      } else {
        Alert.alert("Error", error.message || "Failed to sign up. Please try again.");
      }
    }
  };

  const logout = async (): Promise<void> => {
    setToken(null);
    setUser(null);
    setIsAuth(false);
    setTokenExpiration(null);
    if (Platform.OS === "web") {
      localStorage.removeItem("token");
    } else {
      await AsyncStorage.removeItem("token");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuth,
        tokenExpiration,
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
