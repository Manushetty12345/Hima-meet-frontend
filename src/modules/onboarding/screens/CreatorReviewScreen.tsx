import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  Animated,
  Easing,
  TouchableOpacity,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, User, Sparkles, Pencil, Info } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';

const STATUSBAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

const TOTAL_STEPS = 4;
const CURRENT_STEP = 2;

const MIN_INTERESTS = 1;
const MAX_INTERESTS = 4;
const MIN_BIO_LENGTH = 15;
const MAX_BIO_LENGTH = 250;

type Props = NativeStackScreenProps<AuthStackParamList, 'CreateProfileSetup'>;

// ---- Palette pulled from the Himameet mark ----
const PLUM_ROYAL = '#5B0E8B';
const GOLD = '#F5C542';
const GOLD_DEEP = '#D4AF37';
const IVORY = '#FBF6EC';
const IVORY_LINE = '#EBDFC4';
const TEXT_PLUM = '#2A1240';
const TEXT_MUTED = '#8B7F98';

// Light lavender header wash — matches every other screen in the app
const LILAC_WHITE = '#FBF7FF';
const LILAC_PALE = '#EFDFFB';

const INTERESTS = [
  'Politics',
  'Art',
  'Sports',
  'Movies',
  'Music',
  'Foodie',
  'Travel',
  'Photography',
  'Love',
  'Cooking',
];

