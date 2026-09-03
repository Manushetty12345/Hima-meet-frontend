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
      <View style={styles.statusBarSpacer} />

      {/* Header: Back + Progress */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={20} color="#EC1372" />
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
          <View style={styles.globeBadge}>
            <Globe size={11} color="#FFFFFF" />
          </View>
        </View>
      </View>

      {/* Language list */}
      <ScrollView
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
                  ? ['#FF3B8D', '#E0116F']
                  : ['#E9DDE7', '#E9DDE7']
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
    backgroundColor: '#FFFFFF',
  },
  statusBarSpacer: {
    height: STATUSBAR_HEIGHT,
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FDE6EF',
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
    backgroundColor: '#EFE7F3',
  },
  progressSegmentActive: {
    backgroundColor: '#EC1372',
  },
  titleBlock: {
    paddingHorizontal: 24,
    marginTop: 14,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1B0E22',
    marginBottom: 8,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#8A7A9C',
    marginRight: 6,
  },
  globeBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#3B6FE0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  bottomSpacer: {
    height: 12,
  },
  ctaContainer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    shadowColor: '#4A0F6E',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 8,
  },
  ctaWrapper: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#E0116F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
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
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  ctaTextDisabled: {
    color: '#B4A6BE',
  },
});

export default SelectLanguageScreen;

