import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import apiClient from '../../../api/apiClient';
import AvatarPickerCarousel, { AvatarItem } from '../../onboarding/components/AvatarPickerCarousel';
import { getAvatars } from '../../onboarding/api/onboardingApi';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

type RootStackParamList = {
  EditProfile: undefined;
  [key: string]: undefined | object;
};

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

// ---- Palette pulled from the Himameet mark ----
const PLUM_ROYAL = '#5B0E8B';
const GOLD = '#F5C542';
const GOLD_DEEP = '#D4AF37';
const IVORY = '#FBF6EC';
const IVORY_LINE = '#EBDFC4';
const TEXT_PLUM = '#2A1240';
const TEXT_MUTED = '#8B7F98';

// Light lavender header wash — matches the rest of the flow
const LILAC_WHITE = '#FBF7FF';
const LILAC_PALE = '#EFDFFB';

const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('Male');
  const [language, setLanguage] = useState('English');
  const [avatars, setAvatars] = useState<AvatarItem[]>([]);
  const [selectedAvatarId, setSelectedAvatarId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    const loadProfileAndAvatars = async () => {
      try {
        const res = await apiClient.get('/api/user/me');
        if (res.data?.data) {
          const profile = res.data.data;
          setUsername(profile.username || '');
          setGender(profile.gender === 'female' ? 'Female' : 'Male');
          setLanguage(profile.language_name || 'English');

          if (profile.avatar_id) {
            setSelectedAvatarId(profile.avatar_id.toString());
          }

          // Fetch avatars for the user's gender
          const avatarRes = await getAvatars(profile.gender || 'male');
          const mappedAvatars = avatarRes.data.data.map((a: any) => ({
            id: a.id.toString(),
            uri: a.avatar_url,
          }));
          setAvatars(mappedAvatars);

          if (!profile.avatar_id && mappedAvatars.length > 0) {
            setSelectedAvatarId(mappedAvatars[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
      } finally {
        setIsFetching(false);
      }
    };
    loadProfileAndAvatars();
  }, []);

  const handleUpdate = async () => {
    const trimmed = username.trim();
    if (trimmed.length < 4 || trimmed.length > 10) {
      Alert.alert('Invalid Username', 'Username must be 4-10 characters.');
      return;
    }
    if (!selectedAvatarId) {
      Alert.alert('Missing Selection', 'Please select an avatar.');
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.put('/api/user/profile', {
        username: trimmed,
        avatar_id: parseInt(selectedAvatarId, 10),
      });
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = username.trim().length >= 4 && username.trim().length <= 10 && selectedAvatarId;

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

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={20} color={PLUM_ROYAL} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitleCenter}>Your Avatar</Text>
          {!isFetching && avatars.length > 0 && (
            <AvatarPickerCarousel
              avatars={avatars}
              selectedAvatarId={selectedAvatarId}
              onSelect={setSelectedAvatarId}
            />
          )}
          <Text style={styles.cardHintCenter}>Swipe to choose</Text>
        </View>

        {/* Username Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            placeholderTextColor={TEXT_MUTED}
            maxLength={10}
          />
          <Text style={styles.cardHint}>Username must be 4-10 characters.</Text>
        </View>

        {/* Read-Only Info Card */}
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.cardTitle}>Gender</Text>
              <Text style={styles.readOnlyText}>{gender}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.column}>
              <Text style={styles.cardTitle}>Preferred Language</Text>
              <Text style={styles.readOnlyText}>{language}</Text>
            </View>
          </View>
          <Text style={styles.cardHint}>Above fields are not editable.</Text>
        </View>
      </ScrollView>

      {/* Footer Update Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={!isFormValid || isLoading}
          onPress={handleUpdate}
          style={styles.updateButtonWrapper}
        >
          {isFormValid ? (
            <LinearGradient
              colors={[GOLD, GOLD_DEEP]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.updateButton}
            >
              <Text style={styles.updateButtonText}>
                {isLoading ? 'Updating...' : 'Update'}
              </Text>
            </LinearGradient>
          ) : (
            <View style={[styles.updateButton, styles.updateButtonDisabled]}>
              <Text style={styles.updateButtonTextDisabled}>Update</Text>
            </View>
          )}
        </TouchableOpacity>
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
  header: {
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: TEXT_PLUM,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
  },
  cardTitleCenter: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_PLUM,
    textAlign: 'center',
    marginBottom: 20,
  },
  cardHintCenter: {
    fontSize: 12,
    color: TEXT_MUTED,
    textAlign: 'center',
    marginTop: 12,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: TEXT_PLUM,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: TEXT_PLUM,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  cardHint: {
    fontSize: 11,
    color: TEXT_MUTED,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    flex: 1,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: IVORY_LINE,
    marginHorizontal: 16,
  },
  readOnlyText: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_PLUM,
    marginBottom: 4,
  },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 58 : 44,
    backgroundColor: IVORY,
  },
  updateButtonWrapper: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  updateButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButtonDisabled: {
    backgroundColor: IVORY_LINE,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A0733',
  },
  updateButtonTextDisabled: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_MUTED,
  },
});

export default EditProfileScreen;