import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useUserData } from '@/hooks/useUser';

const GoalInfo: React.FC = () => {
  const router = useRouter();
  const { userData, updateUserGoalData } = useUserData();
  const [selectedGoals, setSelectedGoals] = useState<string[]>(userData?.goal || []);

  const goals = ["Lose Weight", "Get Healthier", "Reduce Stress"];

  // Toggle goal selection
  const handleGoalSelection = (goal: string) => {
    setSelectedGoals((prevSelectedGoals) => {
      if (prevSelectedGoals.includes(goal)) {
        return prevSelectedGoals.filter((g) => g !== goal);
      } else {
        return [...prevSelectedGoals, goal];
      }
    });
  };

  // Update user data with the selected goals
  const handleContinue = () => {
    if (selectedGoals.length > 0) {
      const updatedUser = {
        ...userData,
        goal: selectedGoals,
      };
      updateUserGoalData(updatedUser);
      router.push('/personal-info');
    }
  };

  return (
    <View className="flex-1 justify-evenly items-center bg-white px-6">
      <View className='w-full'>
        <Text className="text-3xl font-bold mb-10 mt-20 text-center">Current Goal(s)?</Text>

        {/* Progress Indicator */}
        <View className='flex flex-row justify-center mb-20 gap-5'>
          <View className='rounded-full h-8 w-8 bg-black'></View>
          <View className='rounded-full h-8 w-8 bg-gray-200'></View>
          <View className='rounded-full h-8 w-8 bg-gray-200'></View>
          <View className='rounded-full h-8 w-8 bg-gray-200'></View>
          <View className='rounded-full h-8 w-8 bg-gray-200'></View>
          <View className='rounded-full h-8 w-8 bg-gray-200'></View>
          <View className='rounded-full h-8 w-8 bg-gray-200'></View>
        </View>

        {/* Goal Options */}
        {goals.map((goal) => (
          <TouchableOpacity
            key={goal}
            className={`w-full p-6 mb-4 rounded-full ${selectedGoals.includes(goal) ? 'bg-blue-500' : 'bg-gray-200'}`}
            onPress={() => handleGoalSelection(goal)}
          >
            <Text className={`text-center ${selectedGoals.includes(goal) ? 'text-white font-bold' : 'text-black'}`}>
              {goal}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue Button */}
      <View>
        <TouchableOpacity
          className={`p-4 rounded-full w-[300px] ${selectedGoals.length > 0 ? 'bg-blue-500' : 'bg-gray-300'}`}
          disabled={selectedGoals.length === 0}  
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

export default GoalInfo;
