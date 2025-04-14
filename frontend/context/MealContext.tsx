import React, { createContext, useState, ReactNode } from "react";
import Constants from "expo-constants";
import { Alert, Platform } from "react-native";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { MealResponse } from "@/types/MealResponse";
import useChallenge from "@/hooks/useChallenge";

interface MealContextType {
  meals: any;
  selectedMeal: any;
  setSelectedMeal: any;
  fetchMeals: () => Promise<void>;
  addMeals: (meal: any, log: any) => Promise<void>;
}

interface MealProviderProps {
  children: ReactNode;
}

export const MealContext = createContext<MealContextType | undefined>(undefined);

export const MealProvider: React.FC<MealProviderProps> = ({ children }) => {
  const router = useRouter();
  const [meals, setMeals] = useState<any[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const { user } = useAuth();
  const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;
  const { challengeCheck } = useChallenge();

  // Fetch all meals in database
  const fetchMeals = async () => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/foods`);
      const data = await response.json();
      setMeals(data.foods || []);
    } catch (error) {
      console.error("Error fetching meals:", error);
    }
  };

  const addMeals = async (meal: any, log: any) => {
    try {
      const mealResponse = await fetch(`${BACKEND_API_URL}/foods`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: meal.name,
          calories: meal.calories,
          numberOfServings: meal.numberOfServings,
          servingSize: meal.servingSize,
          protein: meal.protein,
          fat: meal.fat,
          carbohydrates: meal.carbohydrates,
          mealType: meal.mealType,
        }),
      });

      if (!mealResponse.ok) {
        if (Platform.OS === "web") {
          alert("Error: \nFailed to add meal.");
        } else {
          Alert.alert("Error", "Failed to add meal.");
        }
        return;
      }

      const mealData = await mealResponse.json();
      const mealId: MealResponse = mealData.newFood?._id;

      if (!mealId) {
        if (Platform.OS === "web") {
          alert("Error: \n Failed to create valid meal");
        } else {
          Alert.alert("Error", "Failed to create valid meal.");
        }
        return;
      }

      if (log.foods.some((m: any) => m._id === mealId)) {
        if (Platform.OS === "web") {
          alert("Error: \nThis meal has already been added to the log.");
        } else {
          Alert.alert("Error", "This meal has already been added to the log.");
        }
        return;
      }

      const updatedMeals = [...log.foods, { _id: mealId }];

      const logResponse = await fetch(
        `${BACKEND_API_URL}/users/${user?._id}/dailyLogs/${log._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            foods: updatedMeals,
          }),
        }
      );

      if (logResponse.ok) {
        await logResponse.json();

        if (Platform.OS === "web") {
          alert("Success: \nMeal added successfully!");
        } else {
          Alert.alert("Success", "Meal added successfully!");
        }

        challengeCheck(user?._id, "Meal", null);
        router.push("/logs");
      } else {
        const errorLogData = await logResponse.json();
        console.error("Failed to add meal to log:", errorLogData);
        if (Platform.OS === "web") {
          alert("Error: \nFailed to add meal to log.");
        } else {
          Alert.alert("Error", "Failed to add meal to log.");
        }
      }

    } catch (error) {
      if (Platform.OS === "web") {
        alert("Error: \nAn error occurred while adding the meal.");
      } else {
        Alert.alert("Error", "An error occurred while adding the meal.");
      }
    }
  }

  return (
    <MealContext.Provider
      value={{
        meals,
        selectedMeal,
        setSelectedMeal,
        fetchMeals,
        addMeals,
      }}>
      {children}
    </MealContext.Provider>
  );
};