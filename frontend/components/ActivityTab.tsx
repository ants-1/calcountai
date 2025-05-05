import useAuth from "@/hooks/useAuth";
import useLog from "@/hooks/useLog";
import { ExerciseType } from "@/types/ExerciseType";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const ActivityTab = () => {
  const { user } = useAuth();
  const userId = user?._id;
  const { currentLog, removeLogActivity } = useLog();

  if (!currentLog || !userId) {
    return <Text>No log or user data available</Text>;
  }

  const handleRemoveActivity = async (exerciseId: string) => {
    removeLogActivity(currentLog._id, exerciseId, userId);
  };

  const exercises = currentLog?.exercises || [];

  return (
    <View className="mt-5">
      {/* Activities Section */}
      <View className="bg-gray-100 p-4 rounded-xl">
        <Text className="text-lg font-semibold text-gray-700 mb-2">Activities</Text>

        {exercises.length === 0 ? (
          <Text className="text-sm text-gray-500 text-center">No activities logged.</Text>
        ) : (
          exercises.map((exercise: ExerciseType) => {
            const key = exercise._id || `${exercise.name}-${exercise.caloriesBurned}`;
            return (
              <View key={key} className="flex-row justify-between items-center my-2">
                <Text className="text-sm text-gray-600">{exercise.name}</Text>
                <View className="flex flex-row gap-4">
                  <Text className="text-sm text-gray-500 mr-2">{exercise.caloriesBurned} kcal burned</Text>
                  <TouchableOpacity onPress={() => handleRemoveActivity(exercise._id)}>
                    <Icon name="remove" size={20} color="#FF0000" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
};

export default ActivityTab;