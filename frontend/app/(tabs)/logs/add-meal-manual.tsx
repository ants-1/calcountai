import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuth from "@/hooks/useAuth";
import Header from "@/components/Header";
import useLog from "@/hooks/useLog";
import { MealForm } from "@/types/MealForm";
import { LogForm } from "@/types/LogForm";
import useMeal from "@/hooks/useMeal";
import { formatDate } from "@/utils/dateFormatter";

const AddMealManual = () => {
  const { user } = useAuth();
  const userId = user?._id;
  const { addMeals, selectedMeal } = useMeal();
  const { dailyLogs, fetchDailyLogs } = useLog();

  const [meal, setMeal] = useState<MealForm>({
    name: selectedMeal?.name || "",
    calories: selectedMeal?.calories || "",
    numberOfServings: selectedMeal?.numberOfServings || "1",
    servingSize: selectedMeal?.servingSize || "",
    mealType: selectedMeal?.mealType || "",
    protein: selectedMeal?.protein || "",
    fat: selectedMeal?.fat || "",
    carbohydrates: selectedMeal?.carbohydrates || "",
  });

  const [originalMeal, setOriginalMeal] = useState<MealForm>(meal);
  const [log, setLog] = useState<LogForm | null>(null);
  const [showLogDropdown, setShowLogDropdown] = useState<boolean>(false);
  const [showMealTypeDropdown, setShowMealTypeDropdown] = useState<boolean>(false);
  const [showServingsDropdown, setShowServingsDropdown] = useState<boolean>(false);

  useEffect(() => {
    fetchDailyLogs();
  }, [userId]);

  useEffect(() => {
    if (selectedMeal) {
      const initialMeal = {
        name: selectedMeal?.name || "",
        calories: selectedMeal?.calories || "",
        numberOfServings: selectedMeal?.numberOfServings || "1",
        servingSize: selectedMeal?.servingSize || "",
        mealType: selectedMeal?.mealType || "",
        protein: selectedMeal?.protein || "",
        fat: selectedMeal?.fat || "",
        carbohydrates: selectedMeal?.carbohydrates || "",
      };
      setMeal(initialMeal);
      setOriginalMeal(initialMeal);
    }
  }, [selectedMeal]);

  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snacks"];
  const servingSizes = ["0.25", "0.50", "0.75", "1", "2", "3", "4", "5"];

  const handleChange = (key: keyof MealForm, value: string) => {
    if (key === "name" || key === "mealType" || key === "servingSize") {
      setMeal((prevMeal) => ({ ...prevMeal, [key]: value }));
      return;
    }

    if (value === "") {
      setMeal((prevMeal) => ({ ...prevMeal, [key]: value }));
      return;
    }

    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue <= 0) {
      return;
    }

    if (["calories", "protein", "fat", "carbohydrates"].includes(key)) {
      value = numericValue.toFixed(2);
    }

    setMeal((prevMeal) => ({ ...prevMeal, [key]: value }));
  };


  const getNumericValue = (value: string | undefined): number => {
    return value ? parseFloat(value) : 0;
  };

  // Update the calculated fields based on servings when the servings field is changed
  const handleNumberOfServingsChange = (newServings: string) => {
    const servings = parseFloat(newServings);
    if (servings > 0.1) {
      const updatedMeal = {
        ...meal,
        numberOfServings: newServings,
        calories: (getNumericValue(originalMeal.calories) * servings).toFixed(2),
        protein: (getNumericValue(originalMeal.protein) * servings).toFixed(2),
        fat: (getNumericValue(originalMeal.fat) * servings).toFixed(2),
        carbohydrates: (getNumericValue(originalMeal.carbohydrates) * servings).toFixed(2),
      };
      setMeal(updatedMeal);
    }
  };

  const handleBlur = (key: keyof MealForm) => {
    if (meal[key] === "") return;

    const numericValue = parseFloat(meal[key]);
    if (isNaN(numericValue) || numericValue < 0) {
      setMeal({ ...meal, [key]: selectedMeal?.[key] || "" });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white pt-6">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <Header title="Add Meal" icon="chevron-left" iconSize={25} titleSize="text-3xl" />

        <ScrollView showsVerticalScrollIndicator={false} className="px-6">
          {/* Name */}
          <Text className="text-lg font-semibold mb-2 mt-10">Meal Name</Text>
          <TextInput
            className="w-full p-4 pt-2 bg-gray-200 rounded-full mb-4 text-lg"
            placeholder="Enter meal name"
            value={meal.name}
            onChangeText={(text) => handleChange("name", text)}
          />

          {/* Number of Servings Dropdown */}
          <Text className="text-lg font-semibold mb-2">Number of Servings</Text>
          <View className="flex-row justify-start relative">
            <TouchableOpacity
              className="bg-gray-200 px-3 py-6 rounded-full w-full"
              onPress={() => setShowServingsDropdown((prev) => !prev)}
            >
              <Text className="font-semibold">
                {meal.numberOfServings ? `${meal.numberOfServings} Servings` : "Select Number of Servings"}
              </Text>
            </TouchableOpacity>
            
            {showServingsDropdown && (
              <View className="absolute left-0 bg-white border border-gray-200 rounded-lg mt-12 w-full z-10 shadow-lg max-h-20" style={{ zIndex: 999 }}>
                <ScrollView>
                  {servingSizes.map((size) => (
                    <TouchableOpacity
                      key={size}
                      className="p-2"
                      onPress={() => {
                        handleNumberOfServingsChange(size);
                        setShowServingsDropdown(false);
                      }}
                    >
                      <Text className="text-gray-700">{`${size} Servings`}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Calories Input */}
          <Text className="text-lg font-semibold mt-4" style={{ zIndex: -99 }}>Calories</Text>
          <TextInput
            className="w-full p-4 pt-2 bg-gray-200 rounded-full mb-4 text-lg"
            placeholder="Enter calorie amount"
            keyboardType="numeric"
            value={meal.calories.toString()}
            onChangeText={(text) => handleChange("calories", text)}
            onBlur={() => handleBlur("calories")}
            returnKeyType="done"
          />

          {/* Serving Size Input */}
          <Text className="text-lg font-semibold mb-2 mt-2" style={{ zIndex: -99 }}>Serving Size</Text>
          <TextInput
            className="w-full p-4 pt-2 bg-gray-200 rounded-full mb-4 text-lg"
            placeholder="Enter serving size"
            keyboardType="numeric"
            value={meal.servingSize.toString()}
            onChangeText={(text) => handleChange("servingSize", text)}
            onBlur={() => handleBlur("servingSize")}
            returnKeyType="done"
          />

          {/* Meal Type Input */}
          <Text className="text-lg font-semibold mb-2" style={{ zIndex: -99 }}>Meal Type</Text>
          <View className="flex-row justify-start relative">
            <TouchableOpacity
              className="bg-gray-200 px-3 py-6 rounded-full w-full"
              onPress={() => setShowMealTypeDropdown((prev) => !prev)}
            >
              <Text className="font-semibold">
                {meal.mealType ? `${meal.mealType}` : "Select a Meal Type"}
              </Text>
            </TouchableOpacity>

            {showMealTypeDropdown && (
              <View className="absolute left-0 bg-white border border-gray-200 rounded-lg mt-12 w-full z-10 shadow-lg max-h-20" style={{ zIndex: 999 }}>
                <ScrollView>
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
                </ScrollView>
              </View>
            )}
          </View>

          {/* Protein Input */}
          <Text className="text-lg font-semibold mb-2 mt-4" style={{ zIndex: -99 }}>Protein (grams)</Text>
          <TextInput
            className="w-full p-4 pt-2 bg-gray-200 rounded-full mb-4 text-lg"
            placeholder="Enter protein amount"
            keyboardType="numeric"
            value={meal.protein.toString()}
            onChangeText={(text) => handleChange("protein", text)}
            onBlur={() => handleBlur("protein")}
            returnKeyType="done"
          />

          {/* Fat Input */}
          <Text className="text-lg font-semibold mb-2">Fat (grams)</Text>
          <TextInput
            className="w-full p-4 pt-2 bg-gray-200 rounded-full mb-4 text-lg"
            placeholder="Enter fat amount"
            keyboardType="numeric"
            value={meal.fat.toString()}
            onChangeText={(text) => handleChange("fat", text)}
            onBlur={() => handleBlur("fat")}
            returnKeyType="done"
          />

          {/* Carbohydrates Input */}
          <Text className="text-lg font-semibold mb-2">Carbohydrates (grams)</Text>
          <TextInput
            className="w-full p-4 pt-2 bg-gray-200 rounded-full mb-4 text-lg"
            placeholder="Enter carbohydrate amount"
            keyboardType="numeric"
            value={meal.carbohydrates.toString()}
            onChangeText={(text) => handleChange("carbohydrates", text)}
            onBlur={() => handleBlur("carbohydrates")}
            returnKeyType="done"
          />

          {/* Log Selection */}
          <Text className="text-lg font-semibold mb-2">Logs</Text>
          <View className="flex-row justify-start relative">
            <TouchableOpacity
              className="bg-gray-200 px-3 py-6 rounded-full w-full"
              onPress={() => setShowLogDropdown((prev) => !prev)}
            >
              <Text className="font-semibold">
                {log ? `Selected Log: ${formatDate(log.date)}` : "Select a Log"}
              </Text>
            </TouchableOpacity>

            {showLogDropdown && (
              <ScrollView className="absolute left-0 bg-white border border-gray-200 rounded-lg mt-12 w-full z-10 shadow-lg max-h-20" style={{ zIndex: 999 }}>
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

          {/* Add Meal to Log Button */}
          <View className={`flex items-center justify-center mt-10 ${Platform.OS === "web" ? "mb-5" : ""}`} style={{ zIndex: -99 }}>
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
