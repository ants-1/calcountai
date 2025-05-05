import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import { useUserData } from "@/hooks/useUser";
import Icon from "react-native-vector-icons/FontAwesome";
import { convertCmToFeet, convertFeetToCm } from "@/utils/heightFormatter";
import { isValidHeight } from "@/utils/isValidHeight";

const Height: React.FC = () => {
  const router = useRouter();
  const { userData, updateUserGoalData } = useUserData();
  const [height, setHeight] = useState("");
  const [unit, setUnit] = useState<"ft" | "cm">("ft");

  useEffect(() => {
    if (height) {
      const convertHeight = unit === "ft" ? convertCmToFeet(parseFloat(height)) : convertFeetToCm(parseFloat(height));
      setHeight(convertHeight.toString());
    }
  }, [unit]);

  // Handle the height update and validation
  const handleUpdateHeight = () => {
    if (!isValidHeight(height, unit)) {
      Alert.alert("Invalid Height", `Please enter a valid height in ${unit}.`);
      return;
    }

    const finalHeight = unit === "cm" ? parseFloat(height) : convertFeetToCm(parseFloat(height));

    updateUserGoalData({ ...userData, height: finalHeight });
    router.push("/activity-level");
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 justify-evenly items-center bg-white px-4">
        <View className="w-full">
          {/* Header */}
          <View className="flex flex-row justify-between">
            <TouchableOpacity className="mt-1" onPress={() => router.back()}>
              <Icon name="chevron-left" size={25} color="#4B5563" />
            </TouchableOpacity>
            <Text className="text-3xl font-bold mb-10 text-center">Your Height</Text>
            <View></View>
          </View>

          {/* Progress Indicator */}
          <View className="flex flex-row justify-center mb-20 gap-5">
            <View className='rounded-full h-8 w-8 bg-black'></View>
            <View className='rounded-full h-8 w-8 bg-black'></View>
            <View className='rounded-full h-8 w-8 bg-black'></View>
            <View className='rounded-full h-8 w-8 bg-black'></View>
            <View className='rounded-full h-8 w-8 bg-black'></View>
            <View className='rounded-full h-8 w-8 bg-gray-200'></View>
            <View className='rounded-full h-8 w-8 bg-gray-200'></View>
          </View>

          {/* Height Input */}
          <View className="flex flex-row justify-center">
            <TextInput
              className="w-[80%] bg-gray-200 p-6 rounded-full text-center text-xl"
              placeholder="0"
              keyboardType="numeric"
              value={height}
              onChangeText={setHeight}
            />
          </View>

          <Text className="text-center mt-2 text-lg font-semibold">{unit}</Text>

          {/* Unit Change Buttons */}
          <View className="mt-5 flex flex-row justify-center gap-3">
            {["ft", "cm"].map((unitType) => (
              <TouchableOpacity
                key={unitType}
                className={`p-4 rounded-lg w-[90px] ${unit === unitType ? "bg-blue-500" : "bg-gray-200"}`}
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
            className={`p-4 rounded-full w-[300px] ${height && isValidHeight(height, unit) ? "bg-blue-500" : "bg-gray-300"}`}
            disabled={!height || !isValidHeight(height, unit)}
            onPress={handleUpdateHeight}
          >
            <Text className="text-center text-white font-semibold text-lg">Continue</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/dashboard")}>
            <Text className="text-center mt-5 underline">Enter Information Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Height;
