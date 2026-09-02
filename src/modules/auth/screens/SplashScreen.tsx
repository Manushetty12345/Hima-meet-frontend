import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';
import { getSavedToken } from '../../../api/apiClient';
import { checkSession } from '../api/authApi';

const { width, height } = Dimensions.get('window');

type Props = NativeStackScreenProps<AuthStackParamList, 'SplashScreen'>;

const SPLASH_DURATION = 2800;

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  // Logo entrance + breathing loop
  const logoScale = useRef(new Animated.Value(0.4)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const breathe = useRef(new Animated.Value(1)).current;

  // Orbit rings around the logo
  const ringRotateA = useRef(new Animated.Value(0)).current;
  const ringRotateB = useRef(new Animated.Value(0)).current;

  // Wordmark reveal
  const wordHiOpacity = useRef(new Animated.Value(0)).current;
  const wordHiTranslate = useRef(new Animated.Value(-14)).current;
  const wordMeetOpacity = useRef(new Animated.Value(0)).current;
  const wordMeetTranslate = useRef(new Animated.Value(14)).current;

  // Shine sweep across wordmark
  const shineX = useRef(new Animated.Value(-1)).current;

  // Tagline
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  // Loader arc rotation
  const loaderRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');

    Animated.sequence([
      // 1. Logo pops in
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 5,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      // 2. Wordmark halves slide in from opposite sides
      Animated.parallel([
        Animated.timing(wordHiOpacity, {
          toValue: 1,
          duration: 380,
          useNativeDriver: true,
        }),
        Animated.timing(wordHiTranslate, {
          toValue: 0,
          duration: 380,
          easing: Easing.out(Easing.back(1.4)),
          useNativeDriver: true,
        }),
        Animated.timing(wordMeetOpacity, {
          toValue: 1,
          duration: 380,
          useNativeDriver: true,
        }),
        Animated.timing(wordMeetTranslate, {
          toValue: 0,
          duration: 380,
          easing: Easing.out(Easing.back(1.4)),
          useNativeDriver: true,
        }),
      ]),
      // 3. Tagline fades up
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      // 4. Shine sweep across the wordmark, once
      Animated.timing(shineX, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Breathing pulse on the logo, looping forever
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1.06,
          duration: 1100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(breathe, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Two orbit rings spinning in opposite directions
    Animated.loop(
      Animated.timing(ringRotateA, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
    Animated.loop(
      Animated.timing(ringRotateB, {
        toValue: 1,
        duration: 4200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    // Loader arc spin
    Animated.loop(
      Animated.timing(loaderRotate, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    // Session check + navigation, same logic as before
    const checkSessionAndNavigate = async () => {
      const startTime = Date.now();
      let nextScreen: keyof AuthStackParamList = 'LoginScreen';

      try {
        const token = await getSavedToken();
        if (token) {
          const res = await checkSession();
          if (res.status === 'success') {
            const data = res.data;
            if (data.is_new_user) {
              nextScreen = 'GenderSelect';
            } else if (data.user) {
              if (data.user.role === 'female') {
                nextScreen = 'CreatorDashboard' as any;
              } else {
                nextScreen = 'Home' as any;
              }
            }
          }
        }
      } catch (e) {
        console.log('Session check failed', e);
      }

      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, SPLASH_DURATION - elapsed);

      setTimeout(() => {
        navigation.replace(nextScreen as any);
      }, remainingTime);
    };

    checkSessionAndNavigate();
  }, [navigation]);

  const spinA = ringRotateA.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const spinB = ringRotateB.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });
  const loaderSpin = loaderRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const shineTranslate = shineX.interpolate({
    inputRange: [-1, 1],
    outputRange: [-WORD_WIDTH, WORD_WIDTH],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0B1220', '#12213B', '#1B2E4A']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.gradient}
      >
        {/* Organic accent blobs — teal + coral, unlike a single-tone background */}
        <View style={[styles.blob, styles.blobTeal]} />
        <View style={[styles.blob, styles.blobCoral]} />
        <View style={[styles.blob, styles.blobGoldSmall]} />

        <View style={styles.content}>
          {/* Logo with dual orbit rings + glow, replacing a plain circular badge */}
          <View style={styles.logoStage}>
            <Animated.View
              style={[
                styles.orbitRing,
                styles.orbitRingOuter,
                { transform: [{ rotate: spinA }] },
              ]}
            >
              <View style={styles.orbitDotTeal} />
            </Animated.View>
            <Animated.View
              style={[
                styles.orbitRing,
                styles.orbitRingInner,
                { transform: [{ rotate: spinB }] },
              ]}
            >
              <View style={styles.orbitDotCoral} />
            </Animated.View>

            <Animated.View
              style={[
                styles.logoWrapper,
                {
                  opacity: logoOpacity,
                  transform: [
                    { scale: Animated.multiply(logoScale, breathe) },
                  ],
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

          {/* Split, two-tone wordmark with a shine sweep, instead of one static line */}
          <View style={styles.wordmarkClip}>
            <View style={styles.wordmarkRow}>
              <Animated.Text
                style={[
                  styles.wordHi,
                  {
                    opacity: wordHiOpacity,
                    transform: [{ translateX: wordHiTranslate }],
                  },
                ]}
              >
Hima
</Animated.Text>
              <Animated.Text
                style={[
                  styles.wordMeet,
                  {
                    opacity: wordMeetOpacity,
                    transform: [{ translateX: wordMeetTranslate }],
                  },
                ]}
              >
Meet
</Animated.Text>
            </View>
            <Animated.View
              pointerEvents="none"
              style={[
                styles.shine,
                { transform: [{ translateX: shineTranslate }, { rotate: '18deg' }] },
              ]}
            />
          </View>

          <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
            Real People. Real Moments.
          </Animated.Text>
        </View>

        {/* Rotating arc loader, replacing plain pulsing dots */}
        <View style={styles.footer}>
          <Animated.View
            style={[styles.loaderArc, { transform: [{ rotate: loaderSpin }] }]}
          />
          <Text style={styles.loadingText}>Getting things ready…</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const CIRCLE_LARGE = width * 0.55;
const CIRCLE_MED = width * 0.4;
const CIRCLE_SMALL = width * 0.24;
const LOGO_SIZE = width * 0.48;
const STAGE_SIZE = width * 0.65;
const WORD_WIDTH = width * 0.7;

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: {
    flex: 1,
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center',
  },

  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  blobTeal: {
    width: CIRCLE_LARGE,
    height: CIRCLE_LARGE,
    top: -CIRCLE_LARGE * 0.3,
    right: -CIRCLE_LARGE * 0.3,
    backgroundColor: 'rgba(45, 212, 191, 0.14)',
  },
  blobCoral: {
    width: CIRCLE_MED,
    height: CIRCLE_MED,
    bottom: height * 0.1,
    left: -CIRCLE_MED * 0.35,
    backgroundColor: 'rgba(255, 111, 97, 0.14)',
  },
  blobGoldSmall: {
    width: CIRCLE_SMALL,
    height: CIRCLE_SMALL,
    top: height * 0.35,
    right: -CIRCLE_SMALL * 0.3,
    backgroundColor: 'rgba(255, 195, 100, 0.10)',
  },

  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoStage: {
    width: STAGE_SIZE,
    height: STAGE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  orbitRing: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
  },
  orbitRingOuter: {
    width: STAGE_SIZE,
    height: STAGE_SIZE,
    borderColor: 'rgba(45, 212, 191, 0.35)',
    borderStyle: 'dashed',
  },
  orbitRingInner: {
    width: STAGE_SIZE * 0.78,
    height: STAGE_SIZE * 0.78,
    borderColor: 'rgba(255, 111, 97, 0.3)',
  },
  orbitDotTeal: {
    position: 'absolute',
    top: -4,
    left: '50%',
    marginLeft: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2DD4BF',
  },
  orbitDotCoral: {
    position: 'absolute',
    bottom: -4,
    left: '50%',
    marginLeft: -4,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FF6F61',
  },
  logoWrapper: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE / 2,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: '68%',
    height: '68%',
  },

  wordmarkClip: {
    overflow: 'hidden',
    paddingHorizontal: 4,
  },
  wordmarkRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  wordHi: {
    fontSize: 34,
    fontWeight: '800',
    fontStyle: 'italic',
    color: '#FF6F61',
    letterSpacing: 0.5,
  },
  wordMeet: {
    fontSize: 34,
    fontWeight: '300',
    color: '#F5F7FA',
    letterSpacing: 1.5,
    marginLeft: 4,
  },
  shine: {
    position: 'absolute',
    top: -20,
    width: 40,
    height: 90,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },

  tagline: {
    fontSize: 13,
    color: 'rgba(200, 220, 235, 0.75)',
    marginTop: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '500',
  },

  footer: {
    position: 'absolute',
    bottom: height * 0.08,
    alignItems: 'center',
  },
  loaderArc: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.15)',
    borderTopColor: '#2DD4BF',
    borderRightColor: '#FF6F61',
    marginBottom: 12,
  },
  loadingText: {
    color: 'rgba(200, 220, 235, 0.7)',
    fontSize: 12,
    letterSpacing: 0.8,
  },
});

export default SplashScreen;
