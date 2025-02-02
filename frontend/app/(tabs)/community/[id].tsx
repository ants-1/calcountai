import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, Dimensions, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import Icon from "react-native-vector-icons/FontAwesome";
import { useState, useEffect } from "react";
import Constants from "expo-constants";
import useAuth from "@/hooks/useAuth";
import Header from "@/components/Header";

// Sample Screens
const InfoScreen = ({ community }: { community: any }) => (
  <ScrollView className="flex-1 p-6">
    <Text className="text-lg text-gray-700">{community.description}</Text>
  </ScrollView>
);

const ChallengesScreen = ({ challenges }: { challenges: any[] }) => (
  <ScrollView className="p-6">
    {challenges.length > 0 ? (
      challenges.map((challenge) => (
        <View key={challenge._id}>
          <View className="flex flex-row justify-between items-center w-full bg-gray-200 p-2 rounded-xl">
            <Text className="p-3 flex-1">{challenge.description}</Text>

            <Text className="bg-green-300 p-2.5 rounded-xl w-auto text-center h-10">{challenge.challengeType}</Text>
          </View>
        </View>
      ))
    ) : (
      <Text className="text-lg text-gray-700">No challenges available yet.</Text>
    )}
  </ScrollView>
);

const PeopleScreen = ({ members, creatorId }: { members: any[]; creatorId: string }) => (
  <ScrollView className="p-6">
    {members.length > 0 ? (
      members.map((member) => (
        <View key={member._id} className="flex flex-row justify-between items-center w-full mb-4 bg-gray-200 p-4 rounded-lg">
          <View className="flex flex-row gap-2">
            <Icon name="user-circle" size={25} color="#4B5563" />
            <Text className="text-lg text-gray-800">
              {member.firstName} {member.lastName}
            </Text>
          </View>

          {/* Check if the member is the creator */}
          {member._id === creatorId && (
            <Text className="text-lg font-semibold mb-1">Creator</Text>
          )}
        </View>
      ))
    ) : (
      <Text className="text-lg text-gray-700">No members available yet.</Text>
    )}
  </ScrollView>
);

const CommunityDetails = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { id } = useLocalSearchParams();
  const [community, setCommunity] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [index, setIndex] = useState(0);
  const [isJoined, setIsJoined] = useState<boolean | null>(null);

  const routes = [
    { key: "info", title: "Info" },
    { key: "challenges", title: "Challenges" },
    { key: "people", title: "People" },
  ];

  const renderScene = SceneMap({
    info: () => (community ? <InfoScreen community={community} /> : null),
    challenges: () => (community ? <ChallengesScreen challenges={community.challenges} /> : null),
    people: () => (community ? <PeopleScreen members={community.members} creatorId={community.createdBy} /> : null),
  });

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;
        const API_URL = `${BACKEND_API_URL}/communities/${id}`;
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (!data.community) {
          throw new Error("API did not return valid community data");
        }

        setCommunity(data.community);
      } catch (error) {
        console.error("Error fetching community:", error);
        Alert.alert("Error", "Community not found or there was an issue loading the data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCommunity();
  }, [id]);

  useEffect(() => {
    if (community && user) {
      const isUserJoined = community.members.some((member: { _id: any; }) => String(member._id) === String(user._id));
      setIsJoined(isUserJoined);
    }
  }, [community, user]);

  // Handle join community
  const joinCommunity = async () => {
    try {
      const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;
      const API_URL = `${BACKEND_API_URL}/communities/${id}/join`;
      const userId = user?._id;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to join community. Status: ${response.status}`);
      }

      setIsJoined(true);
      Alert.alert("Success", "You have successfully joined the community.");
      router.replace(`/community/${id}`);
    } catch (error) {
      console.error("Error joining community:", error);
      Alert.alert("Error", "There was an issue joining the community.");
    }
  };

  const leaveCommunity = async () => {
    Alert.alert(
      "Confirm Leave",
      "Are you sure you want to leave this community?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Leave"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;
              const API_URL = `${BACKEND_API_URL}/communities/${id}/leave`;
              const userId = user?._id;

              const response = await fetch(API_URL, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
              });

              if (!response.ok) {
                throw new Error(`Failed to leave community. Status: ${response.status}`);
              }

              setIsJoined(false);
              Alert.alert("Success", "You have successfully left the community.");
              router.replace(`/community/${id}`);
            } catch (error) {
              console.error("Error leaving community:", error);
              Alert.alert("Error", "There was an issue leaving the community.");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const deleteCommunity = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this community?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Delete"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;
              const API_URL = `${BACKEND_API_URL}/communities/${id}`;

              const response = await fetch(API_URL, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
              });

              if (!response.ok) {
                throw new Error(`Failed to delete community. Status: ${response.status}`);
              }

              Alert.alert("Success", "Community has been deleted.");
              router.push('/(tabs)/community'); // Redirect to communities page after deletion
            } catch (error) {
              console.error("Error deleting community:", error);
              Alert.alert("Error", "There was an issue deleting the community.");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-xl font-semibold text-gray-700">Loading community...</Text>
      </SafeAreaView>
    );
  }

  if (!community) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-xl font-semibold text-gray-700">Community not found.</Text>
        <TouchableOpacity className="mt-4 p-3 bg-blue-500 rounded-lg" onPress={() => router.back()}>
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title={community.name} icon="arrow-left" iconSize={25} titleSize="text-3xl"/>

      <View className="px-6 py-4">
        {isJoined === null ? (
          <Text className="text-lg text-gray-700">Checking membership...</Text>
        ) : isJoined ? (
          <View>
            {community.createdBy !== user?._id && (
              <TouchableOpacity className="p-3 bg-red-500 rounded-lg" onPress={leaveCommunity}>
                <Text className="text-white text-center">Leave Community</Text>
              </TouchableOpacity>
            )}
            {community.createdBy === user?._id && (
              <TouchableOpacity className="mt-3 p-3 bg-red-700 rounded-lg" onPress={deleteCommunity}>
                <Text className="text-white text-center">Delete Community</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <TouchableOpacity className="p-3 bg-blue-500 rounded-lg" onPress={joinCommunity}>
            <Text className="text-white text-center">Join Community</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tab View */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get("window").width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "#3B82F6" }}
            style={{ backgroundColor: "white" }}
            activeColor="#3B82F6"
            inactiveColor="gray"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default CommunityDetails;
