import { View, Text, FlatList } from 'react-native'
import React from 'react'
import ChallengeCard from './ChallengeCard';

const ChallengeList: React.FC<{ challenges: any[] }> = ({ challenges }) => {
  if (!Array.isArray(challenges)) {
    console.error("ChallengeList received invalid challenges:", challenges);
    return <Text className="text-gray-500 text-center mt-10">No challenges available.</Text>;
  }

  return (
    <View className='p-4'>
      {challenges.length > 0 ? (
        <FlatList
          data={challenges}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <ChallengeCard challenge={item} />}
        />
      ) : (
        <Text className='text-gray-500 text-center mt-10'>No completed challenges.</Text>
      )}
    </View>
  );
};

export default ChallengeList;