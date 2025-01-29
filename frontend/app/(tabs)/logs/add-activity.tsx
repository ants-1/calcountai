import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";

const AddActivity = () => {
  const router = useRouter();

  const [activity, setActivity] = useState({
    name: "",
    duration: "",
    caloriesBurned: "",
  });


  // Handle Form Submission
  const handleSubmit = () => {
    if (!activity.name || !activity.duration || !activity.caloriesBurned) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    console.log("Activity Added:", activity);

    router.push("/logs");
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

        <View className="flex items-center justify-center mt-6">
          <TouchableOpacity
            className={`p-4 rounded-lg w-[300px] ${activity.name && activity.duration && activity.caloriesBurned
                ? "bg-blue-500"
                : "bg-gray-300"
              }`}
            disabled={!activity.name || !activity.duration || !activity.caloriesBurned}
            onPress={handleSubmit}
          >
            <Text className="text-center text-white font-semibold text-lg">Add</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddActivity;
