import { View, Text, TextInput, TouchableOpacity, Platform, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import useCommunity from "@/hooks/useCommunity";

const CreateCommunity = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { createCommunity } = useCommunity();

  const handleCreate = () => {
    if (!name || !description) {
      if (Platform.OS === "web") {
        alert("Validation Error: \nPlease enter both name and description.");
      } else {
        Alert.alert("Validation Error", "Please enter both name and description.");
      }
      return;
    }

    createCommunity(name, description);
  };

  return (
    <SafeAreaView className="flex-1 bg-white pt-6">
      <Header title="Create Community" icon="chevron-left" iconSize={25} titleSize="text-3xl" />

      {/* Community Form */}
      <View className="mt-6 px-6">
        <Text className="mt-4 mb-2 pl-4 text">Community Name</Text>
        <TextInput
          className="w-full bg-gray-100 rounded-full p-5 mb-4"
          placeholder="Enter Name..."
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
        />
        <Text className="mt-4 mb-2 pl-4 text">Community Description</Text>
        <TextInput
          className="w-full bg-gray-100 rounded-full p-5 mb-4"
          placeholder="Enter Description..."
          placeholderTextColor="#888"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-full w-full mt-6"
          onPress={() => handleCreate()}
        >
          <Text className="text-white text-center">Create</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateCommunity;
