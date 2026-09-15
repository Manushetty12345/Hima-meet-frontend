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
import { Phone, ShieldCheck, Clock, HelpCircle, LayoutDashboard, CheckCircle2, AlertCircle } from 'lucide-react-native';
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

import { submitCreatorApplication } from '../api/onboardingApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken } from '../../../api/apiClient';
import { checkSession } from '../../auth/api/authApi';

const ProfileReviewScreen: React.FC<Props> = ({ navigation, route }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(true);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  useEffect(() => {
    // Prevent going back (hardware button or gesture)
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (e.data.action.type === 'GO_BACK') {
        e.preventDefault();
      }
    });

    const submit = async () => {
      try {
        const params = route.params;
        if (!params || !params.audioUri) {
          // Arrived here from SplashScreen — application already submitted, just show UI
          setIsSubmitting(false);
          return;
        }
        const response = await submitCreatorApplication(params, params.audioUri || '');
        if (response.data?.status === 'success') {
          if (response.data.data.token) {
            await AsyncStorage.setItem('userToken', response.data.data.token);
            await setAuthToken(response.data.data.token);
            await AsyncStorage.setItem('userRole', 'creator');
          }
          setIsSubmitting(false);
        } else {
          setSubmitError(response.data?.message || 'Submission failed');
          setIsSubmitting(false);
        }
      } catch (err: any) {
        setSubmitError(err.message || 'Network error');
        setIsSubmitting(false);
      }
    };
    submit();

    // Poll every 15 seconds to check if admin has approved
    const pollInterval = setInterval(async () => {
      try {
        const res = await checkSession();
        if (res.status === 'success' && res.data?.application_status === 'approved') {
          clearInterval(pollInterval);
          navigation.replace('CreatorDashboard' as any);
        }
      } catch (_) {
        // Silently ignore polling errors
      }
    }, 15000);

    return () => {
      clearInterval(pollInterval);
      unsubscribe();
    };
  }, [route.params]);

  const StatusIcon = submitError ? AlertCircle : isSubmitting ? Clock : CheckCircle2;
  const statusColor = submitError ? '#C0435A' : PLUM_ROYAL;
  const statusBg = submitError ? 'rgba(192, 67, 90, 0.10)' : 'rgba(91, 14, 139, 0.08)';
  const statusBorder = submitError ? 'rgba(192, 67, 90, 0.30)' : 'rgba(91, 14, 139, 0.20)';

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" />

      <LinearGradient
        colors={[LILAC_WHITE, LILAC_PALE]}
        style={styles.topSection}
      >
        {/* Decorative background texture */}
        <View style={styles.topBlobLeft} pointerEvents="none" />
        <View style={styles.topBlobRight} pointerEvents="none" />

        <View style={styles.statusBarSpacer} />

        <View style={styles.hourglassStack}>
          <View style={styles.hourglassGlow} />
          <View>
            <LinearGradient
              colors={[GOLD, GOLD_DEEP]}
              style={styles.hourglassWrapper}
            >
              <Text style={styles.hourglassGlyph}>⏳</Text>
            </LinearGradient>
          </View>
        </View>

        <Text style={styles.title}>Almost done...</Text>
        <LinearGradient
          colors={[GOLD, GOLD_DEEP]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.titleUnderline}
        />
        <Text style={styles.subtitle}>Your profile is under review</Text>
      </LinearGradient>

      <View style={styles.body}>
        <View style={[styles.statusPill, { backgroundColor: statusBg, borderColor: statusBorder }]}>
          <StatusIcon size={16} color={statusColor} />
          {submitError ? (
            <Text style={[styles.processingText, { color: statusColor }]}>{submitError}</Text>
          ) : isSubmitting ? (
            <Text style={[styles.processingText, { color: statusColor }]}>
              Uploading profile & voice
            </Text>
          ) : (
            <Text style={[styles.processingText, { color: statusColor }]}>
              Application received successfully!
            </Text>
          )}
          {isSubmitting && !submitError && (
            <Text style={[styles.processingDots, { color: statusColor }]}>
              ...
            </Text>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.cardAccent} />
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleBadge}>
              <ShieldCheck size={16} color={GOLD_DEEP} />
            </View>
            <Text style={styles.cardTitle}>What happens next?</Text>
          </View>
          <Text style={styles.cardDescription}>
            Our team will reach out to you within 24hrs via phone call. This
            is to explain about safety procedures on the platform.
          </Text>

          <View style={styles.stepsDivider} />

          <View style={styles.stepsList}>
            {NEXT_STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isLast = index === NEXT_STEPS.length - 1;
              return (
                <View key={step.key} style={[styles.stepRow, isLast && styles.stepRowLast]}>
                  <View style={styles.stepIconColumn}>
                    <LinearGradient
                      colors={[GOLD, GOLD_DEEP]}
                      style={styles.stepIconCircle}
                    >
                      <StepIcon size={16} color="#2A1240" />
                    </LinearGradient>
                    {!isLast && <View style={styles.stepConnector} />}
                  </View>
                  <Text style={styles.stepText}>{step.text}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.footerRow}>
          <HelpCircle size={14} color={TEXT_MUTED} />
          <Text style={styles.footerText}>
            For any queries please contact support
          </Text>
        </View>
      </View>
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
    paddingTop: 60,
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: PLUM_ROYAL,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 8,
    zIndex: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  topBlobLeft: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(212, 175, 55, 0.10)',
  },
  topBlobRight: {
    position: 'absolute',
    top: 30,
    right: -60,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(91, 14, 139, 0.06)',
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
  hourglassStack: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  hourglassGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(212, 175, 55, 0.22)',
  },
  hourglassWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingTop: 28,
  },
  statusPill: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 1.5,
    marginBottom: 26,
  },
  processingText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  processingDots: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    shadowColor: PLUM_ROYAL,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: GOLD_DEEP,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitleBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F6EFDD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: TEXT_PLUM,
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
  stepsList: {
    width: '100%',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  stepRowLast: {
    marginBottom: 0,
  },
  stepIconColumn: {
    alignItems: 'center',
    marginRight: 14,
  },
  stepIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: GOLD_DEEP,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 2,
  },
  stepConnector: {
    width: 2,
    flex: 1,
    minHeight: 16,
    backgroundColor: IVORY_LINE,
    marginTop: 4,
    marginBottom: 4,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: TEXT_PLUM,
    lineHeight: 20,
    fontWeight: '500',
    paddingTop: 6,
    paddingBottom: 16,
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