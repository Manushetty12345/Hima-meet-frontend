import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Alert,
  Image,
  TextInput,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  Easing,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  MessageCircle,
  Video,
  Phone,
  Heart,
  ArrowRight,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { sendOtp } from '../api/authApi';

const { width } = Dimensions.get('window');
const STATUSBAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

type RootStackParamList = {
  LoginScreen: undefined;
  VerifyOtpScreen: { phoneNumber: string; verificationId?: string };
  [key: string]: undefined | object;
};

type Props = NativeStackScreenProps<RootStackParamList, 'LoginScreen'>;

// ---- Palette pulled from the Himameet mark ----
const PLUM_DEEP = '#1A0733';
const PLUM_MID = '#3A0F63';
const PLUM_ROYAL = '#5B0E8B';
const GOLD = '#F5C542';
const GOLD_DEEP = '#D4AF37';
const IVORY = '#FBF6EC';
const IVORY_LINE = '#EBDFC4';
const TEXT_PLUM = '#2A1240';
const TEXT_MUTED = '#8B7F98';

// Light lavender hero palette — near-white up top, softening into pale purple
const LILAC_WHITE = '#FBF7FF';
const LILAC_PALE = '#EFDFFB';
const LILAC_LIGHT = '#DCC1F2';

// Gold-tinted feature strip, each icon carries a soft plum-gold wash
const FEATURES: { key: string; label: string; icon: LucideIcon; tint: string }[] = [
  { key: 'chat', label: 'Chat', icon: MessageCircle, tint: '#F5C542' },
  { key: 'video', label: 'Video', icon: Video, tint: '#E8A6F2' },
  { key: 'voice', label: 'Voice', icon: Phone, tint: '#F5C542' },
  { key: 'connect', label: 'Connect', icon: Heart, tint: '#FF9BC4' },
];

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [hasReferral, setHasReferral] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const scrollViewRef = useRef<any>(null);

  const cardTranslateY = useRef(new Animated.Value(60)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const ringRotate = useRef(new Animated.Value(0)).current;
  const sparkleTwinkle = useRef(new Animated.Value(0.4)).current;
  const stripOpacity = useRef(new Animated.Value(0)).current;
  const toggleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');

    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 420,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(stripOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 420,
          useNativeDriver: true,
        }),
        Animated.spring(cardTranslateY, {
          toValue: 0,
          friction: 9,
          tension: 55,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    Animated.loop(
      Animated.timing(ringRotate, {
        toValue: 1,
        duration: 7000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleTwinkle, {
          toValue: 1,
          duration: 750,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(sparkleTwinkle, {
          toValue: 0.35,
          duration: 750,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  useEffect(() => {
    Animated.timing(toggleAnim, {
      toValue: hasReferral ? 1 : 0,
      duration: 220,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [hasReferral]);

  const isValidNumber = mobileNumber.trim().length === 10;

  const handleSendOtp = async () => {
    if (!isValidNumber || isLoading) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      const phone = mobileNumber.trim();
      // OTP is generated & stored securely on the backend, sent via bhashsms
      await sendOtp(phone, '+91');
      navigation.navigate('VerifyOtpScreen', {
        phoneNumber: phone,
        verificationId: '', // not needed — backend handles OTP verification
      });
    } catch (err: any) {
      const msg = err?.message || 'Failed to send OTP. Please try again.';
      setErrorMsg(msg);
      Alert.alert('Error', msg);
    } finally {
      setIsLoading(false);
    }
  };

  const ringSpin = ringRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const knobTranslate = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 20],
  });
  const trackColor = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [IVORY_LINE, GOLD],
  });

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <StatusBar barStyle="dark-content" />

      <ScrollView
        ref={scrollViewRef}
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[LILAC_WHITE, LILAC_PALE, LILAC_LIGHT]}
          start={{ x: 0.15, y: 0 }}
          end={{ x: 0.85, y: 1 }}
          style={styles.hero}
        >
          <View style={{ height: STATUSBAR_HEIGHT }} />

          {/* Soft golden + violet glows, gentler for the light backdrop */}
          <View style={[styles.glow, styles.glowTopRight]} />
          <View style={[styles.glow, styles.glowBottomLeft]} />

          {/* Faint corner flourish, matching the logo's ornamental frame */}
          <View style={styles.cornerFlourishTR} />

          <View style={styles.logoStage}>
            <Animated.View
              style={[styles.orbitRing, { transform: [{ rotate: ringSpin }] }]}
            >
              <Animated.Text style={[styles.orbitSparkle, { opacity: sparkleTwinkle }]}>
                ✦
              </Animated.Text>
            </Animated.View>
            <Animated.View
              style={[
                styles.logoWrapper,
                {
                  opacity: logoOpacity,
                  transform: [{ scale: logoScale }],
                },
              ]}
            >
              <Image
                source={require('../../../assets/images/logo1.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </Animated.View>
          </View>

          <Text style={styles.wordmark}>
            <Text style={styles.wordmarkAccent}>Hima</Text>meet
          </Text>
          <View style={styles.taglineDivider}>
            <View style={styles.taglineLine} />
            <Text style={styles.taglineHeart}>♥</Text>
            <View style={styles.taglineLine} />
          </View>
          <Text style={styles.tagline}>WHERE REAL BONDS BEGIN</Text>

          {/* Feature strip, gold-on-glass pills */}
          <Animated.View style={[styles.stripContent, { opacity: stripOpacity }]}>
            {FEATURES.map(feature => {
              const FeatureIcon = feature.icon;
              return (
                <View key={feature.key} style={styles.pill}>
                  <View
                    style={[
                      styles.pillIconDot,
                      { backgroundColor: `${feature.tint}26`, borderColor: `${feature.tint}55` },
                    ]}
                  >
                    <FeatureIcon size={15} color={feature.tint} />
                  </View>
                  <Text style={styles.pillLabel}>{feature.label}</Text>
                </View>
              );
            })}
          </Animated.View>
        </LinearGradient>

        <Animated.View
          style={[
            styles.card,
            {
              opacity: cardOpacity,
              transform: [{ translateY: cardTranslateY }],
            },
          ]}
        >
          <View style={styles.cardHandle} />

          <Text style={styles.cardTitle}>Let's get you in</Text>
          <Text style={styles.cardSubtitle}>
            We'll text a one-time code to verify it's you
          </Text>

          <Text style={styles.inputLabel}>MOBILE NUMBER</Text>
          <View style={[styles.inputRow, isFocused && styles.inputRowFocused]}>
            <View style={styles.countryCode}>
              <Text style={styles.flagEmoji}>🇮🇳</Text>
              <Text style={styles.countryCodeText}>+91</Text>
            </View>
            <View style={styles.inputDivider} />
            <TextInput
              value={mobileNumber}
              onChangeText={text =>
                setMobileNumber(text.replace(/[^0-9]/g, '').slice(0, 10))
              }
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="10-digit number"
              placeholderTextColor="#B8A9C9"
              keyboardType="number-pad"
              maxLength={10}
              style={styles.input}
            />
          </View>
          <Text style={styles.otpHint}>You'll receive an OTP on this number</Text>
          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <TouchableOpacity
            style={styles.referralRow}
            activeOpacity={0.75}
            onPress={() => {
              setHasReferral(prev => !prev);
            }}
          >
            <Animated.View style={[styles.toggleTrack, { backgroundColor: trackColor }]}>
              <Animated.View
                style={[styles.toggleKnob, { transform: [{ translateX: knobTranslate }] }]}
              />
            </Animated.View>
            <Text style={styles.referralText}>Got a referral code?</Text>
          </TouchableOpacity>

          {hasReferral && (
            <TextInput
              value={referralCode}
              onChangeText={setReferralCode}
              placeholder="Enter referral code"
              placeholderTextColor="#B8A9C9"
              autoCapitalize="characters"
              // No forced scroll on focus to prevent keyboard hiding
              style={styles.referralInput}
            />
          )}

          <TouchableOpacity
            activeOpacity={0.85}
            disabled={!isValidNumber}
            onPress={handleSendOtp}
            style={styles.ctaWrapper}
          >
            <LinearGradient
              colors={isValidNumber ? [GOLD, GOLD_DEEP] : [IVORY_LINE, IVORY_LINE]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaButton}
            >
              <Text style={[styles.ctaText, !isValidNumber && styles.ctaTextDisabled]}>
                {isLoading ? 'Sending...' : 'Send OTP'}
              </Text>
              <ArrowRight
                size={18}
                color={isValidNumber ? PLUM_DEEP : '#A79E8C'}
                style={{ marginLeft: 8 }}
              />
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By continuing you agree to our{' '}
            <Text style={styles.termsLink}>Terms</Text> and{' '}
            <Text style={styles.termsLink}>Community Guidelines</Text> of
            Himameet.
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const LOGO_SIZE = width * 0.32;
const STAGE_SIZE = width * 0.48;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: IVORY,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: IVORY,
  },

  hero: {
    alignItems: 'center',
    paddingBottom: 85,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    borderRadius: 999,
  },
  glowTopRight: {
    width: width * 0.6,
    height: width * 0.6,
    top: -width * 0.3,
    right: -width * 0.25,
    backgroundColor: 'rgba(245, 197, 66, 0.18)',
  },
  glowBottomLeft: {
    width: width * 0.4,
    height: width * 0.4,
    bottom: -width * 0.15,
    left: -width * 0.18,
    backgroundColor: 'rgba(91, 14, 139, 0.10)',
  },
  cornerFlourishTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 70,
    height: 70,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    borderTopRightRadius: 20,
    margin: 18,
  },

  logoStage: {
    width: STAGE_SIZE,
    height: STAGE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  orbitRing: {
    position: 'absolute',
    width: STAGE_SIZE,
    height: STAGE_SIZE,
    borderRadius: STAGE_SIZE / 2,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(212, 175, 55, 0.55)',
  },
  orbitSparkle: {
    position: 'absolute',
    top: -8,
    left: '50%',
    marginLeft: -8,
    fontSize: 15,
    color: GOLD_DEEP,
  },
  logoWrapper: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 55, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },

  wordmark: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: '300',
    color: TEXT_PLUM,
    letterSpacing: 1,
  },
  wordmarkAccent: {
    fontWeight: '800',
    fontStyle: 'italic',
    color: GOLD_DEEP,
  },
  taglineDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    width: 130,
  },
  taglineLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.55)',
  },
  taglineHeart: {
    color: GOLD_DEEP,
    fontSize: 10,
    marginHorizontal: 8,
  },
  tagline: {
    marginTop: 6,
    fontSize: 10.5,
    color: 'rgba(91, 14, 139, 0.55)',
    letterSpacing: 2,
  },

  stripContent: {
    marginTop: 22,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginHorizontal: 4,
  },
  pillIconDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7,
  },
  pillLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: TEXT_PLUM,
  },

  card: {
    backgroundColor: IVORY,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    marginTop: -22,
    paddingHorizontal: 26,
    paddingTop: 16,
    paddingBottom: 36,
  },
  cardHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: IVORY_LINE,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: TEXT_PLUM,
    marginBottom: 6,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  cardSubtitle: {
    fontSize: 13.5,
    color: TEXT_MUTED,
    marginBottom: 24,
    lineHeight: 19,
  },
  inputLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: TEXT_MUTED,
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 54,
    backgroundColor: '#FFFFFF',
  },
  inputRowFocused: {
    borderColor: GOLD_DEEP,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  countryCodeText: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_PLUM,
  },
  inputDivider: {
    width: 1,
    height: 22,
    backgroundColor: IVORY_LINE,
    marginHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: TEXT_PLUM,
    padding: 0,
  },
  otpHint: {
    fontSize: 12,
    color: '#A79E8C',
    marginTop: 8,
    marginBottom: 20,
  },
  referralRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  toggleTrack: {
    width: 38,
    height: 22,
    borderRadius: 11,
    padding: 2,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  toggleKnob: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
  },
  referralText: {
    fontSize: 13.5,
    color: '#5C5647',
    fontWeight: '500',
  },
  referralInput: {
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 14,
    color: TEXT_PLUM,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  ctaWrapper: {
    marginTop: 20,
    borderRadius: 999,
    overflow: 'hidden',
    shadowColor: GOLD_DEEP,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaButton: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: PLUM_DEEP,
    letterSpacing: 0.3,
  },
  ctaTextDisabled: {
    color: '#A79E8C',
  },
  errorText: {
    fontSize: 13,
    color: '#C0392B',
    marginTop: 6,
    marginBottom: 4,
  },
  termsText: {
    fontSize: 12,
    color: '#A79E8C',
    marginTop: 18,
    lineHeight: 18,
  },
  termsLink: {
    color: PLUM_ROYAL,
    fontWeight: '700',
  },
});

export default LoginScreen;