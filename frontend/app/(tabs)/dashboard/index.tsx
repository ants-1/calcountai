import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import useAuth from "@/hooks/useAuth";
import { useFocusEffect } from "expo-router";
import Header from "@/components/Header";
import { useUserData } from "@/hooks/useUser";
import useLog from "@/hooks/useLog";
import { FoodType } from "@/types/FoodType";
import { ActivityType } from "@/types/ActivityType";
import useChallenge from "@/hooks/useChallenge";
import { getQuoteOfTheDay } from "@/utils/motivationalQuotes";
import CalorieProgressCard from "@/components/CalorieProgressCard";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const userId = user?._id;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const { weightHistory, calories, streak, currentWeight, targetWeight, goal, fetchWeightGoalData, fetchStreak, userData } = useUserData();
  const { currentLog, fetchDailyLogs } = useLog();
  const { fetchChallenges, fetchUserChallenges, userChallenges } = useChallenge();

  const dailyGoal = calories || 2000;
  const caloriesConsumed = currentLog?.foods?.reduce((sum: number, food: FoodType) => sum + food.calories, 0) || 0;
  const caloriesBurned = currentLog?.exercises?.reduce((sum: number, exercise: ActivityType) => sum + exercise.caloriesBurned, 0) || 0;
  const remainingCalories = dailyGoal - caloriesConsumed + caloriesBurned;

  useEffect(() => {
    if (currentWeight && targetWeight && weightHistory?.[0]?.weight) {
      const startWeight = weightHistory[0].weight;
      const endWeight = targetWeight;
      const totalChange = startWeight - endWeight;
      const currentChange = startWeight - currentWeight;
      const percentage = (currentChange / totalChange) * 100;
      const currentProgress = Math.max(0, Math.min(percentage, 100));
      setProgress(currentProgress);
    }
  }, [currentWeight, targetWeight, weightHistory]);


  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        setLoading(true);
        fetchDailyLogs().finally(() => setLoading(false));
        fetchWeightGoalData(userId).finally(() => setLoading(false));
        fetchUserChallenges(userId);
        fetchStreak(userId);
        fetchChallenges();
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

      <ScrollView className={`w-full ${Platform.OS == "web" ? 'pb-10 px-10 md:px-20' : ''}`}>
        {/* Motivational Support Section */}
        {goal?.includes("Reduce Stress") && (
          <View className={`mt-6 bg-blue-100 p-4 rounded-xl`}>
            <Text className="text-lg font-semibold text-blue-700">Motivation for You</Text>
            <Text className="text-base text-gray-600 mt-2">{getQuoteOfTheDay()}</Text>
          </View>
        )}

        {/* Calorie Progress Section */}
        <CalorieProgressCard />

        {/* Streak Section */}
        {goal?.includes("Get Healthier") && (
          <View className="mt-6 bg-green-100 p-4 rounded-xl">
            <Text className="text-lg font-semibold text-green-700">Streak</Text>
            <Text className="text-sm text-green-500 mt-2">
              You have logged your activity for {streak || 0} consecutive days!
            </Text>
          </View>
        )}

        {/* Weight Goal Section */}
        {goal?.includes("Lose Weight") && (
          <View className="mt-6 bg-yellow-100 p-4 rounded-xl">
            <Text className="text-lg font-semibold text-yellow-700">Weight Goal</Text>
            {loading ? (
              <ActivityIndicator size="small" color="#4B5563" />
            ) : targetWeight !== null ? (
              <>
                <Text className="text-sm text-yellow-500 mt-2">
                  Your goal is to reach {targetWeight?.toFixed(2)} kg. You're currently at {currentWeight?.toFixed(2)} kg.
                </Text>
                <View className="w-full bg-gray-300 h-2 mt-2 rounded-xl">
                  <View
                    className="bg-yellow-500 h-2 rounded-xl"
                    style={{ width: `${progress}%` }}
                  />
                </View>

                {progress >= 100 && (
                  <Text className="text-center text-yellow-500 mt-2 font-semibold">
                    Well done for completing your goal!
                  </Text>
                )}

                {/* View Weight History Button */}
                <TouchableOpacity
                  className="mt-4 bg-yellow-500 py-2 px-4 rounded-full"
                  onPress={() => router.push("/(tabs)/dashboard/weight-history")}
                >
                  <Text className="text-center text-white font-semibold text-lg">View History</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text className="text-sm text-gray-500 mt-2">No weight goal set yet.</Text>
            )}
          </View>
        )}

        {/* Daily Progress Message */}
        <View className="mt-6 bg-gray-100 p-4 rounded-xl">
          <Text className="text-lg font-semibold text-gray-700">Daily Progress Message</Text>
          <Text className="text-sm text-gray-500 mt-2">{getProgressMessage()}</Text>
        </View>

        {/* Challenges Section */}
        <View className="mt-10 bg-gray-100 p-4 rounded-xl">
          <Text className="text-lg font-semibold text-gray-700">Challenges</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#4B5563" />
          ) : userChallenges?.length > 0 ? (
            userChallenges.slice(0, 3).map((challenge: any, index: number) => (
              <View key={index} className="flex-row justify-between items-center mt-4">
                <Text className="text-sm text-gray-600">{challenge.name}</Text>
                {(() => {
                  const level = Number(challenge.level);
                  const participant = challenge.participants?.find((p: any) => p.user === userId || p.user?._id === userId);
                  const progress = participant?.progress ?? 0;
                  const percentage = level > 0 ? Math.min((progress / level) * 100, 100) : 0;

                  return (
                    <Text className="text-sm text-gray-500">
                      {Math.round(percentage)}%
                    </Text>
                  );
                })()}
              </View>
            ))
          ) : (
            <Text className="text-sm text-gray-500 mt-2">No challenges.</Text>
          )}
          {/* View Challenges Button */}
          <TouchableOpacity
            className="mt-4 bg-blue-500 py-2 px-4 rounded-full"
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
            currentLog.foods.slice(0, 3).map((meal: any, index: number) => (
              <View key={index} className="flex-row justify-between items-center mt-4">
                <Text className="text-sm text-gray-600">{meal.name}</Text>
                <Text className="text-sm text-gray-500">{meal.calories} kcal</Text>
              </View>
            ))
          ) : (
            <Text className="text-sm text-gray-500 mt-2">No meals logged today.</Text>
          )}
          <TouchableOpacity
            className="mt-4 bg-blue-500 py-2 px-4 rounded-full"
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
            currentLog.exercises.slice(0, 3).map((exercise: any, index: number) => (
              <View key={index} className="flex-row justify-between items-center mt-4">
                <Text className="text-sm text-gray-600">{exercise.name}</Text>
                <Text className="text-sm text-gray-500">{exercise.caloriesBurned} kcal</Text>
              </View>
            ))
          ) : (
            <Text className="text-sm text-gray-500 mt-2">No activities logged today.</Text>
          )}
          <TouchableOpacity
            className="mt-4 bg-blue-500 py-2 px-4 rounded-full"
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