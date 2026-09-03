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

// ---- Palette pulled from the Himameet mark ----
const PLUM_DEEP = '#1A0733';
const PLUM_MID = '#3A0F63';
const PLUM_ROYAL = '#5B0E8B';
const GOLD = '#F5C542';
const GOLD_DEEP = '#D4AF37';
const GOLD_SOFT = 'rgba(245, 197, 66, 0.55)';
const LILAC_TEXT = 'rgba(233, 214, 255, 0.85)';

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  // Logo entrance + breathing loop
  const logoScale = useRef(new Animated.Value(0.4)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const breathe = useRef(new Animated.Value(1)).current;

  // Halo ring + orbiting sparkle cluster around the logo
  const haloRotate = useRef(new Animated.Value(0)).current;
  const sparkleRotate = useRef(new Animated.Value(0)).current;
  const sparkleTwinkle = useRef(new Animated.Value(0.4)).current;

  // Wordmark reveal
  const wordHimaOpacity = useRef(new Animated.Value(0)).current;
  const wordHimaTranslate = useRef(new Animated.Value(-16)).current;
  const wordMeetOpacity = useRef(new Animated.Value(0)).current;
  const wordMeetTranslate = useRef(new Animated.Value(16)).current;

  // Gold shine sweep across wordmark
  const shineX = useRef(new Animated.Value(-1)).current;

  // Ornamental flourish (heart + scroll divider) draw-in
  const flourishScale = useRef(new Animated.Value(0)).current;
  const flourishOpacity = useRef(new Animated.Value(0)).current;

  // Tagline
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslate = useRef(new Animated.Value(8)).current;

  // Footer dot pulse (3 dots, staggered)
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');

    Animated.sequence([
      // 1. Logo pops in with a soft golden bloom
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 5,
          tension: 55,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      // 2. Wordmark halves glide in from opposite sides
      Animated.parallel([
        Animated.timing(wordHimaOpacity, {
          toValue: 1,
          duration: 420,
          useNativeDriver: true,
        }),
        Animated.timing(wordHimaTranslate, {
          toValue: 0,
          duration: 420,
          easing: Easing.out(Easing.back(1.3)),
          useNativeDriver: true,
        }),
        Animated.timing(wordMeetOpacity, {
          toValue: 1,
          duration: 420,
          useNativeDriver: true,
        }),
        Animated.timing(wordMeetTranslate, {
          toValue: 0,
          duration: 420,
          easing: Easing.out(Easing.back(1.3)),
          useNativeDriver: true,
        }),
      ]),
      // 3. Ornamental flourish blooms open beneath the wordmark
      Animated.parallel([
        Animated.spring(flourishScale, {
          toValue: 1,
          friction: 6,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.timing(flourishOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      // 4. Tagline rises softly into place
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 380,
          useNativeDriver: true,
        }),
        Animated.timing(taglineTranslate, {
          toValue: 0,
          duration: 380,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      // 5. Gold shine sweeps once across the wordmark
      Animated.timing(shineX, {
        toValue: 1,
        duration: 950,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // 6. Footer fades in last
      Animated.timing(footerOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();

    // Breathing pulse on the logo, looping forever
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1.05,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(breathe, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Slow halo ring rotation
    Animated.loop(
      Animated.timing(haloRotate, {
        toValue: 1,
        duration: 9000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    // Orbiting sparkle cluster, opposite direction, faster
    Animated.loop(
      Animated.timing(sparkleRotate, {
        toValue: 1,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    // Twinkling sparkles
    Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleTwinkle, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(sparkleTwinkle, {
          toValue: 0.35,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Staggered footer dot pulse
    const pulseDot = (val: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, {
            toValue: 1,
            duration: 420,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(val, {
            toValue: 0.3,
            duration: 420,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      );
    pulseDot(dot1, 0).start();
    pulseDot(dot2, 180).start();
    pulseDot(dot3, 360).start();

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

  const haloSpin = haloRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const sparkleSpin = sparkleRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });
  const shineTranslate = shineX.interpolate({
    inputRange: [-1, 1],
    outputRange: [-WORD_WIDTH, WORD_WIDTH],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[PLUM_DEEP, PLUM_MID, PLUM_ROYAL]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={styles.gradient}
      >
        {/* Soft golden light glows, not flat pastel blobs */}
        <View style={[styles.glow, styles.glowTopRight]} />
        <View style={[styles.glow, styles.glowBottomLeft]} />
        <View style={[styles.glow, styles.glowCenterFaint]} />

        {/* Faint damask-style corner flourishes, echoing the logo backdrop */}
        <View style={styles.cornerFlourishTL} />
        <View style={styles.cornerFlourishBR} />

        <View style={styles.content}>
          {/* Logo with rotating halo ring + orbiting sparkle cluster */}
          <View style={styles.logoStage}>
            <Animated.View
              style={[styles.haloRing, { transform: [{ rotate: haloSpin }] }]}
            />

            <Animated.View
              style={[
                styles.sparkleOrbit,
                { transform: [{ rotate: sparkleSpin }] },
              ]}
            >
              <Animated.Text
                style={[styles.sparkleTop, { opacity: sparkleTwinkle }]}
              >
                ✦
              </Animated.Text>
              <Animated.Text
                style={[styles.sparkleRight, { opacity: sparkleTwinkle }]}
              >
                ✧
              </Animated.Text>
              <Animated.Text
                style={[styles.sparkleBottom, { opacity: sparkleTwinkle }]}
              >
                ✦
              </Animated.Text>
              <Animated.Text
                style={[styles.sparkleLeft, { opacity: sparkleTwinkle }]}
              >
                ✧
              </Animated.Text>
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

          {/* Two-tone gold wordmark with a shine sweep */}
          <View style={styles.wordmarkClip}>
            <View style={styles.wordmarkRow}>
              <Animated.Text
                style={[
                  styles.wordHima,
                  {
                    opacity: wordHimaOpacity,
                    transform: [{ translateX: wordHimaTranslate }],
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
                meet
              </Animated.Text>
            </View>
            <Animated.View
              pointerEvents="none"
              style={[
                styles.shine,
                {
                  transform: [
                    { translateX: shineTranslate },
                    { rotate: '18deg' },
                  ],
                },
              ]}
            />
          </View>

          {/* Ornamental heart-and-scroll flourish, pulled from the logo */}
          <Animated.View
            style={[
              styles.flourishRow,
              {
                opacity: flourishOpacity,
                transform: [{ scaleX: flourishScale }],
              },
            ]}
          >
            <View style={styles.flourishLine} />
            <Text style={styles.flourishHeart}>♥</Text>
            <View style={styles.flourishLine} />
          </Animated.View>

          <Animated.Text
            style={[
              styles.tagline,
              {
                opacity: taglineOpacity,
                transform: [{ translateY: taglineTranslate }],
              },
            ]}
          >
            Where Real Bonds Begin
          </Animated.Text>
        </View>

        {/* Three glowing gold dots, replacing a spinning loader arc */}
        <Animated.View style={[styles.footer, { opacity: footerOpacity }]}>
          <View style={styles.dotRow}>
            <Animated.View style={[styles.dot, { opacity: dot1 }]} />
            <Animated.View style={[styles.dot, { opacity: dot2 }]} />
            <Animated.View style={[styles.dot, { opacity: dot3 }]} />
          </View>
          <Text style={styles.loadingText}>Preparing your world…</Text>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const GLOW_LARGE = width * 0.65;
const GLOW_MED = width * 0.45;
const GLOW_FAINT = width * 0.9;
const LOGO_SIZE = width * 0.42;
const STAGE_SIZE = width * 0.62;
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

  glow: {
    position: 'absolute',
    borderRadius: 999,
  },
  glowTopRight: {
    width: GLOW_LARGE,
    height: GLOW_LARGE,
    top: -GLOW_LARGE * 0.35,
    right: -GLOW_LARGE * 0.3,
    backgroundColor: 'rgba(245, 197, 66, 0.10)',
  },
  glowBottomLeft: {
    width: GLOW_MED,
    height: GLOW_MED,
    bottom: height * 0.06,
    left: -GLOW_MED * 0.3,
    backgroundColor: 'rgba(184, 90, 232, 0.14)',
  },
  glowCenterFaint: {
    width: GLOW_FAINT,
    height: GLOW_FAINT,
    top: height * 0.28,
    left: -GLOW_FAINT * 0.15,
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
  },

  cornerFlourishTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 90,
    height: 90,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: 'rgba(245, 197, 66, 0.18)',
    borderTopLeftRadius: 24,
    margin: 22,
  },
  cornerFlourishBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 90,
    height: 90,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(245, 197, 66, 0.18)',
    borderBottomRightRadius: 24,
    margin: 22,
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
    marginBottom: 26,
  },
  haloRing: {
    position: 'absolute',
    width: STAGE_SIZE,
    height: STAGE_SIZE,
    borderRadius: STAGE_SIZE / 2,
    borderWidth: 1,
    borderColor: GOLD_SOFT,
    borderStyle: 'dashed',
  },
  sparkleOrbit: {
    position: 'absolute',
    width: STAGE_SIZE * 0.86,
    height: STAGE_SIZE * 0.86,
  },
  sparkleTop: {
    position: 'absolute',
    top: -6,
    left: '50%',
    marginLeft: -8,
    fontSize: 16,
    color: GOLD,
  },
  sparkleRight: {
    position: 'absolute',
    top: '50%',
    right: -6,
    marginTop: -8,
    fontSize: 13,
    color: GOLD_DEEP,
  },
  sparkleBottom: {
    position: 'absolute',
    bottom: -6,
    left: '50%',
    marginLeft: -8,
    fontSize: 14,
    color: GOLD,
  },
  sparkleLeft: {
    position: 'absolute',
    top: '50%',
    left: -6,
    marginTop: -8,
    fontSize: 13,
    color: GOLD_DEEP,
  },
  logoWrapper: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE / 2,
    backgroundColor: 'rgba(245, 197, 66, 0.07)',
    borderWidth: 1.5,
    borderColor: 'rgba(245, 197, 66, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: '72%',
    height: '72%',
  },

  wordmarkClip: {
    overflow: 'hidden',
    paddingHorizontal: 4,
  },
  wordmarkRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  wordHima: {
    fontSize: 38,
    fontStyle: 'italic',
    fontWeight: '700',
    color: GOLD,
    letterSpacing: 0.5,
    // Pair with a serif/display font in your font set, e.g. 'PlayfairDisplay-BoldItalic'
    fontFamily: 'PlayfairDisplay-BoldItalic',
    textShadowColor: 'rgba(245, 197, 66, 0.45)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  wordMeet: {
    fontSize: 34,
    fontWeight: '300',
    color: '#F3E9FF',
    letterSpacing: 3,
    marginLeft: 5,
    fontFamily: 'PlayfairDisplay-Regular',
  },
  shine: {
    position: 'absolute',
    top: -22,
    width: 46,
    height: 96,
    backgroundColor: 'rgba(255, 231, 160, 0.22)',
  },

  flourishRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    width: WORD_WIDTH * 0.72,
  },
  flourishLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(245, 197, 66, 0.4)',
  },
  flourishHeart: {
    color: GOLD,
    fontSize: 12,
    marginHorizontal: 10,
  },

  tagline: {
    fontSize: 12.5,
    color: LILAC_TEXT,
    marginTop: 14,
    letterSpacing: 3,
    textTransform: 'uppercase',
    fontWeight: '500',
  },

  footer: {
    position: 'absolute',
    bottom: height * 0.08,
    alignItems: 'center',
  },
  dotRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: GOLD,
    marginHorizontal: 4,
    shadowColor: GOLD,
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  loadingText: {
    color: 'rgba(233, 214, 255, 0.65)',
    fontSize: 12,
    letterSpacing: 1,
  },
});

export default SplashScreen;