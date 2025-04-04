import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import useAuth from '@/hooks/useAuth';

interface FormState {
  username: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const { signUp } = useAuth();
  const [form, setForm] = useState<FormState>({
    username: '',
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    // Check if all fields are emtpy
    if (!form.username || !form.email || !form.password) {
      if (Platform.OS === "web") {
        alert("Empty Fields: \nAll fields are required.");
      } else {
        Alert.alert("Empty Fields", "All fields are required.");
      }
      return false;
    }

    // Check if length of username is less than 2
    if (!form.username || form.username.length <= 1) {
      if (Platform.OS === "web") {
        alert("Validation Error: \nUsername must be at least 2 characters.");
      } else {
        Alert.alert("Validation Error", "Username must be at least 2 characters.");
      }
      return false;
    }

    // Check email is a valid email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email || !emailRegex.test(form.email)) {
      if (Platform.OS = "web") {
        alert("Validation Error: \nPlease enter a valid email address.");
      } else {
        Alert.alert("Validation Error", "Please enter a valid email address.");
      }
      return false;
    }

    // Check if password length is under 7 characters
    if (!form.password || form.password.length <= 7) {
      if (Platform.OS === "web") {
        alert("Validation Error: \nPassword must be at least 8 characters.");
      } else {
        Alert.alert("Validation Error", "Password must be at least 8 characters.");
      }
      return false;
    }

    // Check for at least one uppercase letter and one symbol
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!passwordRegex.test(form.password)) {
      if (Platform.OS === "web") {
        alert("Validation Error: \nPassword must include at least one uppercase letter and one symbol.");
      } else {
        Alert.alert("Validation Error", "Password must include at least one uppercase letter and one symbol.");
      }
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Validate form
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await signUp(form.username, form.email, form.password);
    } catch (error) {
      Alert.alert('Sign Up Error', 'An error occurred during sign-up. Please try again.');
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
        <View className="mb-20">
          {/* Header */}
          <Text className="text-5xl font-bold text-center mb-20">Sign Up</Text>

          {/* Input Fields */}
          <TextInput
            className="w-full bg-gray-100 rounded-full p-5 mb-6"
            placeholder="Username"
            placeholderTextColor={'#888'}
            value={form.username}
            onChangeText={(e) => setForm({ ...form, username: e })}
            returnKeyType="done"
          />

          <TextInput
            className="w-full bg-gray-100 rounded-full p-5 mb-6"
            placeholder="Email Address"
            placeholderTextColor={'#888'}
            value={form.email}
            onChangeText={(e) => setForm({ ...form, email: e })}
            returnKeyType="done"
          />

          <TextInput
            className="w-full bg-gray-100 rounded-full p-5 mb-6"
            placeholder="Password"
            placeholderTextColor={'#888'}
            value={form.password}
            secureTextEntry
            onChangeText={(e) => setForm({ ...form, password: e })}
            returnKeyType="done"
          />
        </View>

        {/* Sign Up Button */}
        <View className=" flex items-center">
          <TouchableOpacity
            className="bg-blue-500 py-4 rounded-full w-[300px]"
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-center text-white font-semibold text-lg">Sign Up</Text>
            )}
          </TouchableOpacity>

          <Text className="text-center text-base mt-4">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-blue-500 font-semibold underline">
              Login
            </Link>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
