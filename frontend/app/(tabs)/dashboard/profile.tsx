import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Platform, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import useAuth from "@/hooks/useAuth";
import Constants from "expo-constants";
import Header from "@/components/Header";

const Profile: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({ firstName: "", lastName: "", email: "" });

  const fetchUser = async () => {
    if (!user?._id) return;

    try {
      const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;
      const API_URL = `${BACKEND_API_URL}/users/${user._id}`;

      const response = await fetch(API_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || `HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.user) {
        setFirstName(data.user.firstName || "");
        setLastName(data.user.lastName || "");
        setEmail(data.user.email || "");

        setOriginalData({
          firstName: data.user.firstName || "",
          lastName: data.user.lastName || "",
          email: data.user.email || "",
        });
      } else {
        throw new Error("Invalid user data received");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const updateProfile = async () => {
    if (!user?._id) return;

    try {
      const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;
      const API_URL = `${BACKEND_API_URL}/users/${user._id}`;

      const updatedUserData = { firstName, lastName, email };

      const response = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUserData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || `HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();

      setFirstName(data.updatedUser.firstName || "");
      setLastName(data.updatedUser.lastName || "");
      setEmail(data.updatedUser.email || "");

      setOriginalData({
        firstName: data.updatedUser.firstName || "",
        lastName: data.updatedUser.lastName || "",
        email: data.updatedUser.email || "",
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      if (Platform.OS === "web") {
        alert("Failed to update profile. Please try again.");
      } else {
        Alert.alert("Failed to update profile", "Please try again.");
      }
    }
  };

  const handleCancelEdit = () => {
    setFirstName(originalData.firstName);
    setLastName(originalData.lastName);
    setEmail(originalData.email);
    setIsEditing(false);
  };

  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user]);

  return (
    <SafeAreaView className="flex-1 bg-white pt-6 px-6">
      <Header title="Profile" icon="chevron-left" iconSize={25} titleSize="text-3xl" />

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

      {isEditing ? (
        <View className="mt-6 flex-row justify-between">
          <TouchableOpacity
            className="flex-1 mr-2 bg-blue-500 py-3 rounded-lg"
            onPress={updateProfile}
          >
            <Text className="text-center text-white font-semibold text-lg">Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 ml-2 bg-gray-300 py-3 rounded-lg"
            onPress={handleCancelEdit}
          >
            <Text className="text-center text-black font-semibold text-lg">Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          className="mt-6 bg-blue-500 py-3 rounded-lg"
          onPress={() => setIsEditing(true)}
        >
          <Text className="text-center text-white font-semibold text-lg">Edit Profile</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        className="mt-6 bg-gray-500 py-3 rounded-lg"
        onPress={() => router.push("/goal-info")}
      >
        <Text className="text-center text-white font-semibold text-lg">Edit Info</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="mt-6 flex-row items-center justify-center p-3 bg-red-500 rounded-lg"
        onPress={() => {
          logout();
          router.push("/");
        }}
      >
        <Icon name="sign-out" size={20} color="#fff" />
        <Text className="ml-3 text-white font-semibold text-lg">Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Profile;
