import { Stack } from 'expo-router'
import React from 'react'

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="goal-info"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="personal-info"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="current-weight"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="target-weight"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="height"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="dob"
          options={{
            headerShown: false
          }}
        />
      </Stack>
    </>
  )
}

export default AuthLayout