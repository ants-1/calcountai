import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useUserData } from '@/hooks/useUser';
import Icon from 'react-native-vector-icons/FontAwesome';

const ActivityLevel: React.FC = () => {
  const router = useRouter();
  const { userData, updateUserGoalData } = useUserData();
  const [selectedLevel, setSelectedLevel] = useState<string>(userData?.activityLevel || "");

  const levels = [
    "Sedentary: little or no exercise",
    "Light: exercise 1-3 times/week",
    "Moderate: exercise 4-5 times/week",
    "Active: daily exercises"
  ];

  // Toggle selection
  const handleLevelSelection = (level: string) => {
    setSelectedLevel(level); 
  };

  // Save and continue
  const handleContinue = () => {
    if (selectedLevel) {
      const updatedUser = {
        ...userData,
        activityLevel: selectedLevel, 
      };
      updateUserGoalData(updatedUser);
      console.log(updatedUser);
      router.push('/dob');
    }
  };

  return (
    <View className="flex-1 justify-evenly items-center bg-white px-6">
      {/* Header */}
      <View className="w-full mt-10 flex-row justify-between items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="chevron-left" size={25} color="#4B5563" />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-center">Activity Level</Text>
        <View style={{ width: 25 }} /> {/* Empty spacer */}
      </View>

      {/* Progress Indicator */}
      <View className="flex flex-row justify-center mb-20 gap-5">
        <View className='rounded-full h-8 w-8 bg-black'></View>
        <View className='rounded-full h-8 w-8 bg-black'></View>
        <View className='rounded-full h-8 w-8 bg-black'></View>
        <View className='rounded-full h-8 w-8 bg-black'></View>
        <View className='rounded-full h-8 w-8 bg-black'></View>
        <View className='rounded-full h-8 w-8 bg-black'></View>
        <View className='rounded-full h-8 w-8 bg-gray-200'></View>
      </View>

      {/* Options */}
      <View className="w-full">
        {levels.map((level) => (
          <TouchableOpacity
            key={level}
            className={`w-full p-6 mb-4 rounded-full ${
              selectedLevel === level ? 'bg-blue-500' : 'bg-gray-200'
            }`}
            onPress={() => handleLevelSelection(level)}
          >
            <Text
              className={`text-center ${
                selectedLevel === level ? 'text-white font-bold' : 'text-black'
              }`}
            >
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue Button */}
      <View>
        <TouchableOpacity
          className={`p-4 rounded-full w-[300px] ${
            selectedLevel ? 'bg-blue-500' : 'bg-gray-300'
          }`}
          disabled={!selectedLevel}
          onPress={handleContinue}
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

export default ActivityLevel;
