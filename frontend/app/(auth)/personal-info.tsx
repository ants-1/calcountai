import { useRouter } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { useUserData } from "@/hooks/useUser";
import Icon from "react-native-vector-icons/FontAwesome";

const PersonalInfo: React.FC = () => {
  const router = useRouter();
  const { userData, updateUserGoalData } = useUserData();
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const genders = ["Male", "Female", "Other"];

  const handleGenderChange = () => {
    const updatedUser = {
      ...userData,
      gender: selectedGender,
    };

    updateUserGoalData(updatedUser);
    console.log(userData);
  };

  return (
    <View className="flex-1 justify-evenly items-center bg-white px-6">
      <View className="w-full">
        {/* Header */}
        <View className="flex flex-row justify-between">
          <TouchableOpacity className="mt-1" onPress={() => router.back()}>
            <Icon name="chevron-left" size={25} color="#4B5563" />
          </TouchableOpacity>

          <Text className="text-3xl font-bold mb-10 text-center">Personal Info</Text>

          <View></View>
        </View>

        {/* Progress Indicator */}
        <View className="flex flex-row justify-center mb-20 gap-5">
          <View className='rounded-full h-8 w-8 bg-black'></View>
          <View className='rounded-full h-8 w-8 bg-black'></View>
          <View className='rounded-full h-8 w-8 bg-gray-200'></View>
          <View className='rounded-full h-8 w-8 bg-gray-200'></View>
          <View className='rounded-full h-8 w-8 bg-gray-200'></View>
          <View className='rounded-full h-8 w-8 bg-gray-200'></View>
          <View className='rounded-full h-8 w-8 bg-gray-200'></View>
        </View>

        {/* Gender Options */}
        {genders.map((gender) => (
          <TouchableOpacity
            key={gender}
            className={`w-full p-6 mb-4 rounded-full ${selectedGender === gender ? "bg-blue-500" : "bg-gray-200"}`}
            onPress={() => setSelectedGender(gender)}
          >
            <Text className={`text-center ${selectedGender === gender ? "text-white font-bold" : "text-black"}`}>
              {gender}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue Button */}
      <View>
        <TouchableOpacity
          className={`p-4 rounded-full w-[300px] ${selectedGender ? "bg-blue-500" : "bg-gray-300"}`}
          disabled={!selectedGender}
          onPress={() => {
            handleGenderChange();
            router.push("/current-weight");
          }}
        >
          <Text className="text-center text-white font-semibold text-lg">Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/dashboard")}>
          <Text className="text-center mt-5 underline">Enter Information Later</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PersonalInfo;
