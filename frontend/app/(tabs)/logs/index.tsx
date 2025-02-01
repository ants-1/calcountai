import { useFocusEffect, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from "react-native-vector-icons/FontAwesome";
import useAuth from "@/hooks/useAuth";
import Constants from "expo-constants";

const Log: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [dailyLogs, setDailyLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentLog, setCurrentLog] = useState(null);
  const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchDailyLogs();
    }, [])
  );

  const fetchDailyLogs = async () => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/users/${user._id}/dailyLogs`);
      if (!response.ok) {
        throw new Error("Failed to fetch logs");
      }

      const data = await response.json();
      const logs = data.dailyLogs;
      setDailyLogs(logs);

      const today = new Date().toISOString().split('T')[0];
      const todayLog = logs.find(log => log.date.split('T')[0] === today);

      if (!todayLog) {
        const newLog = {
          date: today,
          foods: [],
          exercises: [],
          completed: false,
        };

        const newLogResponse = await fetch(`${BACKEND_API_URL}/users/${user._id}/dailyLogs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newLog),
        });

        if (!newLogResponse.ok) {
          throw new Error("Failed to create log for today");
        }

        const createdLog = await newLogResponse.json();
        setCurrentLog(createdLog.dailyLog);
        setDailyLogs([...logs, createdLog.dailyLog]);
      } else {
        setCurrentLog(todayLog);
      }
    } catch (error) {
      console.error("Error fetching or creating log:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (!currentLog) return;

    const index = dailyLogs.findIndex(log => log._id === currentLog._id);
    if (index > 0) {
      setCurrentLog(dailyLogs[index - 1]);
    }
  };

  const handleNext = () => {
    if (!currentLog) return;

    const index = dailyLogs.findIndex(log => log._id === currentLog._id);
    if (index < dailyLogs.length - 1) {
      setCurrentLog(dailyLogs[index + 1]);
    }
  };

  // const handleDeleteLog = async () => {
  //   try {
  //     const confirmDelete = await Alert.alert(
  //       "Delete Log",
  //       "Are you sure you want to delete this log?",
  //       [
  //         { text: "Cancel", style: "cancel" },
  //         {
  //           text: "Delete", onPress: async () => {
  //             const response = await fetch(`${BACKEND_API_URL}/users/${user._id}/dailyLogs/${currentLog._id}`, {
  //               method: "DELETE",
  //             });

  //             if (!response.ok) {
  //               throw new Error("Failed to delete log");
  //             }

  //             await fetchDailyLogs();
  //             setCurrentLog(null); // Optionally reset current log
  //             Alert.alert("Success", "The log has been deleted.");
  //           }
  //         }
  //       ]
  //     );
  //   } catch (error) {
  //     console.error("Error deleting log:", error);
  //   }
  // };

  const handleCreateNewLog = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Check if today's log already exists
      const todayLog = dailyLogs.find(log => log.date.split('T')[0] === today);
      if (todayLog) {
        Alert.alert(
          "Log Already Created",
          "A log for today has already been created.",
          [{ text: "OK" }]
        );
        return;
      }

      const newLog = {
        date: today,
        foods: [],
        exercises: [],
        completed: false,
      };

      const response = await fetch(`${BACKEND_API_URL}/users/${user._id}/dailyLogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLog),
      });

      if (!response.ok) {
        throw new Error("Failed to create log");
      }

      await fetchDailyLogs();
    } catch (error) {
      console.error("Error creating log:", error);
    }
  };

  const handleRemoveExercise = async (exerciseId) => {
    if (!currentLog) return;

    try {
      const updatedExercises = currentLog.exercises.filter(exercise => exercise._id !== exerciseId);

      const response = await fetch(`${BACKEND_API_URL}/users/${user._id}/dailyLogs/${currentLog._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exercises: updatedExercises }),
      });

      if (response.ok) {
        const updatedLog = await response.json();
        setCurrentLog(updatedLog.dailyLog);
      } else {
        Alert.alert("Failed to remove exercise");
      }
    } catch (error) {
      console.error("Error removing exercise:", error);
    }
  };


  if (loading) {
    return <ActivityIndicator size="large" className='pt-96' />;
  }

  const dailyGoal = 2000;
  const caloriesConsumed = currentLog?.foods?.reduce((sum, food) => sum + food.calories, 0) || 0;
  const caloriesBurned = currentLog?.exercises?.reduce((sum, exercise) => sum + exercise.caloriesBurned, 0) || 0;
  const remainingCalories = dailyGoal - caloriesConsumed + caloriesBurned;

  return (
    <SafeAreaView className="flex-1 bg-white px-4 pt-6">
      <View className="flex flex-row justify-between items-center">
        {/* Delete Button
        <TouchableOpacity
          onPress={handleDeleteLog}
        >
          <Icon name="remove" size={24} color="#4B5563" />
        </TouchableOpacity> */}
        <View></View>
        <View className='ml-8'>
          <Text className="text-3xl font-bold text-center">Daily Logs</Text>
          <Text className="font-semibold text-center">
            {currentLog ? new Date(currentLog.date).toLocaleDateString() : "No Logs"}
          </Text>
        </View>

        <TouchableOpacity onPress={handleCreateNewLog}>
          <Icon name="plus" size={24} color="#4B5563" />
        </TouchableOpacity>
      </View>

      <ScrollView className="mt-4" showsVerticalScrollIndicator={false}>
        {dailyLogs.length === 0 ? (
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

            <View className='flex flex-row justify-between'>
              <TouchableOpacity
                className="mt-8 bg-blue-500 py-2 px-4 rounded-lg w-40"
                onPress={() => router.push("/(tabs)/logs/meals")}
              >
                <Text className="text-center text-white font-semibold text-lg">Add Meal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="mt-8 bg-blue-500 py-2 px-4 rounded-lg w-40"
                onPress={() => router.push("/(tabs)/logs/activity")}
              >
                <Text className="text-center text-white font-semibold text-lg">Add Activity</Text>
              </TouchableOpacity>
            </View>

            {/* Meals Section */}
            {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((mealType) => (
              <View key={mealType} className="mt-4 bg-gray-100 p-4 rounded-xl">
                <Text className="text-lg font-semibold text-gray-700">{mealType}</Text>
                {currentLog.foods
                  ?.filter((food) => food.mealType?.toLowerCase() === mealType.toLowerCase())
                  .map((food) => (
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
              {currentLog.exercises?.map((exercise) => {
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
