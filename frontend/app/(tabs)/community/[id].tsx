import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import Icon from "react-native-vector-icons/FontAwesome";
import { useState } from "react";
import { ScrollView } from "react-native";

// Sample community data 
const communities = [
  { id: 1, name: 'Fitness Enthusiasts', members: 1200, description: 'A community for fitness lovers to share tips, workouts, and motivation.' },
  { id: 2, name: 'Healthy Eating', members: 900, description: 'Discover healthy recipes and nutrition advice for a balanced lifestyle.' },
  { id: 3, name: 'Yoga and Wellness', members: 450, description: 'Join us for yoga tips, mindfulness practices, and wellness inspiration.' },
  { id: 4, name: 'Marathon Runners', members: 700, description: 'Connect with marathon enthusiasts and share running plans and experiences.' },
  { id: 5, name: 'Weight Loss Warriors', members: 800, description: 'Support and motivate each other on your weight loss journey.' },
  { id: 6, name: 'Cycling Club', members: 600, description: 'A group for cycling enthusiasts to share routes, gear tips, and adventures.' },
];

const InfoScreen = ({ community }) => (
  <ScrollView className="flex-1 p-6">
    <Text className="text-lg text-gray-700">{community.description}</Text>
  </ScrollView>
);

const ChallengesScreen = () => (
  <ScrollView className="p-6">
    <Text className="text-lg text-gray-700">No challenges available yet.</Text>
  </ScrollView>
);

const PeopleScreen = () => (
  <ScrollView className="p-6">
    <Text className="text-lg text-gray-700">List of members coming soon...</Text>
  </ScrollView>
);

const CommunityDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const community = communities.find((c) => c.id === Number(id));


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

  // Tab Configuration
  const [index, setIndex] = useState(0);

  const routes = [
    { key: "info", title: "Info" },
    { key: "challenges", title: "Challenges" },
    { key: "people", title: "People" },
  ]

  const renderScene = SceneMap({
    info: () => <InfoScreen community={community} />,
    challenges: ChallengesScreen,
    people: PeopleScreen,
  });

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
