import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { ChallengeType } from '@/types/ChallengeType';
import Icon from 'react-native-vector-icons/FontAwesome';
import useChallenge from '@/hooks/useChallenge';
import useAuth from '@/hooks/useAuth';

interface ChallengeCardProps {
  challenge: ChallengeType;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
  const { joinChallenge, leaveChallenge, shareChallenge } = useChallenge();
  const { user } = useAuth();
  const userId = user?._id;

  const isParticipant = challenge.participants?.some((p) => p.user === userId);
  const userProgress = challenge.participants?.find((p) => p.user === userId)?.progress ?? 0;
  const level = Number(challenge.level);
  const progressPercentage = level > 0 ? Math.min((userProgress / level) * 100, 100) : 0;

  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef<View | null>(null);

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
    if (action === 'share') shareChallenge();
  };

  return (
    <View className='mt-5 p-4 bg-gray-100 rounded-xl relative'>
      <View className='flex flex-row justify-between items-center w-full mb-2'>
        <Text className='font-bold'>{challenge.name}</Text>
        <TouchableOpacity onPress={() => setMenuVisible(prev => !prev)}>
          <Icon name="ellipsis-v" size={22} color="#4B5563" />
        </TouchableOpacity>
      </View>

      <Text className='text-gray-700'>{challenge.description}</Text>

      <View className='w-full bg-gray-300 h-2 mt-2 mb-2 rounded-xl'>
        <View
          className='bg-green-500 h-2 rounded-xl'
          style={{ width: `${progressPercentage}%` }}
        />
      </View>

      <View className='flex flex-row justify-between items-center w-full mb-2'>
        <Text className='text-sm text-gray-600'>Progress: {userProgress}/{challenge.level}</Text>
        <Text>{challenge.challengeType}</Text>
      </View>

      {/* Dropdown Menu */}
      {menuVisible && (
        <View
          ref={menuRef}
          className='absolute right-0 mt-2 z-10 bg-white border border-gray-200 rounded-lg shadow-lg w-48 p-2'
          style={{ top: 40 }}
        >
          {!isParticipant && (
            <TouchableOpacity
              className='py-2 px-3 flex-row items-center'
              onPress={() => handleOptionPress('join')}
            >
              <Icon name="plus" size={16} color="#3B82F6" />
              <Text className='ml-2 text-blue-600'>Join Challenge</Text>
            </TouchableOpacity>
          )}
          {isParticipant && (
            <TouchableOpacity
              className='py-2 px-3 flex-row items-center'
              onPress={() => handleOptionPress('leave')}
            >
              <Icon name="sign-out" size={16} color="#EF4444" />
              <Text className='ml-2 text-red-500'>Leave Challenge</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className='py-2 px-3 flex-row items-center'
            onPress={() => handleOptionPress('share')}
          >
            <Icon name="share-alt" size={16} color="#4B5563" />
            <Text className='ml-2 text-gray-700'>Share Challenge</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ChallengeCard;
