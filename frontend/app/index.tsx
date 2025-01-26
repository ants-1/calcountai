import { Link } from "expo-router";
import { Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-4xl font-bold mb-4">CalCountAI</Text>
        {/* Image Placerholder */}
        <View className="w-[300px] h-[300px] bg-gray-200 rounded-xl my-16" />
        <Text className="text-center text-base mb-6 w-[300px]">
          Welcome to CalCountAI, an AI calorie tracker focused on achieving your weight loss goals.
        </Text>
        <TouchableOpacity className="bg-blue-500 w-[300px] py-4 rounded-lg mb-4">
          <Link href="/sign-up" className="text-white text-lg font-bold text-center">
            Sign Up
          </Link>
        </TouchableOpacity>
        <Text className="text-center">
          Already have an account?{" "}
          <Link href="/sign-in" className="underline font-semibold">
            Log in
          </Link>
        </Text>
        <Link href="/dashboard" className="underline font-semibold">
            Dashboard
          </Link>
      </View>
    </SafeAreaView>
  );
}
