import { useFocusEffect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from "react-native-vector-icons/FontAwesome";
import useLog from '@/hooks/useLog';
import { FoodType } from '@/types/FoodType';
import { ExerciseType } from '@/types/ExerciseType';
import MealTab from '@/components/MealTab';
import ActivityTab from '@/components/ActivityTab';

const Log: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [index, setIndex] = useState(0);

  const router = useRouter();
  const { dailyLogs, currentLog, fetchDailyLogs, handlePrevious, handleNext } = useLog();

  const routes = [
    { key: "meal", title: "Meals" },
    { key: "activity", title: "Activities" }
  ];

  const renderScene = SceneMap({
    meal: () => <MealTab />,
    activity: () => <ActivityTab />
  });

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchDailyLogs().finally(() => setLoading(false));;
    }, [])
  );

  if (loading) {
    return <ActivityIndicator size="large" className='pt-96' />;
  }

  const dailyGoal = 2000;
  const caloriesConsumed = currentLog?.foods?.reduce((sum: any, food: FoodType) => sum + food.calories, 0) || 0;
  const caloriesBurned = currentLog?.exercises?.reduce((sum: any, exercise: ExerciseType) => sum + exercise.caloriesBurned, 0) || 0;
  const remainingCalories = dailyGoal - caloriesConsumed + caloriesBurned;
  console.log(currentLog);

  return (
    <SafeAreaView className="flex-1 bg-white px-4 pt-6">
      {/* Header */}
      <View className="flex flex-row justify-between items-center">
        {/* Previous Log Button */}
        <TouchableOpacity
          disabled={!currentLog || dailyLogs[0]?._id === currentLog._id}
          onPress={handlePrevious}
          className={`${!currentLog || dailyLogs[0]?._id === currentLog._id ? 'opacity-50' : ''}`}
        >
          <Icon name="chevron-left" size={24} color={(!currentLog || dailyLogs[0]?._id === currentLog._id) ? '#9CA3AF' : '#4B5563'} />
        </TouchableOpacity>

        <View>
          <Text className="text-3xl font-bold text-center">Daily Logs</Text>
          <Text className="font-semibold text-center">
            {currentLog ? new Date(currentLog.date).toLocaleDateString() : "No Logs"}
          </Text>
        </View>

        {/* Next Log Button */}
        <TouchableOpacity
          disabled={!currentLog || dailyLogs[dailyLogs.length - 1]?._id === currentLog._id}
          onPress={handleNext}
          className={`${!currentLog || dailyLogs[dailyLogs.length - 1]?._id === currentLog._id ? 'opacity-50' : ''}`}
        >
          <Icon name="chevron-right" size={24} color={(!currentLog || dailyLogs[dailyLogs.length - 1]?._id === currentLog._id) ? '#9CA3AF' : '#4B5563'} />
        </TouchableOpacity>
      </View>

      <View className='flex-1'>
        <View className="mt-4 mb-4">
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

              {/* Nutritional Marco Section */}
              <View className='flex flex-row justify-evenly mt-4'>
                <View className='w-24 p-2 flex justify-center items-center gap-2 bg-gray-100 rounded-lg'>
                  <Text className='text-gray-700 font-semibold'>Protein</Text>
                  <Text className='text-gray-500'>{currentLog.protein}g</Text>
                </View>
                <View className='w-24 p-2 flex justify-center items-center gap-2 bg-gray-100 rounded-lg'>
                  <Text className='text-gray-700 font-semibold'>Fats</Text>
                  <Text className='text-gray-500'>{currentLog.fats}g</Text>
                </View>
                <View className='w-24 p-2 flex justify-center items-center gap-2 bg-gray-100 rounded-lg'>
                  <Text className='text-gray-700 font-semibold'>Carbs</Text>
                  <Text className='text-gray-500'>{currentLog.carbs}g</Text>
                </View>
              </View>

              <View className='flex flex-row justify-between mt-4'>
                {/* Add Meal Button */}
                <TouchableOpacity onPress={() => router.push("/(tabs)/logs/meals")} className='bg-blue-500 p-5 rounded-full w-36'>
                  <Text className='text-white text-center'>+ Add Meal</Text>
                </TouchableOpacity>

                {/* Add Activity Button */}
                <TouchableOpacity onPress={() => router.push("/(tabs)/logs/activity")} className='bg-blue-500 p-5 rounded-full w-36'>
                  <Text className='text-white text-center'>+ Add Activity</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text className="text-center mt-6 text-gray-500">No logs available for today.</Text>
          )}
        </View>

        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: Dimensions.get("window").width }}
          renderTabBar={(props) => (
            <TabBar {...props} indicatorStyle={{ backgroundColor: "#3B82F6" }} style={{ backgroundColor: "white" }} activeColor="#3B82F6" inactiveColor="gray" />
          )}
        />

      </View>
    </SafeAreaView>
  );
};

export default Log;
