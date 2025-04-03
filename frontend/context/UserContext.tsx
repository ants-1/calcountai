import React, { createContext, useState, ReactNode } from "react";
import Constants from "expo-constants";
import useAuth from "@/hooks/useAuth";
import { Alert, Platform } from "react-native";

interface UserContextType {
  userData: any;
  updateUserGoalData: any;
  username: any;
  email: any;
  goal: any;
  setUsername: any;
  setEmail: any;
  fetchUser: () => Promise<void>;
  updateProfile: (updatedUsername: string, updatedEmail: string) => Promise<void>;
  submitUpdateUserData: (dob: any) => Promise<void>;
  fetchWeightGoalData: (userId: string) => Promise<void>;
  fetchStreak: (userId: string) => Promise<void>;
  streak: any;
  userGoalData: any;
  currentWeight: any;
  targetWeight: any;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<any>(null);
  const [streak, setStreak] = useState<any>(null);
  const [userGoalData, setUserGoalData] = useState<any>(null);
  const [username, setUsername] = useState<any>(null);
  const [email, setEmail] = useState<any>(null);
  const [goal, setGoal] = useState<any>(null);
  const [currentWeight, setCurrentWeight] = useState<any>(null);
  const [targetWeight, setTargetWeight] = useState<any>(null);
  const { user } = useAuth();
  const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;

  // Set user goal data in the context
  const updateUserGoalData = (updatedData: any) => {
    setUserData(updatedData);
  }

  // Submit updated user data to the backend
  const submitUpdateUserData = async (dob: any) => {
    const updatedUser = { ...userData, dob };
    
    try {
      const response = await fetch(`${BACKEND_API_URL}/users/${user?._id}/goal-info`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error("Failed to update user data");
      }

      updateUserGoalData(updatedUser);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  // Fetch user and update username and email
  const fetchUser = async () => {
    try {
      const API_URL = `${BACKEND_API_URL}/users/${user?._id}`;

      const response = await fetch(API_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await response.json();

      if (data.user) {
        setUsername(data.user.username || "");
        setEmail(data.user.email || "");
        setGoal(data.user.goal || "");
      } else {
        throw new Error("Invalid user data received");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  // Update profile information such as username and email
  /*
  BUG: Creates duplicate emails
       Check if email already exist if so return error
  */
  const updateProfile = async (updatedUsername: string, updatedEmail: string) => {
    try {
      const API_URL = `${BACKEND_API_URL}/users/${user?._id}`;
      const updatedUserData = { username: updatedUsername, email: updatedEmail };

      const response = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUserData),
      });

      if (!response.ok) {
        throw new Error("Failed to update user's profile'");
      }

      const data = await response.json();

      setUsername(data.updatedUser.username);
      setEmail(data.updatedUser.email);
    } catch (error) {
      console.error("Error updating profile:", error);
      if (Platform.OS === "web") {
        alert("Failed to update profile. Please try again.");
      } else {
        Alert.alert("Failed to update profile", "Please try again.");
      }
    }
  }

  // Fetch user's goal data
  const fetchWeightGoalData = async (userId: string) => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/users/${userId}`);

      if (!response.ok) throw new Error("Failed to fetch weight goal data");

      const data = await response.json();

      setCurrentWeight(data.user.currentWeight);
      setTargetWeight(data.user.targetWeight);
      setGoal(data.user.goal);
    } catch (error) {
      console.error("Error fetching weight goal data");
    }
  }

  // Fetch user's streak
  const fetchStreak = async (userId: string) => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/users/${userId}/streaks`);

      if (!response.ok) throw new Error("Failed to fetch streak data");

      const data = await response.json();

      if (!data) {
        setStreak(0);
      }

      setStreak(data.streak);
    } catch (error) {
      console.error("Error fetching weight goal data");
    }
  }

  return (
    <UserContext.Provider value={{
      userData,
      updateUserGoalData,
      username,
      email,
      goal,
      setUsername,
      setEmail,
      fetchUser,
      updateProfile,
      submitUpdateUserData,
      fetchWeightGoalData,
      fetchStreak,
      streak,
      userGoalData,
      currentWeight,
      targetWeight
    }}>
      {children}
    </UserContext.Provider>
  );
};
