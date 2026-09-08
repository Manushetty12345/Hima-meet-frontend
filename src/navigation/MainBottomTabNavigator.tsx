import React from 'react';
import { Platform, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home as HomeIcon, Clock, Users, UserCircle2 } from 'lucide-react-native';

import HomeScreen from '../modules/home/screens/HomeScreen';
import RecentCallsScreen from '../modules/recent/screens/RecentCallsScreen';
import FriendsScreen from '../modules/friends/screens/FriendsScreen';
import ProfileScreen from '../modules/profile/screens/ProfileScreen';

type BottomTabParamList = {
  Home: undefined;
  Recent: undefined;
  Friends: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const GOLD_DEEP = '#D4AF37';
const TEXT_MUTED = '#8B7F98';
const IVORY_LINE = '#EBDFC4';

const MainBottomTabNavigator = () => {
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
          if (route.name === 'Home') return <HomeIcon size={28} color={color} />;
          if (route.name === 'Recent') return <Clock size={28} color={color} />;
          if (route.name === 'Friends') return <Users size={28} color={color} />;
          if (route.name === 'Profile') return <UserCircle2 size={28} color={color} />;
          return null;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Recent" component={RecentCallsScreen} />
      <Tab.Screen name="Friends" component={FriendsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainBottomTabNavigator;