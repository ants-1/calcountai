import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import useLog from "@/hooks/useLog";
import useActivity from "@/hooks/useActivity";
import { ActivityFormType } from "@/types/ActivityFormType";
import { ExerciseLogType } from "@/types/ExerciseLogType";

const AddActivity = () => {
  const { fetchDailyLogs, dailyLogs } = useLog();
  const { addExercise } = useActivity();

  const [activity, setActivity] = useState<ActivityFormType>({
    name: "",
    duration: "",
    caloriesBurned: "",
  });

  const [log, setLog] = useState<ExerciseLogType | null>(null);
  const [showLogDropdown, setShowLogDropdown] = useState<boolean>(false);

  useEffect(() => {
    fetchDailyLogs();
  });

  // Format the date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const handleAddExercise = async () => {
    if (!log) {
      if (Platform.OS === "web") {
        alert("Error: \nPlease select a log");
      } else {
        Alert.alert("Error", "Please select a log.");
      }
      return;
    }

    if (!activity.name || !activity.duration || !activity.caloriesBurned) {
      if (Platform.OS === "web") {
        alert("Error: \nPlease fill all required fields.");
      } else {
        Alert.alert("Error", "Please fill all required fields.");
      }
      return;
    }

    addExercise(activity, log);
  };

  return (
    <SafeAreaView className="flex-1 bg-white pt-6">
      <Header title="Add Activity" icon="chevron-left" iconSize={25} titleSize="text-3xl" />

      <ScrollView showsVerticalScrollIndicator={false} className="px-6 mt-5">
        {/* Name */}
        <Text className="text-lg font-semibold mb-2">Activity Name</Text>
        <TextInput
          className="w-full p-4 bg-gray-200 rounded-full mb-4 text-lg"
          placeholder="Enter activity name"
          value={activity.name}
          onChangeText={(text) => setActivity({ ...activity, name: text })}
        />

        {/* Duration */}
        <Text className="text-lg font-semibold mb-2">Duration (minutes)</Text>
        <TextInput
          className="w-full p-4 bg-gray-200 rounded-full mb-4 text-lg"
          placeholder="Enter duration"
          keyboardType="numeric"
          value={activity.duration}
          onChangeText={(text) => setActivity({ ...activity, duration: text })}
          returnKeyType="done"
        />

        {/* Calories Burned */}
        <Text className="text-lg font-semibold mb-2">Calories Burned</Text>
        <TextInput
          className="w-full p-4 bg-gray-200 rounded-full mb-4 text-lg"
          placeholder="Enter calories burned"
          keyboardType="numeric"
          value={activity.caloriesBurned}
          onChangeText={(text) => setActivity({ ...activity, caloriesBurned: text })}
          returnKeyType="done"
        />

        {/* Log Selection */}
        <Text className="text-lg font-semibold mb-2">Logs</Text>
        <View className="flex-row justify-start relative ">
          <TouchableOpacity
            className="bg-gray-200 px-3 py-6 rounded-full w-full"
            onPress={() => setShowLogDropdown((prev) => !prev)}
          >
            <Text className=" font-semibold">
              {log ? `Selected Log: ${formatDate(log.date)}` : "Select a Log"}
            </Text>
          </TouchableOpacity>

          {showLogDropdown && (
            <View style={{ zIndex: 999}} className="absolute left-0 bg-white border border-gray-200 rounded-lg mt-12 w-full z-10 shadow-lg max-h-20" >
              <ScrollView>
                {dailyLogs.map((logItem) => (
                  <TouchableOpacity
                    key={logItem._id}
                    className="p-2"
                    onPress={() => {
                      setLog(logItem);
                      setShowLogDropdown(false);
                    }}
                  >
                    <Text className=" text-gray-700">{`Log Date: ${formatDate(logItem.date)}`}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <View className="flex items-center justify-center mt-10" style={{ zIndex: -99}}>
          <TouchableOpacity
            className={`p-4 rounded-full w-[300px] ${activity.name && activity.duration && activity.caloriesBurned && log
              ? "bg-blue-500"
              : "bg-gray-300"
              }`}
            disabled={!activity.name || !activity.duration || !activity.caloriesBurned || !log}
            onPress={handleAddExercise}
          >
            <Text className="text-center text-white font-semibold text-lg">Add Activity</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddActivity;
