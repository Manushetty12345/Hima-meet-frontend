import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  Easing,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, ArrowRight, Info } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';

// Components
import GenderCard from '../components/GenderCard';
import AvatarPickerCarousel, { AvatarItem } from '../components/AvatarPickerCarousel';
import { getAvatars } from '../api/onboardingApi';

const { width } = Dimensions.get('window');
const STATUSBAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

const TOTAL_STEPS = 4;
const CURRENT_STEP = 1;

type Gender = 'male' | 'female';

type Props = NativeStackScreenProps<AuthStackParamList, 'GenderSelect'>;

// ---- Palette pulled from the Himameet mark ----
const PLUM_ROYAL = '#5B0E8B';
const GOLD = '#F5C542';
const GOLD_DEEP = '#D4AF37';
const IVORY = '#FBF6EC';
const IVORY_LINE = '#EBDFC4';
const TEXT_PLUM = '#2A1240';
const TEXT_MUTED = '#8B7F98';

// Light lavender header wash — matches Login / VerifyOtp exactly
const LILAC_WHITE = '#FBF7FF';
const LILAC_PALE = '#EFDFFB';

const GenderSelectScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedGender, setSelectedGender] = useState<Gender | null>('male');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('');

  const [maleAvatars, setMaleAvatars] = useState<AvatarItem[]>([]);
  const [femaleAvatars, setFemaleAvatars] = useState<AvatarItem[]>([]);

  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(24)).current;

  React.useEffect(() => {
    // Fetch avatars on mount
    const fetchAvatars = async () => {
      try {
        const [maleRes, femaleRes] = await Promise.all([
          getAvatars('male'),
          getAvatars('female')
        ]);

        const mapAvatars = (data: any[]) => data.map(a => ({ id: a.id.toString(), uri: a.avatar_url }));

        const mAvatars = mapAvatars(maleRes.data.data);
        const fAvatars = mapAvatars(femaleRes.data.data);

        setMaleAvatars(mAvatars);
        setFemaleAvatars(fAvatars);

        // set default selection
        if (mAvatars.length > 0) setSelectedAvatarId(mAvatars[0].id);
      } catch (e) {
        console.error('Failed to fetch avatars', e);
      }
    };
    fetchAvatars();

    StatusBar.setBarStyle('dark-content');
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 380,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(cardTranslateY, {
        toValue: 0,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const currentAvatars = selectedGender === 'female' ? femaleAvatars : maleAvatars;

  const handleGenderSelect = (gender: Gender) => {
    if (gender === selectedGender) return;
    setSelectedGender(gender);
    const list = gender === 'female' ? femaleAvatars : maleAvatars;
    if (list.length > 0) {
      setSelectedAvatarId(list[0].id);
    } else {
      setSelectedAvatarId('');
    }
  };

  const isContinueEnabled = !!selectedGender && !!selectedAvatarId;

  const handleContinue = () => {
    if (!isContinueEnabled) return;
    // Go to SelectLanguage passing both gender and avatar
    navigation.navigate('SelectLanguage', {
      gender: selectedGender,
      avatar_id: parseInt(selectedAvatarId, 10)
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

      <ScrollView
        style={styles.scrollFlex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Who are you?</Text>
        <Text style={styles.subtitle}>
          Choose your gender to personalize your experience
        </Text>

        {/* Gender Cards — extracted component */}
        <View style={styles.genderRow}>
          <GenderCard
            gender="male"
            selectedGender={selectedGender}
            onSelect={handleGenderSelect}
          />
          <GenderCard
            gender="female"
            selectedGender={selectedGender}
            onSelect={handleGenderSelect}
          />
        </View>

        {/* Ornamental divider, matching the splash/login flourish */}
        <View style={styles.flourishRow}>
          <View style={styles.flourishLine} />
          <Text style={styles.flourishHeart}>♥</Text>
          <View style={styles.flourishLine} />
        </View>

        {/* Avatar Picker Header */}
        <View style={styles.avatarHeaderRow}>
          <Text style={styles.avatarHeaderTitle}>Pick your avatar</Text>
          <View style={styles.swipeHintRow}>
            <Text style={styles.swipeHintText}>Swipe to explore</Text>
            <ArrowRight size={16} color={GOLD_DEEP} />
          </View>
        </View>

        {/* Avatar Carousel — extracted component */}
        <AvatarPickerCarousel
          avatars={currentAvatars}
          selectedAvatarId={selectedAvatarId}
          onSelect={setSelectedAvatarId}
        />

        <View style={styles.spacer} />

        {/* Info notice */}
        <View style={styles.infoRow}>
          <Info size={14} color={GOLD_DEEP} />
          <Text style={styles.infoText}>Phone number and gender can&apos;t be changed later</Text>
        </View>

        {/* Continue CTA */}
        <Animated.View
          style={{
            opacity: cardOpacity,
            transform: [{ translateY: cardTranslateY }],
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
      </ScrollView>
    </View>
  );
};

const CARD_GAP = 14;

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
  cornerFlourishTR: {
    position: 'absolute',
    top: STATUSBAR_HEIGHT + 4,
    right: 0,
    width: 60,
    height: 60,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    borderTopRightRadius: 18,
    margin: 14,
  },
  scrollFlex: {
    flex: 1,
    backgroundColor: IVORY,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 32,
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: TEXT_PLUM,
    marginBottom: 8,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  subtitle: {
    fontSize: 14,
    color: TEXT_MUTED,
    marginBottom: 24,
    lineHeight: 20,
  },
  genderRow: {
    flexDirection: 'row',
    gap: CARD_GAP,
    marginBottom: 22,
  },
  flourishRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 26,
  },
  flourishLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.35)',
  },
  flourishHeart: {
    color: GOLD_DEEP,
    fontSize: 11,
    marginHorizontal: 10,
  },
  avatarHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarHeaderTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT_PLUM,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  swipeHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  swipeHintText: {
    fontSize: 14,
    color: TEXT_MUTED,
    fontWeight: '600',
  },
  spacer: {
    flexGrow: 1,
    minHeight: 40,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 12.5,
    color: TEXT_MUTED,
    fontWeight: '500',
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

export default GenderSelectScreen;