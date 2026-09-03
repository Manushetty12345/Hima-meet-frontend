import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Easing,
  TouchableOpacity,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, MessageCircle, Bell } from 'lucide-react-native';
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

    return () => {
      StatusBar.setBarStyle('dark-content');
    };
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

  const handleEnableNotifications = () => {
    // TODO: trigger the native notification permission prompt here
    completeSetup();
  };

  const handleMaybeLater = () => {
    completeSetup();
  };

  return (
    <LinearGradient
      colors={['#AD0F5D', '#E0166F', '#EA2D7C']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.flex}
    >
      <StatusBar barStyle="light-content" {...(Platform.OS === 'android' && { translucent: true, backgroundColor: 'transparent' })} />
      <View style={styles.statusBarSpacer} />

      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.8}
        onPress={() => navigation.goBack()}
      >
        <ArrowLeft size={20} color="#E0166F" />
      </TouchableOpacity>

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
              color="#FFFFFF"
              strokeWidth={1.8}
              style={styles.bubbleBack}
            />
            <MessageCircle
              size={54}
              color="#FFFFFF"
              strokeWidth={1.8}
              style={styles.bubbleFront}
            />
          </View>

          <Text style={styles.title}>Stay connected</Text>
          <Text style={styles.subtitle}>
            Turn on notifications so you never miss a moment on Hima.
          </Text>

          <View style={styles.benefitList}>
            {BENEFITS.map(item => (
              <View key={item.key} style={styles.benefitRow}>
                <View style={styles.benefitIconCircle}>
                  <Bell size={18} color="#FFFFFF" />
                </View>
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
          style={styles.ctaButton}
        >
          <Text style={styles.ctaText}>Enable notifications</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  statusBarSpacer: {
    height: STATUSBAR_HEIGHT,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
    marginTop: 8,
    shadowColor: '#4A0F6E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
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
    top: 0,
    left: 0,
  },
  bubbleFront: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
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
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
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
    color: 'rgba(255,255,255,0.75)',
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
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 18,
  },
  ctaButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4A0F6E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 6,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E0166F',
    letterSpacing: 0.3,
  },
});

export default NotificationSetupScreen;
