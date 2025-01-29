import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Community: React.FC = () => {
  
  // Sample community data 
  const [communities] = useState([
    { id: 1, name: 'Fitness Enthusiasts', members: 1200, description: 'A community for fitness lovers to share tips, workouts, and motivation.' },
    { id: 2, name: 'Healthy Eating', members: 900, description: 'Discover healthy recipes and nutrition advice for a balanced lifestyle.' },
    { id: 3, name: 'Yoga and Wellness', members: 450, description: 'Join us for yoga tips, mindfulness practices, and wellness inspiration.' },
    { id: 4, name: 'Marathon Runners', members: 700, description: 'Connect with marathon enthusiasts and share running plans and experiences.' },
    { id: 5, name: 'Weight Loss Warriors', members: 800, description: 'Support and motivate each other on your weight loss journey.' },
    { id: 6, name: 'Cycling Club', members: 600, description: 'A group for cycling enthusiasts to share routes, gear tips, and adventures.' },
  ]);

  const [searchText, setSearchText] = useState('');
  const [sortOption, setSortOption] = useState<'name' | 'members'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

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
      return sortOrder === 'asc' ? a.members - b.members : b.members - a.members;
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
      <Text className="text-md text-center text-gray-600 mt-8">
        Find and join communities that match your interests and goals!
      </Text>

      {/* Search and Sort Controls */}
      <View className="flex-row items-center mt-4">
        {/* Search Bar */}
        <TextInput
          className="flex-1 p-3 bg-gray-100 rounded-lg text-sm"
          placeholder="Search for a community..."
          value={searchText}
          onChangeText={setSearchText}
        />

        {/* Sort Dropdown */}
        <View className="relative ml-3">
          <TouchableOpacity
            className="bg-gray-200 p-3 rounded-lg"
            onPress={() => setShowSortDropdown((prev) => !prev)}
          >
            <Text className="text-sm font-semibold text-gray-700">
              Sort: {`${sortOption === 'name' ? 'Name' : 'Members'} ${
                sortOrder === 'asc' ? 'Ascending' : 'Descending'
              }`}
            </Text>
          </TouchableOpacity>

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
      </View>

      {/* Communities List */}
      <FlatList
        className="mt-4"
        data={sortedCommunities}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity className="bg-gray-100 p-4 mb-3 rounded-lg">
            <Text className="text-lg font-semibold text-gray-700">{item.name}</Text>
            <Text className="text-sm text-gray-500">{item.members} members</Text>
            <Text className="text-sm text-gray-600 mt-2">{item.description}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="mt-6">
            <Text className="text-center text-gray-500">No communities found.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Community;
