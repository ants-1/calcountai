import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useAuth() {
  const { token, setToken, setIsAuth, logout, login, signUp, user, isAuth } = useContext(AuthContext);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(await storedToken);
        setIsAuth(true);
      }
    };
    fetchToken();
  }, [setToken, setIsAuth]);

  return { token, user, isAuth, logout, login, signUp };
}
