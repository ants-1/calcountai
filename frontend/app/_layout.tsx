import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import useAuth from "@/hooks/useAuth";

import "../global.css";

import AuthContextProvider from "@/context/AuthContext";
import { ChallengeProvider } from "@/context/ChallengeContext";
import { CommunityProvider } from "@/context/CommunityContext";
import { LogProvider } from "@/context/LogContext";
import { UserProvider } from "@/context/UserContext";
import { MealProvider } from "@/context/MealContext";
import { ActivityProvider } from "@/context/ActivityContext";

export default function RootLayout() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user]);

  return (
    <AuthContextProvider>
      <ChallengeProvider>
        <UserProvider>
          <LogProvider>
            <MealProvider>
              <ActivityProvider>
                <CommunityProvider>
                  <Stack>
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                  </Stack>
                </CommunityProvider>
              </ActivityProvider>
            </MealProvider>
          </LogProvider>
        </UserProvider>
      </ChallengeProvider>
    </AuthContextProvider>
  );
}
