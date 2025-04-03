import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useUserData } from "@/hooks/useUser";
import Icon from "react-native-vector-icons/FontAwesome";
import { convertKgToStone, convertStoneToKg } from "@/utils/weightFormatter";
import { isValidWeight } from "@/utils/isValidWeight";

const TargetWeight: React.FC = () => {
  const router = useRouter();
  const { userData, updateUserGoalData } = useUserData();
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState<"st" | "kg">("st");

  useEffect(() => {
    if (weight) {
      const convertedWeight = unit === "st" ? convertKgToStone(parseFloat(weight)) : convertStoneToKg(parseFloat(weight));
      setWeight(convertedWeight.toString());
    }
  }, [unit]);

  // Handle the weight update and validation
  const handleUpdateTargetWeight = () => {
    if (!isValidWeight(weight, unit)) {
      Alert.alert("Invalid Weight", `Please enter a valid weight in ${unit}.`);
      return;
    }

    // Convert the weight to the correct unit before updating
    const finalWeight = unit === "kg" ? convertStoneToKg(parseFloat(weight)) : convertStoneToKg(parseFloat(weight));

    updateUserGoalData({ ...userData, targetWeight: finalWeight });
    router.push("/(auth)/height");
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-evenly items-center bg-white px-4">
          <View className="w-full">
            {/* Header */}
            <View className="flex flex-row justify-between">
              <TouchableOpacity className="mt-1" onPress={() => router.back()}>
                <Icon name="chevron-left" size={25} color="#4B5563" />
              </TouchableOpacity>
              <Text className="text-3xl font-bold mb-10 text-center">Target Weight</Text>
              <View></View>
            </View>

            {/* Progress Indicator */}
            <View className="flex flex-row justify-center mb-20 gap-5">
              {[...Array(3)].map((_, i) => (
                <View key={i} className="rounded-full h-8 w-8 bg-black"></View>
              ))}
              {[...Array(3)].map((_, i) => (
                <View key={i + 3} className="rounded-full h-8 w-8 bg-gray-200"></View>
              ))}
            </View>

            {/* Weight Input */}
            <View className="flex flex-row justify-center gap-3">
              <TextInput
                className="w-[80%] bg-gray-200 p-6 rounded-full text-center text-xl"
                placeholder="0"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />
            </View>

            <Text className="text-center mt-2 text-lg font-semibold">{unit}</Text>

            {/* Unit Change Buttons */}
            <View className="mt-5 flex flex-row justify-center gap-3">
              {["st", "kg"].map((unitType) => (
                <TouchableOpacity
                  key={unitType}
                  className={`p-4 rounded-lg w-[90px] ${unit === unitType ? "bg-blue-500" : "bg-gray-200"}`}
                  onPress={() => setUnit(unitType as "st" | "kg")}
                >
                  <Text className={`text-center ${unit === unitType ? "text-white font-bold" : "text-black"}`}>{`Change to ${unitType}`}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Submit Button */}
          <View>
            <TouchableOpacity
              className={`p-4 rounded-full w-[300px] ${weight && isValidWeight(weight, unit) ? "bg-blue-500" : "bg-gray-300"}`}
              disabled={!weight || !isValidWeight(weight, unit)}
              onPress={handleUpdateTargetWeight}
            >
              <Text className="text-center text-white font-semibold text-lg">Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default TargetWeight;
