import useLog from "@/hooks/useLog";
import { FoodType } from "@/types/FoodType";
import { ScrollView, View, Text } from "react-native";

const MealTab = () => {
  const { currentLog } = useLog();

  return (
    <ScrollView className="mt-4">
      {/* Meals Section */}
      {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((mealType) => {
        const filteredFoods = currentLog.foods?.filter(
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
                <View key={food._id} className="flex-row justify-between items-center mt-2">
                  <Text className="text-sm text-gray-600">{food.name}</Text>
                  <Text className="text-sm text-gray-500">{food.calories} kcal</Text>
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