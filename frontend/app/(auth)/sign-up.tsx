import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  // confirmPassword: string;
}

const SignUp: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    // confirmPassword: '',
  });
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    setIsSubmitting(true);
    setTimeout(() => {
      console.log('Form Submitted:', form);
      setIsSubmitting(false);
      router.push('/goal-info'); // Navigate to goal-info page
    }, 2000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="w-full justify-evenly min-h-[83vh] px-4 my-6">
        <View className='mb-8'>
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
          {/* <TextInput
            className="w-full bg-gray-100 rounded-lg p-5 mb-6"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            secureTextEntry
            onChangeText={(e) => setForm({ ...form, confirmPassword: e })}
          /> */}
        </View>

        {/* Sign Up Button */}
        <View className='flex flex-col items-center'>
          <TouchableOpacity
            className="bg-blue-500 py-4 rounded-lg w-[300px]"
            onPress={submit}
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
