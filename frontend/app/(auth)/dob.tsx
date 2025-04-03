import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useUserData } from "@/hooks/useUser";
import Icon from "react-native-vector-icons/FontAwesome";
import { isValidDate } from "@/utils/isValidDate";

const DoB: React.FC = () => {
  const router = useRouter();
  const { submitUpdateUserData } = useUserData();
  const [dob, setDob] = useState({ day: "", month: "", year: "" });

  // Update the user's goal data on submit
  const handleSubmit = async () => {
    const { day, month, year } = dob;

    // Validate the date
    if (!isValidDate(day, month, year)) {
      if (Platform.OS === "web") {
        alert("Invalid Date\nPlease enter a valid date of birth.");
      } else {
        Alert.alert("Invalid Date", "Please enter a valid date of birth.");
      }
      return;
    }

    const updatedDob = { day, month, year };
    try {
      await submitUpdateUserData(updatedDob);
      router.push("/dashboard");
    } catch (error) {
      // console.error("Error updating user data:", error);
      if (Platform.OS === "web") {
        alert("Error\nError updating user data.");
      } else {
        Alert.alert("Error", "Error updating user data.");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-evenly items-center bg-white px-4">
          <View className="w-full">
            {/* Header */}
            <View className="flex flex-row justify-between">
              <TouchableOpacity className="mt-1" onPress={() => router.back()}>
                <Icon name="chevron-left" size={25} color="#4B5563" />
              </TouchableOpacity>

              <Text className="text-3xl font-bold mb-10 text-center">Date of Birth</Text>

              <View></View>
            </View>

            {/* Progress Indicator */}
            <View className="flex flex-row justify-center mb-20 gap-5">
              <View className="rounded-full h-8 w-8 bg-black"></View>
              <View className="rounded-full h-8 w-8 bg-black"></View>
              <View className="rounded-full h-8 w-8 bg-black"></View>
              <View className="rounded-full h-8 w-8 bg-black"></View>
              <View className="rounded-full h-8 w-8 bg-black"></View>
              <View className="rounded-full h-8 w-8 bg-black"></View>
            </View>

            {/* DoB Input Section */}
            <View className="flex flex-row justify-center gap-3">
              {/* Day Input */}
              <View className="items-center">
                <Text className="text-lg font-semibold mb-1">Day</Text>
                <TextInput
                  className="w-[80px] bg-gray-200 p-6 rounded-lg text-center text-xl"
                  placeholder="DD"
                  keyboardType="numeric"
                  maxLength={2}
                  value={dob.day}
                  onChangeText={(text) => setDob({ ...dob, day: text })}
                />
              </View>

              {/* Month Input */}
              <View className="items-center">
                <Text className="text-lg font-semibold mb-1">Month</Text>
                <TextInput
                  className="w-[80px] bg-gray-200 p-6 rounded-lg text-center text-xl"
                  placeholder="MM"
                  keyboardType="numeric"
                  maxLength={2}
                  value={dob.month}
                  onChangeText={(text) => setDob({ ...dob, month: text })}
                />
              </View>

              {/* Year Input */}
              <View className="items-center">
                <Text className="text-lg font-semibold mb-1">Year</Text>
                <TextInput
                  className="w-[100px] bg-gray-200 p-6 rounded-lg text-center text-xl"
                  placeholder="YYYY"
                  keyboardType="numeric"
                  maxLength={4}
                  value={dob.year}
                  onChangeText={(text) => setDob({ ...dob, year: text })}
                />
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <View>
            <TouchableOpacity
              className={`p-4 rounded-full w-[300px] ${dob.day && dob.month && dob.year ? "bg-blue-500" : "bg-gray-300"}`}
              disabled={!dob.day || !dob.month || !dob.year}
              onPress={handleSubmit}
            >
              <Text className="text-center text-white font-semibold text-lg">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default DoB;
