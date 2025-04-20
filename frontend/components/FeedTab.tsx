import { ScrollView, Text, View } from "react-native";
import { formatTimeAndDate } from "@/utils/dateFormatter";

const FeedTab = ({ community }: { community: any }) => (
  <ScrollView className="p-4">
    {community.feed && community.feed.length > 0 ? (
      community.feed.map((feedItem: any) => (
        <View key={feedItem._id} className="mb-4 bg-gray-100 p-4 rounded-xl">
          <Text className="font-semibold text-gray-800">{feedItem.username}</Text>
          <Text className="text-gray-600 mt-1">{feedItem.content}</Text>
          <Text className="text-sm text-gray-500 mt-2">
            Created At: {" "}
            {formatTimeAndDate(feedItem.createdAt)}
          </Text>
        </View>
      ))
    ) : (
      <Text className="text-center text-sm text-gray-500 mt-4">
        No feed available.
      </Text>
    )}

  </ScrollView>
);

export default FeedTab;
