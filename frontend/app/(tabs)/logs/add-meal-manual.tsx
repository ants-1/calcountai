import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import useAuth from "@/hooks/useAuth";
import Header from "@/components/Header";

// Define types for state variables
interface Meal {
  name: string;
  calories: string;
  numberOfServings: string;
  servingSize: string;
  mealType: string;
  protein: string;
  fat: string;
  carbohydrates: string;
}

interface Log {
  _id: string;
  date: string;
  foods: Array<{ _id: string }>;
}

interface LogResponse {
  dailyLogs: Log[];
}

interface MealResponse {
  newFood: {
    _id: string;
  };
}

const AddMealManual = () => {
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?._id;
  const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;

  const [meal, setMeal] = useState<Meal>({
    name: "",
    calories: "",
    numberOfServings: "",
    servingSize: "",
    mealType: "",
    protein: "",
    fat: "",
    carbohydrates: "",
  });
  const [logs, setLogs] = useState<Log[]>([]);
  const [log, setLog] = useState<Log | null>(null);
  const [showLogDropdown, setShowLogDropdown] = useState<boolean>(false);
  const [showMealTypeDropdown, setShowMealTypeDropdown] = useState<boolean>(false);

  // Fetch logs for the user
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`${BACKEND_API_URL}/users/${userId}/dailyLogs`);
        const data: LogResponse = await response.json();
        setLogs(data.dailyLogs || []);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    fetchLogs();
  }, [userId]);

  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Handle the meal type selection
  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snacks"];

  const handleAddMeal = async () => {
    if (!log) {
      if (Platform.OS === "web") {
        alert("Error: \nPlease select a log.");
      } else {
        Alert.alert("Error", "Please select a log.");
      }
      return;
    }

    if (!meal.name || !meal.calories || !meal.numberOfServings || !meal.servingSize || !meal.mealType) {
      if (Platform.OS === "web") {
        alert("Error: \nPlease fill all required fields.");
      } else {
        Alert.alert("Error", "Please fill all required fields.");
      }
      return;
    }

    try {
      const mealResponse = await fetch(`${BACKEND_API_URL}/foods`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: meal.name,
          calories: meal.calories,
          numberOfServings: meal.numberOfServings,
          servingSize: meal.servingSize,
          protein: meal.protein,
          fat: meal.fat,
          carbohydrates: meal.carbohydrates,
          mealType: meal.mealType,
        }),
      });

      const rawResponse = await mealResponse.text();

      if (!mealResponse.ok) {
        if (Platform.OS === "web") {
          alert("Error: \nFailed to add meal.");
        } else {
          Alert.alert("Error", "Failed to add meal.");
        }
        return;
      }

      const mealData: MealResponse = JSON.parse(rawResponse);

      const mealId = mealData.newFood?._id;

      if (!mealId) {
        console.error("Invalid meal ID:", mealData);
        if (Platform.OS === "web") {
          alert("Error: \n Failed to create valid meal");
        } else {
          Alert.alert("Error", "Failed to create valid meal.");
        }
        return;
      }

      if (log.foods.some((m) => m._id === mealId)) {
        if (Platform.OS === "web") {
          alert("Error: \nThis meal has already been added to the log.");
        } else {
          Alert.alert("Error", "This meal has already been added to the log.");
        }
        return;
      }

      const updatedMeals = [...log.foods, { _id: mealId }];

      const logResponse = await fetch(
        `${BACKEND_API_URL}/users/${userId}/dailyLogs/${log._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            foods: updatedMeals,
          }),
        }
      );

      if (logResponse.ok) {
        const updatedLog = await logResponse.json();
        setLog(updatedLog.dailyLog);

        if (Platform.OS === "web") {
          alert("Success: \nMeal added successfully!");
        } else {
          Alert.alert("Success", "Meal added successfully!");
        }
        router.push("/logs");
      } else {
        const errorLogData = await logResponse.json();
        console.error("Failed to add meal to log:", errorLogData);
        if (Platform.OS === "web") {
          alert("Error: \nFailed to add meal to log.");
        } else {
          Alert.alert("Error", "Failed to add meal to log.");
        }
      }
    } catch (error) {
      console.error("Error adding meal:", error);
      if (Platform.OS === "web") {
        alert("Error: \nAn error occurred while adding the meal.");
      } else {
        Alert.alert("Error", "An error occurred while adding the meal.");
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white pt-6">
      <Header title="Add Meal" icon="chevron-left" iconSize={25} titleSize="text-3xl" />

      <ScrollView showsVerticalScrollIndicator={false} className="px-6">
        {/* Name */}
        <Text className="text-lg font-semibold mb-2 mt-10">Meal Name</Text>
        <TextInput
          className="w-full p-4 bg-gray-200 rounded-lg mb-4 text-lg"
          placeholder="Enter meal name"
          value={meal.name}
          onChangeText={(text) => setMeal({ ...meal, name: text })}
        />

        {/* Calories */}
        <Text className="text-lg font-semibold mb-2">Calories</Text>
        <TextInput
          className="w-full p-4 bg-gray-200 rounded-lg mb-4 text-lg"
          placeholder="Enter calorie amount"
          keyboardType="numeric"
          value={meal.calories}
          onChangeText={(text) => setMeal({ ...meal, calories: text })}
        />

        {/* Number of Servings */}
        <Text className="text-lg font-semibold mb-2">Number of Servings</Text>
        <TextInput
          className="w-full p-4 bg-gray-200 rounded-lg mb-4 text-lg"
          placeholder="Enter number of servings"
          keyboardType="numeric"
          value={meal.numberOfServings}
          onChangeText={(text) => setMeal({ ...meal, numberOfServings: text })}
        />

        {/* Serving Size */}
        <Text className="text-lg font-semibold mb-2">Serving Size (grams/ml)</Text>
        <TextInput
          className="w-full p-4 bg-gray-200 rounded-lg mb-4 text-lg"
          placeholder="Enter serving size"
          keyboardType="numeric"
          value={meal.servingSize}
          onChangeText={(text) => setMeal({ ...meal, servingSize: text })}
        />

        {/* Meal Type */}
        <Text className="text-lg font-semibold mb-2">Meal Type</Text>
        <View className="flex-row justify-start relative ">
          <TouchableOpacity
            className="bg-gray-200 px-3 py-6 rounded-lg w-full"
            onPress={() => setShowMealTypeDropdown((prev) => !prev)}
          >
            <Text className="font-semibold">
              {meal.mealType ? `${meal.mealType}` : "Select a Meal Type"}
            </Text>
          </TouchableOpacity>

          {showMealTypeDropdown && (
            <View className="absolute left-0 bg-white border border-gray-200 rounded-lg mt-12 w-full z-10 shadow-lg">
              {mealTypes.map((mealType) => (
                <TouchableOpacity
                  key={mealType}
                  className="p-2"
                  onPress={() => {
                    setMeal({ ...meal, mealType });
                    setShowMealTypeDropdown(false);
                  }}
                >
                  <Text className="text-gray-700">{mealType}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Protein */}
        <Text className="text-lg font-semibold mb-2 mt-4">Protein (grams)</Text>
        <TextInput
          className="w-full p-4 bg-gray-200 rounded-lg mb-4 text-lg"
          placeholder="Enter protein amount"
          keyboardType="numeric"
          value={meal.protein}
          onChangeText={(text) => setMeal({ ...meal, protein: text })}
        />

        {/* Fat */}
        <Text className="text-lg font-semibold mb-2">Fat (grams)</Text>
        <TextInput
          className="w-full p-4 bg-gray-200 rounded-lg mb-4 text-lg"
          placeholder="Enter fat amount"
          keyboardType="numeric"
          value={meal.fat}
          onChangeText={(text) => setMeal({ ...meal, fat: text })}
        />

        {/* Carbohydrates */}
        <Text className="text-lg font-semibold mb-2">Carbohydrates (grams)</Text>
        <TextInput
          className="w-full p-4 bg-gray-200 rounded-lg mb-4 text-lg"
          placeholder="Enter carbohydrate amount"
          keyboardType="numeric"
          value={meal.carbohydrates}
          onChangeText={(text) => setMeal({ ...meal, carbohydrates: text })}
        />

        {/* Log Selection */}
        <Text className="text-lg font-semibold mb-2">Logs</Text>
        <View className="flex-row justify-start relative ">
          <TouchableOpacity
            className="bg-gray-200 px-3 py-6 rounded-lg w-full"
            onPress={() => setShowLogDropdown((prev) => !prev)}
          >
            <Text className="font-semibold">
              {log ? `Selected Log: ${formatDate(log.date)}` : "Select a Log"}
            </Text>
          </TouchableOpacity>

          {showLogDropdown && (
            <View className="absolute left-0 bg-white border border-gray-200 rounded-lg mt-12 w-full z-10 shadow-lg">
              {logs.map((logItem) => (
                <TouchableOpacity
                  key={logItem._id}
                  className="p-2"
                  onPress={() => {
                    setLog(logItem);
                    setShowLogDropdown(false);
                  }}
                >
                  <Text className="text-gray-700">{`Log Date: ${formatDate(logItem.date)}`}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View className="flex items-center justify-center mt-10">
          <TouchableOpacity
            className={`p-4 rounded-lg w-[300px] ${meal.name && meal.calories && meal.numberOfServings && meal.servingSize && meal.mealType && log
              ? "bg-blue-500"
              : "bg-gray-300"
              }`}
            disabled={!meal.name || !meal.calories || !meal.numberOfServings || !meal.servingSize || !meal.mealType || !log}
            onPress={handleAddMeal}
          >
            <Text className="text-center text-white font-semibold text-lg">Add Meal</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddMealManual;
