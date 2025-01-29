import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";

const foodItemsData = [
  { id: "1", name: "Tea", calories: 2 },
  { id: "2", name: "Orange", calories: 32 },
  { id: "3", name: "Banana", calories: 52 },
];

const Meals: React.FC = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [sortOption, setSortOption] = useState<"name" | "calories">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Filter and sort meals
  const filteredMeals = foodItemsData.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const sortedMeals = filteredMeals.slice().sort((a, b) => {
    if (sortOption === "name") {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else {
      return sortOrder === "asc" ? a.calories - b.calories : b.calories - a.calories;
    }
  });

  // Sorting options
  const sortOptions = [
    { label: "Name Ascending", option: "name", order: "asc" },
    { label: "Name Descending", option: "name", order: "desc" },
    { label: "Calories Ascending", option: "calories", order: "asc" },
    { label: "Calories Descending", option: "calories", order: "desc" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white px-6 pt-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-3xl font-bold">Meals</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-left" size={24} color="#4B5563" />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center space-x-2">
        <TextInput
          className="flex-1 bg-gray-100 p-3 mr-3 rounded-lg"
          placeholder="Search for food..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity
          className="bg-blue-500 px-4 py-3 rounded-lg"
          onPress={() => router.push("/(tabs)/logs/add-meal-manual")}
        >
          <Text className="text-white font-semibold">+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Sort Dropdown */}
      <View className="flex-row justify-between relative mt-4">
        <TouchableOpacity 
        className="bg-gray-200 p-3 rounded-lg"
        onPress={() => router.push("/(tabs)/logs/add-meal-barcode")}
        >
          <Text>Scan a Barcode</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-gray-200 p-3 rounded-lg"
          onPress={() => setShowSortDropdown((prev) => !prev)}
        >
          <Text className="text-sm font-semibold">
            Sort: {`${sortOption === "name" ? "Name" : "Calories"} ${
              sortOrder === "asc" ? "Ascending" : "Descending"
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
                  setSortOption(option.option as "name" | "calories");
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
        <Text className="font-semibold">My Foods</Text>
      </View>

      {/* Food List */}
      <FlatList
        className="mt-4"
        data={sortedMeals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="flex-row justify-between items-center bg-gray-100 p-3 mt-2 rounded-lg">
            <Text className="text-lg">{item.name}</Text>
            <Text className="text-gray-600">{item.calories} cal</Text>
          </View>
        )}
        ListEmptyComponent={
          <View className="mt-6">
            <Text className="text-center text-gray-500">No meals found.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Meals;
