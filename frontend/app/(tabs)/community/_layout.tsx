import { Stack } from "expo-router";
import React from "react";

const CommunityLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="create-community" options={{ headerShown: false }} /> 
      <Stack.Screen name="[id]" options={{ headerShown: false }} /> 
    </Stack>
  );
};

export default CommunityLayout;
