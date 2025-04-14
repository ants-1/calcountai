import React, { createContext, useState, ReactNode } from "react";
import Constants from "expo-constants";
import { Alert, Platform } from "react-native";
import useAuth from "@/hooks/useAuth";

interface LogContextType {
  dailyLogs: any[];
  currentLog: any;
  setCurrentLog: (log: any) => void;
  fetchDailyLogs: () => Promise<void>;
  createNewDailyLog: () => Promise<void>;
  handlePrevious: () => void;
  handleNext: () => void;
}

interface LogProviderProps {
  children: ReactNode;
}

export const LogContext = createContext<LogContextType | undefined>(undefined);

export const LogProvider: React.FC<LogProviderProps> = ({ children }) => {
  const [dailyLogs, setDailyLogs] = useState<any[]>([]);
  const [currentLog, setCurrentLog] = useState<any>({});

  const { user } = useAuth();
  const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;

  // Fetch all daily logs and ensure today's log exists
  const fetchDailyLogs = async () => {
    try {
      if (!user) return;

      const response = await fetch(`${BACKEND_API_URL}/users/${user._id}/dailyLogs`);

      // Replace with alerts
      // if (!response.ok) throw new Error("Failed to fetch logs");
      
      const data = await response.json();
      const logs = data.dailyLogs || [];
      setDailyLogs(logs);

      const today = new Date().toISOString().split("T")[0];
      let todayLog = logs.find((log: any) => log.date.split("T")[0] === today);

      if (!todayLog) {
        todayLog = await createNewDailyLog();
      }

      if (!currentLog) {
        createNewDailyLog();
      }

      setCurrentLog(todayLog);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  // Create a new daily log and return it
  const createNewDailyLog = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
  
      // Fetch latest logs to ensure no duplicate creation
      const res = await fetch(`${BACKEND_API_URL}/users/${user?._id}/dailyLogs`);
      const data = await res.json();
      const logs = data.dailyLogs || [];
  
      // If today's log exists, just stop
      const existingTodayLog = logs.find((log: any) => log.date.split("T")[0] === today);
      if (existingTodayLog) return null;
  
      const newLog = {
        date: today,
        foods: [],
        exercises: [],
        completed: false,
      };
  
      const response = await fetch(`${BACKEND_API_URL}/users/${user?._id}/dailyLogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLog),
      });
  
      if (!response.ok) throw new Error("Failed to create log");
  
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
        handlePrevious,
        handleNext
      }}>
      {children}
    </LogContext.Provider>
  );
};
