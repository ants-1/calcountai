import { Link } from "expo-router";
import { Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function Index() {
  return (
    <SafeAreaView className="bg-white flex-1 relative">
      <StatusBar style="dark" />
      
      {/* Background Circles */}
      <View className="absolute top-[-100px] left-[-100px] w-[250px] h-[250px] bg-blue-500 rounded-full opacity-80" />
      <View className="absolute bottom-[-100px] right-[-100px] w-[250px] h-[250px] bg-blue-500 rounded-full opacity-80" />
      
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-5xl font-bold text-black mb-20">CalCountAI</Text>
        
        <Text className="text-center text-base text-gray-700 mb-6 w-[300px]">
          Welcome to CalCountAI, an AI calorie tracker focused on achieving your weight loss goals.
        </Text>
        
        <TouchableOpacity className="bg-blue-500 w-[300px] py-4 rounded-full mb-4">
          <Link href="/sign-up" className="text-white text-lg font-bold text-center">
            Sign Up
          </Link>
        </TouchableOpacity>
        
        <Text className="text-center text-gray-600">
          Already have an account? {" "}
          <Link href="/sign-in" className="underline font-semibold text-blue-500">
            Log In
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  );
}
