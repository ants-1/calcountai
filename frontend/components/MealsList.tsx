import { View, Text, FlatList } from 'react-native'
import React from 'react'
import MealCard from './MealCard'

const MealsList: React.FC = (sortedMeals: any) => {
  return (
    <FlatList
      className="mt-4 px-6"
      data={sortedMeals}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <MealCard item={item} />
      )}
      ListEmptyComponent={
        <View className="mt-6 px-6">
          <Text className="text-center text-gray-500">No meals found.</Text>
        </View>
      }
    />
  )
}

export default MealsList