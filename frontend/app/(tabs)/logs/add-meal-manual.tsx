import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";

const AddMealManual = () => {
  const router = useRouter();

  const [meal, setMeal] = useState({
    name: "",
    calories: "",
    numberOfServings: "",
    servingSize: "",
    mealType: "",
    protein: "",
    fat: "",
    carbohydrates: "",
  });

  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];

  // Handle Form Submission
  const handleSubmit = () => {
    if (!meal.name || !meal.calories || !meal.numberOfServings || !meal.servingSize || !meal.mealType) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    console.log("Meal Added:", meal);

    router.push("/logs");
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6 pt-6">
      <View className="flex-row justify-between items-center mb-10">
        <Text className="text-3xl font-bold">Add Meal</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-left" size={24} color="#4B5563" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Name */}
        <Text className="text-lg font-semibold mb-2">Meal Name</Text>
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

        {/* Meal Type (Dropdown) */}
        <Text className="text-lg font-semibold mb-2">Meal Type</Text>
        <View className="w-full bg-gray-200 rounded-lg mb-4">
          {mealTypes.map((type) => (
            <TouchableOpacity
              key={type}
              className={`p-4 ${meal.mealType === type ? "bg-blue-500" : ""}`}
              onPress={() => setMeal({ ...meal, mealType: type })}
            >
              <Text className={`text-lg ${meal.mealType === type ? "text-white font-bold" : "text-black"}`}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="flex items-center justify-center mt-6">
          <TouchableOpacity
            className={`p-4 rounded-lg w-[300px] ${meal.name && meal.calories && meal.numberOfServings && meal.servingSize && meal.mealType
              ? "bg-blue-500"
              : "bg-gray-300"
              }`}
            disabled={!meal.name || !meal.calories || !meal.numberOfServings || !meal.servingSize || !meal.mealType}
            onPress={handleSubmit}
          >
            <Text className="text-center text-white font-semibold text-lg">Add</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddMealManual;
