import React, { useState, useEffect } from 'react';
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
  Shield,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { logout } from '../../auth/api/authApi';
import apiClient, { clearAuthToken } from '../../../api/apiClient';

const STATUSBAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

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

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

type NavKey = 'home' | 'recent' | 'friends' | 'profile';

const NAV_ITEMS: { key: NavKey; label: string; icon: LucideIcon }[] = [
  { key: 'home', label: 'Home', icon: HomeIcon },
  { key: 'recent', label: 'Recent', icon: Clock },
  { key: 'friends', label: 'Friends', icon: Users },
  { key: 'profile', label: 'Profile', icon: UserCircle2 },
];

const SETTINGS_ITEMS = [
  {
    id: 'terms',
    title: 'Terms & Condition',
    subtitle: 'Read our terms and conditions',
    icon: FileText,
    iconColor: '#F5A623',
    iconBg: '#FFF6E5',
  },
  {
    id: 'refund',
    title: 'Refund & Cancellation',
    subtitle: 'Request refunds and cancellations',
    icon: CircleDollarSign,
    iconColor: '#2DD36F',
    iconBg: '#E8FBF0',
  },
  {
    id: 'guidelines',
    title: 'Community Guidelines',
    subtitle: 'Policies and community standards',
    icon: BadgeCheck,
    iconColor: '#3880FF',
    iconBg: '#EBF2FF',
  },
  {
    id: 'warnings',
    title: 'My Warnings',
    subtitle: 'View warnings from admins',
    icon: AlertCircle,
    iconColor: '#FF6B00',
    iconBg: '#FFF0E5',
  },
  {
    id: 'dnd',
    title: 'Do Not Disturb',
    subtitle: 'Mute incoming notifications',
    icon: BellOff,
    iconColor: '#EC1372',
    iconBg: '#FDE8F1',
    hasToggle: true,
  },
  {
    id: 'notifications',
    title: 'Manage Notifications',
    subtitle: 'Control alerts and preferences',
    icon: BellRing,
    iconColor: '#EC1372',
    iconBg: '#FDE8F1',
  },
  {
    id: 'settings',
    title: 'Settings',
    subtitle: 'App preferences and account',
    icon: Settings,
    iconColor: '#3880FF',
    iconBg: '#EBF2FF',
  },
  {
    id: 'help',
    title: 'Help & Support',
    subtitle: 'Get help and contact support',
    icon: HelpCircle,
    iconColor: '#8C31FF',
    iconBg: '#F3EBFF',
  },
  {
    id: 'logout',
    title: 'Logout',
    subtitle: 'Sign out from your account',
    icon: LogOut,
    iconColor: '#EC1372',
    iconBg: '#FDE8F1',
  },
];

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [dndEnabled, setDndEnabled] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Profile Data
  const [username, setUsername] = useState('Loading...');
  const [avatarUrl, setAvatarUrl] = useState('https://hima-bucket.s3.amazonaws.com/default-avatar.png');

  useEffect(() => {
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
  }, []);

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
      <View style={styles.statusBarSpacer} />

      <View style={styles.headerRow}>
        <Text style={styles.title}>My Profile</Text>
        <Text style={styles.subtitle}>Manage your account & preferences</Text>
      </View>

      <ScrollView
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
              <TouchableOpacity style={styles.editBadge} activeOpacity={0.8}>
                <Pencil size={10} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.profileTextWrap}>
              <Text style={styles.username}>{username}</Text>
            </View>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.quickActionsRow}>
            {renderQuickAction('Wallet', Wallet, '#EC1372', '#FDE8F1', () => navigation.navigate('Wallet'))}
            {renderQuickAction('Transactions', ReceiptText, '#2DD36F', '#E8FBF0', () => navigation.navigate('Transactions'))}
            {renderQuickAction('Refer', UserPlus, '#8C31FF', '#F3EBFF', () => navigation.navigate('Refer'))}
            {renderQuickAction('Privacy', ShieldCheck, '#3880FF', '#EBF2FF', () => navigation.navigate('AccountPrivacy'))}
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
                      trackColor={{ false: '#E2DCE8', true: '#EC1372' }}
                      thumbColor="#FFFFFF"
                      ios_backgroundColor="#E2DCE8"
                      style={styles.toggle}
                    />
                  ) : (
                    <ChevronRight size={18} color="#C9C3D2" />
                  )}
                </TouchableOpacity>
                {!isLast && <View style={styles.settingsDivider} />}
              </View>
            );
          })}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        {NAV_ITEMS.map((navItem) => {
          const isActive = navItem.key === 'profile';
          const NavIcon = navItem.icon;
          return (
            <TouchableOpacity
              key={navItem.key}
              activeOpacity={0.8}
              style={styles.navItem}
              onPress={() => {
                if (navItem.key !== 'profile') {
                  navigation.navigate(
                    navItem.key === 'home'
                      ? 'Home'
                      : navItem.key === 'recent'
                      ? 'Recent'
                      : 'Friends'
                  );
                }
              }}
            >
              <NavIcon
                size={22}
                color={isActive ? '#EC1372' : '#B4A6BE'}
                fill={isActive ? '#EC1372' : 'transparent'}
              />
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {navItem.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

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
              <AlertOctagon size={48} color="#FF3B3B" strokeWidth={1.5} />
            </View>
            
            <Text style={styles.modalTitle}>Are you sure you want to Log out?</Text>
            <Text style={styles.modalSubtitle}>You will be logged out of your account</Text>
            
            <TouchableOpacity 
              activeOpacity={0.85}
              style={[styles.primaryButton, isLoggingOut && { opacity: 0.6 }]}
              disabled={isLoggingOut}
              onPress={handleLogout}
            >
              <Text style={styles.primaryButtonText}>
                {isLoggingOut ? 'Logging out…' : 'Logout'}
              </Text>
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
    backgroundColor: '#F9F7FB',
  },
  statusBarSpacer: {
    height: STATUSBAR_HEIGHT,
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1B0E22',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#8A7A9C',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#EC1372',
    paddingTop: 20,
    paddingBottom: 16,
    marginBottom: 24,
    shadowColor: '#EC1372',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
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
    borderColor: '#EC1372',
    padding: 2,
    backgroundColor: '#FFFFFF',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    backgroundColor: '#F7F5FA',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EC1372',
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
    color: '#1B0E22',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F7F5FA',
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
    color: '#5B4B6E',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5B4B6E',
    marginBottom: 12,
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#4A0F6E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
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
    color: '#1B0E22',
    marginBottom: 2,
  },
  settingsSubtitle: {
    fontSize: 12,
    color: '#8A7A9C',
  },
  settingsDivider: {
    height: 1,
    backgroundColor: '#F7F5FA',
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
    borderTopColor: '#F1EAF6',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navLabel: {
    fontSize: 11,
    color: '#B4A6BE',
    marginTop: 4,
    fontWeight: '600',
  },
  navLabelActive: {
    color: '#EC1372',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    backgroundColor: '#E2DCE8',
    marginBottom: 24,
  },
  alertIconWrap: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1B0E22',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#8A7A9C',
    marginBottom: 32,
    textAlign: 'center',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#FF147A',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#EFE7F3',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#5B4B6E',
  },
});

export default ProfileScreen;
