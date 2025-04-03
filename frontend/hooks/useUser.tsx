import { useContext } from "react";
import { UserContext } from "@/context/UserContext";

export const useUserData = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUserData must be used within a UserProvider");
  }

  return context;
};


// const fetchLatestDailyLog = async (userId: string) => {
//   try {
//     const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;
//     const response = await fetch(`${BACKEND_API_URL}/users/${userId}/dailyLogs`);
//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.error || "Failed to fetch logs");
//     }

//     if (!data.dailyLogs || data.dailyLogs.length === 0) {
//       return null;
//     }

//     // Sort logs by date in descending order (latest first)
//     const sortedLogs = data.dailyLogs.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

//     return sortedLogs[0];
//   } catch (error) {
//     console.error("Error fetching logs:", error);
//     return null;
//   }
// };

// const fetchWeightGoalData = async (userId: string) => {
//   try {
//     const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;
//     const response = await fetch(`${BACKEND_API_URL}/users/${userId}`);

//     const textResponse = await response.text();

//     const data = JSON.parse(textResponse);

//     if (!response.ok) {
//       throw new Error(data.error || "Failed to fetch weight goal data");
//     }

//     return data.user;
//   } catch (error) {
//     console.error("Error fetching weight goal data:", error);
//     return null;
//   }
// };
// const fetchStreaks = async (userId: string) => {
//   try {
//     const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;
//     const response = await fetch(`${BACKEND_API_URL}/users/${userId}/streaks`);
    
//     const textResponse = await response.text();

//     const data = JSON.parse(textResponse);

//     if (!response.ok) {
//       throw new Error(data.error || "Failed to fetch streak data");
//     }

//     return data;
//   } catch (error) {
//     console.error("Error fetching streak data:", error);
//     return null;
//   }
// }