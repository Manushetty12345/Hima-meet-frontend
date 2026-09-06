import React, { useEffect, useRef } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { StatusBar, useColorScheme, Linking } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthNavigator from './src/navigation/AuthNavigator';
import apiClient from './src/api/apiClient';

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

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer ref={navigationRef} linking={linking}>
        <AuthNavigator />
      </NavigationContainer>
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
        { name: 'Home' },
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
      routes: [{ name: 'Home' }, { name: 'Wallet' }],
    });
  }
}

export default App;
