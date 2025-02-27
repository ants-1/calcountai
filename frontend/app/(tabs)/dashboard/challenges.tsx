import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '@/components/Header'

const Challenges: React.FC = () => {
  return (
    <SafeAreaView className="flex-1 bg-white pt-6">
      <Header title='Challenges' icon='chevron-left' iconSize={25} titleSize='text-3xl' />

      <ScrollView className="mt-10 px-6">
        <Text className='text-2xl font-semibold text-center'>Personal</Text>
        <Text className='text-lg font-semibold mt-5'>Completed</Text>
        <View className='mt-5'>
          <View className='flex flex-row justify-between w-full bg-gray-200 p-2 rounded-xl'>
            <Text className='p-3'>Eat 2000 calories</Text>
            <Text className='bg-green-300 p-3 rounded-xl w-36 text-center'>Personal</Text>
          </View>
        </View>
        <Text className='text-lg font-semibold mt-5'>Current</Text>
        <View className='mt-5'>
          <View className='flex flex-row justify-between w-full bg-gray-200 p-2 rounded-xl'>
            <Text className='p-3'>Eat 5 fruits</Text>
            <Text className='bg-green-300 p-3 rounded-xl w-36 text-center'>Personal</Text>
          </View>
        </View>

        <Text className='text-2xl font-semibold mt-10 text-center'>Community</Text>
        <Text className='text-lg font-semibold mt-5'>Completed</Text>
        <View className='mt-5'>
          <View className='flex flex-row justify-between w-full bg-gray-200 p-2 rounded-xl'>
            <Text className='p-3'>Eat 2000 calories</Text>
            <Text className='bg-blue-300 p-3 rounded-xl w-36 text-center'>Community</Text>
          </View>
        </View>
        <Text className='text-lg font-semibold mt-5'>Current</Text>
        <View className='mt-5'>
          <View className='flex flex-row justify-between w-full bg-gray-200 p-2 rounded-xl'>
            <Text className='p-3'>Eat 5 fruits</Text>
            <Text className='bg-blue-300 p-3 rounded-xl w-36 text-center'>Community</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

export default Challenges