import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';

interface Community {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  members: string[];
  challenges: any[];
  feed: any[];
}

interface CommunityPopupProps {
  visible: boolean;
  communities: Community[];
  onClose: () => void;
  onSelect: (communityId: string) => void;
}

const CommunityPopup: React.FC<CommunityPopupProps> = ({
  visible,
  communities,
  onClose,
  onSelect,
}) => {
  if (!visible) return null;

  return (
    <View
      className="absolute top-20 left-0 right-0 mx-auto bg-white rounded-xl w-10/12 max-w-lg shadow-lg p-4"
      style={{ zIndex: 9999 }}
    >
      <Text className="text-lg font-bold mb-3 text-center">Select a Community to Share</Text>
      <FlatList
        data={communities}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="py-2 px-3 border-b border-gray-300"
            onPress={() => onSelect(item._id)}
          >
            <Text className="text-sm text-gray-700">{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
      />
      <TouchableOpacity
        className="mt-4 p-3 bg-blue-500 rounded-lg"
        onPress={onClose}
      >
        <Text className="text-white text-center">Close</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CommunityPopup;
