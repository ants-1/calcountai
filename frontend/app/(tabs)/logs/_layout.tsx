import { Stack } from 'expo-router';
import React from 'react';

const LogsLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="activity" options={{ headerShown: false }} />
      <Stack.Screen name="add-activity" options={{ headerShown: false }} />
      <Stack.Screen name="meals" options={{ headerShown: false }} />
      <Stack.Screen name="add-meal-manual" options={{ headerShown: false }} />
    </Stack>
  );
};

export default LogsLayout;
