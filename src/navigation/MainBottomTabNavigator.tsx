import React from 'react';
import { Platform, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home as HomeIcon, Clock, Users, UserCircle2 } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

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
const PLUM_ROYAL = '#5B0E8B';
const LILAC_WHITE = '#FBF7FF';

const MainBottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: PLUM_ROYAL,
        tabBarInactiveTintColor: TEXT_MUTED,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: LILAC_WHITE,
          paddingTop: 16,
          paddingBottom: Platform.OS === 'ios' ? 38 : 28,
          height: Platform.OS === 'ios' ? 110 : 100,
          borderTopWidth: 0,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          position: 'absolute',
          elevation: 15,
          shadowColor: PLUM_ROYAL,
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
        },
        tabBarIcon: ({ focused, color }) => {
          let Icon = HomeIcon;
          if (route.name === 'Recent') Icon = Clock;
          if (route.name === 'Friends') Icon = Users;
          if (route.name === 'Profile') Icon = UserCircle2;

          return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <View style={{
                height: 48,
                width: 48,
                borderRadius: 24,
                backgroundColor: focused ? 'rgba(91, 14, 139, 0.12)' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: focused ? 1.5 : 0,
                borderColor: focused ? 'rgba(91, 14, 139, 0.3)' : 'transparent',
              }}>
                <Icon size={26} color={focused ? PLUM_ROYAL : TEXT_MUTED} />
              </View>
              {focused && (
                <View style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: GOLD_DEEP,
                  marginTop: 6,
                  position: 'absolute',
                  bottom: -12
                }} />
              )}
            </View>
          );
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