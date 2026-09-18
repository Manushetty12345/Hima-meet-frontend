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
  Alert,
  Animated,
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
  Bell,
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
  const [dndUntil, setDndUntil] = useState<string | null>(null);
  const [showDndModal, setShowDndModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastIcon, setToastIcon] = useState<React.ReactNode>(null);
  const toastOpacity = React.useRef(new Animated.Value(0)).current;

  const showToast = (message: string, icon?: React.ReactNode) => {
    setToastMessage(message);
    setToastIcon(icon || null);
    
    toastOpacity.setValue(0);
    Animated.sequence([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2500),
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToastMessage(null);
    });
  };

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
            setDndUntil(profile.dnd_until || null);
          }
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      };
      fetchProfile();
    }, [])
  );

  const confirmTurnOffDnd = async () => {
    setShowDndModal(false);
    setDndEnabled(false);
    setDndUntil(null);
    try {
      await apiClient.post('/api/user/dnd', { enabled: false });
      showToast('Do Not Disturb disabled', <Bell size={18} color="#FFFFFF" style={{ marginRight: 8 }} />);
    } catch (error) {
      console.error('Failed to update DND:', error);
      setDndEnabled(true); // revert
    }
  };

  const handleDndToggle = async (value: boolean) => {
    if (!value) {
      setShowDndModal(true);
      return;
    }
    
    // Turn ON Optimistically
    setDndEnabled(true);
    try {
      const res = await apiClient.post('/api/user/dnd', { enabled: true });
      if (res.data?.dnd_until) {
        setDndUntil(res.data.dnd_until);
      }
      showToast('Do Not Disturb enabled', <BellOff size={18} color="#FFFFFF" style={{ marginRight: 8 }} />);
    } catch (error) {
      console.error('Failed to update DND:', error);
      setDndEnabled(false);
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
            {renderQuickAction('Refer', UserPlus, GOLD_DEEP, 'rgba(245, 197, 66, 0.16)', () => Alert.alert('Coming Soon', 'Referral sharing will be implemented in the next version!'))}
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
                    {item.id === 'dnd' && dndEnabled && dndUntil ? (
                      <Text style={styles.settingsTitle}>Do Not Disturb • Until {new Date(dndUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    ) : (
                      <Text style={styles.settingsTitle}>{item.title}</Text>
                    )}
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

      
      <Modal
        visible={showDndModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDndModal(false)}
      >
        <View style={styles.centeredModalOverlay}>
          <View style={styles.dndModalContent}>
            <View style={styles.dndModalIconContainer}>
              <BellOff size={30} color="#FF3B5C" />
            </View>
            <Text style={styles.dndModalTitle}>Turn off Do Not Disturb?</Text>
            <Text style={styles.dndModalBody}>
              You're in Do Not Disturb. Turning it off means you'll start receiving incoming calls again.
            </Text>
            <Text style={styles.dndModalSubBody}>
              You'll be available to all callers right away.
            </Text>
            <View style={styles.dndModalButtonRow}>
              <TouchableOpacity style={styles.dndModalCancelBtn} onPress={() => setShowDndModal(false)}>
                <Text style={styles.dndModalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dndModalConfirmBtn} onPress={confirmTurnOffDnd}>
                <Text style={styles.dndModalConfirmText}>Turn off DND</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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

      {/* Toast */}
      {toastMessage && (
        <Animated.View style={[
          styles.toastContainer, 
          { opacity: toastOpacity }
        ]}>
          {toastIcon}
          <Text style={styles.toastText}>
            {toastMessage}
          </Text>
        </Animated.View>
      )}
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
    height: 140,
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
  
  dndModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 32,
    width: '90%',
    maxWidth: 380,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  dndModalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(245, 197, 66, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 66, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dndModalTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 20,
    color: '#2A1240',
    marginBottom: 12,
    textAlign: 'center',
  },
  dndModalBody: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 22,
  },
  dndModalSubBody: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#D4AF37',
    textAlign: 'center',
    marginBottom: 28,
  },
  dndModalButtonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  dndModalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  dndModalCancelText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#1a1a25',
  },
  dndModalConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#F5C542',
    alignItems: 'center',
  },
  dndModalConfirmText: {
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    color: '#1A0733',
  },

  centeredModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
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
  toastContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 160 : 140,
    alignSelf: 'center',
    backgroundColor: '#9B5DE5', // Light purple requested by user
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 9999,
  },
  toastText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    flexShrink: 1,
  },
});

export default ProfileScreen;