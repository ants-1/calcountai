import React, { createContext, useState, ReactNode } from "react";
import Constants from "expo-constants";
import { Alert, Platform } from "react-native";
import { useRouter } from "expo-router";
import useAuth from "@/hooks/useAuth";
import useLog from "@/hooks/useLog";

interface ActivityContextType {
  activities: any[];
  fetchExercises: () => Promise<void>;
  addExerciseToLog: (id: string) => Promise<void>;
}

interface ActivityProviderProps {
  children: ReactNode;
}

export const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider: React.FC<ActivityProviderProps> = ({ children }) => {
  const [activities, setActivites] = useState<any[]>([]);
  const { user } = useAuth();
  const { currentLog, setCurrentLog } = useLog();
  const router = useRouter();
  const userId = user?._id;
  const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;

  const fetchExercises = async () => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/exercises`);
      const data = await response.json();
      setActivites(data.exercise || []);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  }

  const addExerciseToLog = async (id: string) => {
    if (!currentLog) {
      router.push("/(tabs)/logs");
      return;
    }

    if (currentLog.exercises.some((e: any) => e._id === id)) {
      if (Platform.OS === "web") {
        alert("Error: \nThis activity has already been added to today's log.")
      } else {
        Alert.alert("Error", "This activity has already been added to today's log.");
      }
      return;
    }

    try {
      const response = await fetch(
        `${BACKEND_API_URL}/users/${userId}/dailyLogs/${currentLog._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            exercises: [...currentLog.exercises.map((e: any) => e._id), id],
          }),
        }
      );

      if (response.ok) {
        const updatedLog = await response.json();
        setCurrentLog(updatedLog.dailyLog);

        if (Platform.OS === "web") {
          alert("Exercise Added: \nExercise has been added to log");
        } else {
          Alert.alert("Exercise Added", "Exercise has been added to log");
        }

        router.push("/(tabs)/logs");
      } else {

        if (Platform.OS === "web") {
          alert("Error: \nFailed to add exercise");
        } else {
          Alert.alert("Error", "Failed to add exercise");
        }
      }
    } catch (error) {
      console.error("Error adding exercise:", error);
    }
  }

  const addExercise = async (log: any) => {
    if (!log) {
      if (Platform.OS === "web") {
        alert("Error: \nPlease select a log");
      } else {
        Alert.alert("Error", "Please select a log.");
      }
      return;
    }
  }

  return (
    <ActivityContext.Provider
      value={{
        activities,
        fetchExercises,
        addExerciseToLog,
      }}>
      {children}
    </ActivityContext.Provider>
  )
}