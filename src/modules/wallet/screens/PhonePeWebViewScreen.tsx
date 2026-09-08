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
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, X } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';
import apiClient from '../../../api/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;
type Props = NativeStackScreenProps<AuthStackParamList, 'PhonePeWebView'>;

// ---- Palette pulled from the Himameet mark ----
const PLUM_ROYAL = '#5B0E8B';
const GOLD_DEEP = '#D4AF37';
const IVORY = '#FBF6EC';
const IVORY_LINE = '#EBDFC4';
const TEXT_PLUM = '#2A1240';
const TEXT_MUTED = '#8B7F98';

// Light lavender header wash — matches every other screen in the app
const LILAC_WHITE = '#FBF7FF';
const LILAC_PALE = '#EFDFFB';

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
      navigation.navigate('Wallet', {
        paymentResult: {
          success: isSuccess,
          coinsAdded,
          newBalance,
          transactionId,
        },
      } as any);
    } catch (err: any) {
      if (err.response?.status !== 404) {
        console.error('Verify payment error:', err.message);
      }
      await AsyncStorage.removeItem('hima_pending_payment');
      navigation.navigate('Wallet', {
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
          onPress: () => navigation.navigate('Wallet', {} as any),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <LinearGradient
        colors={[LILAC_WHITE, LILAC_PALE]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.statusBarSpacer} />

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={20} color={PLUM_ROYAL} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>PhonePe Payment</Text>
          <TouchableOpacity
            style={styles.closeButton}
            activeOpacity={0.8}
            onPress={handleClose}
          >
            <X size={20} color={TEXT_MUTED} />
          </TouchableOpacity>
        </View>
      </LinearGradient>


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
    backgroundColor: IVORY,
  },
  headerGradient: {
    overflow: 'hidden',
  },
  statusBarSpacer: {
    height: STATUSBAR_HEIGHT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(91, 14, 139, 0.10)',
    borderWidth: 1.5,
    borderColor: 'rgba(91, 14, 139, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    color: TEXT_PLUM,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webView: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: STATUSBAR_HEIGHT + 84,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: IVORY,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    color: TEXT_MUTED,
    fontWeight: '500',
  },
  verifyingContainer: {
    flex: 1,
    backgroundColor: IVORY,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  verifyingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: TEXT_PLUM,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  verifyingSubText: {
    fontSize: 13,
    color: TEXT_MUTED,
  },
});

export default PhonePeWebViewScreen;