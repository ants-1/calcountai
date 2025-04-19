import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useEffect, useState } from "react";
import useCommunity from "@/hooks/useCommunity";
import Header from "@/components/Header";
import useAuth from "@/hooks/useAuth";
import FeedTab from "@/components/FeedTab";
import PeopleTab from "@/components/PeopleTab";

const CommunityDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { community, fetchCommunity, joinCommunity, leaveCommunity, deleteCommunity, isJoined, setIsJoined } = useCommunity();
  const { user } = useAuth(); 
  const [index, setIndex] = useState(0);

  const routes = [
    { key: "feed", title: "Feed" },
    { key: "people", title: "People" },
  ];

  const renderScene = SceneMap({
    feed: () => (community ? <FeedTab community={community} /> : null),
    people: () => (community ? <PeopleTab members={community.members} creatorId={community.createdBy} /> : null),
  });

  useEffect(() => {
    if (id) fetchCommunity?.(id as string);
  }, [id]);

  useEffect(() => {
    if (community && user) {
      setIsJoined(community.members.some((member: any) => member._id === user._id));
    }
  }, [community, user]);

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

  const isCreator = user?._id === community.createdBy; 

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <Header title={community.name} icon="chevron-left" iconSize={25} titleSize="text-3xl" />

      <Text className="text-lg text-gray-700 text-center px-6 py-2">{community.description}</Text>

      {/* Join, Leave and Delete Community Button */}
      <View className="px-6 py-4">
        {isJoined === null ? (
          <Text className="text-lg text-gray-700">Checking membership...</Text>
        ) : isJoined ? (
          <View>
            {!isCreator && (
              <TouchableOpacity className="p-3 bg-red-500 rounded-full" onPress={() => leaveCommunity?.(id as string)}>
                <Text className="text-white text-center">Leave Community</Text>
              </TouchableOpacity>
            )}
            {isCreator && (
              <TouchableOpacity className="p-3 bg-red-700 rounded-full" onPress={() => deleteCommunity?.(id as string)}>
                <Text className="text-white text-center">Delete Community</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <TouchableOpacity className="p-3 bg-blue-500 rounded-full" onPress={() => joinCommunity?.(id as string)}>
            <Text className="text-white text-center">Join Community</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Community Tab */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get("window").width }}
        renderTabBar={(props) => (
          <TabBar {...props} indicatorStyle={{ backgroundColor: "#3B82F6" }} style={{ backgroundColor: "white" }} activeColor="#3B82F6" inactiveColor="gray" />
        )}
      />
    </SafeAreaView>
  );
};

export default CommunityDetails;
