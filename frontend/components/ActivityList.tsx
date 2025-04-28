import { View, Text, FlatList } from 'react-native'
import React from 'react'
import ActivityCard from './ActivityCard'

type ActivityListProps = {
  activities: any[]; 
}

const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
  return (
    <FlatList
      className="mt-4 px-6"
      style={{ zIndex: -99 }} 
      data={activities}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <ActivityCard item={item} />
      )}
      ListEmptyComponent={
        <View className="mt-6">
          <Text className="text-center text-gray-500">No activities found.</Text>
        </View>
      }
    />
  )
}

export default ActivityList