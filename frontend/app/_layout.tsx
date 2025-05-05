import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";

import "../global.css";

import AuthContextProvider from "@/context/AuthContext";
import { ChallengeProvider } from "@/context/ChallengeContext";
import { CommunityProvider } from "@/context/CommunityContext";
import { LogProvider } from "@/context/LogContext";
import { UserProvider } from "@/context/UserContext";
import { MealProvider } from "@/context/MealContext";
import { ActivityProvider } from "@/context/ActivityContext";

import { startChatbotPing } from "@/utils/chatbot";

export default function RootLayout() {
  const { user } = useAuth();
  const router = useRouter();
  const [iseMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    startChatbotPing();
  }, []);

  useEffect(() => {
    if (iseMounted) {
      if (!user) {
        router.replace("/");
      }
    }
  }, [iseMounted, user, router]);

  if (!iseMounted) {
    return null;
  }

  return (
    <AuthContextProvider>
      <ChallengeProvider>
        <UserProvider>
          <LogProvider>
            <MealProvider>
              <ActivityProvider>
                <CommunityProvider>
                  <Stack >
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
