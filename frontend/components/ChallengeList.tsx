import { View, Text, FlatList } from 'react-native'
import React from 'react'
import ChallengeCard from './ChallengeCard';

const ChallengeList: React.FC<{ challenges: any[] }> = ({ challenges }) => {
  if (!Array.isArray(challenges)) {
    console.error("ChallengeList received invalid challenges:", challenges);
    return <Text className="text-gray-500 text-center mt-10">No challenges available.</Text>;
  }

  const completedChallenges = challenges.filter(challenge => challenge.completed);
  const currentChallenges = challenges.filter(challenge => !challenge.completed);

  return (
    <View className='p-4'>
      <Text className='text-lg font-semibold mt-5'>Completed</Text>
      {completedChallenges.length > 0 ? (
        <FlatList
          data={completedChallenges}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <ChallengeCard challenge={item} />}
        />
      ) : (
        <Text className='text-gray-500 text-center mt-10'>No completed challenges.</Text>
      )}

      <Text className='text-lg font-semibold mt-10'>Current</Text>
      {currentChallenges.length > 0 ? (
        <FlatList
          data={currentChallenges}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <ChallengeCard challenge={item} />}
        />
      ) : (
        <Text className='text-gray-500 text-center mt-10'>No current challenges.</Text>
      )}
    </View>
  );
};

export default ChallengeList;