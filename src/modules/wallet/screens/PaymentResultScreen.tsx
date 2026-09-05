import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { CheckCircle2, XCircle, Coins, ArrowRight, RotateCcw } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';
import apiClient from '../../../api/apiClient';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;
type Props = NativeStackScreenProps<AuthStackParamList, 'PaymentResult'>;

const PaymentResultScreen: React.FC<Props> = ({ navigation, route }) => {
  const { checking, transactionId, coins: initialCoins } = route.params;

  const [isVerifying, setIsVerifying] = useState(checking === true);
  const [success, setSuccess] = useState<boolean>(route.params.success);
  const [coinsAdded, setCoinsAdded] = useState<number>(initialCoins ?? 0);
  const [newBalance, setNewBalance] = useState<number>(0);

  // Animations
  const iconScale = useRef(new Animated.Value(0)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(30)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;

  const startAnimations = (isSuccess: boolean) => {
    Animated.sequence([
      Animated.delay(100),
      Animated.parallel([
        Animated.spring(iconScale, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }),
        Animated.timing(iconOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(contentOpacity, { toValue: 1, duration: 400, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.spring(contentTranslateY, { toValue: 0, friction: 8, tension: 50, useNativeDriver: true }),
      ]),
    ]).start();

    if (isSuccess) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseScale, { toValue: 1.08, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(pulseScale, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      ).start();
    }
  };

  useEffect(() => {
    if (checking && transactionId) {
      // Call verifyPayment API — like JyothisVani pattern
      apiClient.post('/api/wallet/recharge/verify', { merchant_transaction_id: transactionId })
        .then(res => {
          const data = res.data?.data;
          const isSuccess = data?.success === true;
          setSuccess(isSuccess);
          setCoinsAdded(data?.coins_added ?? initialCoins ?? 0);
          setNewBalance(data?.new_balance ?? 0);
          setIsVerifying(false);
          startAnimations(isSuccess);
        })
        .catch(err => {
          console.error('Verify payment error:', err);
          setSuccess(false);
          setIsVerifying(false);
          startAnimations(false);
        });
    } else {
      startAnimations(route.params.success);
    }
  }, []);

  const goToWallet = () => {
    navigation.reset({ index: 1, routes: [{ name: 'Home' }, { name: 'Wallet' }] });
  };

  const tryAgain = () => {
    navigation.reset({ index: 1, routes: [{ name: 'Home' }, { name: 'Wallet' }] });
  };

  if (isVerifying) {
    return (
      <View style={styles.verifyingContainer}>
        <LinearGradient colors={['#1A0733', '#3A0E6A', '#5A1D9A']} style={StyleSheet.absoluteFill} />
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.verifyingText}>Verifying your payment...</Text>
        <Text style={styles.verifyingSubText}>Please wait, do not close the app</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={success ? ['#1A0733', '#3A0E6A', '#5A1D9A'] : ['#1A0733', '#2D0A0A', '#5C1212']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.decorCircle, styles.decorCircle1, success ? styles.decorSuccess : styles.decorFail]} />
      <View style={[styles.decorCircle, styles.decorCircle2, success ? styles.decorSuccess : styles.decorFail]} />

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.iconWrap,
            {
              opacity: iconOpacity,
              transform: [{ scale: Animated.multiply(iconScale, pulseScale) }],
              backgroundColor: success ? 'rgba(45, 211, 111, 0.15)' : 'rgba(236, 19, 114, 0.15)',
              borderColor: success ? 'rgba(45, 211, 111, 0.4)' : 'rgba(236, 19, 114, 0.4)',
            },
          ]}
        >
          <View style={[styles.iconInner, { backgroundColor: success ? 'rgba(45,211,111,0.2)' : 'rgba(236,19,114,0.2)' }]}>
            {success
              ? <CheckCircle2 size={52} color="#2DD36F" strokeWidth={1.5} />
              : <XCircle size={52} color="#EC1372" strokeWidth={1.5} />
            }
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: contentOpacity, transform: [{ translateY: contentTranslateY }], alignItems: 'center' }}>
          <Text style={styles.statusTitle}>
            {success ? 'Payment Successful!' : 'Payment Failed'}
          </Text>

          {success && coinsAdded > 0 ? (
            <View style={styles.coinsAdded}>
              <View style={styles.coinIconWrap}>
                <Coins size={18} color="#F5A623" />
              </View>
              <Text style={styles.coinsAddedText}>
                <Text style={styles.coinsCount}>{coinsAdded}</Text> Coins Added to Your Wallet!
              </Text>
            </View>
          ) : null}

          {success && newBalance > 0 ? (
            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>New Balance: </Text>
              <Text style={styles.balanceValue}>{newBalance} Coins</Text>
            </View>
          ) : null}

          <Text style={styles.statusSubtitle}>
            {success
              ? 'Your coins are ready to use. Enjoy connecting with people on Himameet!'
              : 'Something went wrong with your payment. Your money is safe — please try again.'}
          </Text>

          {transactionId ? (
            <View style={styles.txnBox}>
              <Text style={styles.txnLabel}>Transaction ID</Text>
              <Text style={styles.txnValue}>{transactionId}</Text>
            </View>
          ) : null}
        </Animated.View>
      </View>

      <Animated.View style={[styles.actions, { opacity: contentOpacity }]}>
        {success ? (
          <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85} onPress={goToWallet}>
            <LinearGradient colors={['#2DD36F', '#1AAB52']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.primaryBtnGrad}>
              <Text style={styles.primaryBtnText}>Go to Wallet</Text>
              <ArrowRight size={18} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85} onPress={tryAgain}>
              <LinearGradient colors={['#EC1372', '#B30D57']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.primaryBtnGrad}>
                <RotateCcw size={18} color="#FFFFFF" />
                <Text style={styles.primaryBtnText}>Try Again</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.7} onPress={() => navigation.navigate('Home')}>
              <Text style={styles.secondaryBtnText}>Go to Home</Text>
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  verifyingContainer: {
    flex: 1,
    backgroundColor: '#1A0733',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  verifyingText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  verifyingSubText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  container: { flex: 1, backgroundColor: '#1A0733' },
  decorCircle: { position: 'absolute', borderRadius: 999, opacity: 0.08 },
  decorCircle1: { width: 320, height: 320, top: -80, right: -80 },
  decorCircle2: { width: 240, height: 240, bottom: 80, left: -60 },
  decorSuccess: { backgroundColor: '#2DD36F' },
  decorFail: { backgroundColor: '#EC1372' },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: STATUSBAR_HEIGHT + 20,
    gap: 24,
  },
  iconWrap: {
    width: 130, height: 130, borderRadius: 65,
    borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  iconInner: {
    width: 100, height: 100, borderRadius: 50,
    alignItems: 'center', justifyContent: 'center',
  },
  statusTitle: {
    fontSize: 28, fontWeight: '900', color: '#FFFFFF',
    textAlign: 'center', marginBottom: 8, letterSpacing: -0.5,
  },
  coinsAdded: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(245, 166, 35, 0.15)',
    borderRadius: 30, paddingHorizontal: 18, paddingVertical: 10,
    gap: 10, marginBottom: 8,
    borderWidth: 1, borderColor: 'rgba(245, 166, 35, 0.3)',
  },
  coinIconWrap: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(245, 166, 35, 0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  coinsAddedText: { fontSize: 14, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  coinsCount: { fontSize: 16, color: '#F5A623', fontWeight: '900' },
  balanceRow: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: { fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: '500' },
  balanceValue: { fontSize: 14, color: '#2DD36F', fontWeight: '800' },
  statusSubtitle: {
    fontSize: 14, color: 'rgba(255,255,255,0.6)',
    textAlign: 'center', lineHeight: 22, marginBottom: 16,
  },
  txnBox: {
    backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 12,
    paddingHorizontal: 20, paddingVertical: 12, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  txnLabel: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4, letterSpacing: 1, textTransform: 'uppercase' },
  txnValue: { fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: '600', letterSpacing: 0.5 },
  actions: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 12, gap: 12 },
  primaryBtn: {
    borderRadius: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
  primaryBtnGrad: { height: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  secondaryBtn: { height: 50, alignItems: 'center', justifyContent: 'center' },
  secondaryBtnText: { fontSize: 14, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
});

export default PaymentResultScreen;
