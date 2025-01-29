import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";

const activityItemsData = [
  { id: "1", name: "Running", caloriesBurned: 300 },
  { id: "2", name: "Cycling", caloriesBurned: 250 },
  { id: "3", name: "Swimming", caloriesBurned: 400 },
];

const ActivityTrackerScreen: React.FC = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [sortOption, setSortOption] = useState<"name" | "caloriesBurned">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Filter and sort activities
  const filteredActivities = activityItemsData.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const sortedActivities = filteredActivities.slice().sort((a, b) => {
    if (sortOption === "name") {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else {
      return sortOrder === "asc"
        ? a.caloriesBurned - b.caloriesBurned
        : b.caloriesBurned - a.caloriesBurned;
    }
  });

  // Sorting options
  const sortOptions = [
    { label: "Name Ascending", option: "name", order: "asc" },
    { label: "Name Descending", option: "name", order: "desc" },
    { label: "Calories Burned Ascending", option: "caloriesBurned", order: "asc" },
    { label: "Calories Burned Descending", option: "caloriesBurned", order: "desc" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white px-6 pt-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-3xl font-bold">Activities</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-left" size={24} color="#4B5563" />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center space-x-2">
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

      {/* Sort Dropdown */}
      <View className="flex-row justify-start relative mt-4">
        <TouchableOpacity
          className="bg-gray-200 p-3 rounded-lg"
          onPress={() => setShowSortDropdown((prev) => !prev)}
        >
          <Text className="text-sm font-semibold">
            Sort: {`${sortOption === "name" ? "Name" : "Calories Burned"} ${sortOrder === "asc" ? "Ascending" : "Descending"
              }`}
          </Text>
        </TouchableOpacity>

        {showSortDropdown && (
          <View className="absolute right-0 bg-white border border-gray-200 rounded-lg mt-12 w-48 z-10 shadow-lg">
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.label}
                className="p-2"
                onPress={() => {
                  setSortOption(option.option as "name" | "caloriesBurned");
                  setSortOrder(option.order as "asc" | "desc");
                  setShowSortDropdown(false);
                }}
              >
                <Text className="text-sm text-gray-700">{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Tabs */}
      <View className="flex-row justify-around mt-6 border-b border-gray-300 pb-2">
        <Text className="font-semibold">History</Text>
        <Text className="font-semibold">My Activities</Text>
      </View>

      {/* Activity List */}
      <FlatList
        className="mt-4"
        data={sortedActivities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="flex-row justify-between items-center bg-gray-100 p-3 mt-2 rounded-lg">
            <Text className="text-lg">{item.name}</Text>
            <Text className="text-gray-600">{item.caloriesBurned} cal</Text>
          </View>
        )}
        ListEmptyComponent={
          <View className="mt-6">
            <Text className="text-center text-gray-500">No activities found.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default ActivityTrackerScreen;
