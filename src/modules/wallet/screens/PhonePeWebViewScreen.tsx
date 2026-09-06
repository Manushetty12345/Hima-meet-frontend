import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { ArrowLeft, X } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';
import apiClient from '../../../api/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;
type Props = NativeStackScreenProps<AuthStackParamList, 'PhonePeWebView'>;

// These URLs signal payment is done
const SUCCESS_INDICATORS = [
  '/api/wallet/recharge/redirect',
  'himaapp://payment/',
  'payment/success',
  'payment/failure',
  'payment/redirect',
];

const PhonePeWebViewScreen: React.FC<Props> = ({ navigation, route }) => {
  const { paymentUrl, transactionId, coins } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const webViewRef = useRef<any>(null);
  const hasRedirected = useRef(false);

  // Save pending transaction to AsyncStorage on mount
  // So if user kills the app mid-payment, we can recover on next launch
  useEffect(() => {
    AsyncStorage.setItem(
      'hima_pending_payment',
      JSON.stringify({ transactionId, coins })
    );
    return () => {
      // If user navigates back without completing, clean up
      // (verifyAndGoBack also cleans up on success)
    };
  }, []);

  const verifyAndGoBack = async () => {
    if (hasRedirected.current) return;
    hasRedirected.current = true;

    setIsVerifying(true);
    try {
      const res = await apiClient.post('/api/wallet/recharge/verify', {
        merchant_transaction_id: transactionId,
      });
      const data = res.data?.data;
      const isSuccess = data?.success === true;
      const coinsAdded = data?.coins_added ?? coins ?? 0;
      const newBalance = data?.new_balance ?? 0;

      // Clear pending transaction — payment handled
      await AsyncStorage.removeItem('hima_pending_payment');

      // Navigate back to Wallet with result params
      navigation.replace('Wallet', {
        paymentResult: {
          success: isSuccess,
          coinsAdded,
          newBalance,
          transactionId,
        },
      } as any);
    } catch (err) {
      console.error('Verify payment error:', err);
      await AsyncStorage.removeItem('hima_pending_payment');
      navigation.replace('Wallet', {
        paymentResult: {
          success: false,
          coinsAdded: 0,
          newBalance: 0,
          transactionId,
        },
      } as any);
    }
  };

  const handleNavigationChange = (navState: WebViewNavigation) => {
    const url = navState.url || '';
    const urlLower = url.toLowerCase();

    if (SUCCESS_INDICATORS.some(indicator => urlLower.includes(indicator.toLowerCase()))) {
      verifyAndGoBack();
    }
  };

  const handleClose = () => {
    Alert.alert(
      'Cancel Payment?',
      'Are you sure you want to cancel this payment?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => navigation.replace('Wallet', {} as any),
        },
      ]
    );
  };

  if (isVerifying) {
    return (
      <View style={styles.verifyingContainer}>
        <ActivityIndicator size="large" color="#EC1372" />
        <Text style={styles.verifyingTitle}>Verifying Payment...</Text>
        <Text style={styles.verifyingSubText}>Please wait, do not close the app</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" {...{ backgroundColor: '#FFFFFF' } as any} />
      <View style={styles.statusBarSpacer} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={20} color="#EC1372" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PhonePe Payment</Text>
        <TouchableOpacity
          style={styles.closeButton}
          activeOpacity={0.8}
          onPress={handleClose}
        >
          <X size={20} color="#8A7A9C" />
        </TouchableOpacity>
      </View>

      {/* Loading indicator */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#5A2D8F" />
          <Text style={styles.loadingText}>Opening PhonePe...</Text>
        </View>
      )}

      <WebView
        ref={webViewRef}
        source={{ uri: paymentUrl }}
        onNavigationStateChange={handleNavigationChange}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        style={styles.webView}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        scalesPageToFit
        mixedContentMode="always"
        thirdPartyCookiesEnabled
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  statusBarSpacer: {
    height: STATUSBAR_HEIGHT,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBF5',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0EBF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#1B0E22',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0EBF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  webView: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: STATUSBAR_HEIGHT + 68,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#8A7A9C',
    fontWeight: '500',
  },
  verifyingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  verifyingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B0E22',
  },
  verifyingSubText: {
    fontSize: 13,
    color: '#8A7A9C',
  },
});

export default PhonePeWebViewScreen;
