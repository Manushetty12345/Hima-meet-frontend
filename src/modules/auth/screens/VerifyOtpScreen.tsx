import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
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
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  MessageCircle,
  Video,
  Phone,
  Heart,
  ArrowLeft,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';
import { verifyOtp, sendOtp } from '../api/authApi';
// import { getAuth, PhoneAuthProvider, signInWithCredential, signInWithPhoneNumber } from '@react-native-firebase/auth';

const { width } = Dimensions.get('window');
const STATUSBAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

const OTP_LENGTH = 6;
const RESEND_SECONDS = 54;

type Props = NativeStackScreenProps<AuthStackParamList, 'VerifyOtpScreen'>;

// Horizontal pill strip, matching the login screen's feature showcase
const FEATURES: { key: string; label: string; icon: LucideIcon; tint: string }[] = [
  { key: 'chat', label: 'Chat', icon: MessageCircle, tint: '#2DD4BF' },
  { key: 'video', label: 'Video', icon: Video, tint: '#FF6F61' },
  { key: 'voice', label: 'Voice', icon: Phone, tint: '#FFC364' },
  { key: 'connect', label: 'Connect', icon: Heart, tint: '#B084F0' },
];

const VerifyOtpScreen: React.FC<Props> = ({ navigation, route }) => {
  const mobileNumber = route?.params?.phoneNumber ?? '';

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [isVerifying, setIsVerifying] = useState(false);

  const inputRefs = useRef<Array<any>>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cardTranslateY = useRef(new Animated.Value(60)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const ringRotate = useRef(new Animated.Value(0)).current;
  const stripOpacity = useRef(new Animated.Value(0)).current;
  const timerBarWidth = useRef(new Animated.Value(1)).current;
  const shakeX = useRef(new Animated.Value(0)).current;

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
    startResendTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startResendTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSecondsLeft(RESEND_SECONDS);
    timerBarWidth.setValue(1);
    Animated.timing(timerBarWidth, {
      toValue: 0,
      duration: RESEND_SECONDS * 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    timerRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const otpValue = otp.join('');
  const isOtpComplete = otpValue.length === OTP_LENGTH;

  const triggerShake = () => {
    shakeX.setValue(0);
    Animated.sequence([
      Animated.timing(shakeX, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleChangeDigit = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: { nativeEvent: { key: string } },
    index: number,
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const next = [...otp];
      next[index - 1] = '';
      setOtp(next);
    }
  };

  const handleVerifyOtp = async () => {
    if (!isOtpComplete || isVerifying) return;
    setIsVerifying(true);
    try {
      // Call backend API without Firebase idToken
      const result = await verifyOtp(mobileNumber, otpValue, '+91');
      const { is_new_user } = result.data;

      if (is_new_user) {
        navigation.navigate('GenderSelect');
      } else {
        navigation.replace('Home');
      }
    } catch (error: any) {
      triggerShake();
      Alert.alert('Invalid OTP', error.message || 'Please check the OTP and try again.');
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (secondsLeft > 0) return;
    setOtp(Array(OTP_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
    try {
      await sendOtp(mobileNumber);
      startResendTimer();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resend OTP');
    }
  };

  const handleChangeNumber = () => {
    navigation.goBack();
  };

  const ringSpin = ringRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const timerBarPct = timerBarWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
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

          <View style={[styles.blob, styles.blobTeal]} />
          <View style={[styles.blob, styles.blobCoral]} />

          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={19} color="#F5F7FA" />
          </TouchableOpacity>

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
                source={require('../../../assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </Animated.View>
          </View>

          <Text style={styles.wordmark}>
            <Text style={styles.wordmarkAccent}>Hi</Text>MaMeet
          </Text>
          <Text style={styles.tagline}>REAL PEOPLE · REAL MOMENTS</Text>

          <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ opacity: stripOpacity }}
            contentContainerStyle={styles.stripContent}
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
          </Animated.ScrollView>
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

          <Text style={styles.cardTitle}>Enter the code</Text>

          <View style={styles.otpSentRow}>
            <View>
              <Text style={styles.otpSentLabel}>Sent by SMS to</Text>
              <Text style={styles.mobileNumberText}>{mobileNumber}</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={handleChangeNumber}>
              <Text style={styles.changeLink}>Change</Text>
            </TouchableOpacity>
          </View>

          {/* Underline-style OTP boxes, not bordered squares */}
          <Animated.View
            style={[styles.otpRow, { transform: [{ translateX: shakeX }] }]}
          >
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref: any) => {
                  inputRefs.current[index] = ref;
                }}
                value={digit}
                onChangeText={text => handleChangeDigit(text, index)}
                onKeyPress={e => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                style={[styles.otpBox, digit ? styles.otpBoxFilled : undefined]}
              />
            ))}
          </Animated.View>

          <TouchableOpacity
            activeOpacity={0.85}
            disabled={!isOtpComplete || isVerifying}
            onPress={handleVerifyOtp}
            style={styles.ctaWrapper}
          >
            <LinearGradient
              colors={
                isOtpComplete ? ['#2DD4BF', '#1BAE9C'] : ['#E4DED0', '#E4DED0']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaButton}
            >
              <Text
                style={[
                  styles.ctaText,
                  !isOtpComplete && styles.ctaTextDisabled,
                ]}
              >
                {isVerifying ? 'Verifying…' : 'Verify & Continue'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.resendBlock}>
            {secondsLeft > 0 ? (
              <>
                <View style={styles.timerTrack}>
                  <Animated.View
                    style={[styles.timerFill, { width: timerBarPct }]}
                  />
                </View>
                <Text style={styles.resendText}>
                  Resend available in {secondsLeft}s
                </Text>
              </>
            ) : (
              <View style={styles.resendRow}>
                <Text style={styles.resendText}>Didn't get a code? </Text>
                <TouchableOpacity activeOpacity={0.7} onPress={handleResendOtp}>
                  <Text style={styles.resendActiveText}>Resend OTP</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const LOGO_SIZE = width * 0.24;
const STAGE_SIZE = width * 0.4;
const OTP_BOX_SIZE = (width - 26 * 2 - 5 * 10) / OTP_LENGTH;

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
    paddingBottom: 30,
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

  backButton: {
    position: 'absolute',
    top: STATUSBAR_HEIGHT + 12,
    left: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoStage: {
    width: STAGE_SIZE,
    height: STAGE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
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
    width: '68%',
    height: '68%',
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
    paddingHorizontal: 4,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
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
    marginBottom: 20,
  },
  otpSentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  otpSentLabel: {
    fontSize: 12.5,
    color: '#8B8577',
    marginBottom: 4,
  },
  mobileNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16233A',
  },
  changeLink: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1BAE9C',
  },

  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  otpBox: {
    width: OTP_BOX_SIZE,
    height: OTP_BOX_SIZE + 10,
    borderBottomWidth: 2.5,
    borderColor: '#E4DED0',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#16233A',
    backgroundColor: 'transparent',
  },
  otpBoxFilled: {
    borderColor: '#2DD4BF',
    color: '#1BAE9C',
  },

  ctaWrapper: {
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

  resendBlock: {
    marginTop: 22,
    alignItems: 'center',
  },
  timerTrack: {
    width: '60%',
    height: 3,
    borderRadius: 2,
    backgroundColor: '#E4DED0',
    overflow: 'hidden',
    marginBottom: 10,
  },
  timerFill: {
    height: '100%',
    backgroundColor: '#2DD4BF',
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 13,
    color: '#8B8577',
  },
  resendActiveText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1BAE9C',
    textDecorationLine: 'underline',
  },
});

export default VerifyOtpScreen;