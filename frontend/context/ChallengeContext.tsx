import React, { createContext, useState, ReactNode } from "react";
import Constants from "expo-constants";
import { Alert, Platform } from "react-native";
import { useRouter } from "expo-router";

interface ChallengeContextType {
  challenges: any;
  userChallenges: any;
  fetchChallenges: () => Promise<void>;
  fetchUserChallenges: (userId: string | undefined) => Promise<void>;
  createChallenge: (challengeData: any) => Promise<void>;
  joinChallenge: (userId: string | undefined, challengeId: string) => Promise<void>;
  leaveChallenge: (userId: string | undefined, challengeId: string) => Promise<void>;
  updateChallenge: (userId: string | undefined, challengeId: string, progress: number) => Promise<void>;
  challengeCheck: (userId: string | undefined, selectedChallengeType: string, challengeData: string | null) => void;
  shareChallenge: (userId: string, communityId: string, challengeId: string) => Promise<void>;
}

interface ChallengeProviderProps {
  children: ReactNode;
}

export const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

export const ChallengeProvider: React.FC<ChallengeProviderProps> = ({ children }) => {
  const [challenges, setChallenges] = useState<any>(null);
  const [userChallenges, setUserChallenges] = useState<any>(null);
  const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;
  const router = useRouter();

  const fetchChallenges = async () => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/challenges`);

      if (response.status === 404) {
        setChallenges([]);
        return;
      }

      if (!response.ok) {
        return;
      };

      const data = await response.json();

      setChallenges(data.challenges);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const fetchUserChallenges = async (userId: string | undefined) => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/users/${userId}/challenges`);

      if (response.status === 404) {
        setUserChallenges([]);
        return;
      }

      if (!response.ok) throw new Error("Unable to fetch user challenges");

      const data = await response.json();

      setUserChallenges(data?.challenges);
    } catch (error: any) {
      console.error(error.message);
    }
  };

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

  const joinChallenge = async (userId: string | undefined, challengeId: string) => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/users/${userId}/challenges/${challengeId}/join`, {
        method: "PUT",
      });

      if (!response.ok) throw new Error("Unable to join challenge");

      Alert.alert('Success', 'You have joined the challenge.');

      if (Platform.OS === 'web') {
        window.location.reload();
      } else {
        router.replace("/(tabs)/dashboard/challenges");
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const leaveChallenge = async (userId: string | undefined, challengeId: string) => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/users/${userId}/challenges/${challengeId}/leave`, {
        method: "PUT",
      });

      if (!response.ok) throw new Error("Unable to join challenge");

      Alert.alert('Success', 'You have left the challenge.');

      if (Platform.OS === 'web') {
        window.location.reload();
      } else {
        router.replace("/(tabs)/dashboard/challenges");
      }
    } catch (error: any) {
      console.error(error.message);
    }
  }

  const updateChallenge = async (userId: string | undefined, challengeId: string, progress: number) => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/challenges/${challengeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participants: [{ user: userId, progress }],
        }),
      });

      if (!response.ok) throw new Error("Unable to update challenge");
    } catch (error: any) {
      console.error(error.message);
    }
  };

  /*
    BUG: Updating challengeType Streak
      Only updates one streak and doesn't update new streak challenges added
      - Due to fetchStreaks in UserContext only being used in index
      - Completed need to be added to particepents 
  */
  const challengeCheck = async (
    userId: string | undefined,
    selectedChallengeType: string,
    challengeData: string | number | null
  ) => {
    // Ensure userChallenges is available and an array
    if (!userChallenges || !Array.isArray(userChallenges)) return;

    // Update promises for concurrent updates
    const updatePromises: Promise<void>[] = [];

    // Loop through each challenge to check for matching type
    userChallenges.forEach((challenge: any) => {
      // Skip if the challenge type doesn't match the selected challenge type
      if (challenge.challengeType !== selectedChallengeType) return;

      // Find the participant for the challenge
      const participant = challenge.participants.find(
        (p: any) => p.user === userId
      );

      // If the participant doesn't exist, skip this challenge
      if (!participant) return;

      let newProgress: number;

      // Calculate the new progress based on the challenge type
      switch (challenge.challengeType) {
        case "Streak":
          // For Streaks, use the passed challengeData (e.g., streak number)
          newProgress = Number(challengeData);
          break;
        case "Meal":
        case "Activity":
          // For meals and activities, increment the participant's progress
          newProgress = (participant?.progress || 0) + 1;
          break;
        default:
          return;
      }

      // Cap the progress at the challenge level (do not exceed the max level)
      if (newProgress > challenge.level) newProgress = challenge.level;

      // If the participant has already completed the challenge, no need to update
      if (participant.progress >= challenge.level) return;

      // Add the update to the promises array
      updatePromises.push(updateChallenge(userId, challenge._id, newProgress));
    });

    // Wait for all update promises to resolve
    await Promise.all(updatePromises);
  };

  const shareChallenge = async (userId: string, communityId: string, challengeId: string) => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/communities/${communityId}/feeds`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: userId,
          challengeId: challengeId,
        }),
  
      });

      if (!response.ok) {
        Alert.alert('Error', 'Unable to share challenge');
        throw new Error("Unable to share challenge");
      } else {
        Alert.alert('Success', 'Challenge has been shared');
      }
    } catch (error: any) {
      console.error(error.message);
    }
  }

  return (
    <ChallengeContext.Provider
      value={{
        challenges,
        userChallenges,
        fetchChallenges,
        fetchUserChallenges,
        createChallenge,
        joinChallenge,
        leaveChallenge,
        updateChallenge,
        challengeCheck,
        shareChallenge
      }}>
      {children}
    </ChallengeContext.Provider>
  );
};