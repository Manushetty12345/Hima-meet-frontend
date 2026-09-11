import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home as HomeIcon, MessageCircle, Wallet, UserCircle2 } from 'lucide-react-native';

import CreatorHomeScreen from '../modules/creator/screens/CreatorHomeScreen';
import CreatorMessagesScreen from '../modules/creator/screens/CreatorMessagesScreen';
import CreatorEarningsScreen from '../modules/creator/screens/CreatorEarningsScreen';
import CreatorProfileScreen from '../modules/creator/screens/CreatorProfileScreen';

type CreatorBottomTabParamList = {
  CreatorHome: undefined;
  CreatorMessages: undefined;
  CreatorEarnings: undefined;
  CreatorProfile: undefined;
};

const Tab = createBottomTabNavigator<CreatorBottomTabParamList>();

const GOLD_DEEP = '#D4AF37';
const TEXT_MUTED = '#8B7F98';
const IVORY_LINE = '#EBDFC4';

const CreatorBottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: GOLD_DEEP,
        tabBarInactiveTintColor: TEXT_MUTED,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          paddingTop: 14,
          paddingBottom: Platform.OS === 'ios' ? 36 : 24,
          height: Platform.OS === 'ios' ? 100 : 90,
          borderTopWidth: 1,
          borderTopColor: IVORY_LINE,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIcon: ({ color }) => {
          if (route.name === 'CreatorHome') return <HomeIcon size={28} color={color} />;
          if (route.name === 'CreatorMessages') return <MessageCircle size={28} color={color} />;
          if (route.name === 'CreatorEarnings') return <Wallet size={28} color={color} />;
          if (route.name === 'CreatorProfile') return <UserCircle2 size={28} color={color} />;
          return null;
        },
      })}
    >
      <Tab.Screen name="CreatorHome" component={CreatorHomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="CreatorMessages" component={CreatorMessagesScreen} options={{ tabBarLabel: 'Messages' }} />
      <Tab.Screen name="CreatorEarnings" component={CreatorEarningsScreen} options={{ tabBarLabel: 'Earnings' }} />
      <Tab.Screen name="CreatorProfile" component={CreatorProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
};

export default CreatorBottomTabNavigator;
