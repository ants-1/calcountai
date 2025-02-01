import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import useAuth from "@/hooks/useAuth";

const AddActivity = () => {
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?._id;
  const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;

  const [activity, setActivity] = useState({
    name: "",
    duration: "",
    caloriesBurned: "",
  });
  const [logs, setLogs] = useState([]);
  const [log, setLog] = useState(null);
  const [showLogDropdown, setShowLogDropdown] = useState(false);

  // Fetch logs for the user
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`${BACKEND_API_URL}/users/${userId}/dailyLogs`);
        const data = await response.json();
        setLogs(data.dailyLogs || []);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    fetchLogs();
  }, [userId]);

  // Format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const handleAddExercise = async () => {
    if (!log) {
      Alert.alert("Error", "Please select a log.");
      return;
    }

    if (!activity.name || !activity.duration || !activity.caloriesBurned) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    try {
      const exerciseResponse = await fetch(`${BACKEND_API_URL}/exercises`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: activity.name,
          duration: activity.duration,
          caloriesBurned: activity.caloriesBurned,
        }),
      });

      if (!exerciseResponse.ok) {
        Alert.alert("Error", "Failed to add exercise.");
        return;
      }

      const exerciseData = await exerciseResponse.json();


      const exerciseId = exerciseData.newExercise?._id;

      if (!exerciseId) {
        console.error("Invalid exercise ID:", exerciseData);
        Alert.alert("Error", "Failed to create valid exercise.");
        return;
      }

      if (log.exercises.some((e) => e?._id === exerciseId)) {
        Alert.alert("Error", "This exercise has already been added to the log.");
        return;
      }

      const updatedExercises = [
        ...log.exercises.filter((e) => e != null && e._id != null).map((e) => e._id),
      ];

      updatedExercises.push(exerciseId);

      // Add the exercise to the selected log
      const logResponse = await fetch(
        `${BACKEND_API_URL}/users/${userId}/dailyLogs/${log._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            exercises: updatedExercises,
          }),
        }
      );

      if (logResponse.ok) {
        const updatedLog = await logResponse.json();
        setLog(updatedLog.dailyLog);
        Alert.alert("Success", "Activity added successfully!");
        router.push("/logs");
      } else {
        Alert.alert("Error", "Failed to add exercise to log.");
      }
    } catch (error) {
      console.error("Error adding exercise:", error);
      Alert.alert("Error", "An error occurred while adding the exercise.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6 pt-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-between items-center mb-10">
          <Text className="text-3xl font-bold">Add Activity</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-left" size={24} color="#4B5563" />
          </TouchableOpacity>
        </View>

        {/* Name */}
        <Text className="text-lg font-semibold mb-2">Activity Name</Text>
        <TextInput
          className="w-full p-4 bg-gray-200 rounded-lg mb-4 text-lg"
          placeholder="Enter activity name"
          value={activity.name}
          onChangeText={(text) => setActivity({ ...activity, name: text })}
        />

        {/* Duration */}
        <Text className="text-lg font-semibold mb-2">Duration (minutes)</Text>
        <TextInput
          className="w-full p-4 bg-gray-200 rounded-lg mb-4 text-lg"
          placeholder="Enter duration"
          keyboardType="numeric"
          value={activity.duration}
          onChangeText={(text) => setActivity({ ...activity, duration: text })}
        />

        {/* Calories Burned */}
        <Text className="text-lg font-semibold mb-2">Calories Burned</Text>
        <TextInput
          className="w-full p-4 bg-gray-200 rounded-lg mb-4 text-lg"
          placeholder="Enter calories burned"
          keyboardType="numeric"
          value={activity.caloriesBurned}
          onChangeText={(text) => setActivity({ ...activity, caloriesBurned: text })}
        />

        {/* Log Selection */}
        <Text className="text-lg font-semibold mb-2">Logs</Text>
        <View className="flex-row justify-start relative ">
          <TouchableOpacity
            className="bg-gray-200 px-3 py-6 rounded-lg w-full"
            onPress={() => setShowLogDropdown((prev) => !prev)}
          >
            <Text className=" font-semibold">
              {log ? `Selected Log: ${formatDate(log.date)}` : "Select a Log"}
            </Text>
          </TouchableOpacity>

          {showLogDropdown && (
            <View className="absolute left-0 bg-white border border-gray-200 rounded-lg mt-12 w-full z-10 shadow-lg">
              {logs.map((logItem) => (
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
            </View>
          )}
        </View>

        <View className="flex items-center justify-center mt-10">
          <TouchableOpacity
            className={`p-4 rounded-lg w-[300px] ${activity.name && activity.duration && activity.caloriesBurned && log
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
