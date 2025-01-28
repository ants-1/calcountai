import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

const TargetWeight: React.FC = () => {
  const router = useRouter();
  const [weight, setWeight] = useState({ value1: "", value2: "" });
  const [unit, setUnit] = useState<"st" | "lbs" | "kg">("st");

  return (
    <View className="flex-1 justify-evenly items-center bg-white px-4">
      <View className="w-full">
        {/* Back Button */}

        <Text className="text-3xl font-bold mb-10 text-center">Target weight?</Text>

        {/* Progress Indicator */}
        <View className='flex flex-row justify-center mb-20 gap-5'>
          <View className='rounded-full h-8 w-8 bg-black'></View>
          <View className='rounded-full h-8 w-8 bg-black'></View>
          <View className='rounded-full h-8 w-8 bg-black'></View>
          <View className='rounded-full h-8 w-8 bg-black'></View>
          <View className='rounded-full h-8 w-8 bg-gray-200'></View>
          <View className='rounded-full h-8 w-8 bg-gray-200'></View>
        </View>

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

      {/* Continue Button */}
      <View>
        <TouchableOpacity
          className={`p-4 rounded-lg w-[300px] ${weight.value1 ? "bg-blue-500" : "bg-gray-300"
            }`}
          disabled={!weight.value1}
          onPress={() => router.push("/height")}
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

export default TargetWeight;
