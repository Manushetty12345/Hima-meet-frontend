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
import { Phone, ShieldCheck, Clock, HelpCircle, LayoutDashboard } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';

const STATUSBAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

type Props = NativeStackScreenProps<AuthStackParamList, 'ProfileReview'>;

// ---- Palette pulled from the Himameet mark ----
const PLUM_ROYAL = '#5B0E8B';
const PLUM_DEEP = '#3D0A63';
const GOLD = '#F5C542';
const GOLD_DEEP = '#D4AF37';
const IVORY = '#FBF6EC';
const IVORY_LINE = '#EBDFC4';
const TEXT_PLUM = '#2A1240';
const TEXT_MUTED = '#8B7F98';

// Light lavender header wash
const LILAC_WHITE = '#FBF7FF';
const LILAC_PALE = '#EFDFFB';

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

      <LinearGradient
        colors={[LILAC_WHITE, LILAC_PALE]}
        style={styles.topSection}
      >
        <View style={styles.statusBarSpacer} />

        {/* Dashboard Icon at Top Right */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.dashboardBtn}
            onPress={() => navigation.replace('CreatorDashboard')}
          >
            <LayoutDashboard size={20} color={PLUM_ROYAL} />
          </TouchableOpacity>
        </View>

        <Animated.View style={{ transform: [{ rotate: rotateInterpolate }], marginTop: 10 }}>
          {/* We replace the text emoji with a styled container for an hourglass look */}
          <LinearGradient
            colors={[GOLD, GOLD_DEEP]}
            style={styles.hourglassWrapper}
          >
            <Text style={styles.hourglassGlyph}>⏳</Text>
          </LinearGradient>
        </Animated.View>

        <Text style={styles.title}>Almost done...</Text>
        <LinearGradient
          colors={[GOLD, GOLD_DEEP]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.titleUnderline}
        />
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
                <LinearGradient
                  colors={[GOLD, GOLD_DEEP]}
                  style={styles.stepIconCircle}
                >
                  <StepIcon size={16} color="#2A1240" />
                </LinearGradient>
                <Text style={styles.stepText}>{step.text}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.footerRow}>
          <HelpCircle size={14} color={TEXT_MUTED} />
          <Text style={styles.footerText}>
            For any queries please contact support
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: IVORY,
  },
  statusBarSpacer: {
    height: STATUSBAR_HEIGHT,
  },
  topSection: {
    alignItems: 'center',
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: PLUM_ROYAL,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 8,
    zIndex: 10,
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  dashboardBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(91, 14, 139, 0.10)',
    borderWidth: 1.5,
    borderColor: 'rgba(91, 14, 139, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hourglassWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: GOLD_DEEP,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  hourglassGlyph: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: TEXT_PLUM,
    marginBottom: 8,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  titleUnderline: {
    width: 46,
    height: 4,
    borderRadius: 2,
    marginBottom: 14,
  },
  subtitle: {
    fontSize: 15,
    color: TEXT_MUTED,
    fontWeight: '500',
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  processingRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 26,
  },
  processingText: {
    fontSize: 14,
    fontWeight: '700',
    color: PLUM_ROYAL,
  },
  processingDots: {
    fontSize: 14,
    fontWeight: '700',
    color: PLUM_ROYAL,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    shadowColor: PLUM_ROYAL,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: TEXT_PLUM,
    marginBottom: 12,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  cardDescription: {
    fontSize: 14,
    color: TEXT_MUTED,
    lineHeight: 22,
    marginBottom: 20,
  },
  stepsDivider: {
    height: 1,
    backgroundColor: IVORY_LINE,
    marginBottom: 20,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  stepRowLast: {
    marginBottom: 0,
  },
  stepIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: TEXT_PLUM,
    lineHeight: 20,
    fontWeight: '500',
    paddingTop: 6,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 28,
  },
  footerText: {
    fontSize: 13,
    color: TEXT_MUTED,
    fontWeight: '500',
  },
});

export default ProfileReviewScreen;
