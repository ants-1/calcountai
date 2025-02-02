import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import useAuth from "@/hooks/useAuth";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";

const CreateCommunity = () => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const createCommunity = async () => {
    if (!name || !description || name.length < 3 || description.length < 3) {
      Alert.alert("Error", "Both name and description must be at least 3 characters long.");
      return;
    }

    try {
      const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;
      const API_URL = `${BACKEND_API_URL}/communities`;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          createdBy: user?._id,
          members: [user?._id],
          challenges: [],
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create community. Status: ${response.status}`);
      }

      Alert.alert("Success", "Community created successfully.");
      router.back();
    } catch (error) {
      console.error("Error creating community:", error);
      Alert.alert("Error", "There was an issue creating the community.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white pt-6">
      <Header title="Create Community" icon="arrow-left" iconSize={25} titleSize="text-3xl" />

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
          onPress={createCommunity}
        >
          <Text className="text-white text-center">Create</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateCommunity;
