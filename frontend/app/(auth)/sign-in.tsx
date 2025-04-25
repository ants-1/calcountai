import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Platform } from "react-native";
import { Link } from "expo-router";
import useAuth from "@/hooks/useAuth";

interface FormState {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const submit = async () => {
    if (!form.email || !form.password) {
      if (Platform.OS === "web") {
        alert("Validation Error: \nPlease enter both email and password.");
      } else {
        Alert.alert("Validation Error", "Please enter both email and password.");
      }
      return;
    }

    setIsSubmitting(true);

    try {
      await login(form.email, form.password);
    } catch (error: any) {
      setIsSubmitting(false);
      if (Platform.OS === "web") {
        alert("Login failed.");
      } else {
        Alert.alert("Error", "Login failed.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white relative">

      {/* Background Circles */}
      <View className="absolute top-[-100px] left-[-100px] w-[250px] h-[250px] bg-blue-500 rounded-full opacity-80" />
      <View className="absolute bottom-[-100px] right-[-100px] w-[250px] h-[250px] bg-blue-500 rounded-full opacity-80" />

      <View className="w-full justify-evenly min-h-[83vh] px-4 my-10">
        <View className="mb-48 w-full items-center">
          <Text className="text-5xl font-bold text-center mb-20">Login</Text>

          {/* Email Input */}
          <TextInput
            className="w-full md:max-w-[600px] bg-gray-100 rounded-full p-5 mb-6"
            placeholder="Email Address"
            placeholderTextColor="#888"
            value={form.email}
            onChangeText={(e) => setForm({ ...form, email: e })}
            returnKeyType="done"
          />

          {/* Password Input */}
          <TextInput
            className="w-full md:max-w-[600px] bg-gray-100 rounded-full p-5 mb-6"
            placeholder="Password"
            placeholderTextColor="#888"
            value={form.password}
            secureTextEntry
            onChangeText={(e) => setForm({ ...form, password: e })}
            returnKeyType="done"
          />
        </View>

        <View className=" flex items-center">
          <TouchableOpacity
            className="bg-blue-500 py-4 rounded-full w-[300px]"
            onPress={submit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-center text-white font-semibold text-lg">
                Login
              </Text>
            )}
          </TouchableOpacity>

          <Text className="text-center text-base mt-4">
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-blue-500 font-semibold">
              Sign Up
            </Link>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
