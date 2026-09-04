import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Easing,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, Globe } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import LanguageCard, { LanguageItem } from '../components/LanguageCard';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';
import { getLanguages } from '../api/onboardingApi';

const STATUSBAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

const TOTAL_STEPS = 4;
const CURRENT_STEP = 3;

type Props = NativeStackScreenProps<AuthStackParamList, 'SelectLanguage'>;

// ---- Palette pulled from the Himameet mark ----
const PLUM_ROYAL = '#5B0E8B';
const GOLD = '#F5C542';
const GOLD_DEEP = '#D4AF37';
const IVORY = '#FBF6EC';
const IVORY_LINE = '#EBDFC4';
const TEXT_PLUM = '#2A1240';
const TEXT_MUTED = '#8B7F98';

// Light lavender header wash — matches Login / VerifyOtp / GenderSelect exactly
const LILAC_WHITE = '#FBF7FF';
const LILAC_PALE = '#EFDFFB';

const SelectLanguageScreen: React.FC<Props> = ({ route, navigation }) => {
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>('');
  const [languages, setLanguages] = useState<LanguageItem[]>([]);

  const gender = route.params?.gender;
  const avatarId = route.params?.avatar_id;

  const ctaOpacity = useRef(new Animated.Value(0)).current;
  const ctaTranslateY = useRef(new Animated.Value(24)).current;

  React.useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await getLanguages();
        const apiLangs = res.data.data.map((l: any) => ({
          id: l.id.toString(),
          glyph: l.name_native?.charAt(0) || 'A',
          nameEnglish: l.name_english,
          nameNative: l.name_native || l.name_english
        }));
        setLanguages(apiLangs);
        if (apiLangs.length > 0) {
          setSelectedLanguageId(apiLangs[0].id);
        }
      } catch (e) {
        console.error('Failed to fetch languages', e);
      }
    };
    fetchLanguages();

    StatusBar.setBarStyle('dark-content');
    Animated.parallel([
      Animated.timing(ctaOpacity, {
        toValue: 1,
        duration: 380,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(ctaTranslateY, {
        toValue: 0,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isContinueEnabled = !!selectedLanguageId;

  const handleContinue = () => {
    if (!isContinueEnabled) return;
    navigation.navigate('NotificationSetup', {
      gender,
      avatar_id: avatarId,
      language_id: parseInt(selectedLanguageId, 10)
    });
  };

  return (
    <View style={styles.flex}>
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

        {/* Title block */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Choose your language</Text>
          <View style={styles.subtitleRow}>
            <Text style={styles.subtitle}>
              Pick the language you&apos;re most comfortable in
            </Text>
            <LinearGradient
              colors={[GOLD, GOLD_DEEP]}
              style={styles.globeBadge}
            >
              <Globe size={11} color="#2A1240" />
            </LinearGradient>
          </View>
        </View>
      </LinearGradient>

      {/* Language list */}
      <ScrollView
        style={styles.scrollFlex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {languages.map(lang => (
          <LanguageCard
            key={lang.id}
            language={lang}
            isSelected={lang.id === selectedLanguageId}
            onSelect={setSelectedLanguageId}
          />
        ))}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Sticky Continue CTA */}
      <View style={styles.ctaContainer}>
        <Animated.View
          style={{
            opacity: ctaOpacity,
            transform: [{ translateY: ctaTranslateY }],
          }}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={!isContinueEnabled}
            onPress={handleContinue}
            style={styles.ctaWrapper}
          >
            <LinearGradient
              colors={
                isContinueEnabled
                  ? [GOLD, GOLD_DEEP]
                  : [IVORY_LINE, IVORY_LINE]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaButton}
            >
              <Text
                style={[
                  styles.ctaText,
                  !isContinueEnabled && styles.ctaTextDisabled,
                ]}
              >
                Continue
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: IVORY,
  },
  headerGradient: {
    overflow: 'hidden',
  },
  statusBarSpacer: {
    height: STATUSBAR_HEIGHT,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(91, 14, 139, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(91, 14, 139, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  progressTrack: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
  },
  progressSegment: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
  },
  progressSegmentActive: {
    backgroundColor: GOLD_DEEP,
  },
  titleBlock: {
    paddingHorizontal: 24,
    marginTop: 6,
    marginBottom: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: TEXT_PLUM,
    marginBottom: 8,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: TEXT_MUTED,
    marginRight: 6,
  },
  globeBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollFlex: {
    flex: 1,
    backgroundColor: IVORY,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  bottomSpacer: {
    height: 12,
  },
  ctaContainer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: IVORY,
    shadowColor: '#3A0F63',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 8,
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
    color: '#1A0733',
    letterSpacing: 0.3,
  },
  ctaTextDisabled: {
    color: '#A79E8C',
  },
});

export default SelectLanguageScreen;