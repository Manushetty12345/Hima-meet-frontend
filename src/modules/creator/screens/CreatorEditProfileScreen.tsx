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
const PLUM_ROYAL = '#5B0E8B';
const GOLD = '#F5C542';
const GOLD_DEEP = '#D4AF37';
const IVORY = '#FBF6EC';
const IVORY_LINE = '#EBDFC4';
const TEXT_PLUM = '#2A1240';
const TEXT_MUTED = '#8B7F98';
const LILAC_WHITE = '#FBF7FF';
const LILAC_PALE = '#EFDFFB';

type Props = NativeStackScreenProps<any, 'CreatorEditProfile'>;

const CreatorEditProfileScreen = ({ navigation }: Props) => {
  const [username, setUsername] = useState('');
  const [about, setAbout] = useState('');
  
  // Read-only fields
  const [gender, setGender] = useState('Female');
  const [age, setAge] = useState('24');
  const [interests, setInterests] = useState('Astrology, Music, Travel');
  
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
          setAbout(profile.bio || 'Hi! Let\'s chat!');
          
          if (profile.avatar_id) {
            setSelectedAvatarId(profile.avatar_id.toString());
          }

          const avatarRes = await getAvatars(profile.gender || 'female');
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
    const trimmedUser = username.trim();
    if (trimmedUser.length < 4 || trimmedUser.length > 10) {
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
        username: trimmedUser,
        avatar_id: parseInt(selectedAvatarId, 10),
        bio: about.trim(),
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

      <LinearGradient colors={[LILAC_WHITE, LILAC_PALE]} start={{ x: 0.15, y: 0 }} end={{ x: 0.85, y: 1 }} style={styles.headerGradient}>
        <View style={styles.statusBarSpacer} />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} activeOpacity={0.8} onPress={() => navigation.goBack()}>
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

        {/* Editable Info */}
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

          <View style={styles.divider} />

          <Text style={styles.cardTitle}>About Me (Bio)</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={about}
            onChangeText={setAbout}
            placeholder="Tell us about yourself..."
            placeholderTextColor={TEXT_MUTED}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Read-Only Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Basic Info</Text>
          <View style={styles.readOnlyGrid}>
            <View style={styles.readOnlyCell}>
              <Text style={styles.readOnlyLabel}>Age</Text>
              <Text style={styles.readOnlyValue}>{age}</Text>
            </View>
            <View style={styles.readOnlyCell}>
              <Text style={styles.readOnlyLabel}>Gender</Text>
              <Text style={styles.readOnlyValue}>{gender}</Text>
            </View>
          </View>
          <View style={styles.readOnlyCellSingle}>
            <Text style={styles.readOnlyLabel}>Interests / Topics</Text>
            <Text style={styles.readOnlyValue}>{interests}</Text>
          </View>
          <Text style={styles.cardHint}>Above fields cannot be edited directly.</Text>
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
            <LinearGradient colors={[GOLD, GOLD_DEEP]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.updateButton}>
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
  flex: { flex: 1, backgroundColor: IVORY },
  headerGradient: { overflow: 'hidden' },
  statusBarSpacer: { height: 40 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(91, 14, 139, 0.10)', borderWidth: 1.5, borderColor: 'rgba(91, 14, 139, 0.25)', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: TEXT_PLUM, fontFamily: 'PlayfairDisplay-Bold' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1.5, borderColor: IVORY_LINE, padding: 20, marginBottom: 20 },
  cardTitleCenter: { fontSize: 16, fontWeight: '700', color: TEXT_PLUM, textAlign: 'center', marginBottom: 16 },
  cardHintCenter: { fontSize: 13, color: TEXT_MUTED, textAlign: 'center', marginTop: 12 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: TEXT_PLUM, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, fontWeight: '600', color: TEXT_PLUM },
  textarea: { height: 100, textAlignVertical: 'top' },
  cardHint: { fontSize: 12, color: TEXT_MUTED, marginTop: 8 },
  divider: { height: 1, backgroundColor: IVORY_LINE, marginVertical: 20 },
  readOnlyGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  readOnlyCell: { flex: 1, backgroundColor: '#F9FAFB', borderRadius: 12, padding: 12, marginRight: 8 },
  readOnlyCellSingle: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 12, marginBottom: 8 },
  readOnlyLabel: { fontSize: 12, color: TEXT_MUTED, textTransform: 'uppercase', marginBottom: 4 },
  readOnlyValue: { fontSize: 16, fontWeight: '700', color: TEXT_PLUM },
  footer: { paddingHorizontal: 20, paddingBottom: Platform.OS === 'ios' ? 34 : 20, paddingTop: 16, backgroundColor: IVORY, borderTopWidth: 1, borderTopColor: IVORY_LINE },
  updateButtonWrapper: { borderRadius: 999, overflow: 'hidden' },
  updateButton: { paddingVertical: 18, alignItems: 'center' },
  updateButtonText: { fontSize: 16, fontWeight: '700', color: '#1A0733' },
  updateButtonDisabled: { backgroundColor: '#E5E7EB' },
  updateButtonTextDisabled: { fontSize: 16, fontWeight: '700', color: '#9CA3AF' },
});

export default CreatorEditProfileScreen;
