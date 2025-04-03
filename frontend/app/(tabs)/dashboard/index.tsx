import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import useAuth from "@/hooks/useAuth";
import { useFocusEffect } from "expo-router";
import Header from "@/components/Header";
import { motivationalQuotes } from "@/utils/motivationalQuotes";
import { useUserData } from "@/hooks/useUser";
import useLog from "@/hooks/useLog";
import { FoodType } from "@/types/FoodType";
import { ActivityType } from "@/types/ActivityType";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const userId = user?._id;
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const { streak, currentWeight, targetWeight, fetchWeightGoalData, fetchStreak } = useUserData();
  const { currentLog, fetchDailyLogs, createNewDailyLog } = useLog();

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  const dailyGoal = 2000;
  const caloriesConsumed = currentLog?.foods?.reduce((sum: number, food: FoodType) => sum + food.calories, 0) || 0;
  const caloriesBurned = currentLog?.exercises?.reduce((sum: number, exercise: ActivityType) => sum + exercise.caloriesBurned, 0) || 0;
  const remainingCalories = dailyGoal - caloriesConsumed + caloriesBurned;

  // Calculate weight progress
  const weightProgress = targetWeight && currentWeight
    ? ((currentWeight - targetWeight) / targetWeight) * 100
    : 0;

  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        setLoading(true);
        fetchDailyLogs().finally(() => setLoading(false));
        fetchWeightGoalData(userId).finally(() => setLoading(false));
        fetchStreak(userId);
      }
    }, [userId])
  );

  const getProgressMessage = () => {
    if (remainingCalories > 0) {
      return "You're doing great! Keep pushing towards your goal!";
    } else if (remainingCalories === 0) {
      return "You've reached your goal today! Excellent work!";
    } else {
      return "You can still hit your goal! Keep up the effort!";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4 pt-6">
      <Header title="Dashboard" icon="user-circle" iconSize={30} titleSize="text-3xl" link="/dashboard/profile" />

      <ScrollView>
        {/* Motivational Support Section */}
        <View className="mt-6 bg-yellow-100 p-4 rounded-xl">
          <Text className="text-lg font-semibold text-yellow-700">Motivation for You</Text>
          <Text className="text-base text-gray-600 mt-2">{randomQuote}</Text>
        </View>

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

        {/* Streak Section */}
        <View className="mt-6 bg-blue-100 p-4 rounded-xl">
          <Text className="text-lg font-semibold text-blue-700">Streak</Text>
          <Text className="text-sm text-blue-500 mt-2">
            You have logged your activity for {streak || 0} consecutive days!
          </Text>
        </View>

        {/* Weight Goal Section */}
        <View className="mt-6 bg-green-100 p-4 rounded-xl">
          <Text className="text-lg font-semibold text-green-700">Weight Goal</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#4B5563" />
          ) : targetWeight !== null ? (
            <>
              <Text className="text-sm text-green-500 mt-2">
                Your goal is to reach {targetWeight?.toFixed(2)} kg. You're currently at {currentWeight?.toFixed(2)} kg.
              </Text>
              <View className="w-full bg-gray-300 h-2 mt-2 rounded-xl">
                <View
                  className="bg-green-500 h-2 rounded-xl"
                  style={{ width: `${Math.max(0, Math.min(weightProgress, 100))}%` }}
                />
              </View>
            </>
          ) : (
            <Text className="text-sm text-gray-500 mt-2">No weight goal set yet.</Text>
          )}
        </View>

        {/* Daily Progress Message */}
        <View className="mt-6 bg-gray-100 p-4 rounded-xl">
          <Text className="text-lg font-semibold text-gray-700">Daily Progress Message</Text>
          <Text className="text-sm text-gray-500 mt-2">{getProgressMessage()}</Text>
        </View>

        {/* Challenges Section */}
        <View className="mt-10 bg-gray-100 p-4 rounded-xl">
          <Text className="text-lg font-semibold text-gray-700">Challenges</Text>
          <TouchableOpacity
            className="mt-4 bg-blue-500 py-2 px-4 rounded-lg"
            onPress={() => router.push("/(tabs)/dashboard/challenges")}
          >
            <Text className="text-center text-white font-semibold text-lg">
              View Challenges
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent Meals Section */}
        <View className="mt-10 bg-gray-100 p-4 rounded-xl">
          <Text className="text-lg font-semibold text-gray-700">Recent Meals</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#4B5563" />
          ) : currentLog?.foods?.length > 0 ? (
            currentLog.foods.map((meal: any, index: number) => (
              <View key={index} className="flex-row justify-between items-center mt-4">
                <Text className="text-sm text-gray-600">{meal.name}</Text>
                <Text className="text-sm text-gray-500">{meal.calories} kcal</Text>
              </View>
            ))
          ) : (
            <Text className="text-sm text-gray-500 mt-2">No meals logged today.</Text>
          )}
          <TouchableOpacity
            className="mt-4 bg-blue-500 py-2 px-4 rounded-lg"
            onPress={() => router.push("/logs")}
          >
            <Text className="text-center text-white font-semibold text-lg">View Logs</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activities Section */}
        <View className="mt-10 bg-gray-100 p-4 rounded-xl">
          <Text className="text-lg font-semibold text-gray-700">Recent Activities</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#4B5563" />
          ) : currentLog?.exercises?.length > 0 ? (
            currentLog.exercises.map((exercise: any, index: number) => (
              <View key={index} className="flex-row justify-between items-center mt-4">
                <Text className="text-sm text-gray-600">{exercise.name}</Text>
                <Text className="text-sm text-gray-500">{exercise.caloriesBurned} kcal</Text>
              </View>
            ))
          ) : (
            <Text className="text-sm text-gray-500 mt-2">No activities logged today.</Text>
          )}
          <TouchableOpacity
            className="mt-4 bg-blue-500 py-2 px-4 rounded-lg"
            onPress={() => router.push("/(tabs)/logs")}
          >
            <Text className="text-center text-white font-semibold text-lg">View Activities</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;