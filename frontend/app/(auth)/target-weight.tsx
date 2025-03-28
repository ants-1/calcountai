import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import { useUserData } from "@/hooks/useUser";
import Icon from "react-native-vector-icons/FontAwesome";

const TargetWeight: React.FC = () => {
  const router = useRouter();
  const { userData, updateUserData } = useUserData();
  const [weight, setWeight] = useState({ value1: "", value2: "" });
  const [unit, setUnit] = useState<"st" | "lbs" | "kg">("st");

  // Convert target weight to kg
  const convertWeight = () => {
    const weight1 = parseFloat(weight.value1) || 0;
    const weight2 = parseFloat(weight.value2) || 0;

    switch (unit) {
      case "st":
        return (weight1 * 6.35) + (weight2 * 0.453592);
      case "lbs":
        return weight1 * 0.453592;
      case "kg":
        return weight1;
      default:
        return 0;
    }
  };

  const handleUpdateTargetWeight = () => {
    const updatedWeight = convertWeight();

    const updatedUser = {
      ...userData,
      targetWeight: updatedWeight,
    };

    updateUserData(updatedUser);

    router.push("/(auth)/height");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-evenly items-center bg-white px-4">
          <View className="w-full">
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-gray-200 p-3 rounded-lg w-12"
            >
              <Icon name="arrow-left" size={24} color="#4B5563" />
            </TouchableOpacity>

            <Text className="text-3xl font-bold mb-10 text-center">Target weight?</Text>

            {/* Weight Input */}
            <View className="flex flex-row justify-center gap-3">
              <TextInput
                className="w-[40%] bg-gray-200 p-6 rounded-lg text-center text-xl"
                placeholder="0"
                keyboardType="numeric"
                value={weight.value1}
                onChangeText={(text) => setWeight({ ...weight, value1: text })}
              />
              {unit === "st" && (
                <TextInput
                  className="w-[40%] bg-gray-200 p-6 rounded-lg text-center text-xl"
                  placeholder="0"
                  keyboardType="numeric"
                  value={weight.value2}
                  onChangeText={(text) => setWeight({ ...weight, value2: text })}
                />
              )}
            </View>

            <Text className="text-center mt-2 text-lg font-semibold">{unit}</Text>

            {/* Unit Change Buttons */}
            <View className="mt-5 flex flex-row justify-center gap-3">
              {["st", "lbs", "kg"].map((unitType) => (
                <TouchableOpacity
                  key={unitType}
                  className={`p-4 rounded-lg w-[90px] ${unit === unitType ? "bg-blue-500" : "bg-gray-200"
                    }`}
                  onPress={() => setUnit(unitType as "st" | "lbs" | "kg")}
                >
                  <Text className={`text-center ${unit === unitType ? "text-white font-bold" : "text-black"}`}>
                    {`Change to ${unitType}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Submit Button */}
          <View>
            <TouchableOpacity
              className={`p-4 rounded-lg w-[300px] ${weight.value1 ? "bg-blue-500" : "bg-gray-300"
                }`}
              disabled={!weight.value1}
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
