import React, { createContext, useState, ReactNode } from "react";
import Constants from "expo-constants";
import { Alert, Platform } from "react-native";
import { useRouter } from "expo-router";
import useAuth from "@/hooks/useAuth";
import useLog from "@/hooks/useLog";
import { ActivityType } from "@/types/ActivityType";
import useChallenge from "@/hooks/useChallenge";

interface ActivityContextType {
  activities: any;
  fetchExercises: () => Promise<void>;
  addExerciseToLog: (id: string) => Promise<void>;
  addExercise: (activity: any, log: any) => Promise<void>;
  removeExercise: (exerciseId: string, log: any) => Promise<void>;
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
  const { challengeCheck } = useChallenge();

  // Fetch exercises from backend
  const fetchExercises = async () => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/exercises`);
      const data = await response.json();
      setActivites(data.exercises);
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

        challengeCheck(userId, "Activity", null);
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

  const addExercise = async (activity: any, log: any) => {
    try {
      const exerciseResponse = await fetch(`${BACKEND_API_URL}/exercises`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: activity.name,
          duration: activity.duration,
          caloriesBurned: activity.caloriesBurned,
        }),
      });

      if (!exerciseResponse.ok) {
        if (Platform.OS === "web") {
          alert("Error \nFailed to add exercise.");
        } else {
          Alert.alert("Error", "Failed to add exercise.");
        }
        return;
      }

      const exerciseData = await exerciseResponse.json();

      const exerciseId = exerciseData.newExercise?._id;

      if (!exerciseId) {
        console.error("Invalid exercise ID:", exerciseData);

        if (Platform.OS === "web") {
          alert("Error: \nFailed to create valid exercise.");
        } else {
          Alert.alert("Error", "Failed to create valid exercise.");
        }
        return;
      }

      if (log.exercises.some((e: any) => e?._id === exerciseId)) {
        if (Platform.OS === "web") {
          alert("Error: \n This exercise has already been added to the log.");
        } else {
          Alert.alert("Error", "This exercise has already been added to the log.");
        }
        return;
      }

      const updatedExercises = [
        ...log.exercises.filter((e: any) => e != null && e._id != null).map((e: any) => e._id),
      ];

      updatedExercises.push(exerciseId);

      // Add the exercise to the selected log
      const logResponse = await fetch(
        `${BACKEND_API_URL}/users/${userId}/dailyLogs/${log._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            exercises: updatedExercises,
          }),
        }
      );

      if (logResponse.ok) {
        await logResponse.json();

        if (Platform.OS === "web") {
          alert("Success: \nActivity added sucessfully!");
        } else {
          Alert.alert("Success", "Activity added successfully!");
        }

        challengeCheck(userId, "Activity", null);
        router.push("/logs");
      } else {
        if (Platform.OS === "web") {
          alert("Success: \nFailed to add exercise to log.");
        } else {
          Alert.alert("Error", "Failed to add exercise to log.");
        }
      }
    } catch (error) {
      console.error("Error adding exercise:", error);
      if (Platform.OS === "web") {
        alert("Error: \nAn error occurred while adding the exercise.");
      } else {
        Alert.alert("Error", "An error occurred while adding the exercise.");
      }
    }
  }

  const removeExercise = async (exerciseId: string, log: any) => {
    if (!log) return;

    try {
      const updatedExercises = log.exercise?.filter((exercise: ActivityType) => exercise._id !== exerciseId);


      const response = await fetch(`${BACKEND_API_URL}/users/${user?._id}/dailyLogs/${currentLog._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exercises: updatedExercises }),
      });

      if (response.ok) {
        const updatedLog = await response.json();
        setCurrentLog(updatedLog.dailyLog);
      } else {
        if (Platform.OS === "web") {
          alert("Error: \nFailed to remove exercise.");
        } else {
          Alert.alert("Error", "Failed to remove exercise.");
        }
      }

    } catch (error) {
      if (Platform.OS === "web") {
        alert("Error: \nError while removing exercise.");
      } else {
        Alert.alert("Error", "Error while removing exercise.");
      }
    }
  }

  return (
    <ActivityContext.Provider
      value={{
        activities,
        fetchExercises,
        addExerciseToLog,
        addExercise,
        removeExercise,
      }}>
      {children}
    </ActivityContext.Provider>
  )
}