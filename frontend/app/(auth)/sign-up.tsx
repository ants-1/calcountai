import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import useAuth from '@/hooks/useAuth';

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const { signUp } = useAuth(); 
  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    if (!form.firstName || form.firstName.length <= 1) {
      Alert.alert("Validation Error", "First name must be at least 1 characters.");
      return false;
    }

    if (!form.lastName || form.lastName.length <= 3) {
      Alert.alert("Validation Error", "Last name must be at least 4 characters.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email || !emailRegex.test(form.email)) {
      Alert.alert("Validation Error", "Please enter a valid email address.");
      return false;
    }

    if (!form.password || form.password.length <= 7) {
      Alert.alert("Validation Error", "Password must be at least 8 characters.");
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
      await signUp(form.firstName, form.lastName, form.email, form.password);
    } catch (error) {
      Alert.alert('Sign Up Error', 'An error occurred during sign-up. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="w-full justify-evenly min-h-[83vh] px-4 my-6">
        <View className="mb-8">
          <Text className="text-4xl font-bold text-center mb-16">Sign Up</Text>

          {/* Input Fields */}
          <TextInput
            className="w-full bg-gray-100 rounded-lg p-5 mb-6"
            placeholder="First Name"
            placeholderTextColor={'#888'}
            value={form.firstName}
            onChangeText={(e) => setForm({ ...form, firstName: e })}
          />

          <TextInput
            className="w-full bg-gray-100 rounded-lg p-5 mb-6"
            placeholder="Last Name"
            placeholderTextColor={'#888'}
            value={form.lastName}
            onChangeText={(e) => setForm({ ...form, lastName: e })}
          />

          <TextInput
            className="w-full bg-gray-100 rounded-lg p-5 mb-6"
            placeholder="Email Address"
            placeholderTextColor={'#888'}
            value={form.email}
            onChangeText={(e) => setForm({ ...form, email: e })}
          />

          <TextInput
            className="w-full bg-gray-100 rounded-lg p-5 mb-6"
            placeholder="Password"
            placeholderTextColor={'#888'}
            value={form.password}
            secureTextEntry
            onChangeText={(e) => setForm({ ...form, password: e })}
          />
        </View>

        {/* Sign Up Button */}
        <View className="flex flex-col items-center">
          <TouchableOpacity
            className="bg-blue-500 py-4 rounded-lg w-[300px]"
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
