import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import useActivity from "@/hooks/useActivity";
import ActivityList from "@/components/ActivityList";

type SortOption = "name" | "caloriesBurned";
type SortOrder = "asc" | "desc";

const ActivityTrackerScreen: React.FC = () => {
  const router = useRouter();
  const { activities, fetchExercises } = useActivity();

  const [searchText, setSearchText] = useState<string>("");
  const [sortOption, setSortOption] = useState<SortOption>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [showSortDropdown, setShowSortDropdown] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchExercises().finally(() => setLoading(false));
  })

  // Function to apply sorting based on selected option and order
  const getSortedActivities = () => {
    return activities
      ?.filter((item: any) => item.name.toLowerCase().includes(searchText.toLowerCase()))
      .sort((a: any, b: any) => {
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
          className="flex-1 bg-gray-100 p-3 mr-3 rounded-full"
          placeholder="Search for an activity..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity
          className="bg-blue-500 px-4 py-3 rounded-full"
          onPress={() => router.push("/(tabs)/logs/add-activity")}
        >
          <Text className="text-white font-semibold">+ Add</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-end relative mt-4 px-6">
        <TouchableOpacity
          className="bg-black p-3 rounded-full"
          onPress={() => setShowSortDropdown((prev) => !prev)}
        >
          <Text className="text-sm text-white  font-semibold">
            Sort: {`${sortOption === "name" ? "Name" : "Calories Burned"} ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
          </Text>
        </TouchableOpacity>

        {showSortDropdown && (
          <View className="absolute right-5 bg-white border border-gray-200 rounded-lg mt-12 w-48 z-10 shadow-lg">
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

      <View style={{ zIndex: -99 }} className="flex-row justify-around mt-6 border-b border-gray-300 pb-2 mx-6">
        <Text className="font-semibold px-6">History</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4B5563" className="mt-6" />
      ) : (
        <ActivityList activities={getSortedActivities()} />
      )}
    </SafeAreaView>
  );
};

export default ActivityTrackerScreen;
