import { useFocusEffect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from "react-native-vector-icons/FontAwesome";
import useLog from '@/hooks/useLog';
import { FoodType } from '@/types/FoodType';
import { ExerciseType } from '@/types/ExerciseType';
import useActivity from '@/hooks/useActivity';

const Log: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const { dailyLogs, currentLog, fetchDailyLogs, createNewDailyLog, handlePrevious, handleNext } = useLog();
  const { removeExercise } = useActivity();

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchDailyLogs().finally(() => setLoading(false));;
      setLoading(false);
    }, [])
  );

  const handleRemoveExercise = async (exerciseId: string) => {
    removeExercise(exerciseId, currentLog);
  };

  if (loading) {
    return <ActivityIndicator size="large" className='pt-96' />;
  }

  const dailyGoal = 2000;
  const caloriesConsumed = currentLog?.foods?.reduce((sum: any, food: FoodType) => sum + food.calories, 0) || 0;
  const caloriesBurned = currentLog?.exercises?.reduce((sum: any, exercise: ExerciseType) => sum + exercise.caloriesBurned, 0) || 0;
  const remainingCalories = dailyGoal - caloriesConsumed + caloriesBurned;

  return (
    <SafeAreaView className="flex-1 bg-white px-4 pt-6">
      {/* Header */}
      <View className="flex flex-row justify-between items-center">
        <View></View>
        <View className='ml-8'>
          <Text className="text-3xl font-bold text-center">Daily Logs</Text>
          <Text className="font-semibold text-center">
            {currentLog ? new Date(currentLog.date).toLocaleDateString() : "No Logs"}
          </Text>
        </View>

        <TouchableOpacity onPress={createNewDailyLog}>
          <Icon name="plus" size={24} color="#4B5563" />
        </TouchableOpacity>
      </View>

      <ScrollView className="mt-4" showsVerticalScrollIndicator={false}>
        {dailyLogs?.length === 0 ? (
          <Text className="text-center mt-6 text-gray-500">No logs available. Creating one now...</Text>
        ) : currentLog ? (
          <>
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

            {/* Navigation Buttons */}
            <View className="flex-row justify-between mt-8">
              <TouchableOpacity
                disabled={!currentLog || dailyLogs[0]?._id === currentLog._id}
                onPress={handlePrevious}
                className={`bg-gray-200 p-3 rounded-lg ${!currentLog || dailyLogs[0]?._id === currentLog._id ? 'opacity-50' : ''}`}
              >
                <Icon name="arrow-left" size={24} color={(!currentLog || dailyLogs[0]?._id === currentLog._id) ? '#9CA3AF' : '#4B5563'} />
              </TouchableOpacity>

              <TouchableOpacity
                disabled={!currentLog || dailyLogs[dailyLogs.length - 1]?._id === currentLog._id}
                onPress={handleNext}
                className={`bg-gray-200 p-3 rounded-lg ${!currentLog || dailyLogs[dailyLogs.length - 1]?._id === currentLog._id ? 'opacity-50' : ''}`}
              >
                <Icon name="arrow-right" size={24} color={(!currentLog || dailyLogs[dailyLogs.length - 1]?._id === currentLog._id) ? '#9CA3AF' : '#4B5563'} />
              </TouchableOpacity>
            </View>


            <View className='flex flex-row justify-between mt-8'>
              {/* Add Meal Button */}
              <TouchableOpacity onPress={() => router.push("/(tabs)/logs/meals")} className='bg-blue-500 p-5 rounded-full w-36'>
                <Text className='text-white text-center'>+ Add Meal</Text>
              </TouchableOpacity>

              {/* Add Activity Button */}
              <TouchableOpacity onPress={() => router.push("/(tabs)/logs/activity")} className='bg-blue-500 p-5 rounded-full w-36'>
                <Text className='text-white text-center'>+ Add Activity</Text>
              </TouchableOpacity>
            </View>

            {/* Meals Section */}
            <Text className="text-2xl font-semibold text-center mt-8">Meals</Text>
            {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((mealType) => (
              <View key={mealType} className="mt-4 bg-gray-100 p-4 rounded-xl">
                <Text className="text-lg font-semibold text-gray-700">{mealType}</Text>
                {currentLog.foods
                  ?.filter((food: FoodType) => food.mealType?.toLowerCase() === mealType.toLowerCase())
                  .map((food: FoodType) => (
                    <View key={food._id} className="flex-row justify-between items-center mt-4">
                      <Text className="text-sm text-gray-600">{food.name}</Text>
                      <Text className="text-sm text-gray-500">{food.calories} kcal</Text>
                    </View>
                  ))}
              </View>
            ))}

            {/* Activities Section */}
            <Text className="text-2xl font-semibold text-center mt-10">Activities</Text>
            <View className="mt-4 bg-gray-100 p-4 rounded-xl">
              <Text className="text-lg font-semibold text-gray-700">Activities</Text>
              {currentLog.exercises?.map((exercise: ExerciseType) => {
                const key = exercise._id || `${exercise.name}-${exercise.caloriesBurned}`;
                return (
                  <View key={key} className="flex-row justify-between items-center mt-4">
                    <Text className="text-sm text-gray-600">{exercise.name}</Text>
                    <View className="flex flex-row gap-4">
                      <Text className="text-sm text-gray-500">{exercise.caloriesBurned} kcal burned</Text>
                      <TouchableOpacity
                        onPress={() => handleRemoveExercise(exercise._id)}
                      >
                        <Icon name="remove" size={20} color="#FF0000" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        ) : (
          <Text className="text-center mt-6 text-gray-500">No logs available for today.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Log;
