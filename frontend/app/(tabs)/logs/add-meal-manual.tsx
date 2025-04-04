import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Platform, KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuth from "@/hooks/useAuth";
import Header from "@/components/Header";
import useLog from "@/hooks/useLog";
import { MealForm } from "@/types/MealForm";
import { LogForm } from "@/types/LogForm";
import useMeal from "@/hooks/useMeal";

const AddMealManual = () => {
  const { user } = useAuth();
  const userId = user?._id;
  const { addMeals, selectedMeal } = useMeal();

  const [meal, setMeal] = useState<MealForm>({
    name: selectedMeal?.name || "",
    calories: selectedMeal?.calories || "",
    numberOfServings: selectedMeal?.numberOfServings || "",
    servingSize: selectedMeal?.servingSize || "",
    mealType: selectedMeal?.mealType || "",
    protein: selectedMeal?.protein || "",
    fat: selectedMeal?.fat || "",
    carbohydrates: selectedMeal?.carbohydrates || "",
  });

  useEffect(() => {
    if (selectedMeal) {
      const updatedMeal = {
        name: selectedMeal?.name || "",
        calories: selectedMeal?.calories || "",
        numberOfServings: selectedMeal?.numberOfServings || "",
        servingSize: selectedMeal?.servingSize || "",
        mealType: selectedMeal?.mealType || "",
        protein: selectedMeal?.protein || "",
        fat: selectedMeal?.fat || "",
        carbohydrates: selectedMeal?.carbohydrates || "",
      };
      setMeal(updatedMeal);
    }
  }, [selectedMeal]);

  const { dailyLogs, fetchDailyLogs } = useLog();
  const [log, setLog] = useState<LogForm | null>(null);
  const [showLogDropdown, setShowLogDropdown] = useState<boolean>(false);
  const [showMealTypeDropdown, setShowMealTypeDropdown] = useState<boolean>(false);

  // Fetch logs for the user
  useEffect(() => {
    fetchDailyLogs();
  }, [userId]);

  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Handle the meal type selection
  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snacks"];

  return (

    <SafeAreaView className="flex-1 bg-white pt-6">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Header title="Add Meal" icon="chevron-left" iconSize={25} titleSize="text-3xl" />

        <ScrollView showsVerticalScrollIndicator={false} className="px-6">
          {/* Name */}
          <Text className="text-lg font-semibold mb-2 mt-10">Meal Name</Text>
          <TextInput
            className="w-full p-4 bg-gray-200 rounded-full mb-4 text-lg"
            placeholder="Enter meal name"
            value={meal.name}
            onChangeText={(text) => setMeal({ ...meal, name: text })}
          />

          {/* Calories */}
          <Text className="text-lg font-semibold mb-2">Calories</Text>
          <TextInput
            className="w-full p-4 bg-gray-200 rounded-full mb-4 text-lg"
            placeholder="Enter calorie amount"
            keyboardType="numeric"
            value={meal.calories.toString()}
            onChangeText={(text) => setMeal({ ...meal, calories: text })}
            returnKeyType="done"
          />

          {/* Number of Servings */}
          <Text className="text-lg font-semibold mb-2">Number of Servings</Text>
          <TextInput
            className="w-full p-4 bg-gray-200 rounded-full mb-4 text-lg"
            placeholder="Enter number of servings"
            keyboardType="numeric"
            value={meal.numberOfServings.toString()}
            onChangeText={(text) => setMeal({ ...meal, numberOfServings: text })}
            returnKeyType="done"
          />

          {/* Serving Size */}
          <Text className="text-lg font-semibold mb-2">Serving Size (grams/ml)</Text>
          <TextInput
            className="w-full p-4 bg-gray-200 rounded-full mb-4 text-lg"
            placeholder="Enter serving size"
            keyboardType="numeric"
            value={meal.servingSize.toString()}
            onChangeText={(text) => setMeal({ ...meal, servingSize: text })}
            returnKeyType="done"
          />

          {/* Meal Type */}
          <Text className="text-lg font-semibold mb-2">Meal Type</Text>
          <View className="flex-row justify-start relative ">
            <TouchableOpacity
              className="bg-gray-200 px-3 py-6 rounded-full w-full"
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
            className="w-full p-4 bg-gray-200 rounded-full mb-4 text-lg"
            placeholder="Enter protein amount"
            keyboardType="numeric"
            value={meal.protein.toString()}
            onChangeText={(text) => setMeal({ ...meal, protein: text })}
            returnKeyType="done"
          />

          {/* Fat */}
          <Text className="text-lg font-semibold mb-2">Fat (grams)</Text>
          <TextInput
            className="w-full p-4 bg-gray-200 rounded-full mb-4 text-lg"
            placeholder="Enter fat amount"
            keyboardType="numeric"
            value={meal.fat.toString()}
            onChangeText={(text) => setMeal({ ...meal, fat: text })}
            returnKeyType="done"
          />

          {/* Carbohydrates */}
          <Text className="text-lg font-semibold mb-2">Carbohydrates (grams)</Text>
          <TextInput
            className="w-full p-4 bg-gray-200 rounded-full mb-4 text-lg"
            placeholder="Enter carbohydrate amount"
            keyboardType="numeric"
            value={meal.carbohydrates.toString()}
            onChangeText={(text) => setMeal({ ...meal, carbohydrates: text })}
            returnKeyType="done"
          />

          {/* Log Selection */}
          <Text className="text-lg font-semibold mb-2">Logs</Text>
          <View className="flex-row justify-start relative ">
            <TouchableOpacity
              className="bg-gray-200 px-3 py-6 rounded-full w-full"
              onPress={() => setShowLogDropdown((prev) => !prev)}
            >
              <Text className="font-semibold">
                {log ? `Selected Log: ${formatDate(log.date)}` : "Select a Log"}
              </Text>
            </TouchableOpacity>

            {showLogDropdown && (
              <ScrollView className="absolute left-0 bg-white border border-gray-200 rounded-lg mt-12 w-full z-10 shadow-lg">
                {dailyLogs.map((logItem) => (
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
              </ScrollView>
            )}
          </View>

          <View className="flex items-center justify-center mt-10">
            <TouchableOpacity
              className={`p-4 rounded-full w-[300px] ${meal.name && meal.calories && meal.numberOfServings && meal.servingSize && meal.mealType && log
                ? "bg-blue-500"
                : "bg-gray-300"
                }`}
              disabled={!meal.name || !meal.calories || !meal.numberOfServings || !meal.servingSize || !meal.mealType || !log}
              onPress={() => addMeals(meal, log)}
            >
              <Text className="text-center text-white font-semibold text-lg">Add Meal</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddMealManual;
