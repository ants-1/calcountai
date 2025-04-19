import { ScrollView, Text } from "react-native";

const FeedTab = ({ community }: { community: any }) => (
  <ScrollView className="flex-1 p-6">
    <Text className="text-lg text-gray-700">{community.description}</Text>
  </ScrollView>
);

export default FeedTab;