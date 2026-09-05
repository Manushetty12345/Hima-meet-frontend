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
import SettingsScreen from '../modules/profile/screens/SettingsScreen';
import TermsScreen from '../modules/profile/screens/TermsScreen';
import RefundPolicyScreen from '../modules/profile/screens/RefundPolicyScreen';
import CommunityGuidelinesScreen from '../modules/profile/screens/CommunityGuidelinesScreen';
import MyWarningsScreen from '../modules/profile/screens/MyWarningsScreen';
import ManageNotificationsScreen from '../modules/profile/screens/ManageNotificationsScreen';
import PrivacyPolicyScreen from '../modules/profile/screens/PrivacyPolicyScreen';
import AccountPrivacyScreen from '../modules/profile/screens/AccountPrivacyScreen';
import DeleteAccountScreen from '../modules/profile/screens/DeleteAccountScreen';
import TransactionsScreen from '../modules/profile/screens/TransactionsScreen';
import ReferralScreen from '../modules/profile/screens/ReferralScreen';
import PhonePeWebViewScreen from '../modules/wallet/screens/PhonePeWebViewScreen';
import PaymentResultScreen from '../modules/wallet/screens/PaymentResultScreen';

import HelpSupportScreen from '../modules/support/screens/HelpSupportScreen';
import MyTicketsScreen from '../modules/support/screens/MyTicketsScreen';
import RaiseTicketScreen from '../modules/support/screens/RaiseTicketScreen';

export type AuthStackParamList = {
  SplashScreen: undefined;
  LoginScreen: undefined;
  VerifyOtpScreen: { phoneNumber: string; generatedOtp: string };
  GenderSelect: undefined;
  ProfileReview: { gender?: string } | undefined;
  SelectLanguage: { gender?: string, avatar_id?: number } | undefined;
  NotificationSetup: { gender?: string, avatar_id?: number, language_id?: number } | undefined;
  CreateProfileSetup: undefined;
  VoiceVerification: { gender?: string } | undefined;
  Home: undefined;
  Wallet: undefined;
  Friends: undefined;
  Recent: undefined;
  Profile: undefined;
  Settings: undefined;
  Terms: undefined;
  RefundPolicy: undefined;
  CommunityGuidelines: undefined;
  MyWarnings: undefined;
  ManageNotifications: undefined;
  CreatorDashboard: undefined;
  HelpSupport: undefined;
  MyTickets: { newTicket?: { id: string, title: string, status: 'ACTIVE' | 'RESOLVED', date: string } } | undefined;
  RaiseTicket: undefined;
  AccountPrivacy: undefined;
  PrivacyPolicy: undefined;
  DeleteAccount: undefined;
  Transactions: undefined;
  Refer: undefined;
  PhonePeWebView: { paymentUrl: string; transactionId: string; coins: number };
  PaymentResult: { success: boolean; transactionId?: string; coins?: number };
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
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="RefundPolicy" component={RefundPolicyScreen} />
      <Stack.Screen name="CommunityGuidelines" component={CommunityGuidelinesScreen} />
      <Stack.Screen name="MyWarnings" component={MyWarningsScreen} />
      <Stack.Screen name="ManageNotifications" component={ManageNotificationsScreen} />
      <Stack.Screen name="CreatorDashboard" component={CreatorDashboardScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="MyTickets" component={MyTicketsScreen} />
      <Stack.Screen name="RaiseTicket" component={RaiseTicketScreen} />
      <Stack.Screen name="AccountPrivacy" component={AccountPrivacyScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
      <Stack.Screen name="Transactions" component={TransactionsScreen} />
      <Stack.Screen name="Refer" component={ReferralScreen} />
      <Stack.Screen name="PhonePeWebView" component={PhonePeWebViewScreen} options={{ presentation: 'fullScreenModal' }} />
      <Stack.Screen name="PaymentResult" component={PaymentResultScreen} options={{ presentation: 'fullScreenModal' }} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;




