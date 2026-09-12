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
import CreatorBottomTabNavigator from './CreatorBottomTabNavigator';
import CreatorEditProfileScreen from '../modules/creator/screens/CreatorEditProfileScreen';
import CreatorCallRatesScreen from '../modules/creator/screens/CreatorCallRatesScreen';
import WithdrawalRequestScreen from '../modules/creator/screens/WithdrawalRequestScreen';
import EarningsDetailScreen from '../modules/creator/screens/EarningsDetailScreen';
import BankDetailsScreen from '../modules/creator/screens/BankDetailsScreen';
import WithdrawalHistoryScreen from '../modules/creator/screens/WithdrawalHistoryScreen';
import EditProfileScreen from '../modules/profile/screens/EditProfileScreen';
import MainBottomTabNavigator from './MainBottomTabNavigator';
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
import CreatorFullProfileScreen from '../modules/home/screens/CreatorFullProfileScreen';
import AudioCallScreen from '../modules/call/screens/AudioCallScreen';
import CreatorAudioCallScreen from '../modules/call/screens/CreatorAudioCallScreen';
import CallFeedbackScreen from '../modules/call/screens/CallFeedbackScreen';
import VideoCallScreen from '../modules/call/screens/VideoCallScreen';
import CreatorVideoCallScreen from '../modules/call/screens/CreatorVideoCallScreen';
import ChatScreen from '../modules/chat/screens/ChatScreen';

import HelpSupportScreen from '../modules/support/screens/HelpSupportScreen';
import MyTicketsScreen from '../modules/support/screens/MyTicketsScreen';
import RaiseTicketScreen from '../modules/support/screens/RaiseTicketScreen';

export type AuthStackParamList = {
  SplashScreen: undefined;
  LoginScreen: undefined;
  VerifyOtpScreen: { phoneNumber: string; generatedOtp: string };
  GenderSelect: undefined;
  ProfileReview: { gender?: string, avatar_id?: number, language_id?: number } | undefined;
  SelectLanguage: { gender?: string, avatar_id?: number, age?: string, selectedInterests?: string[], bio?: string } | undefined;
  NotificationSetup: { gender?: string, avatar_id?: number, language_id?: number } | undefined;
  CreateProfileSetup: { gender?: string, avatar_id?: number } | undefined;
  VoiceVerification: { gender?: string, avatar_id?: number, language_id?: number } | undefined;
  MainTabs: undefined;
  Wallet: { paymentResult?: { success: boolean; coinsAdded: number; newBalance: number; transactionId: string } } | undefined;
  EditProfile: undefined;
  Settings: undefined;
  Terms: undefined;
  RefundPolicy: undefined;
  CommunityGuidelines: undefined;
  MyWarnings: undefined;
  ManageNotifications: undefined;
  CreatorDashboard: undefined;
  CreatorEditProfile: undefined;
  CreatorCallRates: undefined;
  WithdrawalRequest: undefined;
  EarningsDetail: undefined;
  BankDetails: undefined;
  WithdrawalHistory: undefined;
  HelpSupport: undefined;
  MyTickets: { newTicket?: { id: string, title: string, status: 'ACTIVE' | 'RESOLVED', date: string } } | undefined;
  RaiseTicket: undefined;
  AccountPrivacy: undefined;
  PrivacyPolicy: undefined;
  DeleteAccount: undefined;
  Transactions: undefined;
  Refer: undefined;
  PhonePeWebView: { paymentUrl: string; transactionId: string; coins: number };
  CreatorFullProfile: { creator: any };
  AudioCallScreen: { callerName?: string; calleeName?: string; callerAvatar?: string; calleeAvatar?: string; channelId?: string; callId?: string | number; targetId?: string | number; agoraToken?: string; };
  CreatorAudioCallScreen: { callerName?: string; callerAvatar?: string; callId?: string | number; rate?: string | number; agoraToken?: string; };
  CallFeedbackScreen: { creatorName?: string; creatorId?: string | number; callId?: string | number };
  VideoCallScreen: { callerName?: string; calleeName?: string; callerAvatar?: string; calleeAvatar?: string; channelId?: string; callId?: string; targetId?: string; agoraToken?: string; };
  CreatorVideoCallScreen: { callerName?: string; callerAvatar?: string; callId?: string | number; rate?: string | number; agoraToken?: string; };
  ChatScreen: { targetId: string | number; targetName: string; targetAvatar: string };
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
      <Stack.Screen name="MainTabs" component={MainBottomTabNavigator} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="RefundPolicy" component={RefundPolicyScreen} />
      <Stack.Screen name="CommunityGuidelines" component={CommunityGuidelinesScreen} />
      <Stack.Screen name="MyWarnings" component={MyWarningsScreen} />
      <Stack.Screen name="ManageNotifications" component={ManageNotificationsScreen} />
      <Stack.Screen name="CreatorDashboard" component={CreatorBottomTabNavigator} />
      <Stack.Screen name="CreatorEditProfile" component={CreatorEditProfileScreen} />
      <Stack.Screen name="CreatorCallRates" component={CreatorCallRatesScreen} />
      <Stack.Screen name="WithdrawalRequest" component={WithdrawalRequestScreen} />
      <Stack.Screen name="EarningsDetail" component={EarningsDetailScreen} />
      <Stack.Screen name="BankDetails" component={BankDetailsScreen} />
      <Stack.Screen name="WithdrawalHistory" component={WithdrawalHistoryScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="MyTickets" component={MyTicketsScreen} />
      <Stack.Screen name="RaiseTicket" component={RaiseTicketScreen} />
      <Stack.Screen name="AccountPrivacy" component={AccountPrivacyScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
      <Stack.Screen name="Transactions" component={TransactionsScreen} />
      <Stack.Screen name="Refer" component={ReferralScreen} />
      <Stack.Screen name="PhonePeWebView" component={PhonePeWebViewScreen} options={{ presentation: 'fullScreenModal' }} />
      <Stack.Screen name="CreatorFullProfile" component={CreatorFullProfileScreen} />
      <Stack.Screen name="AudioCallScreen" component={AudioCallScreen} />
      <Stack.Screen name="CreatorAudioCallScreen" component={CreatorAudioCallScreen} />
      <Stack.Screen name="CallFeedbackScreen" component={CallFeedbackScreen} />
      <Stack.Screen name="VideoCallScreen" component={VideoCallScreen} />
      <Stack.Screen name="CreatorVideoCallScreen" component={CreatorVideoCallScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
