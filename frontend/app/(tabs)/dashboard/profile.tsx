import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";

const Profile: React.FC = () => {
  const router = useRouter();

  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [isEditing, setIsEditing] = useState(false);

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
              <Text className="text-2xl font-semibold mt-4 text-center mb-4">{firstName}{" "}{lastName}</Text>
              <Text className="text-gray-500 text-center">{email}</Text>
            </>
          )}
        </View>
      </View>

      <TouchableOpacity
        className="mt-6 bg-blue-500 py-3 rounded-lg"
        onPress={() => setIsEditing(!isEditing)}
      >
        <Text className="text-center text-white font-semibold text-lg">
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="mt-6 flex-row items-center justify-center p-3 bg-red-500 rounded-lg"
        onPress={() => router.replace("/(auth)/sign-in")}
      >
        <Icon name="sign-out" size={20} color="#fff" />
        <Text className="ml-3 text-white font-semibold text-lg">Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Profile;
