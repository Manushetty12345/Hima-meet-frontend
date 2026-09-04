import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Easing,
  TouchableOpacity,
  Platform,
  BackHandler,
  PermissionsAndroid,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { MessageCircle, Bell } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { saveProfileSetup } from '../api/onboardingApi';
import { setAuthToken } from '../../../api/apiClient';

const STATUSBAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

type RootStackParamList = {
  NotificationSetup: { gender?: string, avatar_id?: number, language_id?: number } | undefined;
  Home: undefined;
  [key: string]: undefined | object;
};

type Props = NativeStackScreenProps<RootStackParamList, 'NotificationSetup'>;

// ---- Palette pulled from the Himameet mark ----
const PLUM_DEEP = '#1A0733';
const PLUM_MID = '#3A0F63';
const PLUM_ROYAL = '#5B0E8B';
const GOLD = '#F5C542';
const GOLD_DEEP = '#D4AF37';

type BenefitItem = {
  key: string;
  title: string;
  description: string;
};

const BENEFITS: BenefitItem[] = [
  {
    key: 'calls',
    title: 'Incoming calls',
    description: 'Know instantly when a friend calls you.',
  },
  {
    key: 'messages',
    title: 'New messages',
    description: 'Never miss a chat from someone special.',
  },
  {
    key: 'online',
    title: "When they're online",
    description: 'Get pinged the moment a creator comes online.',
  },
];

const NotificationSetupScreen: React.FC<Props> = ({ route, navigation }) => {
  const gender = route.params?.gender || 'male';
  const avatar_id = route.params?.avatar_id || 1;
  const language_id = route.params?.language_id || 1;

  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(24)).current;
  const ctaOpacity = useRef(new Animated.Value(0)).current;
  const ctaTranslateY = useRef(new Animated.Value(24)).current;
  const sparkleTwinkle = useRef(new Animated.Value(0.4)).current;

  React.useEffect(() => {
    StatusBar.setBarStyle('light-content');

    Animated.sequence([
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 420,
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
      Animated.parallel([
        Animated.timing(ctaOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.spring(ctaTranslateY, {
          toValue: 0,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

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

    return () => {
      StatusBar.setBarStyle('dark-content');
    };
  }, []);

  // ── Disable hardware back button — last onboarding step ──
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, []);

  const completeSetup = async () => {
    try {
      const res = await saveProfileSetup({ gender, avatar_id, language_id });
      // Save the new real user token securely
      if (res.data?.data?.token) {
        await setAuthToken(res.data.data.token);
      }
      navigation.navigate('Home');
    } catch (e) {
      console.error('Failed to complete setup', e);
      // Fallback
      navigation.navigate('Home');
    }
  };

  const handleEnableNotifications = async () => {
    if (Platform.OS === 'android') {
      try {
        // Android 13+ requires POST_NOTIFICATIONS permission
        if (Platform.Version >= 33) {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
        }
      } catch (e) {
        console.log('Notification permission error', e);
      }
    }
    // iOS: handled natively by the OS when you call requestPermission
    // For now just complete setup — integrate PushNotification lib later
    completeSetup();
  };

  const handleMaybeLater = () => {
    completeSetup();
  };

  return (
    <LinearGradient
      colors={[PLUM_DEEP, PLUM_MID, PLUM_ROYAL]}
      start={{ x: 0.15, y: 0 }}
      end={{ x: 0.85, y: 1 }}
      style={styles.flex}
    >
      <StatusBar barStyle="light-content" {...(Platform.OS === 'android' && { translucent: true, backgroundColor: 'transparent' })} />

      {/* Soft golden light glows, matching the splash backdrop */}
      <View style={[styles.glow, styles.glowTopRight]} />
      <View style={[styles.glow, styles.glowBottomLeft]} />

      <View style={styles.statusBarSpacer} />

      <View style={styles.content}>
        <Animated.View
          style={{
            opacity: contentOpacity,
            transform: [{ translateY: contentTranslateY }],
          }}
        >
          <View style={styles.illustrationWrap}>
            <MessageCircle
              size={64}
              color={GOLD_DEEP}
              strokeWidth={1.8}
              style={styles.bubbleBack}
            />
            <MessageCircle
              size={54}
              color={GOLD}
              strokeWidth={1.8}
              style={styles.bubbleFront}
            />
            <Animated.Text style={[styles.sparkle, { opacity: sparkleTwinkle }]}>
              ✦
            </Animated.Text>
          </View>

          <Text style={styles.title}>Stay connected</Text>
          <Text style={styles.subtitle}>
            Turn on notifications so you never miss a moment on Himameet.
          </Text>

          <View style={styles.benefitList}>
            {BENEFITS.map(item => (
              <View key={item.key} style={styles.benefitRow}>
                <LinearGradient
                  colors={[GOLD, GOLD_DEEP]}
                  style={styles.benefitIconCircle}
                >
                  <Bell size={18} color={PLUM_DEEP} />
                </LinearGradient>
                <View style={styles.benefitTextBlock}>
                  <Text style={styles.benefitTitle}>{item.title}</Text>
                  <Text style={styles.benefitDescription}>
                    {item.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>
      </View>

      <Animated.View
        style={[
          styles.footer,
          {
            opacity: ctaOpacity,
            transform: [{ translateY: ctaTranslateY }],
          },
        ]}
      >
        <TouchableOpacity activeOpacity={0.7} onPress={handleMaybeLater}>
          <Text style={styles.maybeLaterText}>Maybe later</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleEnableNotifications}
          style={styles.ctaWrapper}
        >
          <LinearGradient
            colors={[GOLD, GOLD_DEEP]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaButton}
          >
            <Text style={styles.ctaText}>Enable notifications</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  glow: {
    position: 'absolute',
    borderRadius: 999,
  },
  glowTopRight: {
    width: 260,
    height: 260,
    top: -90,
    right: -80,
    backgroundColor: 'rgba(245, 197, 66, 0.10)',
  },
  glowBottomLeft: {
    width: 200,
    height: 200,
    bottom: 40,
    left: -70,
    backgroundColor: 'rgba(184, 90, 232, 0.14)',
  },

  statusBarSpacer: {
    height: STATUSBAR_HEIGHT,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
    marginTop: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  illustrationWrap: {
    width: 100,
    height: 84,
    marginBottom: 28,
  },
  bubbleBack: {
    position: 'absolute',
    top: -18,
    left: 0,
    opacity: 1,
  },
  bubbleFront: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  sparkle: {
    position: 'absolute',
    top: -4,
    right: 4,
    fontSize: 16,
    color: GOLD,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(233, 214, 255, 0.85)',
    lineHeight: 22,
    marginBottom: 32,
  },
  benefitList: {
    gap: 22,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  benefitIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    shadowColor: GOLD_DEEP,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  benefitTextBlock: {
    flex: 1,
    paddingTop: 2,
  },
  benefitTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  benefitDescription: {
    fontSize: 13,
    color: 'rgba(233, 214, 255, 0.75)',
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 28,
    alignItems: 'center',
  },
  maybeLaterText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(233, 214, 255, 0.85)',
    marginBottom: 18,
  },
  ctaWrapper: {
    width: '100%',
    borderRadius: 999,
    overflow: 'hidden',
    shadowColor: GOLD_DEEP,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
  ctaButton: {
    width: '100%',
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
});

export default NotificationSetupScreen;