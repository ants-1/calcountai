import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const isWeb = typeof window !== "undefined";

export default function useAuth() {
  const { token, setToken, setIsAuth, logout, login, signUp, user, isAuth } = useContext(AuthContext);

  useEffect(() => {
    const fetchToken = async () => {
      if (isWeb) {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
          setIsAuth(true);
        }
      } else {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
          setIsAuth(true);
        }
      }
    };

    fetchToken();
  }, [setToken, setIsAuth]);

  return { token, user, isAuth, logout, login, signUp };
}
