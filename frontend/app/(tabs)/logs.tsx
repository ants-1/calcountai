import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Log: React.FC = () => {
  const dailyGoal = 2000;

  // Sample data
  const dailyLog = {
    foods: [
      { id: 1, name: 'Oatmeal', calories: 150, mealType: 'breakfast' },
      { id: 2, name: 'Orange Juice', calories: 100, mealType: 'breakfast' },
      { id: 3, name: 'Chicken Salad', calories: 300, mealType: 'lunch' },
      { id: 4, name: 'Rice', calories: 200, mealType: 'lunch' },
      { id: 5, name: 'Grilled Salmon', calories: 400, mealType: 'dinner' },
      { id: 6, name: 'Steamed Vegetables', calories: 150, mealType: 'dinner' },
      { id: 7, name: 'Cookies', calories: 250, mealType: 'snacks' },
    ],
    exercises: [
      { id: 1, name: 'Running', caloriesBurned: 300 },
      { id: 2, name: 'Cycling', caloriesBurned: 200 },
    ],
    completed: false,
  };

  // Calculate calories consumed and burned
  const caloriesConsumed = dailyLog.foods.reduce((sum, food) => sum + food.calories, 0);
  const caloriesBurned = dailyLog.exercises.reduce((sum, exercise) => sum + exercise.caloriesBurned, 0);
  const remainingCalories = dailyGoal - caloriesConsumed + caloriesBurned;

  return (
    <SafeAreaView className="flex-1 bg-white px-4 pt-6">
      <Text className="text-3xl font-bold text-center">Daily Logs</Text>
      <Text className="font-semibold text-center">18/12/25</Text>

      <ScrollView className="mt-4">
        {/* Calorie Progress Section */}
        <View className="mt-6 bg-gray-100 p-4 rounded-xl">
          <Text className="text-lg font-semibold text-gray-700">Calories Progress</Text>
          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-sm text-gray-500">Goal: {dailyGoal} kcal</Text>
            <Text className="text-sm text-gray-500">{caloriesConsumed} kcal consumed</Text>
          </View>
          <View className="w-full bg-gray-300 h-2 mt-2 rounded-xl">
            <View
              className="bg-green-500 h-2 rounded-xl"
              style={{ width: `${(caloriesConsumed / dailyGoal) * 100}%` }}
            />
          </View>
          <Text className="mt-2 text-sm text-gray-500">
            {remainingCalories > 0
              ? `You can consume ${remainingCalories} more calories today`
              : 'You have exceeded your daily calorie goal!'}
          </Text>
        </View>

        {/* Meals Section */}
        <TouchableOpacity className="mt-10 bg-blue-500 py-2 px-4 rounded-lg">
          <Text className="text-center text-white font-semibold text-lg">Add Meal</Text>
        </TouchableOpacity>

        {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((mealType) => (
          <View key={mealType} className="mt-4 bg-gray-100 p-4 rounded-xl">
            <Text className="text-lg font-semibold text-gray-700">{mealType}</Text>
            {dailyLog.foods
              .filter((food) => food.mealType === mealType.toLowerCase())
              .map((food) => (
                <View key={food.id} className="flex-row justify-between items-center mt-4">
                  <Text className="text-sm text-gray-600">{food.name}</Text>
                  <Text className="text-sm text-gray-500">{food.calories} kcal</Text>
                </View>
              ))}
          </View>
        ))}

        {/* Activities Section */}
        <TouchableOpacity className="mt-10 bg-blue-500 py-2 px-4 rounded-lg">
          <Text className="text-center text-white font-semibold text-lg">Add Activities</Text>
        </TouchableOpacity>

        <View className="mt-4 bg-gray-100 p-4 rounded-xl">
          <Text className="text-lg font-semibold text-gray-700">Activities</Text>
          {dailyLog.exercises.map((exercise) => (
            <View key={exercise.id} className="flex-row justify-between items-center mt-4">
              <Text className="text-sm text-gray-600">{exercise.name}</Text>
              <Text className="text-sm text-gray-500">{exercise.caloriesBurned} kcal burned</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Log;
