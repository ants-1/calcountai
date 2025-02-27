import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import useAuth from "@/hooks/useAuth";
import Header from "@/components/Header";

// Types for Activity and Log
type Activity = {
  name: string;
  duration: string;
  caloriesBurned: string;
};

type Log = {
  _id: string;
  date: string;
  exercises: Array<{ _id: string }>;
};

const AddActivity = () => {
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?._id;
  const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;

  const [activity, setActivity] = useState<Activity>({
    name: "",
    duration: "",
    caloriesBurned: "",
  });

  const [logs, setLogs] = useState<Log[]>([]);
  const [log, setLog] = useState<Log | null>(null);
  const [showLogDropdown, setShowLogDropdown] = useState<boolean>(false);

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
        if (Platform.OS === "web") {
          alert("Error \nFailed to add exercise.");
        } else {
          Alert.alert("Error", "Failed to add exercise.");
        }
        return;
      }

      const exerciseData = await exerciseResponse.json();

      const exerciseId = exerciseData.newExercise?._id;

      if (!exerciseId) {
        console.error("Invalid exercise ID:", exerciseData);

        if(Platform.OS === "web") {
          alert("Error: \nFailed to create valid exercise.");
        } else {
          Alert.alert("Error", "Failed to create valid exercise.");
        }
        return;
      }

      if (log.exercises.some((e) => e?._id === exerciseId)) {
        if (Platform.OS === "web") {
          alert("Error: \n This exercise has already been added to the log.");
        } else {
          Alert.alert("Error", "This exercise has already been added to the log.");
        }
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

        if (Platform.OS === "web") {
          alert("Success: \nActivity added sucessfully!");
        } else {
          Alert.alert("Success", "Activity added successfully!");
        }
        router.push("/logs");
      } else {
        if (Platform.OS === "web") {
          alert("Success: \nFailed to add exercise to log.");
        } else {
          Alert.alert("Error", "Failed to add exercise to log.");
        }
      }
    } catch (error) {
      console.error("Error adding exercise:", error);
      if (Platform.OS === "web") {
        alert("Error: \nAn error occurred while adding the exercise.");
      } else {
        Alert.alert("Error", "An error occurred while adding the exercise.");
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white pt-6">
      <Header title="Add Activity" icon="chevron-left" iconSize={25} titleSize="text-3xl" />

      <ScrollView showsVerticalScrollIndicator={false} className="px-6 mt-5">
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
