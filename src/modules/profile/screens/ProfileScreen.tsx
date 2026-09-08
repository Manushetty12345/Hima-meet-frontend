import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
  Switch,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Home as HomeIcon,
  Clock,
  Users,
  UserCircle2,
  Wallet,
  ReceiptText,
  UserPlus,
  ShieldCheck,
  FileText,
  CircleDollarSign,
  BadgeCheck,
  AlertCircle,
  BellOff,
  BellRing,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Pencil,
  AlertOctagon,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { logout } from '../../auth/api/authApi';
import apiClient, { clearAuthToken } from '../../../api/apiClient';

const STATUSBAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

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

const DANGER = '#D14343';

type RootStackParamList = {
  Profile: undefined;
  Home: undefined;
  Recent: undefined;
  Friends: undefined;
  Wallet: undefined;
  Settings: undefined;
  Terms: undefined;
  RefundPolicy: undefined;
  CommunityGuidelines: undefined;
  MyWarnings: undefined;
  ManageNotifications: undefined;
  [key: string]: undefined | object;
};

type Props = BottomTabScreenProps<RootStackParamList, 'Profile'>;



const SETTINGS_ITEMS = [
  {
    id: 'terms',
    title: 'Terms & Condition',
    subtitle: 'Read our terms and conditions',
    icon: FileText,
    iconColor: GOLD_DEEP,
    iconBg: 'rgba(245, 197, 66, 0.16)',
  },
  {
    id: 'refund',
    title: 'Refund & Cancellation',
    subtitle: 'Request refunds and cancellations',
    icon: CircleDollarSign,
    iconColor: PLUM_ROYAL,
    iconBg: 'rgba(91, 14, 139, 0.10)',
  },
  {
    id: 'guidelines',
    title: 'Community Guidelines',
    subtitle: 'Policies and community standards',
    icon: BadgeCheck,
    iconColor: GOLD_DEEP,
    iconBg: 'rgba(245, 197, 66, 0.16)',
  },
  {
    id: 'warnings',
    title: 'My Warnings',
    subtitle: 'View warnings from admins',
    icon: AlertCircle,
    iconColor: PLUM_ROYAL,
    iconBg: 'rgba(91, 14, 139, 0.10)',
  },
  {
    id: 'dnd',
    title: 'Do Not Disturb',
    subtitle: 'Mute incoming notifications',
    icon: BellOff,
    iconColor: GOLD_DEEP,
    iconBg: 'rgba(245, 197, 66, 0.16)',
    hasToggle: true,
  },
  {
    id: 'notifications',
    title: 'Manage Notifications',
    subtitle: 'Control alerts and preferences',
    icon: BellRing,
    iconColor: PLUM_ROYAL,
    iconBg: 'rgba(91, 14, 139, 0.10)',
  },
  {
    id: 'settings',
    title: 'Settings',
    subtitle: 'App preferences and account',
    icon: Settings,
    iconColor: GOLD_DEEP,
    iconBg: 'rgba(245, 197, 66, 0.16)',
  },
  {
    id: 'help',
    title: 'Help & Support',
    subtitle: 'Get help and contact support',
    icon: HelpCircle,
    iconColor: PLUM_ROYAL,
    iconBg: 'rgba(91, 14, 139, 0.10)',
  },
  {
    id: 'logout',
    title: 'Logout',
    subtitle: 'Sign out from your account',
    icon: LogOut,
    iconColor: DANGER,
    iconBg: 'rgba(209, 67, 67, 0.10)',
  },
];

