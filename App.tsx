import React, { useEffect, useRef } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { StatusBar, useColorScheme, Linking } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import AuthNavigator from './src/navigation/AuthNavigator';
import apiClient from './src/api/apiClient';
import { CallOverlayProvider } from './src/context/CallOverlayContext';
import GlobalCallOverlay from './src/components/GlobalCallOverlay';

// Deep link config — himaapp://payment/* will open the app
const linking = {
  prefixes: ['himaapp://'],
  config: {
    screens: {
      Wallet: 'wallet-callback',
    },
  },
};

const navigationRef = React.createRef<NavigationContainerRef<any>>();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  // Handle deep link when app is already open (foreground)
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const url = event.url || '';
      if (url.includes('himaapp://payment/') || url.includes('himaapp://wallet')) {
        await handlePaymentDeepLink();
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Handle deep link when app was killed and opened via deep link
    Linking.getInitialURL().then(url => {
      if (url && (url.includes('himaapp://payment/') || url.includes('himaapp://wallet'))) {
        handlePaymentDeepLink();
      }
    });

    return () => subscription.remove();
  }, []);

  // ── FCM: Register token + handle notification taps ──
  useEffect(() => {
    let unsubscribeTokenRefresh: (() => void) | null = null;
    let unsubscribeBackground: (() => void) | null = null;

    const setupFcm = async () => {
      try {
        const fcmInstance = messaging();
        if (!fcmInstance) return;

        // Request permission
        const authStatus = await fcmInstance.requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) return;

        // Register FCM token
        const token = await fcmInstance.getToken();
        if (token) {
          await apiClient.post('/api/user/fcm-token', { fcm_token: token });
          console.log('[FCM] Token registered:', token);
        }

        // Refresh token if it changes
        if (typeof fcmInstance.onTokenRefresh === 'function') {
          unsubscribeTokenRefresh = fcmInstance.onTokenRefresh(async (newToken) => {
            try {
              await apiClient.post('/api/user/fcm-token', { fcm_token: newToken });
            } catch (err) {
              console.log('[FCM] Token refresh error:', err);
            }
          });
        }

        // When app was KILLED and user taps the notification
        if (typeof fcmInstance.getInitialNotification === 'function') {
          const remoteMessage = await fcmInstance.getInitialNotification();
          if (remoteMessage?.data?.type === 'incoming_call') {
            setTimeout(() => {
              if (navigationRef.isReady()) {
                navigationRef.navigate('CreatorHome' as never);
              }
            }, 1000);
          }
        }

        // When app is in BACKGROUND and user taps the notification
        if (typeof fcmInstance.onNotificationOpenedApp === 'function') {
          unsubscribeBackground = fcmInstance.onNotificationOpenedApp((remoteMessage) => {
            if (remoteMessage?.data?.type === 'incoming_call') {
              if (navigationRef.isReady()) {
                navigationRef.navigate('CreatorHome' as never);
              }
            }
          });
        }
      } catch (err) {
        console.log('[FCM] Setup error:', err);
      }
    };

    setupFcm();

    return () => {
      if (unsubscribeTokenRefresh) unsubscribeTokenRefresh();
      if (unsubscribeBackground) unsubscribeBackground();
    };
  }, []);

  const handleNavigateToCall = (call: any) => {
    if (navigationRef.isReady()) {
      const screenName = call.call_type === 'video' ? 'VideoCallScreen' : 'AudioCallScreen';
      navigationRef.navigate(screenName as never, {
        callId: call.request_id,
        targetId: call.caller_id,
        calleeName: call.name,
        calleeAvatar: call.avatar_url,
      } as never);
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <CallOverlayProvider onNavigateToCall={handleNavigateToCall}>
        <NavigationContainer ref={navigationRef} linking={linking}>
          <AuthNavigator />
          <GlobalCallOverlay />
        </NavigationContainer>
      </CallOverlayProvider>
    </SafeAreaProvider>
  );
}

/**
 * Called when app is opened via deep link (himaapp://payment/...) from PhonePe external browser.
 * Reads pending transaction from AsyncStorage → calls verify API → navigates to Wallet with result.
 */
async function handlePaymentDeepLink() {
  try {
    const raw = await AsyncStorage.getItem('hima_pending_payment');
    if (!raw) return;

    const { transactionId, coins } = JSON.parse(raw);
    if (!transactionId) return;

    // Clear pending immediately
    await AsyncStorage.removeItem('hima_pending_payment');

    const res = await apiClient.post('/api/wallet/recharge/verify', {
      merchant_transaction_id: transactionId,
    });
    const data = res.data?.data;
    const isSuccess = data?.success === true;

    // Navigate to Wallet with result
    navigationRef.current?.reset({
      index: 1,
      routes: [
        { name: 'MainTabs' },
        {
          name: 'Wallet',
          params: {
            paymentResult: {
              success: isSuccess,
              coinsAdded: data?.coins_added ?? coins ?? 0,
              newBalance: data?.new_balance ?? 0,
              transactionId,
            },
          },
        },
      ],
    });
  } catch (err: any) {
    if (err.response?.status !== 404) {
      console.error('Deep link payment verify error:', err.message);
    }
    // Navigate to Wallet anyway so user can see their balance
    navigationRef.current?.reset({
      index: 1,
      routes: [{ name: 'MainTabs' }, { name: 'Wallet' }],
    });
  }
}

export default App;
