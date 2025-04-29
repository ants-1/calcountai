import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FoodType } from '@/types/FoodType';
import { ExerciseType } from '@/types/ExerciseType';
import useLog from '@/hooks/useLog';
import { useUserData } from '@/hooks/useUser';
import useAuth from '@/hooks/useAuth';

const CalorieProgressCard = () => {
    const { currentLog } = useLog();
    const { calories, fetchWeightGoalData } = useUserData();
    const { user } = useAuth()
    const userId = user?._id;
    let calorieCount = calories;

    useEffect(() => {
        if (userId) {
            fetchWeightGoalData(userId);
        } else {
            calorieCount = 2000;
        }
    }, [userId]);

    const dailyGoal = calorieCount || 2000;
    const caloriesConsumed = currentLog?.foods?.reduce((sum: any, food: FoodType) => sum + food.calories, 0) || 0;
    const caloriesBurned = currentLog?.exercises?.reduce((sum: any, exercise: ExerciseType) => sum + exercise.caloriesBurned, 0) || 0;
    const remainingCalories = dailyGoal - caloriesConsumed + caloriesBurned;
    const progress = Math.min((caloriesConsumed / dailyGoal) * 100, 100);

    return (
        <View className="mt-6 bg-gray-100 p-4 rounded-xl">
            <Text className="text-lg font-semibold text-gray-700">Calories Progress</Text>
            <View className="flex-row justify-between items-center mt-2">
                <Text className="text-sm text-gray-500">Goal: {dailyGoal} kcal</Text>
                <Text className="text-sm text-gray-500">{caloriesConsumed} kcal consumed</Text>
            </View>
            <View className="w-full bg-gray-300 h-2 mt-2 rounded-xl">
                <View
                    className="bg-green-500 h-2 rounded-xl"
                    style={{ width: `${progress}%`, backgroundColor: progress >= 100 ? '#EF4444' : '#22C55E' }}
                />
            </View>
            <Text className="mt-2 text-sm text-gray-500">
                {remainingCalories > 0
                    ? `You can consume ${remainingCalories} more calories today`
                    : 'You have exceeded your daily calorie goal!'}
            </Text>
        </View>
    )
}

export default CalorieProgressCard