import React, { createContext, useState, ReactNode } from "react";
import Constants from "expo-constants";
import { Alert, Platform } from "react-native";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "expo-router";

interface LogContextType {
  dailyLogs: any[];
  currentLog: any;
  setCurrentLog: (log: any) => void;
  fetchDailyLogs: () => Promise<void>;
  createNewDailyLog: () => Promise<void>;
  removeLogMeal: (dailyLogId: string, mealId: string, userId: string | undefined) => Promise<void>;
  removeLogActivity: (dailyLogId: string, activityId: string, userId: string | undefined) => Promise<void>;
  handlePrevious: () => void;
  handleNext: () => void;
}

interface LogProviderProps {
  children: ReactNode;
}

export const LogContext = createContext<LogContextType | undefined>(undefined);

export const LogProvider: React.FC<LogProviderProps> = ({ children }) => {
  const router = useRouter();
  const [dailyLogs, setDailyLogs] = useState<any[]>([]);
  const [currentLog, setCurrentLog] = useState<any>({});

  const { user } = useAuth();
  const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;

  // Fetch all daily logs and ensure today's log exists
  const fetchDailyLogs = async () => {
    try {
      if (!user) return;

      const response = await fetch(`${BACKEND_API_URL}/users/${user._id}/dailyLogs`);

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      const logs = data.dailyLogs || [];
      setDailyLogs(logs);

      const today = new Date().toISOString().split("T")[0];
      let todayLog = logs.find((log: any) => log.date.split("T")[0] === today);

      if (!todayLog) {
        todayLog = await createNewDailyLog();
      }

      setCurrentLog(todayLog);
    } catch (error) {
      Alert.alert("Error", "Unable to fetch log.");
    }
  };

  // Create a new daily log and return it
  const createNewDailyLog = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const newLog = {
        date: today,
        foods: [],
        protein: 0,
        carbs: 0,
        fats: 0,
        exercises: [],
        completed: false,
      };

      const response = await fetch(`${BACKEND_API_URL}/users/${user?._id}/dailyLogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLog),
      });

      if(response.status === 400) {
        return;
      }

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(errMsg || "Failed to create log");
      }

      const createdLog = await response.json();
      const newDailyLog = createdLog.dailyLog;

      setDailyLogs(prev => [...prev, newDailyLog]);
      setCurrentLog(newDailyLog);

      return newDailyLog;
    } catch (error) {
      console.error("Error creating log:", error);
      return null;
    }
  };

  const removeLogMeal = async (dailyLogId: string, mealId: string, userId: string | undefined) => {
    const response = await fetch(`${BACKEND_API_URL}/dailyLogs/${dailyLogId}/meals/${mealId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userId }),
    });

    if (!response.ok) {
      Alert.alert("Error", "Unable to remove meal from log.");
      router.replace("/(tabs)/logs");
      return;
    }

    Alert.alert("Success", "Meal successfully removed from log.");
    router.replace("/(tabs)/logs");
  }

  const removeLogActivity = async (dailyLogId: string, activityId: string, userId: string | undefined) => {
    const response = await fetch(`${BACKEND_API_URL}/dailyLogs/${dailyLogId}/activities/${activityId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userId }),
    });

    if (!response.ok) {
      Alert.alert("Error", "Unable to remove meal from log.");
      router.replace("/(tabs)/logs");
      return;
    }

    Alert.alert("Success", "Meal successfully removed from log.");
    router.replace("/(tabs)/logs");
  }

  const handlePrevious = () => {
    if (!currentLog) return;

    const index = dailyLogs.findIndex(log => log._id === currentLog._id);
    if (index > 0) {
      setCurrentLog(dailyLogs[index - 1]);
    }
  };

  const handleNext = () => {
    if (!currentLog) return;

    const index = dailyLogs.findIndex(log => log._id === currentLog._id);
    if (index < dailyLogs.length - 1) {
      setCurrentLog(dailyLogs[index + 1]);
    }
  };

  return (
    <LogContext.Provider
      value={{
        dailyLogs,
        currentLog,
        setCurrentLog,
        fetchDailyLogs,
        createNewDailyLog,
        removeLogMeal,
        removeLogActivity,
        handlePrevious,
        handleNext
      }}>
      {children}
    </LogContext.Provider>
  );
};
