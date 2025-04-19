import useActivity from "@/hooks/useActivity";
import useLog from "@/hooks/useLog";
import { ExerciseType } from "@/types/ExerciseType";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const ActivityTab = () => {
  const { currentLog } = useLog();
  const { removeExercise } = useActivity();

  const handleRemoveExercise = async (exerciseId: string) => {
    removeExercise(exerciseId, currentLog);
  };

  const exercises = currentLog?.exercises || [];

  return (
    <ScrollView className="mt-5">
      {/* Activities Section */}
      <View className="bg-gray-100 p-4 rounded-xl">
        <Text className="text-lg font-semibold text-gray-700 mb-2">Activities</Text>

        {exercises.length === 0 ? (
          <Text className="text-sm text-gray-500 text-center">No activities logged.</Text>
        ) : (
          exercises.map((exercise: ExerciseType) => {
            const key = exercise._id || `${exercise.name}-${exercise.caloriesBurned}`;
            return (
              <View key={key} className="flex-row justify-between items-center mt-4">
                <Text className="text-sm text-gray-600">{exercise.name}</Text>
                <View className="flex flex-row gap-4">
                  <Text className="text-sm text-gray-500">{exercise.caloriesBurned} kcal burned</Text>
                  <TouchableOpacity onPress={() => handleRemoveExercise(exercise._id)}>
                    <Icon name="remove" size={20} color="#FF0000" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
};

export default ActivityTab;