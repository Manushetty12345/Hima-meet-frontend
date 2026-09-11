import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Phone,
  BellRing,
  AlertCircle,
  Headphones,
  BadgeCheck,
  FileText,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Pencil,
  AlertOctagon,
} from 'lucide-react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { logout } from '../../auth/api/authApi';
import apiClient, { clearAuthToken } from '../../../api/apiClient';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

const PLUM_ROYAL = '#5B0E8B';
const GOLD = '#F5C542';
const GOLD_DEEP = '#D4AF37';
const LILAC_WHITE = '#FBF7FF';
const LILAC_PALE = '#EFDFFB';
const DANGER = '#D14343';
const TEXT_PLUM = '#2A1240';
const TEXT_MUTED = '#8B7F98';
const IVORY_LINE = '#EBDFC4';
const IVORY = '#FBF6EC';

const SETTINGS_ITEMS = [
  { id: 'rates', title: 'My Call Rates', subtitle: 'View your voice & video rates', icon: Phone, iconColor: PLUM_ROYAL, iconBg: 'rgba(91, 14, 139, 0.10)' },
  { id: 'notifications', title: 'Manage Notifications', subtitle: 'Control alerts and preferences', icon: BellRing, iconColor: GOLD_DEEP, iconBg: 'rgba(245, 197, 66, 0.16)' },
  { id: 'warnings', title: 'My Warnings', subtitle: 'View warnings from admins', icon: AlertCircle, iconColor: PLUM_ROYAL, iconBg: 'rgba(91, 14, 139, 0.10)' },
  { id: 'help', title: 'Help & Support', subtitle: 'Get help and contact support', icon: Headphones, iconColor: GOLD_DEEP, iconBg: 'rgba(245, 197, 66, 0.16)' },
  { id: 'guidelines', title: 'Community Guidelines', subtitle: 'Policies and community standards', icon: BadgeCheck, iconColor: PLUM_ROYAL, iconBg: 'rgba(91, 14, 139, 0.10)' },
  { id: 'terms', title: 'Terms & Conditions', subtitle: 'Read our terms and conditions', icon: FileText, iconColor: GOLD_DEEP, iconBg: 'rgba(245, 197, 66, 0.16)' },
  { id: 'privacy', title: 'Privacy Policy', subtitle: 'Read our privacy policy', icon: ShieldCheck, iconColor: PLUM_ROYAL, iconBg: 'rgba(91, 14, 139, 0.10)' },
  { id: 'logout', title: 'Logout', subtitle: 'Sign out from your account', icon: LogOut, iconColor: DANGER, iconBg: 'rgba(209, 67, 67, 0.10)' },
];

type Props = BottomTabScreenProps<any, 'CreatorProfile'>;

