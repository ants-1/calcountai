import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import useChallenge from '@/hooks/useChallenge';
import useAuth from '@/hooks/useAuth';
import CommunityModal from './CommunityModal';
import { ChallengeType } from '@/types/ChallengeType';
import useCommunity from '@/hooks/useCommunity';

interface ChallengeCardProps {
  challenge: ChallengeType;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
  const { joinChallenge, leaveChallenge, shareChallenge, } = useChallenge();
  const { fetchUserCommunities, userCommunities } = useCommunity();
  const { user } = useAuth();
  const userId = user?._id;

  const participants = challenge.participants ?? [];
  const isParticipant = participants.some((p) => p.user === userId);
  const userProgress = participants.find((p) => p.user === userId)?.progress ?? 0;
  const level = Number(challenge.level);
  const progressPercentage = Math.min((userProgress / level) * 100, 100);

  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const menuRef = useRef<View | null>(null);

  // Fetch user's communities when the component mounts
  useEffect(() => {
    fetchUserCommunities(userId);
  }, [userId]);

  // Hide dropdown when clicking outside (web support)
  useEffect(() => {
    if (Platform.OS === 'web' && menuVisible) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          menuRef.current &&
          !(menuRef.current as any).contains(event.target)
        ) {
          setMenuVisible(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [menuVisible]);

  const handleOptionPress = (action: 'join' | 'leave' | 'share') => {
    setMenuVisible(false);
    if (action === 'join') joinChallenge(userId, challenge._id);
    if (action === 'leave') leaveChallenge(userId, challenge._id);
    if (action === 'share') setModalVisible(true);
  };

  // Handle community selection
  const handleCommunitySelect = async (communityId: string) => {
    await shareChallenge(userId, communityId, challenge._id);
    setModalVisible(false);
  };

  return (
    <View className="mt-5 p-4 bg-gray-100 rounded-xl relative">
      <View className="flex flex-row justify-between items-center w-full mb-2">
        <Text className="font-bold">{challenge.name}</Text>
        <TouchableOpacity onPress={() => setMenuVisible((prev) => !prev)}>
          <Icon name="ellipsis-v" size={22} color="#4B5563" />
        </TouchableOpacity>
      </View>

      <Text className="text-gray-700">{challenge.description}</Text>

      <View className="w-full bg-gray-300 h-2 mt-2 mb-2 rounded-xl">
        <View
          className="bg-green-500 h-2 rounded-xl"
          style={{ width: `${progressPercentage}%`, backgroundColor: '#34D399' }}
        />
      </View>

      <View className="flex flex-row justify-between items-center w-full mb-2">
        <Text className="text-sm text-gray-600">
          Progress: {userProgress}/{challenge.level}
        </Text>
        <Text>{challenge.challengeType}</Text>
      </View>

      {/* Dropdown Menu */}
      {menuVisible && (
        <View
          ref={menuRef}
          className="absolute right-0 mt-2 z-10 bg-white border border-gray-200 rounded-lg shadow-lg w-48 p-2"
          style={{ top: 40 }}
        >
          {!isParticipant && (
            <TouchableOpacity
              className="py-2 px-3 flex-row items-center"
              onPress={() => handleOptionPress('join')}
            >
              <Icon name="plus" size={16} color="#3B82F6" />
              <Text className="ml-2 text-blue-600">Join Challenge</Text>
            </TouchableOpacity>
          )}
          {isParticipant && (
            <TouchableOpacity
              className="py-2 px-3 flex-row items-center"
              onPress={() => handleOptionPress('leave')}
            >
              <Icon name="sign-out" size={16} color="#EF4444" />
              <Text className="ml-2 text-red-500">Leave Challenge</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className="py-2 px-3 flex-row items-center"
            onPress={() => handleOptionPress('share')}
          >
            <Icon name="share-alt" size={16} color="#4B5563" />
            <Text className="ml-2 text-gray-700">Share Challenge</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Community Modal */}
      <CommunityModal
        visible={modalVisible} // Make sure this state is properly controlled
        communities={userCommunities} // Pass the entire community object array
        onClose={() => setModalVisible(false)} // Closing the modal
        onSelect={handleCommunitySelect} // Handle community selection
      />

    </View>
  );
};

export default ChallengeCard;
