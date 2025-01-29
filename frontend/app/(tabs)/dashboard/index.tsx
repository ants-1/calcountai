import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from "expo-router";

const Dashboard: React.FC = () => {
  const [caloriesConsumed, setCaloriesConsumed] = useState(1200);
  const [caloriesBurned, setCaloriesBurned] = useState(500);
  const dailyGoal = 2000;
  const router = useRouter();

  const recentMeals = [
    { name: 'Salad', calories: 350 },
    { name: 'Chips', calories: 450 },
    { name: 'Pizza', calories: 400 },
  ];

  const recentActivities = [
    { name: 'Running', calories: 300 },
    { name: 'Cycling', calories: 200 },
  ];

  const completedChallenges = [
    { name: 'Walk 10,000 steps', date: 'Jan 25, 2025' },
    { name: 'Drink 2L of water', date: 'Jan 24, 2025' },
    { name: 'Consume 1500 calories', date: 'Jan 23, 2025' },
  ];

  const streak = 5;
  const weightGoal = 70;
  const currentWeight = 75;

  const remainingCalories = dailyGoal - caloriesConsumed + caloriesBurned;
  const weightProgress = ((currentWeight - weightGoal) / currentWeight) * 100;

  // Sample motivational quotes
  const motivationalQuotes = [
    "You don't have to be great to start, but you have to start to be great.",
    "Success starts with self-discipline.",
    "Push yourself because no one else is going to do it for you.",
    "The only bad workout is the one that didn’t happen.",
    "Believe you can and you're halfway there."
  ];

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

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
    <SafeAreaView className="flex-1 bg-white px-4 pt-6 -pb-6">
      <View className="flex-row justify-between items-center px-4">
        {/* Dashboard Title */}
        <Text className="text-3xl font-bold">Dashboard</Text>

        {/* Profile Icon */}
        <TouchableOpacity onPress={() => router.push("/dashboard/profile" as any)}>
          <Icon name="user-circle" size={30} color="#4B5563" />
        </TouchableOpacity>
      </View>

      <ScrollView className="mt-6">
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
          <Text className="text-sm text-green-500 mt-2">
            Your goal is to reach {weightGoal} kg. You're currently at {currentWeight} kg.
          </Text>
          <View className="w-full bg-gray-300 h-2 mt-2 rounded-xl">
            <View
              className="bg-green-500 h-2 rounded-xl"
              style={{ width: `${Math.max(0, Math.min(weightProgress, 100))}%` }}
            />
          </View>
        </View>

        {/* Motivational Support Section */}
        <View className="mt-6 bg-yellow-100 p-4 rounded-xl">
          <Text className="text-lg font-semibold text-yellow-700">Motivation for You</Text>
          <Text className="text-base text-gray-600 mt-2">{randomQuote}</Text>
        </View>

        {/* Daily Progress Message */}
        <View className="mt-6 bg-gray-100 p-4 rounded-xl">
          <Text className="text-lg font-semibold text-gray-700">Daily Progress Message</Text>
          <Text className="text-sm text-gray-500 mt-2">{getProgressMessage()}</Text>
        </View>

        {/* Completed Challenges Section */}
        <View className="mt-10 bg-gray-100 p-4 rounded-xl">
          <Text className="text-lg font-semibold text-gray-700">Completed Challenges</Text>
          {completedChallenges.map((challenge, index) => (
            <View key={index} className="flex-row justify-between items-center mt-4">
              <Text className="text-sm text-gray-600">{challenge.name}</Text>
              <Text className="text-sm text-gray-500">{challenge.date}</Text>
            </View>
          ))}

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
          {recentMeals.map((meal, index) => (
            <View key={index} className="flex-row justify-between items-center mt-4">
              <Text className="text-sm text-gray-600">{meal.name}</Text>
              <Text className="text-sm text-gray-500">{meal.calories} kcal</Text>
            </View>
          ))}

          <TouchableOpacity
            className="mt-4 bg-blue-500 py-2 px-4 rounded-lg"
            onPress={() => router.push("/logs")}
          >
            <Text className="text-center text-white font-semibold text-lg">
              View Logs
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activities Section */}
        <View className="mt-10 bg-gray-100 p-4 rounded-xl">
          <Text className="text-lg font-semibold text-gray-700">Recent Activities</Text>
          {recentActivities.map((activity, index) => (
            <View key={index} className="flex-row justify-between items-center mt-4">
              <Text className="text-sm text-gray-600">{activity.name}</Text>
              <Text className="text-sm text-gray-500">{activity.calories} kcal burned</Text>
            </View>
          ))}

          <TouchableOpacity
            className="mt-4 bg-blue-500 py-2 px-4 rounded-lg"
            onPress={() => router.push("/(tabs)/logs/activity")}
          >
            <Text className="text-center text-white font-semibold text-lg">
              View Activities
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
