import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import useAuth from "@/hooks/useAuth";
import Header from "@/components/Header";
import { useUserData } from "@/hooks/useUser";

const Profile: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { username, email, fetchUser, updateProfile, setUsername, setEmail, goal } = useUserData();

  const [isEditing, setIsEditing] = useState(false);

  const handleCancelEdit = () => {
    setUsername(username);
    setEmail(email);
    setIsEditing(false);
  };

  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user]);

  const handleSaveChanges = () => {
    updateProfile(username, email);
    setIsEditing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white pt-6 px-6">
      {/* Header */}
      <Header title="Profile" icon="chevron-left" iconSize={25} titleSize="text-3xl" />

      {/* User's Avater */}
      <View>
        <View className="mt-10 items-center">
          <Icon name="user-circle" size={100} color="#4B5563" />
        </View>



        <View className="mt-6">
          {/* Update Form */}
          {isEditing ? (
            <>
              <Text className="text-sm text-gray-500">Username</Text>
              <TextInput
                className="mt-2 p-4 bg-gray-100 rounded-full"
                value={username}
                onChangeText={setUsername}
              />

              <Text className="mt-4 text-sm text-gray-500">Email</Text>
              <TextInput
                className="mt-2 p-4 bg-gray-100 rounded-full"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </>
          ) : (
            <>
              {/* User Information */}
              <Text className="text-2xl font-semibold mt-4 text-center mb-4">
                {username}
              </Text>
              <Text className="text-gray-500 text-center">{email}</Text>

              {/* User's Goal Information */}
              <Text className="p-4 text-xl font-semibold">Goals</Text>
              {goal && goal.length > 0 ? (
                <View className="flex flex-row gap-1 justify-between">
                  {goal.map((goal: string, index: number) => {
                    // Define colors for each goal
                    let buttonColor, textColor;
                    switch (goal) {
                      case "Lose Weight":
                        buttonColor = "bg-yellow-200";
                        textColor = "text-yellow-700";
                        break;
                      case "Get Healthier":
                        buttonColor = "bg-green-200";
                        textColor = "text-green-700";
                        break;
                      case "Reduce Stress":
                        buttonColor = "bg-blue-200";
                        textColor = "text-blue-700";
                        break;
                      default:
                        buttonColor = "bg-gray-200";
                        textColor = "text-gray-700";
                    }

                    return (
                      <TouchableOpacity
                        key={index}
                        className={`w-fit p-4 mb-2 rounded-full ${buttonColor}`}
                      >
                        <Text className={`text-center text-sm ${textColor}`}>{goal}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : (
                <Text className="text-gray-500 ml-6">No goals set.</Text>
              )}
            </>
          )}
        </View>
      </View>

      {isEditing ? (
        <View className="mt-6 flex-row justify-between">
          <TouchableOpacity
            className="flex-1 mr-2 bg-blue-500 py-3 rounded-full"
            onPress={handleSaveChanges}
          >
            <Text className="text-center text-white font-semibold text-lg">Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 ml-2 bg-gray-100 py-3 rounded-full"
            onPress={handleCancelEdit}
          >
            <Text className="text-center text-black font-semibold text-lg">Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          className="mt-6 bg-gray-100 py-3 rounded-full"
          onPress={() => setIsEditing(true)}
        >
          <Text className="text-center text-black text-lg">Edit Profile</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        className="mt-6 bg-gray-100 py-3 rounded-full"
        onPress={() => router.push("/goal-info")}
      >
        <Text className="text-center text-black text-lg">Edit Information</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="mt-6 flex-row items-center justify-center p-3 bg-red-500 rounded-full"
        onPress={() => {
          logout();
          router.push("/");
        }}
      >
        <Text className="ml-3 text-white  text-lg">Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Profile;
