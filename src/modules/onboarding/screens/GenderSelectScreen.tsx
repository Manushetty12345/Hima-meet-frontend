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

      <ScrollView
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

        {/* Avatar Picker Header */}
        <View style={styles.avatarHeaderRow}>
          <Text style={styles.avatarHeaderTitle}>Pick your avatar</Text>
          <View style={styles.swipeHintRow}>
            <Text style={styles.swipeHintText}>Swipe to explore</Text>
            <ArrowRight size={13} color="#8A7A9C" />
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
          <Info size={14} color="#EC1372" />
          <Text style={styles.infoText}>Gender can&apos;t be changed later</Text>
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
      </ScrollView>
    </View>
  );
};

const CARD_GAP = 14;

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
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1B0E22',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#8A7A9C',
    marginBottom: 24,
    lineHeight: 20,
  },
  genderRow: {
    flexDirection: 'row',
    gap: CARD_GAP,
    marginBottom: 32,
  },
  avatarHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1B0E22',
  },
  swipeHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  swipeHintText: {
    fontSize: 12,
    color: '#8A7A9C',
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
    color: '#EC1372',
    fontWeight: '500',
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

export default GenderSelectScreen;
