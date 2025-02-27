import { View, Text, ScrollView, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import ChallengeList from '@/components/ChallengeList';

const dummyPersonalChallenges = {
  challenges: [
    {
      _id: '6793fa0e2850f2ce97e36efd',
      name: 'Healthy Eating Challenge',
      description: 'Eat at least 5 servings of fruits and vegetables every day for two weeks.',
      percentage: 0,
      participants: ['6793e83eb0eadb3a79941390'],
      completed: false,
      startDate: '2025-02-01T00:00:00.000Z',
      endDate: '2025-02-14T23:59:59.999Z',
      challengeType: 'Personal',
      __v: 1,
    },
    {
      _id: '6793fa0e2850f2ce97e36efc',
      name: 'Healthy Eating Challenge',
      description: 'Eat at least 5 servings of fruits and vegetables every day for two weeks.',
      percentage: 100,
      participants: ['6793e83eb0eadb3a79941390'],
      completed: true,
      startDate: '2025-02-01T00:00:00.000Z',
      endDate: '2025-02-14T23:59:59.999Z',
      challengeType: 'Personal',
      __v: 1,
    },
  ],
};

const dummyCommunityChallenges = {
  challenges: [
    {
      _id: '6793fa0e2850f2ce97e36efd',
      name: 'Healthy Eating Challenge',
      description: 'Eat at least 5 servings of fruits and vegetables every day for two weeks.',
      percentage: 0,
      participants: ['6793e83eb0eadb3a79941390'],
      completed: false,
      startDate: '2025-02-01T00:00:00.000Z',
      endDate: '2025-02-14T23:59:59.999Z',
      challengeType: 'Community',
      __v: 1,
    },
  ],
};

// Tab Screens
const PersonalChallengeScreen = () => (
  <View>
    <ChallengeList challenges={dummyPersonalChallenges.challenges} />
  </View>
);

const CommunityChallengeScreen = () => (
  <View>
    <ChallengeList challenges={dummyCommunityChallenges.challenges} />
  </View>
);

const renderScene = SceneMap({
  personal: PersonalChallengeScreen,
  community: CommunityChallengeScreen,
});

const Challenges: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'personal', title: 'Personal' },
    { key: 'community', title: 'Community' },
  ]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Challenges" icon="chevron-left" iconSize={25} titleSize="text-3xl" />

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get("window").width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "#3B82F6" }}
            style={{ backgroundColor: 'white' }}
            activeColor="#3B82F6"
            inactiveColor="gray"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Challenges;