const ProfileScreen = ({ navigation }: Props) => {
  const [dndEnabled, setDndEnabled] = useState(false);
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
            setDndEnabled(!!profile.dnd_enabled);
          }
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      };
      fetchProfile();
    }, [])
  );

  const handleDndToggle = async (value: boolean) => {
    // Optimistic update
    setDndEnabled(value);
    try {
      await apiClient.post('/api/user/dnd', { enabled: value });
    } catch (error) {
      console.error('Failed to update DND:', error);
      // Revert if API fails
      setDndEnabled(!value);
    }
  };

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
      // Reset navigation stack → LoginScreen so back button won't come back to Home
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
    }
  };

  const renderQuickAction = (
    label: string,
    Icon: LucideIcon,
    color: string,
    bg: string,
    onPress?: () => void
  ) => (
    <TouchableOpacity activeOpacity={0.7} style={styles.quickAction} onPress={onPress}>
      <View style={[styles.quickActionIconBox, { backgroundColor: bg }]}>
        <Icon size={20} color={color} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );

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
        <View style={styles.headerRow}>
          <Text style={styles.title}>My Profile</Text>
          <Text style={styles.subtitle}>Manage your account & preferences</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollFlex}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileInfoRow}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarBorder}>
                <Image
                  source={{ uri: avatarUrl }}
                  style={styles.avatar}
                />
              </View>
              <TouchableOpacity style={styles.editBadge} activeOpacity={0.8} onPress={() => navigation.navigate('EditProfile')}>
                <Pencil size={10} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.profileTextWrap}>
              <Text style={styles.username}>{username}</Text>
            </View>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.quickActionsRow}>
            {renderQuickAction('Wallet', Wallet, GOLD_DEEP, 'rgba(245, 197, 66, 0.16)', () => navigation.navigate('Wallet'))}
            {renderQuickAction('Transactions', ReceiptText, PLUM_ROYAL, 'rgba(91, 14, 139, 0.10)', () => navigation.navigate('Transactions'))}
            {renderQuickAction('Refer', UserPlus, GOLD_DEEP, 'rgba(245, 197, 66, 0.16)', () => navigation.navigate('Refer'))}
            {renderQuickAction('Privacy', ShieldCheck, PLUM_ROYAL, 'rgba(91, 14, 139, 0.10)', () => navigation.navigate('AccountPrivacy'))}
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
                  activeOpacity={item.hasToggle ? 1 : 0.7}
                  style={styles.settingsRow}
                  onPress={() => {
                    if (item.id === 'logout') {
                      setShowLogoutModal(true);
                    } else if (item.id === 'settings') {
                      navigation.navigate('Settings');
                    } else if (item.id === 'terms') {
                      navigation.navigate('Terms');
                    } else if (item.id === 'refund') {
                      navigation.navigate('RefundPolicy');
                    } else if (item.id === 'guidelines') {
                      navigation.navigate('CommunityGuidelines');
                    } else if (item.id === 'warnings') {
                      navigation.navigate('MyWarnings');
                    } else if (item.id === 'notifications') {
                      navigation.navigate('ManageNotifications');
                    } else if (item.id === 'help') {
                      navigation.navigate('HelpSupport');
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
                  {item.hasToggle ? (
                    <Switch
                      value={dndEnabled}
                      onValueChange={handleDndToggle}
                      trackColor={{ false: IVORY_LINE, true: GOLD_DEEP }}
                      thumbColor="#FFFFFF"
                      ios_backgroundColor={IVORY_LINE}
                      style={styles.toggle}
                    />
                  ) : (
                    <ChevronRight size={18} color={IVORY_LINE} />
                  )}
                </TouchableOpacity>
                {!isLast && <View style={styles.settingsDivider} />}
              </View>
            );
          })}
        </View>

        <View style={styles.bottomSpacer} />
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: TEXT_PLUM,
    marginBottom: 4,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  subtitle: {
    fontSize: 13,
    color: TEXT_MUTED,
  },
  scrollFlex: {
    flex: 1,
    backgroundColor: IVORY,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: GOLD_DEEP,
    paddingTop: 20,
    paddingBottom: 16,
    marginBottom: 24,
  },
  profileInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatarBorder: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: GOLD_DEEP,
    padding: 2,
    backgroundColor: '#FFFFFF',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    backgroundColor: IVORY,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: PLUM_ROYAL,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileTextWrap: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_PLUM,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  cardDivider: {
    height: 1,
    backgroundColor: IVORY_LINE,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: TEXT_PLUM,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_PLUM,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  settingsIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  settingsTextWrap: {
    flex: 1,
    paddingRight: 16,
  },
  settingsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_PLUM,
    marginBottom: 2,
  },
  settingsSubtitle: {
    fontSize: 12,
    color: TEXT_MUTED,
  },
  settingsDivider: {
    height: 1,
    backgroundColor: IVORY_LINE,
    marginLeft: 52,
  },
  toggle: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
  bottomSpacer: {
    height: 30,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    borderTopWidth: 1,
    borderTopColor: IVORY_LINE,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navLabel: {
    fontSize: 11,
    color: TEXT_MUTED,
    marginTop: 4,
    fontWeight: '600',
  },
  navLabelActive: {
    color: GOLD_DEEP,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(42, 18, 64, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    alignItems: 'center',
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: IVORY_LINE,
    marginBottom: 24,
  },
  alertIconWrap: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: TEXT_PLUM,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'PlayfairDisplay-Bold',
  },
  modalSubtitle: {
    fontSize: 13,
    color: TEXT_MUTED,
    marginBottom: 32,
    textAlign: 'center',
  },
  primaryButtonWrapper: {
    width: '100%',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 12,
  },
  primaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A0733',
    letterSpacing: 0.2,
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_PLUM,
  },
});

export default ProfileScreen;