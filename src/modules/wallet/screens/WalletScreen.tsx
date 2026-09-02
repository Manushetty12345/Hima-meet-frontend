import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Easing,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, Coins } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// Component
import CoinPackageCard, { CoinPackage } from '../components/CoinPackageCard';

const STATUSBAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

type RootStackParamList = {
  Wallet: undefined;
  [key: string]: undefined | object;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Wallet'>;

const COIN_PACKAGES: CoinPackage[] = [
  { id: 'p40',    coins: 40,    price: 25,   savePercent: 30 },
  { id: 'p90',    coins: 90,    price: 49 },
  { id: 'p200',   coins: 200,   price: 64,   savePercent: 30 },
  { id: 'p440',   coins: 440,   price: 129,  savePercent: 20 },
  { id: 'p1200',  coins: 1200,  price: 299,  savePercent: 30 },
  { id: 'p2500',  coins: 2500,  price: 699,  savePercent: 30, popular: true },
  { id: 'p5500',  coins: 5500,  price: 1199, savePercent: 33 },
  { id: 'p15000', coins: 15000, price: 2999, savePercent: 40 },
  { id: 'p33000', coins: 33000, price: 6999, savePercent: 45 },
];

const formatCoins = (value: number) => value.toLocaleString('en-IN');

const WalletScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedPackageId, setSelectedPackageId] = useState<string>('p40');
  const [coinBalance] = useState<number>(0);

  const ctaOpacity = useRef(new Animated.Value(0)).current;
  const ctaTranslateY = useRef(new Animated.Value(24)).current;

  React.useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    Animated.parallel([
      Animated.timing(ctaOpacity, {
        toValue: 1,
        duration: 380,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(ctaTranslateY, {
        toValue: 0,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const selectedPackage =
    COIN_PACKAGES.find(pkg => pkg.id === selectedPackageId) ?? COIN_PACKAGES[0];

  const handleAddCoins = () => {
    // TODO: hook up your payment/purchase flow here using selectedPackage
    // (e.g. open Razorpay/Stripe checkout, or trigger an in-app purchase),
    // then credit selectedPackage.coins to the user's wallet on success.
  };

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.statusBarSpacer} />

      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={20} color="#EC1372" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Wallet</Text>

        <View style={styles.balancePill}>
          <View style={styles.balanceCoinDot}>
            <Coins size={12} color="#E0166F" />
          </View>
          <Text style={styles.balanceText}>{coinBalance}</Text>
        </View>
      </View>

      {/* Coin package grid */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {COIN_PACKAGES.map(pkg => (
            <CoinPackageCard
              key={pkg.id}
              pkg={pkg}
              isSelected={pkg.id === selectedPackageId}
              onSelect={setSelectedPackageId}
            />
          ))}
        </View>
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Sticky CTA */}
      <Animated.View
        style={[
          styles.ctaContainer,
          {
            opacity: ctaOpacity,
            transform: [{ translateY: ctaTranslateY }],
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleAddCoins}
          style={styles.ctaWrapper}
        >
          <LinearGradient
            colors={['#FF3B8D', '#E0116F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaButton}
          >
            <Text style={styles.ctaText}>
              Add {formatCoins(selectedPackage.coins)} Coins
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  statusBarSpacer: {
    height: STATUSBAR_HEIGHT,
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FDE6EF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    color: '#1B0E22',
  },
  balancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EC1372',
    borderRadius: 20,
    paddingLeft: 4,
    paddingRight: 14,
    paddingVertical: 4,
  },
  balanceCoinDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFE9A8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  balanceText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bottomSpacer: {
    height: 90,
  },
  ctaContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    shadowColor: '#4A0F6E',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  ctaWrapper: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#E0116F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 6,
  },
  ctaButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});

export default WalletScreen;
