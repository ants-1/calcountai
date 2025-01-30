import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
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
      Alert.alert("Validation Error", "Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      await login(form.email, form.password);
    } catch (error: any) {
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="w-full justify-evenly min-h-[83vh] px-4 my-6">
        <View className="mb-48">
          <Text className="text-4xl font-bold text-center mb-16">Login</Text>

          {/* Email Input */}
          <TextInput
            className="w-full bg-gray-100 rounded-lg p-5 mb-6"
            placeholder="Email Address"
            placeholderTextColor="#888"
            value={form.email}
            onChangeText={(e) => setForm({ ...form, email: e })}
          />

          {/* Password Input */}
          <TextInput
            className="w-full bg-gray-100 rounded-lg p-5 mb-6"
            placeholder="Password"
            placeholderTextColor="#888"
            value={form.password}
            secureTextEntry
            onChangeText={(e) => setForm({ ...form, password: e })}
          />
        </View>

        <View>
          <TouchableOpacity
            className="bg-blue-500 py-4 rounded-lg"
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
