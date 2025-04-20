import useAuth from "@/hooks/useAuth";
import useLog from "@/hooks/useLog";
import { FoodType } from "@/types/FoodType";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const MealTab = () => {
  const { user } = useAuth()
  const { currentLog, removeLogMeal } = useLog();
  const userId = user?._id;

  const handleRemoveMeal = (mealId: string) => {
    removeLogMeal(currentLog._id, mealId, userId);
  }

  return (
    <ScrollView className="mt-4">
      {/* Meals Section */}
      {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((mealType) => {
        const filteredFoods = currentLog?.foods?.filter(
          (food: FoodType) => food.mealType?.toLowerCase() === mealType.toLowerCase()
        ) || [];

        const totalCalories = filteredFoods.reduce((sum: any, food: any) => sum + food.calories, 0);

        return (
          <View key={mealType} className="mt-4 bg-gray-100 p-4 rounded-xl">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-semibold text-gray-700">{mealType}</Text>
              <Text className="text-sm font-medium text-gray-700">{totalCalories} kcal</Text>
            </View>
            {filteredFoods.length === 0 ? (
              <Text className="text-sm text-gray-500">No {mealType.toLowerCase()} items logged.</Text>
            ) : (
              filteredFoods.map((food: FoodType) => (
                <View key={food._id} className="flex-row justify-between items-center my-2">
                  <Text className="text-sm text-gray-600">{food.name}</Text>
                  <View className="flex flex-row">
                    <Text className="text-sm text-gray-500 mr-2">{food.calories} kcal</Text>
                    <TouchableOpacity onPress={() => handleRemoveMeal(food._id)}>
                      <Icon name="remove" size={20} color="#FF0000" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};


export default MealTab;