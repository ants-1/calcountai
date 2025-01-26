import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

interface FormState {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    email: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);


  const submit = async () => {
    setIsSubmitting(true);
    // Mock sign-in process
    setTimeout(() => {
      console.log('Form Submitted:', form);
      setIsSubmitting(false);
      Alert.alert('Success', 'You have logged in successfully!');
    }, 2000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="w-full justify-evenly min-h-[83vh] px-4 my-6">
        <View className='mb-48'>
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
            Don't have an account?{' '}
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
