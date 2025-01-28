import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const GoalInfo: React.FC = () => {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const goals = ["Lose Weight", "Get Healthier", "Reduce Stress"];

  return (
    <View className="flex-1 justify-evenly items-center bg-white px-4">
      <View className='w-full'>
        <Text className="text-3xl font-bold mb-10 text-center">Current Goal?</Text>

        {/* Progress Indicator */}
        <View className='flex flex-row justify-center mb-20 gap-5'>
          <View className='rounded-full h-8 w-8 bg-black'></View>
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
            className={`w-full p-6 mb-4 rounded-lg ${selectedGoal === goal ? 'bg-blue-500' : 'bg-gray-200'}`}
            onPress={() => setSelectedGoal(goal)}
          >
            <Text className={`text-center ${selectedGoal === goal ? 'text-white font-bold' : 'text-black'}`}>
              {goal}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue Button */}
      <View>
        <TouchableOpacity
          className={`p-4 rounded-lg w-[300px] ${selectedGoal ? 'bg-blue-500' : 'bg-gray-300'}`}
          disabled={!selectedGoal}
          onPress={() => router.push('/personal-info')}
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
