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
// import { getAuth, signInWithPhoneNumber } from '@react-native-firebase/auth';

const { width } = Dimensions.get('window');
const STATUSBAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

type RootStackParamList = {
  LoginScreen: undefined;
  VerifyOtpScreen: { phoneNumber: string };
  [key: string]: undefined | object;
};

type Props = NativeStackScreenProps<RootStackParamList, 'LoginScreen'>;

// Horizontal pill strip instead of a static icon grid
const FEATURES: { key: string; label: string; icon: LucideIcon; tint: string }[] = [
  { key: 'chat', label: 'Chat', icon: MessageCircle, tint: '#2DD4BF' },
  { key: 'video', label: 'Video', icon: Video, tint: '#FF6F61' },
  { key: 'voice', label: 'Voice', icon: Phone, tint: '#FFC364' },
  { key: 'connect', label: 'Connect', icon: Heart, tint: '#B084F0' },
];

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [hasReferral, setHasReferral] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const cardTranslateY = useRef(new Animated.Value(60)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const ringRotate = useRef(new Animated.Value(0)).current;
  const stripOpacity = useRef(new Animated.Value(0)).current;
  const toggleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');

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
      // Securely call backend to send OTP
      await sendOtp(mobileNumber.trim());

      navigation.navigate('VerifyOtpScreen', { 
        phoneNumber: mobileNumber.trim()
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
    outputRange: ['#E4DED0', '#2DD4BF'],
  });

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={['#0B1220', '#12213B', '#1B2E4A']}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={styles.hero}
        >
          <View style={{ height: STATUSBAR_HEIGHT }} />

          {/* Accent glow blobs, echo the splash screen's palette */}
          <View style={[styles.blob, styles.blobTeal]} />
          <View style={[styles.blob, styles.blobCoral]} />

          <View style={styles.logoStage}>
            <Animated.View
              style={[styles.orbitRing, { transform: [{ rotate: ringSpin }] }]}
            >
              <View style={styles.orbitDot} />
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
            <Text style={styles.wordmarkAccent}>Hima</Text>Meet
          </Text>
          <Text style={styles.tagline}>REAL PEOPLE · REAL MOMENTS</Text>

          {/* Horizontal glass pill strip, in place of a static 4-column grid */}
          <Animated.View style={[styles.stripContent, { opacity: stripOpacity }]}
          >
            {FEATURES.map(feature => {
              const FeatureIcon = feature.icon;
              return (
                <View key={feature.key} style={styles.pill}>
                  <View
                    style={[
                      styles.pillIconDot,
                      { backgroundColor: `${feature.tint}26` },
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
              placeholderTextColor="#B7AE9C"
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
            onPress={() => setHasReferral(prev => !prev)}
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
              placeholderTextColor="#B7AE9C"
              autoCapitalize="characters"
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
              colors={isValidNumber ? ['#2DD4BF', '#1BAE9C'] : ['#E4DED0', '#E4DED0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaButton}
            >
              <Text style={[styles.ctaText, !isValidNumber && styles.ctaTextDisabled]}>
                {isLoading ? 'Sending...' : 'Send OTP'}
              </Text>
              <ArrowRight
                size={18}
                color={isValidNumber ? '#0B1220' : '#A79E8C'}
                style={{ marginLeft: 8 }}
              />
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By continuing you agree to our{' '}
            <Text style={styles.termsLink}>Terms</Text> and{' '}
            <Text style={styles.termsLink}>Community Guidelines</Text> of
            HimaMeet.
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
    backgroundColor: '#0B1220',
  },
  scrollContent: {
    flexGrow: 1,
  },

  hero: {
    alignItems: 'center',
    paddingBottom: 85,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  blobTeal: {
    width: width * 0.6,
    height: width * 0.6,
    top: -width * 0.3,
    right: -width * 0.25,
    backgroundColor: 'rgba(45, 212, 191, 0.14)',
  },
  blobCoral: {
    width: width * 0.4,
    height: width * 0.4,
    bottom: -width * 0.15,
    left: -width * 0.18,
    backgroundColor: 'rgba(255, 111, 97, 0.12)',
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
    borderColor: 'rgba(45, 212, 191, 0.35)',
  },
  orbitDot: {
    position: 'absolute',
    top: -3,
    left: '50%',
    marginLeft: -3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6F61',
  },
  logoWrapper: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
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
    fontSize: 22,
    fontWeight: '300',
    color: '#F5F7FA',
    letterSpacing: 1,
  },
  wordmarkAccent: {
    fontWeight: '800',
    fontStyle: 'italic',
    color: '#FF6F61',
  },
  tagline: {
    marginTop: 4,
    fontSize: 10.5,
    color: 'rgba(200, 220, 235, 0.6)',
    letterSpacing: 1.6,
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
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginHorizontal: 4,
  },
  pillIconDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7,
  },
  pillLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#E7ECF2',
  },

  card: {
    flex: 1,
    backgroundColor: '#FAF7F2',
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
    backgroundColor: '#E4DED0',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: '#16233A',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 13.5,
    color: '#8B8577',
    marginBottom: 24,
    lineHeight: 19,
  },
  inputLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#8B8577',
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E4DED0',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 54,
    backgroundColor: '#FFFFFF',
  },
  inputRowFocused: {
    borderColor: '#2DD4BF',
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
    color: '#16233A',
  },
  inputDivider: {
    width: 1,
    height: 22,
    backgroundColor: '#E4DED0',
    marginHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#16233A',
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
    borderColor: '#E4DED0',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 14,
    color: '#16233A',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  ctaWrapper: {
    marginTop: 20,
    borderRadius: 999,
    overflow: 'hidden',
    shadowColor: '#2DD4BF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
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
    color: '#0B1220',
    letterSpacing: 0.3,
  },
  ctaTextDisabled: {
    color: '#A79E8C',
  },
  errorText: {
    fontSize: 13,
    color: '#FF6F61',
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
    color: '#1BAE9C',
    fontWeight: '600',
  },
});

export default LoginScreen;







