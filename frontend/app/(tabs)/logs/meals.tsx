import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import Constants from "expo-constants";
import Header from "@/components/Header";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

// Tabs Screen
const MyFoodsScreen = () => {
  <ScrollView>

  </ScrollView>
}

const SearchScreen = () => {
  <ScrollView>

  </ScrollView>
}

const Meals: React.FC = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [sortOption, setSortOption] = useState<"name" | "calories">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;

  const fetchMeals = async () => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/foods`);
      const data = await response.json();
      setMeals(data.foods || []);
    } catch (error) {
      console.error("Error fetching meals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  // Filter and sort meals
  const filteredMeals = meals.filter((item) =>
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
    <SafeAreaView className="flex-1 bg-white  pt-6">
      <Header title="Meals" icon="chevron-left" iconSize={25} titleSize="text-3xl" />

      <View className="flex-row items-center space-x-2 mt-5 px-6">
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
      <View className="flex-row justify-between relative mt-4 px-6">
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
            Sort: {`${sortOption === "name" ? "Name" : "Calories"} ${sortOrder === "asc" ? "Ascending" : "Descending"
              }`}
          </Text>
        </TouchableOpacity>

        {showSortDropdown && (
          <View className="absolute right-0 bg-white border border-gray-200 rounded-lg mt-12 w-48 z-10 shadow-lg mr-6">
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
      <View className="flex-row justify-center mt-6 border-b border-gray-300 pb-2 mx-6">
        <Text className="font-semibold ">My Foods</Text>
      </View>

      {/* Loading Indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#4B5563" className="mt-6" />
      ) : (
        <FlatList
          className="mt-4 px-6"
          data={sortedMeals}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View className="flex-row justify-between items-center bg-gray-100 p-3 mt-2 rounded-lg">
              <Text className="text-lg">{item.name}</Text>
              <View className="flex flex-row gap-4">
                <Text className="text-gray-600">{item.calories} cal</Text>
                <TouchableOpacity
                  onPress={() => router.push({
                    pathname: "/(tabs)/logs/add-meal-manual",
                    params: { mealId: item._id },
                  })}
                >
                  <Icon name="plus" size={20} color="#4B5563" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View className="mt-6 px-6">
              <Text className="text-center text-gray-500">No meals found.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Meals;
