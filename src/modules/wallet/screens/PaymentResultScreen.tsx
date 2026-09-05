import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { CheckCircle2, XCircle, Coins, ArrowRight, RotateCcw } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;
type Props = NativeStackScreenProps<AuthStackParamList, 'PaymentResult'>;

const PaymentResultScreen: React.FC<Props> = ({ navigation, route }) => {
  const { success, transactionId, coins } = route.params;

  // Animations
  const iconScale = useRef(new Animated.Value(0)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(30)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Icon pop-in
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(iconScale, {
          toValue: 1,
          friction: 5,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.timing(iconOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      // Content slide up
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(contentTranslateY, {
          toValue: 0,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Pulse animation for success icon
    if (success) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseScale, {
            toValue: 1.08,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseScale, {
            toValue: 1,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, []);

  const goToWallet = () => {
    navigation.reset({
      index: 1,
      routes: [{ name: 'Home' }, { name: 'Wallet' }],
    });
  };

  const tryAgain = () => {
    navigation.reset({
      index: 1,
      routes: [{ name: 'Home' }, { name: 'Wallet' }],
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={success ? ['#1A0733', '#3A0E6A', '#5A1D9A'] : ['#1A0733', '#2D0A0A', '#5C1212']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative circles */}
      <View style={[styles.decorCircle, styles.decorCircle1, success ? styles.decorSuccess : styles.decorFail]} />
      <View style={[styles.decorCircle, styles.decorCircle2, success ? styles.decorSuccess : styles.decorFail]} />

      <View style={styles.content}>
        {/* Icon */}
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

        {/* Text content */}
        <Animated.View
          style={{
            opacity: contentOpacity,
            transform: [{ translateY: contentTranslateY }],
            alignItems: 'center',
          }}
        >
          <Text style={styles.statusTitle}>
            {success ? 'Payment Successful!' : 'Payment Failed'}
          </Text>

          {success && coins ? (
            <View style={styles.coinsAdded}>
              <View style={styles.coinIconWrap}>
                <Coins size={18} color="#F5A623" />
              </View>
              <Text style={styles.coinsAddedText}>
                <Text style={styles.coinsCount}>{coins}</Text> Coins Added to Your Wallet!
              </Text>
            </View>
          ) : null}

          <Text style={styles.statusSubtitle}>
            {success
              ? 'Your coins are ready to use. Enjoy connecting with people on Himameet!'
              : 'Something went wrong with your payment. Your money is safe — please try again.'}
          </Text>

          {transactionId && (
            <View style={styles.txnBox}>
              <Text style={styles.txnLabel}>Transaction ID</Text>
              <Text style={styles.txnValue}>{transactionId}</Text>
            </View>
          )}
        </Animated.View>
      </View>

      {/* Bottom Actions */}
      <Animated.View style={[styles.actions, { opacity: contentOpacity }]}>
        {success ? (
          <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85} onPress={goToWallet}>
            <LinearGradient
              colors={['#2DD36F', '#1AAB52']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryBtnGrad}
            >
              <Text style={styles.primaryBtnText}>Go to Wallet</Text>
              <ArrowRight size={18} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85} onPress={tryAgain}>
              <LinearGradient
                colors={['#EC1372', '#B30D57']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryBtnGrad}
              >
                <RotateCcw size={18} color="#FFFFFF" />
                <Text style={styles.primaryBtnText}>Try Again</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryBtn}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.secondaryBtnText}>Go to Home</Text>
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A0733',
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.08,
  },
  decorCircle1: {
    width: 320,
    height: 320,
    top: -80,
    right: -80,
  },
  decorCircle2: {
    width: 240,
    height: 240,
    bottom: 80,
    left: -60,
  },
  decorSuccess: {
    backgroundColor: '#2DD36F',
  },
  decorFail: {
    backgroundColor: '#EC1372',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: STATUSBAR_HEIGHT + 20,
    gap: 28,
  },
  iconWrap: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  coinsAdded: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 166, 35, 0.15)',
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingVertical: 10,
    gap: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 166, 35, 0.3)',
  },
  coinIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(245, 166, 35, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinsAddedText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  coinsCount: {
    fontSize: 16,
    color: '#F5A623',
    fontWeight: '900',
  },
  statusSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  txnBox: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  txnLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 4,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  txnValue: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  actions: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
    gap: 12,
  },
  primaryBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryBtnGrad: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryBtn: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600',
  },
});

export default PaymentResultScreen;