const CreateProfileSetupScreen: React.FC<Props> = ({ navigation, route }) => {
  const { gender, avatar_id } = route.params || {};
  const [age, setAge] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [bio, setBio] = useState('');

  const ctaOpacity = useRef(new Animated.Value(0)).current;
  const ctaTranslateY = useRef(new Animated.Value(24)).current;

  React.useEffect(() => {
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

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(interest)) {
        return prev.filter(item => item !== interest);
      }
      if (prev.length >= MAX_INTERESTS) {
        return prev;
      }
      return [...prev, interest];
    });
  };

  const isAgeValid = age.trim().length > 0 && Number(age) >= 13;
  const isInterestsValid =
    selectedInterests.length >= MIN_INTERESTS &&
    selectedInterests.length <= MAX_INTERESTS;
  const isBioValid = bio.trim().length >= MIN_BIO_LENGTH;
  const isContinueEnabled = isAgeValid && isInterestsValid && isBioValid;

  const handleContinue = () => {
    if (!isContinueEnabled) return;
    navigation.navigate('SelectLanguage', { 
      gender, 
      avatar_id, 
      age, 
      selectedInterests, 
      bio 
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" />

      <LinearGradient
        colors={[LILAC_WHITE, LILAC_PALE]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.statusBarSpacer} />

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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Create your profile</Text>
        <Text style={styles.subtitle}>Help people know the real you ✨</Text>

        <View style={styles.divider} />

        {/* Age section */}
        <View style={styles.sectionHeaderRow}>
          <LinearGradient colors={[GOLD, GOLD_DEEP]} style={styles.sectionIconCircle}>
            <User size={16} color="#2A1240" />
          </LinearGradient>
          <View>
            <Text style={styles.sectionTitle}>Enter your age</Text>
            <Text style={styles.sectionRequiredLabel}>Required</Text>
          </View>
        </View>

        <View
          style={[
            styles.ageInputRow,
            age.length > 0 && styles.ageInputRowFilled,
          ]}
        >
          <User size={18} color={GOLD_DEEP} style={styles.ageInputIcon} />
          <TextInput
            value={age}
            onChangeText={text =>
              setAge(text.replace(/[^0-9]/g, '').slice(0, 3))
            }
            placeholder="Enter your age"
            placeholderTextColor={TEXT_MUTED}
            keyboardType="number-pad"
            style={styles.ageInput}
          />
        </View>

        <View style={styles.infoRow}>
          <Info size={13} color={TEXT_MUTED} />
          <Text style={styles.infoText}>
            This info will not be shared with Hima
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Interests section */}
        <View style={styles.sectionHeaderRow}>
          <LinearGradient colors={[GOLD, GOLD_DEEP]} style={styles.sectionIconCircle}>
            <Sparkles size={16} color="#2A1240" />
          </LinearGradient>
          <View>
            <Text style={styles.sectionTitle}>Select your interests</Text>
            <Text style={styles.sectionRequiredLabel}>Choose 1-4 topics</Text>
          </View>
        </View>

        <View style={styles.chipWrap}>
          {INTERESTS.map(interest => {
            const isSelected = selectedInterests.includes(interest);
            return (
              <TouchableOpacity
                key={interest}
                activeOpacity={0.8}
                onPress={() => toggleInterest(interest)}
                style={isSelected ? styles.chipSelectedWrap : styles.chip}
              >
                {isSelected ? (
                  <LinearGradient colors={[GOLD, GOLD_DEEP]} style={styles.chipSelectedGrad}>
                    <Text style={styles.chipTextSelected}>{interest}</Text>
                  </LinearGradient>
                ) : (
                  <Text style={styles.chipText}>{interest}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.infoRow}>
          <Info size={13} color={TEXT_MUTED} />
          <Text style={styles.infoText}>
            Select minimum 1 interest, maximum of 4
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Bio section */}
        <View style={styles.sectionHeaderRow}>
          <LinearGradient colors={[GOLD, GOLD_DEEP]} style={styles.sectionIconCircle}>
            <Pencil size={15} color="#2A1240" />
          </LinearGradient>
          <View>
            <Text style={styles.sectionTitle}>
              Give us a quick summary about you
            </Text>
            <Text style={styles.sectionRequiredLabel}>Min 15 characters</Text>
          </View>
        </View>

        <View style={styles.bioBox}>
          <TextInput
            value={bio}
            onChangeText={text => setBio(text.slice(0, MAX_BIO_LENGTH))}
            placeholder='Ex:"I like movie, my favourite one is DDLJ"'
            placeholderTextColor={TEXT_MUTED}
            multiline
            textAlignVertical="top"
            style={styles.bioInput}
          />
        </View>

        <View style={styles.bioFooterRow}>
          <Text style={styles.bioMinText}>Minimum 15 letters</Text>
          <Text style={styles.bioCountText}>
            {bio.length}/{MAX_BIO_LENGTH}
          </Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Animated.View
        style={[
          styles.ctaContainer,
          {
            opacity: ctaOpacity,
            transform: [{ translateY: ctaTranslateY }],
          },
        ]}
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
    </KeyboardAvoidingView>
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
    paddingTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: TEXT_PLUM,
    marginBottom: 6,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  subtitle: {
    fontSize: 14,
    color: TEXT_MUTED,
    marginBottom: 18,
  },
  divider: {
    height: 1,
    backgroundColor: IVORY_LINE,
    marginBottom: 18,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: TEXT_PLUM,
    marginBottom: 2,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  sectionRequiredLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: GOLD_DEEP,
  },
  ageInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 54,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  ageInputRowFilled: {
    borderColor: GOLD_DEEP,
  },
  ageInputIcon: {
    marginRight: 10,
  },
  ageInput: {
    flex: 1,
    fontSize: 15,
    color: TEXT_PLUM,
    padding: 0,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 18,
  },
  infoText: {
    fontSize: 12,
    color: TEXT_MUTED,
    flexShrink: 1,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  chip: {
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  chipSelectedWrap: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  chipSelectedGrad: {
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  chipText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: PLUM_ROYAL,
  },
  chipTextSelected: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#2A1240',
  },
  bioBox: {
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 14,
    height: 100,
    marginBottom: 8,
  },
  bioInput: {
    flex: 1,
    fontSize: 14,
    color: TEXT_PLUM,
    padding: 0,
  },
  bioFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bioMinText: {
    fontSize: 12,
    color: TEXT_MUTED,
  },
  bioCountText: {
    fontSize: 12,
    color: GOLD_DEEP,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 90,
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
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: GOLD_DEEP,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
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
    color: '#1A0733',
    letterSpacing: 0.3,
  },
  ctaTextDisabled: {
    color: '#A79E8C',
  },
});

export default CreateProfileSetupScreen;