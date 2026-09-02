import React from 'react';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';

import SplashScreen from '../modules/auth/screens/SplashScreen';
import LoginScreen from '../modules/auth/screens/LoginScreen';
import VerifyOtpScreen from '../modules/auth/screens/VerifyOtpScreen';
import GenderSelectScreen from '../modules/onboarding/screens/GenderSelectScreen';
import SelectLanguageScreen from '../modules/onboarding/screens/SelectLanguageScreen';
import NotificationSetupScreen from '../modules/onboarding/screens/NotificationSetupScreen';
import CreateProfileSetupScreen from '../modules/onboarding/screens/CreatorReviewScreen';
import VoiceVerificationScreen from '../modules/onboarding/screens/VoiceVerificationScreen';
import ProfileReviewScreen from '../modules/onboarding/screens/ProfileReviewScreen';
import CreatorDashboardScreen from '../modules/creator/screens/CreatorDashboardScreen';
import ProfileScreen from '../modules/profile/screens/ProfileScreen';
import RecentCallsScreen from '../modules/recent/screens/RecentCallsScreen';
import FriendsScreen from '../modules/friends/screens/FriendsScreen';
import HomeScreen from '../modules/home/screens/HomeScreen';
import WalletScreen from '../modules/wallet/screens/WalletScreen';

export type AuthStackParamList = {
  SplashScreen: undefined;
  LoginScreen: undefined;
  VerifyOtpScreen: { phoneNumber: string; generatedOtp: string };
  GenderSelect: undefined;
  SelectLanguage: { gender?: string } | undefined;
  NotificationSetup: undefined;
  CreateProfileSetup: undefined;
  VoiceVerification: { gender?: string } | undefined;
  ProfileReview: undefined;
  Home: undefined;
  Wallet: undefined;
  Friends: undefined;
  Recent: undefined;
  Profile: undefined;
  CreatorDashboard: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="SplashScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="VerifyOtpScreen" component={VerifyOtpScreen} />
      <Stack.Screen name="GenderSelect" component={GenderSelectScreen} />
      <Stack.Screen name="SelectLanguage" component={SelectLanguageScreen} />
      <Stack.Screen name="NotificationSetup" component={NotificationSetupScreen} />
      <Stack.Screen name="CreateProfileSetup" component={CreateProfileSetupScreen} />
      <Stack.Screen name="VoiceVerification" component={VoiceVerificationScreen} />
      <Stack.Screen name="ProfileReview" component={ProfileReviewScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="Friends" component={FriendsScreen} />
      <Stack.Screen name="Recent" component={RecentCallsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="CreatorDashboard" component={CreatorDashboardScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;




