import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useFocusEffect } from '@react-navigation/native';
import useCommunity from "@/hooks/useCommunity";

type SortOption = 'name' | 'members';
type SortOrder = 'asc' | 'desc';

const Community: React.FC = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [sortOption, setSortOption] = useState<SortOption>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [showSortDropdown, setShowSortDropdown] = useState<boolean>(false);
  const { communities, fetchCommunities } = useCommunity();

  // Re-fetch communities every time the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchCommunities();
      setLoading(false);
    }, [])
  );

  // Filtered communities
  const filteredCommunities = communities.filter((community) =>
    community.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Sort communitites
  const sortedCommunities = filteredCommunities.sort((a, b) => {
    if (sortOption === 'name') {
      return sortOrder === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else {
      return sortOrder === 'asc' ? a.members.length - b.members.length : b.members.length - a.members.length;
    }
  });

  // Sort options
  const sortOptions = [
    { label: 'Name Ascending', option: 'name', order: 'asc' },
    { label: 'Name Descending', option: 'name', order: 'desc' },
    { label: 'Members Ascending', option: 'members', order: 'asc' },
    { label: 'Members Descending', option: 'members', order: 'desc' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white px-4 pt-6">
      <Text className={`text-3xl font-bold text-center ${Platform.OS === "web" ? "mt-6" : ""}`}>Communities</Text>
      <View className={`${Platform.OS === "web" ? "p-10 h-full" : ""}`}>
        {/* Search and Create Community Button */}
        <View className="flex-row items-center mt-4">
          <TextInput
            className="flex-1 p-3 bg-gray-100 rounded-full text-sm mr-2"
            placeholder="Search for a community..."
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={setSearchText}
          />

          <TouchableOpacity
            className="bg-black p-3 rounded-full"
            onPress={() => setShowSortDropdown((prev) => !prev)}
          >
            <Text className="text-sm font-semibold text-white">
              Sort: {`${sortOption === 'name' ? 'Name' : 'Members'} ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="relative mt-4">
          <TouchableOpacity
            className="bg-blue-500 p-3 rounded-full"
            onPress={() => router.push('/community/create-community')}
          >
            <Text className="text-white font-semibold">+ Create</Text>
          </TouchableOpacity>

          {/* Sort Dropdown */}
          {showSortDropdown && (
            <View
              className="absolute right-0 bg-white border border-gray-200 rounded-lg  w-48 shadow-lg -mt-2" style={{ zIndex: 999 }}
            >
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.label}
                  className="p-2"
                  onPress={() => {
                    setSortOption(option.option as SortOption);
                    setSortOrder(option.order as SortOrder);
                    setShowSortDropdown(false);
                  }}
                >
                  <Text className="text-sm text-gray-700">{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#3B82F6" className="mt-6 z-0" />
        ) : communities.length === 0 ? (
          <Text className="text-center text-gray-500 mt-5 z-0">No communities found.</Text>
        ) : (
          <FlatList
            className={`mt-4 z-0 ${Platform.OS === "web" ? "pb-6" : ""}`}
            data={sortedCommunities}
            style={{ zIndex: -99 }}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="bg-gray-100 p-4 mb-3 rounded-lg"
                onPress={() => router.push(`/community/${item._id}`)}
              >
                <Text className="text-lg font-semibold text-gray-700">{item.name}</Text>
                <Text className="text-sm text-gray-500">{item.members.length || 0} members</Text>
                <Text className="text-sm text-gray-600 mt-2">{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Community;
