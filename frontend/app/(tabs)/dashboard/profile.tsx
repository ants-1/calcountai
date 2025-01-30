import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import useAuth from "@/hooks/useAuth";
import Constants from "expo-constants";

const Profile: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace("/(auth)/sign-in");
    }
  }, [user, router]);

  const fetchUser = async () => {
    if (!user?._id) return;

    try {
      const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;
      const API_URL = `${BACKEND_API_URL}/users/${user._id}`;

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || `HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched User Data:", data);

      if (data.user) {
        setFirstName(data.user.firstName || "");
        setLastName(data.user.lastName || "");
        setEmail(data.user.email || "");
      } else {
        throw new Error("Invalid user data received");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  // Handle update profile 
  const updateProfile = async () => {
    if (!user?._id) return;

    try {
      const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;
      const API_URL = `${BACKEND_API_URL}/users/${user._id}`;

      const updatedUserData = {
        firstName,
        lastName,
        email,
      };

      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUserData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || `HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Updated User Data:", data);

      setFirstName(data.updatedUser.firstName || "");
      setLastName(data.updatedUser.lastName || "");
      setEmail(data.updatedUser.email || "");

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user]);

  // Handle logout functionality
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error: ", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6 pt-6">
      <View className="flex-row justify-between items-center">
        <Text className="text-3xl font-bold">Profile</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-left" size={24} color="#4B5563" />
        </TouchableOpacity>
      </View>

      <View>
        <View className="mt-10 items-center">
          <Icon name="user-circle" size={100} color="#4B5563" />
        </View>

        <View className="mt-6">
          {isEditing ? (
            <>
              <Text className="text-sm text-gray-500">First Name</Text>
              <TextInput
                className="mt-2 p-3 bg-gray-100 rounded-lg"
                value={firstName}
                onChangeText={setFirstName}
              />

              <Text className="mt-4 text-sm text-gray-500">Last Name</Text>
              <TextInput
                className="mt-2 p-3 bg-gray-100 rounded-lg"
                value={lastName}
                onChangeText={setLastName}
              />

              <Text className="mt-4 text-sm text-gray-500">Email</Text>
              <TextInput
                className="mt-2 p-3 bg-gray-100 rounded-lg"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </>
          ) : (
            <>
              <Text className="text-2xl font-semibold mt-4 text-center mb-4">
                {firstName} {lastName}
              </Text>
              <Text className="text-gray-500 text-center">{email}</Text>
            </>
          )}
        </View>
      </View>

      <TouchableOpacity
        className="mt-6 bg-blue-500 py-3 rounded-lg"
        onPress={isEditing ? updateProfile : () => setIsEditing(true)}
      >
        <Text className="text-center text-white font-semibold text-lg">
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="mt-6 flex-row items-center justify-center p-3 bg-red-500 rounded-lg"
        onPress={handleLogout}
      >
        <Icon name="sign-out" size={20} color="#fff" />
        <Text className="ml-3 text-white font-semibold text-lg">Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Profile;
