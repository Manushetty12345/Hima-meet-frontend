import React, { useState } from 'react';
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
  TextInput,
  FlatList,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Home as HomeIcon,
  Phone,
  Wallet,
  Settings,
  ChevronRight,
  ClipboardList,
  Building2,
  History,
  Headphones,
  ShieldCheck,
  FileText,
  LogOut,
  ArrowLeft,
  Camera,
  Video,
  Coins,
  TrendingUp,
  AlertOctagon,
} from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import ChatRequestCard, { ChatRequest } from '../components/ChatRequestCard';
import CreatorEarningRow, { EarningRecord } from '../components/CreatorEarningRow';

const STATUSBAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

type RootStackParamList = {
  CreatorDashboard: undefined;
  LoginScreen: undefined;
  [key: string]: undefined | object;
};

type Props = NativeStackScreenProps<RootStackParamList, 'CreatorDashboard'>;

type TabKey = 'home' | 'calls' | 'wallet' | 'settings';
type SubScreen =
  | null
  | 'session_earnings'
  | 'bank_details'
  | 'withdrawal_history'
  | 'edit_profile'
  | 'withdraw';

// ─── Dummy Data ──────────────────────────────────────────────────────────────

const DUMMY_REQUESTS: ChatRequest[] = [
  { id: 'r1', name: 'Rahul Verma', avatarUri: 'https://i.pravatar.cc/150?img=11', timeAgo: 'Sent 5 mins ago' },
  { id: 'r2', name: 'Amit K.', avatarUri: 'https://i.pravatar.cc/150?img=12', timeAgo: 'Sent 1 hour ago' },
  { id: 'r3', name: 'Sandeep R.', avatarUri: 'https://i.pravatar.cc/150?img=13', timeAgo: 'Sent 3 hours ago' },
];

const DUMMY_EARNINGS: EarningRecord[] = [
  { id: 'e1', name: 'Rahul Verma', type: 'voice', duration: '15 mins', coins: 150, earned: 75, time: 'Today, 10:30 AM' },
  { id: 'e2', name: 'Karan S.', type: 'video', duration: '5 mins', coins: 300, earned: 150, time: 'Yesterday, 8:15 PM' },
  { id: 'e3', name: 'Mohan D.', type: 'voice', duration: '22 mins', coins: 220, earned: 110, time: 'Yesterday, 4:00 PM' },
];

const WITHDRAWAL_HISTORY = [
  { id: 'w1', amount: 5000, date: 'Aug 20, 2026', status: 'Completed' },
  { id: 'w2', amount: 3200, date: 'Aug 14, 2026', status: 'Completed' },
  { id: 'w3', amount: 2100, date: 'Aug 05, 2026', status: 'Processing' },
];

// ─── Main Screen ─────────────────────────────────────────────────────────────

const CreatorDashboardScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [subScreen, setSubScreen] = useState<SubScreen>(null);
  const [requests, setRequests] = useState<ChatRequest[]>(DUMMY_REQUESTS);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bio, setBio] = useState("Hi! I love talking about music, life, and astrology. Let's chat!");
  const [interests, setInterests] = useState('Love, Career, Music');

  const openSub = (s: SubScreen) => setSubScreen(s);
  const closeSub = () => setSubScreen(null);

  const handleAccept = (id: string) => setRequests(prev => prev.filter(r => r.id !== id));
  const handleReject = (id: string) => setRequests(prev => prev.filter(r => r.id !== id));

  // ─── Sub-screens ────────────────────────────────────────────────────────────

  const renderSubScreen = () => {
    if (!subScreen) return null;

    const subScreenContent = () => {
      switch (subScreen) {
        case 'session_earnings':
          return (
            <>
              <SubHeader title="Session Earnings" onBack={closeSub} />
              <ScrollView contentContainerStyle={styles.subContent}>
                <View style={styles.card}>
                  {DUMMY_EARNINGS.map(item => (
                    <CreatorEarningRow key={item.id} item={item} />
                  ))}
                </View>
              </ScrollView>
            </>
          );

        case 'withdrawal_history':
          return (
            <>
              <SubHeader title="Withdrawal History" onBack={closeSub} />
              <ScrollView contentContainerStyle={styles.subContent}>
                <View style={styles.card}>
                  {WITHDRAWAL_HISTORY.map(w => (
                    <View key={w.id} style={styles.historyRow}>
                      <View>
                        <Text style={styles.historyAmount}>₹{w.amount.toLocaleString('en-IN')}</Text>
                        <Text style={styles.historyDate}>{w.date}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: w.status === 'Completed' ? '#D1FAE5' : '#FEF3C7' }]}>
                        <Text style={[styles.statusText, { color: w.status === 'Completed' ? '#059669' : '#D97706' }]}>
                          {w.status}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </>
          );

        case 'bank_details':
          return (
            <>
              <SubHeader title="Bank Details" onBack={closeSub} />
              <ScrollView contentContainerStyle={styles.subContent}>
                <View style={styles.card}>
                  <Text style={styles.fieldLabel}>Account Holder Name</Text>
                  <TextInput style={styles.input} value="Yamuna Devi" />
                  <Text style={styles.fieldLabel}>Bank Name</Text>
                  <TextInput style={styles.input} value="State Bank of India" />
                  <Text style={styles.fieldLabel}>Account Number</Text>
                  <TextInput style={styles.input} value="XXXX XXXX 7890" keyboardType="numeric" />
                  <Text style={styles.fieldLabel}>IFSC Code</Text>
                  <TextInput style={styles.input} value="SBIN0001234" />
                  <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85}>
                    <Text style={styles.primaryBtnText}>Save Bank Details</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </>
          );

        case 'withdraw':
          return (
            <>
              <SubHeader title="Withdraw Funds" onBack={closeSub} />
              <ScrollView contentContainerStyle={styles.subContent}>
                {/* Balance */}
                <View style={[styles.card, styles.darkCard]}>
                  <Text style={styles.darkCardLabel}>AVAILABLE BALANCE</Text>
                  <Text style={styles.darkCardAmount}>₹12,500</Text>
                </View>

                {/* Amount Input */}
                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>WITHDRAWAL AMOUNT</Text>
                  <View style={styles.amountInputRow}>
                    <Text style={styles.rupeeSign}>₹</Text>
                    <TextInput
                      style={styles.amountInput}
                      placeholder="0"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      value={withdrawAmount}
                      onChangeText={setWithdrawAmount}
                    />
                  </View>
                  <Text style={styles.minNote}>Min. withdrawal is ₹100</Text>
                </View>

                {/* Bank Account */}
                <View style={[styles.card, { backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#E5E7EB' }]}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.sectionTitle}>PAYOUT BANK ACCOUNT</Text>
                    <TouchableOpacity onPress={() => { closeSub(); setTimeout(() => openSub('bank_details'), 100); }}>
                      <Text style={styles.editLink}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.bankName}>State Bank of India</Text>
                  <Text style={styles.bankDetail}>A/C: XXXX XXXX 7890</Text>
                  <Text style={styles.bankDetail}>Holder: Yamuna Devi</Text>
                </View>

                <TouchableOpacity style={[styles.primaryBtn, { marginTop: 8 }]} activeOpacity={0.85}>
                  <Text style={styles.primaryBtnText}>SUBMIT WITHDRAWAL REQUEST</Text>
                </TouchableOpacity>
                <Text style={styles.noteText}>Requests are reviewed and processed by our team.</Text>
              </ScrollView>
            </>
          );

        case 'edit_profile':
          return (
            <>
              <SubHeader title="Edit Profile" onBack={closeSub} />
              <ScrollView contentContainerStyle={styles.subContent}>
                {/* Avatar */}
                <View style={styles.avatarCenterBlock}>
                  <View style={styles.profileAvatarWrap}>
                    <Image source={{ uri: 'https://i.pravatar.cc/150?img=5' }} style={styles.profileAvatar} />
                    <TouchableOpacity style={styles.cameraBtn} activeOpacity={0.8}>
                      <Camera size={14} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.profileName}>Yamuna Devi</Text>
                </View>

                <View style={styles.card}>
                  <Text style={styles.fieldLabel}>About Me (Bio)</Text>
                  <TextInput
                    style={[styles.input, styles.textarea]}
                    value={bio}
                    onChangeText={setBio}
                    multiline
                    numberOfLines={4}
                  />
                  <Text style={styles.fieldLabel}>Interests / Topics</Text>
                  <TextInput
                    style={styles.input}
                    value={interests}
                    onChangeText={setInterests}
                  />
                  <Text style={styles.fieldLabel}>Languages Spoken</Text>
                  <TextInput
                    style={[styles.input, styles.disabledInput]}
                    value="English, Hindi, Kannada"
                    editable={false}
                  />
                  <Text style={styles.hintText}>Languages can only be changed by contacting support.</Text>
                  <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85}>
                    <Text style={styles.primaryBtnText}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </>
          );

        default:
          return null;
      }
    };

    return (
      <View style={styles.subScreenContainer}>
        {subScreenContent()}
      </View>
    );
  };

  // ─── Tab: HOME ───────────────────────────────────────────────────────────────

  const renderHome = () => (
    <ScrollView contentContainerStyle={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Earnings Hero Card */}
      <LinearGradient colors={['#F91970', '#FF4D8D']} style={[styles.card, styles.earningsCard]}>
        <Text style={styles.earningsLabel}>Today's Earnings</Text>
        <Text style={styles.earningsAmount}>₹2,450</Text>
        <View style={styles.earningsCoinRow}>
          <Coins size={14} color="rgba(255,255,255,0.9)" />
          <Text style={styles.earningsCoins}>  4,900 Coins Earned</Text>
        </View>
      </LinearGradient>

      {/* Availability Toggles */}
      <View style={styles.card}>
        <View style={styles.toggleRow}>
          <View style={styles.toggleLabel}>
            <Phone size={18} color="#EC1372" />
            <Text style={styles.toggleLabelText}>Voice Calls</Text>
          </View>
          <Switch
            value={voiceEnabled}
            onValueChange={setVoiceEnabled}
            trackColor={{ false: '#D1D5DB', true: '#10B981' }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#D1D5DB"
          />
        </View>
        <View style={styles.dividerThin} />
        <View style={styles.toggleRow}>
          <View style={styles.toggleLabel}>
            <Video size={18} color="#4F46E5" />
            <Text style={styles.toggleLabelText}>Video Calls</Text>
          </View>
          <Switch
            value={videoEnabled}
            onValueChange={setVideoEnabled}
            trackColor={{ false: '#D1D5DB', true: '#10B981' }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#D1D5DB"
          />
        </View>
      </View>

      {/* Chat Requests */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>New Chat Requests</Text>
        {requests.length === 0 ? (
          <Text style={styles.emptyText}>No new requests right now 🎉</Text>
        ) : (
          requests.map(r => (
            <ChatRequestCard key={r.id} item={r} onAccept={handleAccept} onReject={handleReject} />
          ))
        )}
      </View>
    </ScrollView>
  );

  // ─── Tab: CALLS ──────────────────────────────────────────────────────────────

  const renderCalls = () => (
    <ScrollView contentContainerStyle={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.pageTitle}>Call History</Text>
      <View style={styles.card}>
        {DUMMY_EARNINGS.map(item => (
          <CreatorEarningRow key={item.id} item={item} />
        ))}
      </View>
    </ScrollView>
  );

  // ─── Tab: WALLET ─────────────────────────────────────────────────────────────

  const renderWallet = () => (
    <ScrollView contentContainerStyle={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.pageTitle}>Earnings & Wallet</Text>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Earned</Text>
          <Text style={styles.statValue}>₹45,800</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>This Month</Text>
          <Text style={styles.statValue}>₹14,200</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>This Week</Text>
          <Text style={styles.statValue}>₹8,400</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Today</Text>
          <Text style={styles.statValue}>₹2,450</Text>
        </View>
      </View>

      {/* Withdraw Button */}
      <TouchableOpacity style={styles.withdrawBtn} activeOpacity={0.85} onPress={() => openSub('withdraw')}>
        <LinearGradient colors={['#F91970', '#FF4D8D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.withdrawGrad}>
          <TrendingUp size={20} color="#FFFFFF" />
          <Text style={styles.withdrawBtnText}>Withdraw Funds</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={[styles.card, styles.noPad]}>
        {[
          { label: 'Session Earnings', subtitle: 'View per-session breakdown', sub: 'session_earnings' as SubScreen },
          { label: 'Bank Details', subtitle: 'Manage payout accounts', sub: 'bank_details' as SubScreen },
          { label: 'Withdrawal History', subtitle: 'Track your past payouts', sub: 'withdrawal_history' as SubScreen },
        ].map((a, i) => (
          <TouchableOpacity key={a.label} style={[styles.actionRow, i < 2 && styles.actionRowBorder]} onPress={() => openSub(a.sub)} activeOpacity={0.7}>
            <View style={styles.actionRowLeft}>
              <View style={styles.actionIcon}>
                {i === 0 ? <ClipboardList size={18} color="#EC1372" /> : i === 1 ? <Building2 size={18} color="#EC1372" /> : <History size={18} color="#EC1372" />}
              </View>
              <View>
                <Text style={styles.actionLabel}>{a.label}</Text>
                <Text style={styles.actionSubLabel}>{a.subtitle}</Text>
              </View>
            </View>
            <ChevronRight size={18} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  // ─── Tab: SETTINGS ───────────────────────────────────────────────────────────

  const renderSettings = () => (
    <ScrollView contentContainerStyle={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.pageTitle}>Settings & Support</Text>

      {/* Profile Card */}
      <TouchableOpacity style={[styles.card, styles.rowBetween]} activeOpacity={0.7} onPress={() => openSub('edit_profile')}>
        <View style={styles.profileRow}>
          <Image source={{ uri: 'https://i.pravatar.cc/150?img=5' }} style={styles.settingsAvatar} />
          <View>
            <Text style={styles.settingsName}>Yamuna Devi</Text>
            <Text style={styles.settingsSubName}>Tap to edit avatar & bio</Text>
          </View>
        </View>
        <ChevronRight size={18} color="#9CA3AF" />
      </TouchableOpacity>

      {/* Call Rates */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>My Call Rates</Text>
          <View style={styles.fixedBadge}>
            <Text style={styles.fixedBadgeText}>Fixed by Admin</Text>
          </View>
        </View>
        <View style={styles.ratesRow}>
          <View style={styles.rateCard}>
            <Phone size={20} color="#EC1372" />
            <Text style={styles.rateValue}>10 Coins / min</Text>
            <Text style={styles.rateLabel}>Voice Call</Text>
          </View>
          <View style={styles.rateCard}>
            <Video size={20} color="#4F46E5" />
            <Text style={styles.rateValue}>60 Coins / min</Text>
            <Text style={styles.rateLabel}>Video Call</Text>
          </View>
        </View>
      </View>

      {/* Support & Legal */}
      <View style={[styles.card, styles.noPad]}>
        {[
          { label: 'Help & Support Tickets', icon: <Headphones size={18} color="#EC1372" />, bg: '#FFEBF2' },
          { label: 'Privacy Policy', icon: <ShieldCheck size={18} color="#4F46E5" />, bg: '#E0E7FF' },
          { label: 'Terms & Conditions', icon: <FileText size={18} color="#4F46E5" />, bg: '#E0E7FF' },
          { label: 'Logout', icon: <LogOut size={18} color="#EF4444" />, bg: '#FEE2E2' },
        ].map((s, i) => (
          <TouchableOpacity key={s.label} style={[styles.actionRow, i < 3 && styles.actionRowBorder]} activeOpacity={0.7}>
            <View style={styles.actionRowLeft}>
              <View style={[styles.actionIcon, { backgroundColor: s.bg }]}>{s.icon}</View>
              <Text style={styles.actionLabel}>{s.label}</Text>
            </View>
            <ChevronRight size={18} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  // ─── Bottom Nav ──────────────────────────────────────────────────────────────

  const NAV = [
    { key: 'home' as TabKey, label: 'Home', icon: HomeIcon },
    { key: 'calls' as TabKey, label: 'Calls', icon: Phone },
    { key: 'wallet' as TabKey, label: 'Wallet', icon: Wallet },
    { key: 'settings' as TabKey, label: 'Settings', icon: Settings },
  ];

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.statusBarSpacer} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerBrand}>Hi Ma</Text>
        <View style={styles.headerProfile}>
          <Text style={styles.headerGreet}>Hi, Yamuna</Text>
          <Image source={{ uri: 'https://i.pravatar.cc/150?img=5' }} style={styles.headerAvatar} />
        </View>
      </View>

      {/* Tab Content */}
      <View style={styles.flex}>
        {activeTab === 'home' && renderHome()}
        {activeTab === 'calls' && renderCalls()}
        {activeTab === 'wallet' && renderWallet()}
        {activeTab === 'settings' && renderSettings()}
      </View>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        {NAV.map(n => {
          const isActive = activeTab === n.key;
          const Icon = n.icon;
          return (
            <TouchableOpacity key={n.key} style={styles.navItem} onPress={() => setActiveTab(n.key)} activeOpacity={0.7}>
              <Icon size={22} color={isActive ? '#F91970' : '#9CA3AF'} fill={isActive ? '#F91970' : 'transparent'} />
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{n.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Sub-screens slide over everything */}
      {subScreen && renderSubScreen()}
    </View>
  );
};

// ─── SubHeader Helper ────────────────────────────────────────────────────────

const SubHeader: React.FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => (
  <View style={styles.subHeaderRow}>
    <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.subBackBtn}>
      <ArrowLeft size={20} color="#1F2937" />
    </TouchableOpacity>
    <Text style={styles.subHeaderTitle}>{title}</Text>
  </View>
);

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F3F4F6' },
  statusBarSpacer: { height: STATUSBAR_HEIGHT, backgroundColor: '#FFFFFF' },

  // Header
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    zIndex: 10,
  },
  headerBrand: { fontSize: 22, fontWeight: '800', color: '#F91970' },
  headerProfile: { flexDirection: 'row', alignItems: 'center' },
  headerGreet: { fontSize: 14, color: '#6B7280', fontWeight: '500', marginRight: 10 },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#F91970' },

  // Tab Content
  tabContent: { padding: 20, paddingBottom: 30 },
  pageTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 20 },

  // Card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  noPad: { padding: 0, overflow: 'hidden' },

  // Earnings Card
  earningsCard: { backgroundColor: undefined, padding: 24 },
  earningsLabel: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginBottom: 6 },
  earningsAmount: { fontSize: 40, fontWeight: '800', color: '#FFFFFF', marginBottom: 8 },
  earningsCoinRow: { flexDirection: 'row', alignItems: 'center' },
  earningsCoins: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginLeft: 4 },

  // Toggles
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toggleLabel: { flexDirection: 'row', alignItems: 'center' },
  toggleLabelText: { fontSize: 15, fontWeight: '600', color: '#1F2937', marginLeft: 10 },
  dividerThin: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 14 },

  // Section Title
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 14 },
  emptyText: { color: '#9CA3AF', textAlign: 'center', paddingVertical: 20 },

  // Stats Row
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  statCard: {
    flex: 1, minWidth: '45%', backgroundColor: '#FFFFFF',
    borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#E5E7EB',
  },
  statLabel: { fontSize: 12, color: '#6B7280', marginBottom: 6 },
  statValue: { fontSize: 18, fontWeight: '700', color: '#1F2937' },

  // Withdraw Btn
  withdrawBtn: { borderRadius: 14, overflow: 'hidden', marginBottom: 20 },
  withdrawGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16 },
  withdrawBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginLeft: 10 },

  // Action Row
  actionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  actionRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  actionRowLeft: { flexDirection: 'row', alignItems: 'center' },
  actionIcon: {
    width: 36, height: 36, borderRadius: 8,
    backgroundColor: '#FFEBF2', alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  actionLabel: { fontSize: 15, fontWeight: '600', color: '#1F2937' },
  actionSubLabel: { fontSize: 12, color: '#6B7280', marginTop: 2 },

  // Settings
  settingsAvatar: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: '#F91970', marginRight: 12 },
  settingsName: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  settingsSubName: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  fixedBadge: { backgroundColor: '#F3F4F6', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3 },
  fixedBadgeText: { fontSize: 11, color: '#6B7280' },
  ratesRow: { flexDirection: 'row', gap: 12 },
  rateCard: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 12, padding: 14, alignItems: 'center' },
  rateValue: { fontSize: 14, fontWeight: '700', color: '#1F2937', marginTop: 8, marginBottom: 4, textAlign: 'center' },
  rateLabel: { fontSize: 11, color: '#6B7280' },

  // Bottom Nav
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 36 : 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 10,
  },
  navItem: { flex: 1, alignItems: 'center' },
  navLabel: { fontSize: 11, color: '#9CA3AF', marginTop: 4, fontWeight: '600' },
  navLabelActive: { color: '#F91970' },

  // Sub Screen
  subScreenContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#F3F4F6',
    zIndex: 100,
  },
  subHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: STATUSBAR_HEIGHT + 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  subBackBtn: { marginRight: 14 },
  subHeaderTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  subContent: { padding: 20, paddingBottom: 40 },

  // Sub-screen shared
  fieldLabel: { fontSize: 13, color: '#6B7280', marginBottom: 8, marginTop: 4 },
  input: {
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#1F2937', marginBottom: 14,
  },
  textarea: { height: 100, textAlignVertical: 'top' },
  disabledInput: { backgroundColor: '#F3F4F6', color: '#9CA3AF' },
  hintText: { fontSize: 11, color: '#9CA3AF', marginTop: -10, marginBottom: 16 },
  primaryBtn: {
    backgroundColor: '#F91970', borderRadius: 12, paddingVertical: 16,
    alignItems: 'center', marginTop: 8,
  },
  primaryBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },

  // History
  historyRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  historyAmount: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  historyDate: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  statusBadge: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  statusText: { fontSize: 13, fontWeight: '600' },

  // Withdraw
  darkCard: { backgroundColor: '#1F2937' },
  darkCardLabel: { fontSize: 11, color: '#9CA3AF', letterSpacing: 1, marginBottom: 8 },
  darkCardAmount: { fontSize: 38, fontWeight: '800', color: '#FFFFFF' },
  amountInputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  rupeeSign: { fontSize: 22, fontWeight: '700', color: '#1F2937', marginRight: 4 },
  amountInput: { flex: 1, fontSize: 22, fontWeight: '700', color: '#1F2937', borderBottomWidth: 1.5, borderBottomColor: '#E5E7EB', paddingBottom: 8 },
  minNote: { fontSize: 12, color: '#6B7280', textAlign: 'right', marginBottom: 4 },
  bankName: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  bankDetail: { fontSize: 13, color: '#6B7280', marginBottom: 2 },
  editLink: { fontSize: 14, fontWeight: '600', color: '#F91970' },
  noteText: { fontSize: 11, color: '#9CA3AF', textAlign: 'center', marginTop: 14 },

  // Avatar edit
  avatarCenterBlock: { alignItems: 'center', marginBottom: 24 },
  profileAvatarWrap: { position: 'relative' },
  profileAvatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#F91970' },
  cameraBtn: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: '#F91970', width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#FFFFFF',
  },
  profileName: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginTop: 10 },
});

export default CreatorDashboardScreen;
