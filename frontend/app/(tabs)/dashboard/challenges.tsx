import { View, Dimensions, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { TabView, TabBar } from 'react-native-tab-view';
import ChallengeList from '@/components/ChallengeList';
import useChallenge from '@/hooks/useChallenge';
import useAuth from '@/hooks/useAuth';

const AllChallengesTab = ({ challenges = [], loading }: { challenges: any[]; loading: boolean }) => (
  <View>
    {loading ? <ActivityIndicator size="large" className='mt-20' color="#3B82F6" /> : <ChallengeList challenges={challenges || []} />}
  </View>
);

const OwnChallengesTab = ({ challenges = [], loading }: { challenges: any[]; loading: boolean }) => (
  <View>
    {loading ? <ActivityIndicator size="large" className='mt-20' color="#3B82F6" /> : <ChallengeList challenges={challenges || []} />}
  </View>
);

const Challenges: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'all', title: 'All' },
    { key: 'own', title: 'Own' },
  ]);
  const { user } = useAuth();
  const userId = user?._id;

  const { fetchUserChallenges, fetchChallenges, challenges, userChallenges } = useChallenge();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChallenges = async () => {
      setLoading(true);
      await fetchUserChallenges(userId);
      await fetchChallenges();
      setLoading(false);
    };
    loadChallenges();
  }, []);

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case 'all':
        return <AllChallengesTab challenges={challenges ?? []} loading={loading} />;
      case 'own':
        return <OwnChallengesTab challenges={userChallenges ?? []} loading={loading} />;
      default:
        return null;
    }
  };

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