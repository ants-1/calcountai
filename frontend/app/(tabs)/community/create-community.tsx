import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import useCommunity from "@/hooks/useCommunity";

const CreateCommunity = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { createCommunity } = useCommunity();

  return (
    <SafeAreaView className="flex-1 bg-white pt-6">
      <Header title="Create Community" icon="chevron-left" iconSize={25} titleSize="text-3xl" />

      {/* Community Form */}
      <View className="mt-6 px-6">
        <Text className="mt-4 text">Community Name</Text>
        <TextInput
          className="border-2 border-gray-300 p-3 rounded-lg w-full mb-4"
          placeholder="Enter Name..."
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
        />
        <Text className="mt-4 text">Community Description</Text>
        <TextInput
          className="border-2 border-gray-300 p-3 rounded-lg w-full mb-4"
          placeholder="Enter Description..."
          placeholderTextColor="#888"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TouchableOpacity
          className="bg-blue-500 p-3 rounded-lg w-full mt-6"
          onPress={() => createCommunity(name, description)}
        >
          <Text className="text-white text-center">Create</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateCommunity;
