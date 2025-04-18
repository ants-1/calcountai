import { Stack } from 'expo-router'
import React from 'react'

const DashboardLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="challenges" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="rewards" options={{ headerShown: false }} />
      <Stack.Screen name='weight-history' options={{ headerShown: false }} />
    </Stack>
  )
}

export default DashboardLayout