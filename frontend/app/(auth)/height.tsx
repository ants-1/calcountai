import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useUserData } from "@/hooks/useUser"; 

const Height: React.FC = () => {
  const router = useRouter();
  const { userData, updateUserData } = useUserData()
  const [height, setHeight] = useState({ value1: "", value2: "" });
  const [unit, setUnit] = useState<"ft" | "cm">("ft");

  const convertHeight = () => {
    const feet = parseFloat(height.value1) || 0;
    const inches = parseFloat(height.value2) || 0;

    if (unit === "ft") {
      return (feet * 30.48) + (inches * 2.54);
    } else if (unit === "cm") {
      return feet;
    }
    return 0;
  };

  const handleHeightChange = () => {
    const updatedHeight = convertHeight();

    const updatedUser = {
      ...userData,
      height: updatedHeight,
    };

    updateUserData(updatedUser);
  };

  return (
    <View className="flex-1 justify-evenly items-center bg-white px-4">
      <View className="w-full">
        <Text className="text-3xl font-bold mb-10 text-center">Your Height?</Text>

        {/* Progress Indicator */}
        <View className="flex flex-row justify-center mb-20 gap-5">
          <View className="rounded-full h-8 w-8 bg-black"></View>
          <View className="rounded-full h-8 w-8 bg-black"></View>
          <View className="rounded-full h-8 w-8 bg-black"></View>
          <View className="rounded-full h-8 w-8 bg-black"></View>
          <View className="rounded-full h-8 w-8 bg-black"></View>
          <View className="rounded-full h-8 w-8 bg-gray-200"></View>
        </View>

        {/* Height Input */}
        <View className="flex flex-row justify-center gap-3">
          <TextInput
            className="w-[40%] bg-gray-200 p-6 rounded-lg text-center text-xl"
            placeholder="0"
            keyboardType="numeric"
            value={height.value1}
            onChangeText={(text) => setHeight({ ...height, value1: text })}
          />
          {unit === "ft" && (
            <TextInput
              className="w-[40%] bg-gray-200 p-6 rounded-lg text-center text-xl"
              placeholder="0"
              keyboardType="numeric"
              value={height.value2}
              onChangeText={(text) => setHeight({ ...height, value2: text })}
            />
          )}
        </View>

        <Text className="text-center mt-2 text-lg font-semibold">{unit}</Text>

        {/* Unit Change Buttons */}
        <View className="mt-5 flex flex-row justify-center gap-3">
          {["ft", "cm"].map((unitType) => (
            <TouchableOpacity
              key={unitType}
              className={`p-4 rounded-lg w-[90px] ${unit === unitType ? "bg-blue-500" : "bg-gray-200"
                }`}
              onPress={() => setUnit(unitType as "ft" | "cm")}
            >
              <Text className={`text-center ${unit === unitType ? "text-white font-bold" : "text-black"}`}>
                {`Change to ${unitType}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Continue Button */}
      <View>
        <TouchableOpacity
          className={`p-4 rounded-lg w-[300px] ${height.value1 ? "bg-blue-500" : "bg-gray-300"
            }`}
          disabled={!height.value1}
          onPress={() => {
            handleHeightChange();
            router.push("/dob"); 
          }}
        >
          <Text className="text-center text-white font-semibold text-lg">Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/dashboard")}>
          <Text className="text-center mt-5 underline">Enter Information Later</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Height;
