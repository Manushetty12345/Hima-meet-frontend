import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Mic, ArrowLeft, Sparkles } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';
import VoiceReader from '../components/VoiceReader';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;
const TOTAL_STEPS = 4;
const CURRENT_STEP = 4; // Assuming this is the final step

type Props = NativeStackScreenProps<AuthStackParamList, 'VoiceVerification'>;

// ---- Palette pulled from the Himameet mark ----
const PLUM_ROYAL = '#5B0E8B';
const PLUM_DEEP = '#3D0A63';
const GOLD = '#F5C542';
const GOLD_DEEP = '#D4AF37';
const IVORY = '#FBF6EC';
const IVORY_LINE = '#EBDFC4';
const TEXT_PLUM = '#2A1240';
const TEXT_MUTED = '#8B7F98';

// Light lavender header wash — matches every other screen in the app
const LILAC_WHITE = '#FBF7FF';
const LILAC_PALE = '#EFDFFB';

const VoiceVerificationScreen: React.FC<Props> = ({ route, navigation }) => {
  const { gender, avatar_id, language_id, age, selectedInterests, bio } = route.params || {};
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  // ---- Purely visual animation refs ----
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(20)).current;
  const glowPulse = useRef(new Animated.Value(1)).current;
  const sparklePulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBottomSheet(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(translateAnim, {
        toValue: 0,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();

    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 1.15,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    glowLoop.start();

    const sparkleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(sparklePulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(sparklePulse, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
    );
    sparkleLoop.start();

    return () => {
      glowLoop.stop();
      sparkleLoop.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <LinearGradient
        colors={[LILAC_WHITE, LILAC_PALE]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.statusBarSpacer} />

        {/* Header: Back + Progress */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={20} color={PLUM_ROYAL} />
          </TouchableOpacity>

          <View style={styles.progressTrack}>
            {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressSegment,
                  index < CURRENT_STEP && styles.progressSegmentActive,
                ]}
              />
            ))}
          </View>
        </View>
      </LinearGradient>

      {/* Decorative background blobs */}
      <View style={styles.bgBlobTop} pointerEvents="none" />
      <View style={styles.bgBlobBottom} pointerEvents="none" />

      {/* Main Content Area */}
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: translateAnim }] },
        ]}
      >
        <View style={styles.micStack}>
          <Animated.View style={[styles.micGlow, { transform: [{ scale: glowPulse }] }]} />
          <LinearGradient colors={[PLUM_ROYAL, PLUM_DEEP]} style={styles.micCircle}>
            <Mic size={44} color="#FFFFFF" strokeWidth={1.5} />
          </LinearGradient>
          <Animated.View
            style={[
              styles.sparkleBadge,
              {
                opacity: sparklePulse,
                transform: [
                  {
                    scale: sparklePulse.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.7, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Sparkles size={14} color="#2A1240" />
          </Animated.View>
        </View>

        <Text style={styles.title}>Voice identification</Text>
        <LinearGradient
          colors={[GOLD, GOLD_DEEP]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.divider}
        />
        <Text style={styles.subtitle}>
          To confirm your identity, please record yourself saying the following sentence
        </Text>
      </Animated.View>

      <Modal
        visible={showBottomSheet}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.dragHandle} />
            <VoiceReader
              onSubmit={(audioUri) => {
                setShowBottomSheet(false);
                setTimeout(() => {
                  navigation.navigate('ProfileReview', { gender, avatar_id, language_id, age, selectedInterests, bio, audioUri });
                }, 150);
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: IVORY,
  },
  headerGradient: {
    overflow: 'hidden',
    zIndex: 2,
  },
  statusBarSpacer: {
    height: STATUSBAR_HEIGHT,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(91, 14, 139, 0.10)',
    borderWidth: 1.5,
    borderColor: 'rgba(91, 14, 139, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  progressTrack: {
    flex: 1,
    flexDirection: 'row',
    height: 6,
    gap: 6,
  },
  progressSegment: {
    flex: 1,
    height: '100%',
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderRadius: 3,
  },
  progressSegmentActive: {
    backgroundColor: GOLD_DEEP,
  },
  bgBlobTop: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
  },
  bgBlobBottom: {
    position: 'absolute',
    bottom: 40,
    left: -70,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(91, 14, 139, 0.05)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 60,
  },
  micStack: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  micGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(91, 14, 139, 0.12)',
  },
  micCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PLUM_ROYAL,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  sparkleBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: IVORY,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: TEXT_PLUM,
    marginBottom: 16,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  divider: {
    width: 36,
    height: 3,
    borderRadius: 2,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    color: TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(26, 7, 51, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: '85%',
    shadowColor: '#3A0F63',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: IVORY_LINE,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(42, 18, 64, 0.45)',
    justifyContent: 'flex-end',
  },
  bottomSheetContainer: {
    backgroundColor: IVORY,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1.5,
    borderColor: IVORY_LINE,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
});

export default VoiceVerificationScreen;