import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Constants from 'expo-constants';

const Community: React.FC = () => {
  const router = useRouter();
  const [communities, setCommunities] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<'name' | 'members'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Fetch communities from backend
  const fetchCommunities = async () => {
    try {
      const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;
      const API_URL = `${BACKEND_API_URL}/communities`;
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.communities || !Array.isArray(data.communities)) {
        console.error("API Response is not an array:", data);
        throw new Error("API did not return an array");
      }

      setCommunities(data.communities);
    } catch (error) {
      console.error("Error fetching communities:", error);
      setCommunities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  // Filtered and sorted communities
  const filteredCommunities = communities.filter((community) =>
    community.name.toLowerCase().includes(searchText.toLowerCase())
  );

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
      <Text className="text-3xl font-bold text-center">Communities</Text>

      {/* Search and Create Community Button */}
      <View className="flex-row items-center mt-4">
        <TextInput
          className="flex-1 p-3 bg-gray-100 rounded-lg text-sm mr-2"
          placeholder="Search for a community..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
        />

        <TouchableOpacity
          className="bg-gray-200 p-3 rounded-lg"
          onPress={() => setShowSortDropdown((prev) => !prev)}
        >
          <Text className="text-sm font-semibold text-gray-700">
            Sort: {`${sortOption === 'name' ? 'Name' : 'Members'} ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
          </Text>
        </TouchableOpacity>
      </View>


      <View className="relative mt-4">
        <TouchableOpacity
          className="bg-blue-500 p-3 rounded-lg"
          onPress={() => router.push('/community/create-community')}
        >
          <Text className="text-white font-semibold">+ Create</Text>
        </TouchableOpacity>

        {/* Sort Dropdown */}
        {showSortDropdown && (
          <View className="absolute bg-white border border-gray-300 rounded-lg mt-2 z-10 w-full">
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.label}
                className="p-2"
                onPress={() => {
                  setSortOption(option.option as 'name' | 'members');
                  setSortOrder(option.order as 'asc' | 'desc');
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
        <ActivityIndicator size="large" color="#3B82F6" className="mt-6" />
      ) : communities.length === 0 ? (
        <Text className="text-center text-gray-500 mt-5">No communities found.</Text>
      ) : (
        <FlatList
          className="mt-4"
          data={sortedCommunities}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="bg-gray-100 p-4 mb-3 rounded-lg"
              onPress={() => router.push(`/community/${item._id}`)}
            >
              <Text className="text-lg font-semibold text-gray-700">{item.name}</Text>
              <Text className="text-sm text-gray-500">{item.members?.length || 0} members</Text>
              <Text className="text-sm text-gray-600 mt-2">{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default Community;
