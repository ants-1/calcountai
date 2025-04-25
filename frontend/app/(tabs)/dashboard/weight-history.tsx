import { View, Text, SafeAreaView, FlatList } from 'react-native';
import React from 'react';
import { useUserData } from '@/hooks/useUser';
import Header from '@/components/Header';
import { formatDate } from '@/utils/dateFormatter';

const WeightHistory = () => {
  const { weightHistory } = useUserData();

  const renderItem = ({ item, index }: any) => (
    <View
      className={`flex-row py-2 border-b border-gray-200 ${
        index === weightHistory.length - 1
          ? 'bg-yellow-300'
          : index % 2 === 0
          ? 'bg-gray-50'
          : ''
      }`}
      style={{ width: '100%' }}
    >
      <Text className="flex-1 text-base text-center">{formatDate(item.date)}</Text>
      <Text className="flex-1 text-base text-center">
        {item.weight} kg
        {index === weightHistory.length - 1 && ' (Start)'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white px-4 pt-6">
      <Header title="Weight History" icon="chevron-left" iconSize={25} titleSize="text-3xl" />

      <View className="flex-row border-b-2 border-gray-300 pb-2 mt-6 w-full">
        <Text className="flex-1 font-bold text-base text-center">Date</Text>
        <Text className="flex-1 font-bold text-base text-center">Weight</Text>
      </View>

      <FlatList
        data={weightHistory?.slice().reverse()}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        style={{ width: '100%' }} 
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </SafeAreaView>
  );
};

export default WeightHistory;
