import { View, Image, ImageSourcePropType, Text } from 'react-native'
import { Tabs } from "expo-router";
import React from 'react';

interface TabIconProps {
  icon: ImageSourcePropType;
  color: string;
  name: string;
  focused: boolean;
}

const icons = {
  dashboard: require("../../assets/icons/home.png"),
  logs: require("../../assets/icons/add.png"),
  chatbot: require("../../assets/icons/message.png"),
  community: require("../../assets/icons/community.png"),
}

const TabIcon: React.FC<TabIconProps> = ({ icon, color, name, focused }) => {
  return (
    <View className="flex items-center justify-center gap-2 w-20 mt-6">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
        style={{ width: 24, height: 24 }}
      />
      <Text
        className={`${focused ? "font-semibold" : "font-normal"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabLayout: React.FC = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#3D3BF3",
          tabBarInactiveTintColor: "#A5BFCC",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 90,
          },
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.dashboard}
                color={color}
                name="Dashboard"
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name="logs"
          options={{
            title: "Logs",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.logs}
                color={color}
                name="Logs"
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name="chatbot"
          options={{
            title: "Chatbot",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.chatbot}
                color={color}
                name="Chatbot"
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name="community"
          options={{
            title: "Community",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.community}
                color={color}
                name="Community"
                focused={focused}
              />
            )
          }}
        />
      </Tabs>
    </>
  )
}

export default TabLayout