import React, { createContext, useState, ReactNode, useContext } from "react";
import Constants from "expo-constants";
import { Alert, Platform } from "react-native";

interface ChallengeContextType {
  challenges: any;
  personalChallenges: any;
  communityChallenges: any;
  fetchChallenges: (userId: string) => Promise<void>;
  // fetchCommunityChallenges: (communityId: string) => Promise<void>;
  fetchUserChallenges: (userId: string | undefined) => Promise<void>;
  createChallenge: (challengeData: any) => Promise<void>;
  joinChallenge: (userId: string, challengeId: string) => Promise<void>;
}

interface ChallengeProviderProps {
  children: ReactNode;
}

export const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

export const ChallengeProvider: React.FC<ChallengeProviderProps> = ({ children }) => {
  const [challenges, setChallenges] = useState<any>(null);
  const [personalChallenges, setPersonalChallenges] = useState<any>(null);
  const [communityChallenges, setCommunityChallenges] = useState<any>(null);
  const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;

  const fetchChallenges = async () => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/challenges`);
      if (!response.ok) throw new Error("Unable to fetch challenges");
      const data = await response.json();
      setChallenges(data);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const fetchUserChallenges = async (userId: string | undefined) => {
    if (!userId) {
      console.error("User ID is undefined");
      return;
    }
  
    try {
      const response = await fetch(`${BACKEND_API_URL}/users/${userId}/challenges`);
  
      if (response.status === 404) {
        console.warn("No challenges found for user.");
        setCommunityChallenges([]);
        setPersonalChallenges([]);
        return;
      }
  
      if (!response.ok) throw new Error("Unable to fetch user challenges");
  
      const data = await response.json();
      console.log("Fetched Challenges:", data);
  
      // Extract challenge arrays correctly
      setCommunityChallenges(data?.community?.challenges || []);
      setPersonalChallenges(data?.personal?.challenges || []);
  
    } catch (error: any) {
      console.error(error.message);
    }
  };  

  // const fetchCommunityChallenges = async (communityId: string) => {
  //   try {
  //     const response = await fetch(`${BACKEND_API_URL}/community/${communityId}/challenges`);
  //     if (!response.ok) throw new Error("Unable to fetch community challenges");
  //     const data = await response.json();
  //     setCommunityChallenges(data.challenges);
  //   } catch (error: any) {
  //     console.error(error.message);
  //   }
  // };

  const createChallenge = async (challengeData: any) => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/challenges`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(challengeData),
      });

      const rawResponse = await response.text();

      if (!response.ok) {
        if (Platform.OS === "web") {
          alert("Error: Failed to create challenge.");
        } else {
          Alert.alert("Error", "Failed to create challenge.");
        }
        return;
      }

      const data = JSON.parse(rawResponse);
      console.log(data);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const joinChallenge = async (userId: string, challengeId: string) => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/user/${userId}/challenges/${challengeId}/join`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Unable to join challenge");
    } catch (error: any) {
      console.error(error.message);
    }
  };

  // const editChallenge = async () => {

  // };

  // const leaveChallenge = async () => {

  // }

  // const deleteChallenge = async () => {

  // }

  return (
    <ChallengeContext.Provider value={{
      challenges,
      personalChallenges,
      communityChallenges,
      fetchChallenges,
      fetchUserChallenges,
      // fetchCommunityChallenges,
      createChallenge,
      joinChallenge
    }}>
      {children}
    </ChallengeContext.Provider>
  );
};