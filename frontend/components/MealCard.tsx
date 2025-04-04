import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useRouter } from "expo-router";
import { FoodType } from '@/types/FoodType';
import useMeal from '@/hooks/useMeal';

const MealCard = ({ item }: { item: FoodType }) => {
  const router = useRouter();
  const { setSelectedMeal } = useMeal();

  return (
    <View className="flex-col gap-2 bg-gray-100 p-3 mt-2 rounded-lg">
      <View className='flex-row justify-between items-center'>
        <Text className="text-lg">{item.name}</Text>
        <TouchableOpacity
          onPress={() => {
            setSelectedMeal({ ...item })
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
        <Text className="text-gray-600">{item.calories} cal</Text>
      </View>
    </View >
  )
}

export default MealCard