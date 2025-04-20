import { ScrollView, View, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const PeopleTab = ({ members, creatorId }: { members: any[]; creatorId: string }) => (
  <ScrollView className="p-4">
    {members.length > 0 ? (
      members.map((member) => (
        <View key={member._id} className="flex flex-row justify-between items-center w-full mb-4 bg-gray-100 p-4 rounded-lg">
          <View className="flex flex-row gap-2">
            <Icon name="user-circle" size={25} color="#4B5563" />
            <Text className="text-lg text-gray-800">
              {member.username}
            </Text>
          </View>
          {member._id === creatorId && <Text className="text-lg font-semibold mb-1">Creator</Text>}
        </View>
      ))
    ) : (
      <Text className="text-lg text-gray-700">No members available yet.</Text>
    )}
  </ScrollView>
);

export default PeopleTab;