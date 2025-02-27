import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import Constants from "expo-constants";
import useAuth from "@/hooks/useAuth";
import Header from "@/components/Header";
import { ActivityType } from "@/types/ActivityType";

type SortOption = "name" | "caloriesBurned";
type SortOrder = "asc" | "desc";

const ActivityTrackerScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?._id;
  const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;

  const [searchText, setSearchText] = useState<string>("");
  const [sortOption, setSortOption] = useState<SortOption>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [showSortDropdown, setShowSortDropdown] = useState<boolean>(false);
  const [allActivities, setAllActivities] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [todayLog, setTodayLog] = useState<any | null>(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch(`${BACKEND_API_URL}/exercises`);
        const data = await response.json();
        setAllActivities(data.exercises || []);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTodayLog = async () => {
      try {
        const response = await fetch(`${BACKEND_API_URL}/users/${userId}/dailyLogs`);
        const data = await response.json();

        const today = new Date().toISOString().split("T")[0];
        const todaysLog = data.dailyLogs?.find((log: any) => log.date.split("T")[0] === today);

        setTodayLog(todaysLog || null);
      } catch (error) {
        console.error("Error fetching today's log:", error);
      }
    };

    if (userId) {
      fetchExercises();
      fetchTodayLog();
    }
  }, [userId]);

  const handleAddExercise = async (exerciseId: string) => {
    if (!todayLog) {
      router.push("/(tabs)/logs");
      return;
    }

    if (todayLog.exercises.some((e: any) => e._id === exerciseId)) {
      if (Platform.OS === "web") {
        alert("Error: \nThis activity has already been added to today's log.")
      } else {
        Alert.alert("Error", "This activity has already been added to today's log.");
      } 
      return;
    }

    try {
      const response = await fetch(
        `${BACKEND_API_URL}/users/${userId}/dailyLogs/${todayLog._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            exercises: [...todayLog.exercises.map((e: any) => e._id), exerciseId],
          }),
        }
      );

      if (response.ok) {
        const updatedLog = await response.json();
        setTodayLog(updatedLog.dailyLog);

        if (Platform.OS === "web") {
          alert("Exercise Added: \nExercise has been added to log");
        } else {
          Alert.alert("Exercise Added", "Exercise has been added to log");
        }

        router.push("/(tabs)/logs");
      } else {

        if (Platform.OS === "web") {
          alert("Error: \nFailed to add exercise");
        } else {
          Alert.alert("Error", "Failed to add exercise");
        }
      }
    } catch (error) {
      console.error("Error adding exercise:", error);
    }
  };

  // Function to apply sorting based on selected option and order
  const getSortedActivities = () => {
    return allActivities
      .filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()))
      .sort((a, b) => {
        if (sortOption === "name") {
          return sortOrder === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else if (sortOption === "caloriesBurned") {
          return sortOrder === "asc"
            ? a.caloriesBurned - b.caloriesBurned
            : b.caloriesBurned - a.caloriesBurned;
        }
        return 0;
      });
  };

  return (
    <SafeAreaView className="flex-1 bg-white pt-6">
      <Header title="Activities" icon="chevron-left" iconSize={25} titleSize="text-3xl" />

      <View className="flex-row items-center space-x-2 px-6 mt-5">
        <TextInput
          className="flex-1 bg-gray-100 p-3 mr-3 rounded-lg"
          placeholder="Search for an activity..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity
          className="bg-blue-500 px-4 py-3 rounded-lg"
          onPress={() => router.push("/(tabs)/logs/add-activity")}
        >
          <Text className="text-white font-semibold">+ Add</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-start relative mt-4 px-6">
        <TouchableOpacity
          className="bg-gray-200 p-3 rounded-lg"
          onPress={() => setShowSortDropdown((prev) => !prev)}
        >
          <Text className="text-sm font-semibold">
            Sort: {`${sortOption === "name" ? "Name" : "Calories Burned"} ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
          </Text>
        </TouchableOpacity>

        {showSortDropdown && (
          <View className="absolute left-0 bg-white border border-gray-200 rounded-lg mt-12 w-48 z-10 shadow-lg">
            {[
              { label: "Name Ascending", option: "name", order: "asc" },
              { label: "Name Descending", option: "name", order: "desc" },
              { label: "Calories Burned Ascending", option: "caloriesBurned", order: "asc" },
              { label: "Calories Burned Descending", option: "caloriesBurned", order: "desc" },
            ].map((option) => (
              <TouchableOpacity
                key={option.label}
                className="p-2"
                onPress={() => {
                  setSortOption(option.option as SortOption);
                  setSortOrder(option.order as SortOrder);
                  setShowSortDropdown(false);
                }}
              >
                <Text className="text-sm text-gray-700">{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View className="flex-row justify-around mt-6 border-b border-gray-300 pb-2 mx-6">
        <Text className="font-semibold px-6">History</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4B5563" className="mt-6" />
      ) : (
        <FlatList
          className="mt-4 px-6"
          data={getSortedActivities()}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View className="flex-row justify-between items-center bg-gray-100 p-3 mt-2 rounded-lg">
              <Text className="text-lg">{item.name}</Text>
              <View className="flex flex-row items-center gap-4">
                <Text className="text-gray-600">{item.caloriesBurned} cal</Text>
                <TouchableOpacity onPress={() => handleAddExercise(item._id)}>
                  <Icon name="plus" size={20} color="#4B5563" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View className="mt-6">
              <Text className="text-center text-gray-500">No activities found.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default ActivityTrackerScreen;
