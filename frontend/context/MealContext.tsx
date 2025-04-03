import React, { createContext, useState, ReactNode } from "react";
import Constants from "expo-constants";
import { Alert, Platform } from "react-native";
import useAuth from "@/hooks/useAuth";

interface MealContextType {

}

interface MealProviderProps {
  children: ReactNode;
}

export const MealContext = createContext<MealContextType | undefined>(undefined);

export const MealProvider: React.FC<MealProviderProps> = ({ children }) => {
  const [meals, setMeal] = useState<any[]>([]);
  const { user } = useAuth();
  const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;

  return (
    <MealContext.Provider
      value={{

      }}>
      {children}
    </MealContext.Provider>
  );
};