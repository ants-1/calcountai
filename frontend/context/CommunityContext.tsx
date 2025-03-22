import React, { createContext, useState, ReactNode } from "react";
import Constants from "expo-constants";
import { Alert, Platform } from "react-native";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { CommunityType } from "@/types/CommunityType";

interface CommunityContextType {
  community: any;
  communities: CommunityType[];
  fetchCommunities: () => Promise<void>;
  fetchCommunity: (id: string) => Promise<void>;
  joinCommunity: (id: string) => Promise<void>;
  createCommunity: (name: string, description: string) => Promise<void>;
  leaveCommunity: (id: string) => Promise<void>;
  deleteCommunity: (id: string) => Promise<void>;
  isJoined: boolean | null;
  setIsJoined: (value: boolean) => void;
}

interface CommunityProviderProps {
  children: ReactNode;
}

export const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const CommunityProvider: React.FC<CommunityProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [communities, setCommunities] = useState<CommunityType[]>([]);
  const [community, setCommunity] = useState<any>(null);
  const [isJoined, setIsJoined] = useState<boolean | null>(null);
  const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;

  const fetchCommunities = async () => {
    try {
      const API_URL = `${BACKEND_API_URL}/communities`;
      const response = await fetch(API_URL);

      if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

      const data = await response.json();

      if (!data.communities || !Array.isArray(data.communities)) throw new Error("API did not return an array");

      setCommunities(data.communities);
    } catch (error: any) {
      console.error("Error fetching communities:", error);
    }
  };

  const fetchCommunity = async (id: string) => {
    try {
      const API_URL = `${BACKEND_API_URL}/communities/${id}`;
      const response = await fetch(API_URL);

      if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

      const data = await response.json();

      if (!data.community) throw new Error("API did not return valid community data");

      setCommunity(data.community);
    } catch (error: any) {
      console.error("Error fetching community:", error);

      if (Platform.OS === "web") {
        alert("Error: \nCommunity not found or there was an issue loading the data.");
      } else {
        Alert.alert("Error", "Community not found or there was an issue loading the data.");
      }
    }
  };

  const joinCommunity = async (id: string) => {
    try {
      const API_URL = `${BACKEND_API_URL}/communities/${id}/join`;
      const userId = user?._id;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error(`Failed to join community. Status: ${response.status}`);

      setIsJoined(true);

      if (Platform.OS === "web") {
        alert("Success: \nYou have successfully joined the community.");
      } else {
        Alert.alert("Success", "You have successfully joined the community.");
      }

      router.replace(`/community/${id}`);
    } catch (error: any) {
      console.error("Error joining community:", error);

      if (Platform.OS === "web") {
        alert("Error: \nThere was an issue joining the community.")
      } else {
        Alert.alert("Error", "There was an issue joining the community.");
      }
    }
  };

  const createCommunity = async (name: string, description: string) => {
    try {
      const API_URL = `${BACKEND_API_URL}/communities`;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          createdBy: user?._id,
          members: [user?._id],
          challenges: [],
        }),
      });

      if (!response.ok) throw new Error(`Failed to create community. Status: ${response.status}`);

      if (Platform.OS === "web") {
        alert("Success: \nCommunity created successfully.")
      } else {
        Alert.alert("Success", "Community created successfully.");
      }

      router.back();
    } catch (error: any) {
      console.error("Error creating community:", error);

      if (Platform.OS == "web") {
        alert("Error: There was an issue creating the community.");
      } else {
        Alert.alert("Error", "There was an issue creating the community.");
      }
    }
  }

  const leaveCommunity = async (id: String) => {
    try {
      if (Platform.OS === "web") {
        const confirmLeave = window.confirm("Are you sure you want to leave this community?");
        if (!confirmLeave) return;
      } else {
        const confirmLeave = await new Promise((resolve) =>
          Alert.alert(
            "Confirm Leave",
            "Are you sure you want to leave this community?",
            [
              { text: "No", onPress: () => resolve(false), style: "cancel" },
              { text: "Yes", onPress: () => resolve(true) },
            ],
            { cancelable: false }
          )
        );
        if (!confirmLeave) return;
      }

      const API_URL = `${BACKEND_API_URL}/communities/${id}/leave`;
      const userId = user?._id;

      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error(`Failed to leave community. Status: ${response.status}`);

      setIsJoined(false);

      if (Platform.OS === "web") {
        alert("You have successfully left the community.");
      } else {
        Alert.alert("Success", "You have successfully left the community.");
      }

      router.replace(`/community/${id}`);
    } catch (error: any) {
      console.error("Error leaving community:", error);

      if (Platform.OS === "web") {
        alert("There was an issue leaving the community.");
      } else {
        Alert.alert("Error", "There was an issue leaving the community.");
      }
    }
  }

  const deleteCommunity = async (id: string) => {
    try {
      if (Platform.OS === "web") {
        const confirmDelete = window.confirm("Are you sure you want to delete this community?");
        if (!confirmDelete) return;
      } else {
        const confirmDelete = await new Promise((resolve) =>
          Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this community?",
            [
              { text: "No", onPress: () => resolve(false), style: "cancel" },
              { text: "Yes", onPress: () => resolve(true) },
            ],
            { cancelable: false }
          )
        );
        if (!confirmDelete) return;
      }

      const API_URL = `${BACKEND_API_URL}/communities/${id}`;

      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(`Failed to delete community. Status: ${response.status}`);

      if (Platform.OS === "web") {
        alert("Community has been deleted.");
      } else {
        Alert.alert("Success", "Community has been deleted.");
      }

      router.push("/(tabs)/community");
    } catch (error: any) {
      console.error("Error deleting community:", error);

      if (Platform.OS === "web") {
        alert("There was an issue deleting the community.");
      } else {
        Alert.alert("Error", "There was an issue deleting the community.");
      }
    }
  }

  return (
    <CommunityContext.Provider
      value={{
        community,
        communities,
        fetchCommunities,
        fetchCommunity,
        joinCommunity,
        createCommunity,
        leaveCommunity,
        deleteCommunity,
        isJoined,
        setIsJoined,
      }}>
      {children}
    </CommunityContext.Provider>
  )
}