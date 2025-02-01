import useAuth from "@/hooks/useAuth";
import { useUserData } from "@/hooks/useUser";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Constants from "expo-constants";

const DoB: React.FC = () => {
  const router = useRouter();
  const { userData } = useUserData();
  const [dob, setDob] = useState({ day: "", month: "", year: "" });
  const { user } = useAuth();

  // Update the user data on submit
  const handleSubmit = async () => {
    const updatedUser = {
      ...userData,
      dob: {
        day: dob.day,
        month: dob.month,
        year: dob.year,
      },
    };

    try {
      const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;
      const response = await fetch(`${BACKEND_API_URL}/users/${user?._id}/goal-info`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      console.log(response);
      if (!response.ok) {
        throw new Error('Failed to update user data');
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <View className="flex-1 justify-evenly items-center bg-white px-4">
      <View className="w-full">
        <Text className="text-3xl font-bold mb-10 text-center">Date of Birth?</Text>

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
          className={`p-4 rounded-lg w-[300px] ${dob.day && dob.month && dob.year ? "bg-blue-500" : "bg-gray-300"}`}
          disabled={!dob.day || !dob.month || !dob.year}
          onPress={handleSubmit}
        >
          <Text className="text-center text-white font-semibold text-lg">Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DoB;
