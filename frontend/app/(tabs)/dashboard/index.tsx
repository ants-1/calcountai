import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import useAuth from "@/hooks/useAuth";
import Constants from "expo-constants";
import { useFocusEffect } from "expo-router";

const fetchLatestDailyLog = async (userId: string) => {
  try {
    const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;
    const response = await fetch(`${BACKEND_API_URL}/users/${userId}/dailyLogs`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch logs");
    }

    if (!data.dailyLogs || data.dailyLogs.length === 0) {
      return null; 
    }

    // Sort logs by date in descending order (latest first)
    const sortedLogs = data.dailyLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return sortedLogs[0];
  } catch (error) {
    console.error("Error fetching logs:", error);
    return null;
  }
};

const fetchWeightGoalData = async (userId: string) => {
  try {
    const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;
    const response = await fetch(`${BACKEND_API_URL}/users/${userId}`);

    const textResponse = await response.text(); 

    const data = JSON.parse(textResponse); 

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch weight goal data");
    }

    return data.user; 
  } catch (error) {
    console.error("Error fetching weight goal data:", error);
    return null;
  }
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const userId = user?._id;
  const router = useRouter();

  const [latestLog, setLatestLog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [weightGoal, setWeightGoal] = useState<number | null>(null);
  const [currentWeight, setCurrentWeight] = useState<number>(75);
  const [recentMeals, setRecentMeals] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]); 

  const dailyGoal = 2000;
  const streak = 5;
  const motivationalQuotes = [
    "You don't have to be great to start, but you have to start to be great.",
    "Success starts with self-discipline.",
    "Push yourself because no one else is going to do it for you.",
    "The only bad workout is the one that didn’t happen.",
    "Believe you can and you're halfway there."
  ];
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  const remainingCalories = dailyGoal - caloriesConsumed + caloriesBurned;
  const weightProgress = weightGoal ? ((currentWeight - weightGoal) / currentWeight) * 100 : 0;

  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        setLoading(true);
        fetchLatestDailyLog(userId)
          .then((log) => {
            if (log) {
              setLatestLog(log);

              // Calculate calories consumed and burned dynamically
              const consumed = log.foods?.reduce((sum: number, food: any) => sum + food.calories, 0) || 0;
              const burned = log.exercises?.reduce((sum: number, exercise: any) => sum + exercise.caloriesBurned, 0) || 0;

              setCaloriesConsumed(consumed);
              setCaloriesBurned(burned);

              // Set recent meals and activities from the log
              setRecentMeals(log.foods || []);
              setRecentActivities(log.exercises || []);
            }
          })
          .catch((error) => console.error("Error fetching log:", error));

        fetchWeightGoalData(userId)
          .then((userData) => {
            if (userData) {
              setWeightGoal(userData.targetWeight); 
              setCurrentWeight(userData.currentWeight);
            }
          })
          .catch((error) => console.error("Error fetching weight goal data:", error))
          .finally(() => setLoading(false));
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
    <SafeAreaView className="flex-1 bg-white px-4 pt-6 pb-6">
      <View className="flex-row justify-between items-center px-4">
        <Text className="text-3xl font-bold">Dashboard</Text>
        <TouchableOpacity onPress={() => router.push("/dashboard/profile" as any)}>
          <Icon name="user-circle" size={30} color="#4B5563" />
        </TouchableOpacity>
      </View>

      <ScrollView className="mt-6">
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
            You have logged your activity for {streak} consecutive days!
          </Text>
        </View>

        {/* Weight Goal Section */}
        <View className="mt-6 bg-green-100 p-4 rounded-xl">
          <Text className="text-lg font-semibold text-green-700">Weight Goal</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#4B5563" />
          ) : weightGoal !== null ? (
            <>
              <Text className="text-sm text-green-500 mt-2">
                Your goal is to reach {weightGoal?.toFixed(2)} kg. You're currently at {currentWeight?.toFixed(2)} kg.
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

        {/* Completed Challenges Section */}
        <View className="mt-10 bg-gray-100 p-4 rounded-xl">
          <Text className="text-lg font-semibold text-gray-700">Completed Challenges</Text>
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
          ) : latestLog?.foods?.length > 0 ? (
            latestLog.foods.map((meal: any, index: number) => (
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
          ) : latestLog?.exercises?.length > 0 ? (
            latestLog.exercises.map((exercise: any, index: number) => (
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
