import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';

type Header = {
  title: string;
  icon: string;
  iconSize: number;
  titleSize: string;
  link?: string;
};

const Header: React.FC<Header> = ({ title, icon, iconSize, titleSize, link }) => {
  const router = useRouter();

  const handlePress = () => {
    if (link) {
      router.push(link as any); 
    } else {
      router.back(); 
    }
  };

  return (
    <View className="flex-row items-center justify-between px-6 py-4">
      <TouchableOpacity onPress={handlePress}>
        <Icon name={icon} size={iconSize} color="#4B5563" />
      </TouchableOpacity>
      <Text className={`${titleSize} font-bold mr-3`}>{title}</Text>
      <View></View>
    </View>
  );
};

export default Header;
