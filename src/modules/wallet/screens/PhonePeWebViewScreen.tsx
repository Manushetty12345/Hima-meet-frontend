import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { ArrowLeft, X } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';

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
  const webViewRef = useRef<any>(null);

  const handleNavigationChange = (navState: WebViewNavigation) => {
    const url = navState.url || '';

    // Check if this is a redirect back from PhonePe
    if (SUCCESS_INDICATORS.some(indicator => url.includes(indicator))) {
      const isSuccess =
        url.includes('success') ||
        (url.includes('redirect') && !url.includes('fail') && !url.includes('error'));

      navigation.replace('PaymentResult', {
        success: isSuccess,
        transactionId,
        coins,
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
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
          onPress={() =>
            navigation.replace('PaymentResult', {
              success: false,
              transactionId,
              coins,
            })
          }
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
});

export default PhonePeWebViewScreen;
