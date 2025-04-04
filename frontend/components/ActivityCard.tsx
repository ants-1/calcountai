import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { ActivityType } from '@/types/ActivityType'
import Icon from 'react-native-vector-icons/FontAwesome'
import useActivity from '@/hooks/useActivity'

const ActivityCard = ({ item }: { item: ActivityType }) => {
    const { addExerciseToLog } = useActivity();

  return (
    <View className="flex-row justify-between items-center bg-gray-100 p-3 mt-2 rounded-lg">
      <Text className="text-lg">{item.name}</Text>
      <View className="flex flex-row items-center gap-4">
        <Text className="text-gray-600">{item.caloriesBurned} cal</Text>
        <TouchableOpacity onPress={() => addExerciseToLog(item._id)}>
          <Icon name="plus" size={20} color="#4B5563" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ActivityCard