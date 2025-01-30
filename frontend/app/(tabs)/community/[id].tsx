import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, Dimensions, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import Icon from "react-native-vector-icons/FontAwesome";
import { useState, useEffect } from "react";
import Constants from "expo-constants";

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
  const { id } = useLocalSearchParams();
  const [community, setCommunity] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [index, setIndex] = useState(0);

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
      <View className="flex-row items-center justify-between px-6 py-4">
        <Text className="text-2xl font-bold">{community.name}</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-left" size={24} color="#4B5563" />
        </TouchableOpacity>
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
