import { Stack } from "expo-router";
import "../global.css";
import AuthContextProvider from "@/context/AuthContext";

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </AuthContextProvider>
  );
}
