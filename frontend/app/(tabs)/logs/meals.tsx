import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import useMeal from "@/hooks/useMeal";
import MealsList from "@/components/MealsList";

const Meals: React.FC = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [sortOption, setSortOption] = useState<"name" | "calories">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const { meals, apiMeals, fetchMeals, fetchAPIMeals } = useMeal();

  const [index, setIndex] = useState(0);
  const routes = [
    { key: "myfoods", title: "My Foods" },
    { key: "search", title: "Search" },
  ];

  const handleSearch = async () => {
    if (searchText.trim().length > 1) {
      setSearchLoading(true);
      await fetchAPIMeals(searchText);
      setSearchLoading(false);
    }
  };

  const MyFoodsScreen = () => {
    return (
      <View>
        {loading ? (
          <ActivityIndicator size="large" color="#4B5563" className="mt-6" />
        ) : (
          MealsList(sortedMeals)
        )}
      </View>
    );
  };

  const SearchScreen = () => {
    return (
      <View>
        {searchLoading ? (
          <ActivityIndicator size="large" color="#4B5563" className="mt-6" />
        ) : searchText.trim().length <= 1 ? (
          <Text className="text-gray-500  mt-6 text-center">Type at least 2 letters and hit search.</Text>
        ) : apiMeals.length === 0 ? (
          <Text className="text-gray-500 mt-6 text-center">No foods found for "{searchText}".</Text>
        ) : (
          MealsList(apiMeals)
        )}
      </View>
    );
  };

  const renderScene = SceneMap({
    myfoods: MyFoodsScreen,
    search: SearchScreen,
  });

  useEffect(() => {
    fetchMeals().finally(() => setLoading(false));
  }, []);

  // Filter and sort meals
  const filteredMeals = meals.filter((item: any) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const sortedMeals = filteredMeals.slice().sort((a: any, b: any) => {
    if (sortOption === "name") {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else {
      return sortOrder === "asc" ? a.calories - b.calories : b.calories - a.calories;
    }
  });

  const sortOptions = [
    { label: "Name Ascending", option: "name", order: "asc" },
    { label: "Name Descending", option: "name", order: "desc" },
    { label: "Calories Ascending", option: "calories", order: "asc" },
    { label: "Calories Descending", option: "calories", order: "desc" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white pt-6">
      <Header title="Meals" icon="chevron-left" iconSize={25} titleSize="text-3xl" />

      <View className="flex-row items-center space-x-2 mt-5 px-6">
        <TextInput
          className="flex-1 bg-gray-100 p-3 mr-2 rounded-full"
          placeholder="Search for food..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity
          className="bg-blue-500 px-4 py-3 rounded-full"
          onPress={handleSearch}
        >
          <Text className="text-white font-semibold">Search</Text>
        </TouchableOpacity>
      </View>

      {/* Sort + Scan */}
      <View className="flex-row justify-between relative mt-4 px-6">
      <TouchableOpacity
          className="bg-black px-4 py-3 rounded-full"
          onPress={() => router.push("/(tabs)/logs/add-meal-manual")}
        >
          <Text className="text-white font-semibold">+ Add</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-black p-3 rounded-full"
          onPress={() => setShowSortDropdown((prev) => !prev)}
        >
          <Text className="text-sm font-semibold text-white">
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

      <View className="mb-6"></View>

      {/* Tab View */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get("window").width }}
        renderTabBar={(props) => (
          <TabBar {...props} indicatorStyle={{ backgroundColor: "#3B82F6" }} style={{ backgroundColor: "white" }} activeColor="#3B82F6" inactiveColor="gray" />
        )}
      />
    </SafeAreaView>
  );
};

export default Meals;
