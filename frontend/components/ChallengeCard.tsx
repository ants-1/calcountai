import { View, Text } from 'react-native'
import React from 'react'
import { ChallengeType } from '@/types/ChallengeType'

interface ChallengeCardProps {
  challenge: ChallengeType;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
  return (
    <View className='mt-5 p-4 bg-gray-100 rounded-xl'>
      <View className='flex flex-row justify-between items-center w-full mb-2'>
        <Text className='font-bold'>{challenge.name}</Text>
        <Text className={`p-3 rounded-xl w-36 text-center text-white ${challenge.challengeType === 'Personal' ? 'bg-blue-500' : 'bg-green-500'}`}>{challenge.challengeType}</Text>
      </View>
      <Text className='mt-2 text-gray-700'>{challenge.description}</Text>
      <View className='mt-2 h-3 w-full bg-gray-300 rounded-full'>
        <View className='h-3 bg-blue-500 rounded-full' style={{ width: `${challenge.percentage}%` }} />
      </View>
      <View className='flex flex-row justify-between items-center w-full mb-2'>
        <Text className='mt-1 text-sm text-gray-600'>Progress: {challenge.percentage}%</Text>
        <Text className={`mt-2 text-sm font-bold ${challenge.completed ? 'text-green-600' : 'text-red-600'}`}>
          {challenge.completed ? 'Completed' : 'In Progress'}
        </Text>
      </View>
    </View>
  )
}

export default ChallengeCard