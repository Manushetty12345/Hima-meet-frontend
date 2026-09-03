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

const { width } = Dimensions.get('window');
const STATUSBAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

const OTP_LENGTH = 6;
const RESEND_SECONDS = 54;

type Props = NativeStackScreenProps<AuthStackParamList, 'VerifyOtpScreen'>;

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

// Light lavender hero palette — matches LoginScreen exactly
const LILAC_WHITE = '#FBF7FF';
const LILAC_PALE  = '#EFDFFB';
const LILAC_LIGHT = '#DCC1F2';

// Feature strip, matching the login screen's gold-on-glass showcase
const FEATURES: { key: string; label: string; icon: LucideIcon; tint: string }[] = [
  { key: 'chat', label: 'Chat', icon: MessageCircle, tint: '#F5C542' },
  { key: 'video', label: 'Video', icon: Video, tint: '#E8A6F2' },
  { key: 'voice', label: 'Voice', icon: Phone, tint: '#F5C542' },
  { key: 'connect', label: 'Connect', icon: Heart, tint: '#FF9BC4' },
];

const VerifyOtpScreen: React.FC<Props> = ({ navigation, route }) => {
  const mobileNumber = route?.params?.phoneNumber ?? '';
  const [verificationId, setVerificationId] = useState<string>((route?.params as any)?.verificationId ?? '');

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [isVerifying, setIsVerifying] = useState(false);

  const inputRefs = useRef<Array<any>>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cardTranslateY = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const ringRotate = useRef(new Animated.Value(0)).current;
  const sparkleTwinkle = useRef(new Animated.Value(0.4)).current;
  const stripOpacity = useRef(new Animated.Value(0)).current;
  const timerBarWidth = useRef(new Animated.Value(1)).current;
  const shakeX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');

    // Logo + strip animate in — card is already visible
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
      // Backend verifies OTP against its in-memory store (bhashsms flow)
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
      // Backend generates new OTP and sends via bhashsms
      await sendOtp(mobileNumber, '+91');
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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <StatusBar barStyle="dark-content" />

      <ScrollView
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

          <View style={[styles.glow, styles.glowTopRight]} />
          <View style={[styles.glow, styles.glowBottomLeft]} />
          <View style={styles.cornerFlourishTR} />

          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={19} color={PLUM_ROYAL} />
          </TouchableOpacity>

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

          <Text style={styles.cardTitle}>Verify OTP</Text>

          <View style={styles.otpSentRow}>
            <View>
              <Text style={styles.otpSentLabel}>OTP sent to</Text>
              <Text style={styles.mobileNumberText}>{mobileNumber}</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={handleChangeNumber}>
              <Text style={styles.changeLink}>Change</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.otpInputLabel}>Enter 6-digit OTP</Text>

          {/* Full border box OTP inputs */}
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
              colors={isOtpComplete ? [GOLD, GOLD_DEEP] : [IVORY_LINE, IVORY_LINE]}
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
                {isVerifying ? 'Verifying…' : 'Verify OTP'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.resendBlock}>
            {secondsLeft > 0 ? (
              <View style={styles.resendRow}>
                <Text style={styles.resendText}>Didn't receive the OTP?{'  '}</Text>
                <Text style={styles.resendTimerText}>Retry in ({secondsLeft})</Text>
              </View>
            ) : (
              <View style={styles.resendRow}>
                <Text style={styles.resendText}>Didn't receive the OTP?{'  '}</Text>
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

const LOGO_SIZE = width * 0.32;
const STAGE_SIZE = width * 0.48;
const OTP_BOX_SIZE = (width - 26 * 2 - 5 * 10) / OTP_LENGTH;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: LILAC_LIGHT,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: LILAC_LIGHT,
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

  backButton: {
    position: 'absolute',
    top: STATUSBAR_HEIGHT + 12,
    left: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(91, 14, 139, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(91, 14, 139, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
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
    flex: 1,
    backgroundColor: IVORY,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    marginTop: -22,
    paddingHorizontal: 26,
    paddingTop: 16,
    paddingBottom: 60,
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
    marginBottom: 20,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  otpSentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  otpSentLabel: {
    fontSize: 12.5,
    color: TEXT_MUTED,
    marginBottom: 4,
  },
  mobileNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_PLUM,
  },
  changeLink: {
    fontSize: 13.5,
    fontWeight: '700',
    color: PLUM_ROYAL,
  },

  otpInputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: TEXT_MUTED,
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 16,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  otpBox: {
    width: OTP_BOX_SIZE,
    height: OTP_BOX_SIZE + 10,
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: TEXT_PLUM,
    backgroundColor: '#FFFFFF',
  },
  otpBoxFilled: {
    borderColor: GOLD_DEEP,
    borderWidth: 2,
    backgroundColor: 'rgba(212, 175, 55, 0.06)',
    color: PLUM_ROYAL,
  },

  ctaWrapper: {
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

  resendBlock: {
    marginTop: 22,
    alignItems: 'center',
  },
  timerTrack: {
    width: '60%',
    height: 3,
    borderRadius: 2,
    backgroundColor: IVORY_LINE,
    overflow: 'hidden',
    marginBottom: 10,
  },
  timerFill: {
    height: '100%',
    backgroundColor: GOLD_DEEP,
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 13,
    color: TEXT_MUTED,
  },
  resendTimerText: {
    fontSize: 13,
    fontWeight: '700',
    color: GOLD_DEEP,
  },
  resendActiveText: {
    fontSize: 13,
    fontWeight: '700',
    color: PLUM_ROYAL,
    textDecorationLine: 'underline',
  },
});

export default VerifyOtpScreen;