const CreatorProfileScreen = ({ navigation }: Props) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Profile Data
  const [username, setUsername] = useState('Loading...');
  const [avatarUrl, setAvatarUrl] = useState('https://hima-bucket.s3.amazonaws.com/default-avatar.png');

  useFocusEffect(
    useCallback(() => {
      const fetchProfile = async () => {
        try {
          const res = await apiClient.get('/api/user/me');
          if (res.data?.data) {
            const profile = res.data.data;
            setUsername(profile.username || 'User');
            setAvatarUrl(profile.avatar_url || 'https://hima-bucket.s3.amazonaws.com/default-avatar.png');
          }
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      };
      fetchProfile();
    }, [])
  );

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();           // clears token from keychain
      await clearAuthToken();   // double-clear for safety
    } catch (e) {
      console.log('Logout error (ignored):', e);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
      // @ts-ignore
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={[LILAC_WHITE, LILAC_PALE]} start={{ x: 0.15, y: 0 }} end={{ x: 0.85, y: 1 }} style={styles.headerGradient}>
        <View style={styles.statusBarSpacer} />
        <View style={styles.headerRow}>
          <Text style={styles.title}>My Profile</Text>
          <Text style={styles.subtitle}>Manage your account & preferences</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileInfoRow}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarBorder}>
                <Image source={{ uri: avatarUrl }} style={styles.avatar} />
              </View>
              <TouchableOpacity 
                style={styles.editBadge} 
                activeOpacity={0.8}
                // @ts-ignore
                onPress={() => navigation.navigate('CreatorEditProfile')}
              >
                <Pencil size={10} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.profileTextWrap}>
              <Text style={styles.profileUsername}>{username}</Text>
              <Text style={styles.profileSubtitleText}>Creator Account</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Settings & Support</Text>

        {/* Settings List */}
        <View style={styles.settingsCard}>
          {SETTINGS_ITEMS.map((item, index) => {
            const isLast = index === SETTINGS_ITEMS.length - 1;
            const Icon = item.icon;
            return (
              <View key={item.id}>
                <TouchableOpacity 
                  activeOpacity={0.7} 
                  style={styles.settingsRow}
                  onPress={() => {
                    if (item.id === 'logout') {
                      setShowLogoutModal(true);
                    } else if (item.id === 'rates') {
                      // @ts-ignore
                      navigation.navigate('CreatorCallRates');
                    } else if (item.id === 'terms') {
                      // @ts-ignore
                      navigation.navigate('Terms');
                    } else if (item.id === 'guidelines') {
                      // @ts-ignore
                      navigation.navigate('CommunityGuidelines');
                    } else if (item.id === 'warnings') {
                      // @ts-ignore
                      navigation.navigate('MyWarnings');
                    } else if (item.id === 'notifications') {
                      // @ts-ignore
                      navigation.navigate('ManageNotifications');
                    } else if (item.id === 'help') {
                      // @ts-ignore
                      navigation.navigate('HelpSupport');
                    } else if (item.id === 'privacy') {
                      // @ts-ignore
                      navigation.navigate('PrivacyPolicy');
                    }
                  }}
                >
                  <View style={[styles.settingsIconBox, { backgroundColor: item.iconBg }]}>
                    <Icon size={18} color={item.iconColor} />
                  </View>
                  <View style={styles.settingsTextWrap}>
                    <Text style={styles.settingsTitle}>{item.title}</Text>
                    <Text style={styles.settingsSubtitle}>{item.subtitle}</Text>
                  </View>
                  <ChevronRight size={18} color={IVORY_LINE} />
                </TouchableOpacity>
                {!isLast && <View style={styles.settingsDivider} />}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Logout Bottom Sheet */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHandle} />

            <View style={styles.alertIconWrap}>
              <AlertOctagon size={48} color={DANGER} strokeWidth={1.5} />
            </View>

            <Text style={styles.modalTitle}>Are you sure you want to Log out?</Text>
            <Text style={styles.modalSubtitle}>You will be logged out of your account</Text>

            <TouchableOpacity
              activeOpacity={0.85}
              disabled={isLoggingOut}
              onPress={handleLogout}
              style={[styles.primaryButtonWrapper, isLoggingOut && { opacity: 0.6 }]}
            >
              <LinearGradient
                colors={[GOLD, GOLD_DEEP]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryButton}
              >
                <Text style={styles.primaryButtonText}>
                  {isLoggingOut ? 'Logging out…' : 'Logout'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.secondaryButton}
              onPress={() => setShowLogoutModal(false)}
            >
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  headerGradient: { overflow: 'hidden' },
  statusBarSpacer: { height: STATUSBAR_HEIGHT },
  headerRow: { paddingTop: 12, paddingBottom: 20, paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: '800', color: TEXT_PLUM, marginBottom: 4, fontFamily: 'PlayfairDisplay-Bold' },
  subtitle: { fontSize: 13, color: TEXT_MUTED },
  scrollContent: { padding: 20, paddingBottom: 40 },
  profileCard: { backgroundColor: '#FFFFFF', borderRadius: 20, paddingVertical: 20, marginBottom: 24, shadowColor: PLUM_ROYAL, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3, borderWidth: 1.5, borderColor: GOLD_DEEP },
  profileInfoRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 },
  avatarContainer: { position: 'relative', marginRight: 16 },
  avatarBorder: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: GOLD_DEEP, padding: 2 },
  avatar: { width: '100%', height: '100%', borderRadius: 30, backgroundColor: '#F3F4F6' },
  editBadge: { position: 'absolute', bottom: -2, right: -2, backgroundColor: PLUM_ROYAL, width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#FFFFFF' },
  profileTextWrap: { flex: 1 },
  profileUsername: { fontSize: 20, fontWeight: '700', color: TEXT_PLUM, marginBottom: 4, fontFamily: 'PlayfairDisplay-Bold' },
  profileSubtitleText: { fontSize: 13, color: TEXT_MUTED, fontWeight: '500' },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: TEXT_PLUM, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.4 },
  settingsCard: { backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1.5, borderColor: IVORY_LINE, paddingHorizontal: 16, paddingVertical: 8 },
  settingsRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  settingsIconBox: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  settingsTextWrap: { flex: 1, paddingRight: 16 },
  settingsTitle: { fontSize: 15, fontWeight: '700', color: TEXT_PLUM, marginBottom: 2 },
  settingsSubtitle: { fontSize: 12, color: TEXT_MUTED },
  settingsDivider: { height: 1, backgroundColor: IVORY_LINE, marginLeft: 52 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(42, 18, 64, 0.5)', justifyContent: 'flex-end' },
  bottomSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 24, paddingTop: 12, paddingBottom: Platform.OS === 'ios' ? 40 : 24, alignItems: 'center' },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: IVORY_LINE, marginBottom: 24 },
  alertIconWrap: { marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: TEXT_PLUM, marginBottom: 8, textAlign: 'center', fontFamily: 'PlayfairDisplay-Bold' },
  modalSubtitle: { fontSize: 13, color: TEXT_MUTED, marginBottom: 32, textAlign: 'center' },
  primaryButtonWrapper: { width: '100%', borderRadius: 999, overflow: 'hidden', marginBottom: 12 },
  primaryButton: { paddingVertical: 16, alignItems: 'center' },
  primaryButtonText: { fontSize: 15, fontWeight: '700', color: '#1A0733', letterSpacing: 0.2 },
  secondaryButton: { width: '100%', backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: IVORY_LINE, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  secondaryButtonText: { fontSize: 15, fontWeight: '700', color: TEXT_PLUM },
});

export default CreatorProfileScreen;
