import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from "expo-router";
import { FoodType } from '@/types/FoodType';
import useMeal from '@/hooks/useMeal';

const MealCard = ({ item }: { item: FoodType }) => {
  const router = useRouter();
  const { setSelectedMeal } = useMeal();

  const servings = item.numberOfServings ?? 1;

  const totalCalories = (item.calories ?? 0) * servings;
  const totalProtein = (item.protein ?? 0) * servings;
  const totalFat = (item.fat ?? 0) * servings;
  const totalCarbs = (item.carbohydrates ?? 0) * servings;

  return (
    <View className="flex-col gap-2 bg-gray-100 p-3 mt-2 rounded-lg">
      <View className='flex-row justify-between items-center'>
        <Text className="text-lg">
          {item.name.length > 29 ? item.name.slice(0, 29) + "..." : item.name}
        </Text>

        <TouchableOpacity
          onPress={() => {
            setSelectedMeal({ ...item });
            router.push({
              pathname: "/(tabs)/logs/add-meal-manual",
              params: { mealId: item._id },
            });
          }}
        >
          <Icon name="plus" size={20} color="#4B5563" />
        </TouchableOpacity>
      </View>

      <View className='flex-row justify-between items-center'>
        <Text className="text-gray-600">{item.numberOfServings} servings</Text>
        <Text className="text-gray-600">{totalCalories.toFixed(0)} cal</Text>
      </View>

      <View className='flex-row justify-between items-center'>
        <Text className="text-gray-600 text-sm">Protein: {totalProtein.toFixed(1)}g</Text>
        <Text className="text-gray-600 text-sm">Fat: {totalFat.toFixed(1)}g</Text>
        <Text className="text-gray-600 text-sm">Carbs: {totalCarbs.toFixed(1)}g</Text>
      </View>
    </View>
  );
};

export default MealCard;
