import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Phone, ShieldCheck, Clock, HelpCircle } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';

const STATUSBAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

type Props = NativeStackScreenProps<AuthStackParamList, 'ProfileReview'>;

type NextStepItem = {
  key: string;
  icon: typeof Phone;
  text: string;
};

const NEXT_STEPS: NextStepItem[] = [
  {
    key: 'call',
    icon: Phone,
    text: 'You will receive a verification call from our team',
  },
  {
    key: 'guidelines',
    icon: ShieldCheck,
    text: 'We will explain safety procedures and platform guidelines',
  },
  {
    key: 'timing',
    icon: Clock,
    text: 'Expect our call within 24 hours',
  },
];

const ProfileReviewScreen: React.FC<Props> = ({ navigation }) => {
  const hourglassRotate = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(16)).current;
  const dotOpacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');

    Animated.timing(contentOpacity, {
      toValue: 1,
      duration: 420,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
    Animated.spring(contentTranslateY, {
      toValue: 0,
      friction: 8,
      tension: 50,
      useNativeDriver: true,
    }).start();

    const hourglassLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(hourglassRotate, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(700),
        Animated.timing(hourglassRotate, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(700),
      ]),
    );
    hourglassLoop.start();

    const dotLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(dotOpacity, {
          toValue: 1,
          duration: 550,
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity, {
          toValue: 0.4,
          duration: 550,
          useNativeDriver: true,
        }),
      ]),
    );
    dotLoop.start();

    return () => {
      hourglassLoop.stop();
      dotLoop.stop();
    };
  }, []);

  const rotateInterpolate = hourglassRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.statusBarSpacer} />

      <LinearGradient
        colors={['#FDE9F1', '#FFFFFF']}
        style={styles.topSection}
      >
        <Animated.Text
          style={[
            styles.hourglassGlyph,
            { transform: [{ rotate: rotateInterpolate }] },
          ]}
        >
          â³
        </Animated.Text>

        <Text style={styles.title}>Almost done...</Text>
        <View style={styles.titleUnderline} />
        <Text style={styles.subtitle}>Your profile is under review</Text>
      </LinearGradient>

      <Animated.View
        style={[
          styles.body,
          {
            opacity: contentOpacity,
            transform: [{ translateY: contentTranslateY }],
          },
        ]}
      >
        <View style={styles.processingRow}>
          <Text style={styles.processingText}>Processing your application</Text>
          <Animated.Text
            style={[styles.processingDots, { opacity: dotOpacity }]}
          >
            ...
          </Animated.Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>What happens next?</Text>
          <Text style={styles.cardDescription}>
            Our team will reach out to you within 24hrs via phone call. This
            is to explain about safety procedures on the platform.
          </Text>

          <View style={styles.stepsDivider} />

          {NEXT_STEPS.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <View
                key={step.key}
                style={[
                  styles.stepRow,
                  index === NEXT_STEPS.length - 1 && styles.stepRowLast,
                ]}
              >
                <View style={styles.stepIconCircle}>
                  <StepIcon size={16} color="#FFFFFF" />
                </View>
                <Text style={styles.stepText}>{step.text}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.footerRow}>
          <HelpCircle size={14} color="#B4A6BE" />
          <Text style={styles.footerText}>
            For any queries please contact support
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.ctaButton}
          onPress={() => navigation.replace('CreatorDashboard')}
        >
          <Text style={styles.ctaText}>Go to Dashboard</Text>
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
    backgroundColor: '#FDE9F1',
  },
  topSection: {
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  hourglassGlyph: {
    fontSize: 56,
    marginBottom: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#EC1372',
    marginBottom: 10,
  },
  titleUnderline: {
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#EC1372',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#8A7A9C',
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 22,
  },
  processingRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 22,
  },
  processingText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#EC1372',
  },
  processingDots: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#EC1372',
  },
  card: {
    backgroundColor: '#F7F5FA',
    borderRadius: 20,
    padding: 20,
  },
  cardTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#1B0E22',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 13.5,
    color: '#6E6178',
    lineHeight: 20,
    marginBottom: 18,
  },
  stepsDivider: {
    height: 1,
    backgroundColor: '#E7E1EC',
    marginBottom: 18,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  stepRowLast: {
    marginBottom: 0,
  },
  stepIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1B0E22',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 13.5,
    color: '#3A2E44',
    lineHeight: 19,
    paddingTop: 6,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#B4A6BE',
  },
});

export default ProfileReviewScreen;


