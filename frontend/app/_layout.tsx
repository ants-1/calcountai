import { Stack, useRouter } from "expo-router";
import "../global.css";
import AuthContextProvider from "@/context/AuthContext";
import { ChallengeProvider } from "@/context/ChallengeContext";
import { CommunityProvider } from "@/context/CommunityContext";
import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";

export default function RootLayout() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user, router]);

  return (
    <AuthContextProvider>
      <CommunityProvider>
        <ChallengeProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack>
        </ChallengeProvider>
      </CommunityProvider>
    </AuthContextProvider>
  );
}
