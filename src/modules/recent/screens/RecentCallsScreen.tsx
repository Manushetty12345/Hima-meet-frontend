import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Platform,
  FlatList,
  TextInput,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Home as HomeIcon,
  Clock,
  Users,
  UserCircle2,
  Search,
  Users2,
  PhoneMissed,
  Clock4,
  ArrowDownAZ,
  PhoneOff,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import CallHistoryItem, { CallHistoryRecord } from '../components/CallHistoryItem';

const STATUSBAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

type RootStackParamList = {
  Recent: undefined;
  Home: undefined;
  Friends: undefined;
  Profile: undefined;
  [key: string]: undefined | object;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Recent'>;

type NavKey = 'home' | 'recent' | 'friends' | 'profile';
type FilterKey = 'all' | 'missed' | 'talk_time' | 'a_z';

const NAV_ITEMS: { key: NavKey; label: string; icon: LucideIcon }[] = [
  { key: 'home', label: 'Home', icon: HomeIcon },
  { key: 'recent', label: 'Recent', icon: Clock },
  { key: 'friends', label: 'Friends', icon: Users },
  { key: 'profile', label: 'Profile', icon: UserCircle2 },
];

const FILTERS: { key: FilterKey; label: string; icon: LucideIcon }[] = [
  { key: 'all', label: 'All', icon: Users2 },
  { key: 'missed', label: 'Missed', icon: PhoneMissed },
  { key: 'talk_time', label: 'Talk Time', icon: Clock4 },
  { key: 'a_z', label: 'A - Z', icon: ArrowDownAZ },
];

const TALK_TIME_RANGES = [
  'Last 7 days',
  'Last 15 days',
  'Last 30 days'
];

// Switch to empty array to see the "No Data Found" empty state exactly as designed
const DUMMY_CALLS: CallHistoryRecord[] = []; 

const RecentCallsScreen: React.FC<Props> = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTalkTimeModal, setShowTalkTimeModal] = useState(false);

  const handleFilterPress = (key: FilterKey) => {
    if (key === 'talk_time') {
      setShowTalkTimeModal(true);
      return;
    }
    setActiveFilter(key);
  };

  const renderHeaderDecor = () => (
    <View style={styles.headerDecor}>
      <View style={[styles.decorStar, { top: 4, left: 14 }]} />
      <View style={[styles.decorStar, { top: 22, left: -6 }]} />
      <View style={[styles.decorStar, { bottom: 10, right: 6 }]} />
      <View style={styles.decorIconWrap}>
        <View style={styles.decorVideoIcon}>
           <LinearGradient colors={['#FF3B8D', '#E0116F']} style={styles.decorIconGrad} />
        </View>
        <View style={styles.decorChatIcon}>
           <LinearGradient colors={['#FCA5C7', '#F08AB3']} style={styles.decorIconGrad} />
        </View>
        <View style={styles.decorPhoneIcon}>
           <LinearGradient colors={['#FF3B8D', '#E0116F']} style={styles.decorIconGrad} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.statusBarSpacer} />

      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Recent Calls</Text>
          <Text style={styles.subtitle}>Your call history</Text>
        </View>
        {renderHeaderDecor()}
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter.key;
          const Icon = filter.icon;
          
          if (isActive) {
            return (
              <TouchableOpacity key={filter.key} activeOpacity={0.8} style={styles.filterChipActive}>
                <LinearGradient
                  colors={['#8E2DE2', '#E0116F']} // Based on visual gradient for active "All"
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.filterGrad}
                >
                  <Icon size={14} color="#FFFFFF" style={styles.filterIcon} />
                  <Text style={styles.filterLabelActive}>{filter.label}</Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={filter.key}
              activeOpacity={0.8}
              style={styles.filterChip}
              onPress={() => handleFilterPress(filter.key)}
            >
              <Icon size={14} color="#5B4B6E" style={styles.filterIcon} />
              <Text style={styles.filterLabel}>{filter.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name"
          placeholderTextColor="#B4A6BE"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Search size={18} color="#5B4B6E" />
      </View>

      {/* List / Empty State */}
      <View style={styles.content}>
        {DUMMY_CALLS.length > 0 ? (
          <FlatList
            data={DUMMY_CALLS}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CallHistoryItem item={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <PhoneOff size={42} color="#A79FB3" strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>No Data Found</Text>
            <Text style={styles.emptySubtitle}>Your call history will appear here</Text>
          </View>
        )}
      </View>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        {NAV_ITEMS.map((navItem) => {
          const isActive = navItem.key === 'recent';
          const NavIcon = navItem.icon;
          return (
            <TouchableOpacity
              key={navItem.key}
              activeOpacity={0.8}
              style={styles.navItem}
              onPress={() => {
                if (navItem.key !== 'recent') {
                  navigation.navigate(
                    navItem.key === 'home'
                      ? 'Home'
                      : navItem.key === 'friends'
                      ? 'Friends'
                      : 'Profile'
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

      {/* Talk Time Modal */}
      <Modal
        visible={showTalkTimeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTalkTimeModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowTalkTimeModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Talk Time Range</Text>
            {TALK_TIME_RANGES.map((range, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.modalOption}
                onPress={() => setShowTalkTimeModal(false)}
              >
                <Text style={styles.modalOptionText}>{range}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#F9F7FB', // Light greyish background seen in design
  },
  statusBarSpacer: {
    height: STATUSBAR_HEIGHT,
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#3B4043',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#8A7A9C',
  },
  headerDecor: {
    width: 70,
    height: 50,
    position: 'relative',
  },
  decorStar: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: '#FCA5C7',
    transform: [{ rotate: '45deg' }],
  },
  decorIconWrap: {
    position: 'absolute',
    right: 0,
    top: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  decorIconGrad: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  decorVideoIcon: {
    width: 18,
    height: 14,
    borderRadius: 4,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    top: -8,
  },
  decorChatIcon: {
    width: 14,
    height: 12,
    borderRadius: 3,
    overflow: 'hidden',
    position: 'absolute',
    right: 22,
    top: 4,
  },
  decorPhoneIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'absolute',
    right: 4,
    top: 10,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EFE7F3',
    backgroundColor: '#FFFFFF',
  },
  filterChipActive: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 0,
  },
  filterGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  filterIcon: {
    marginRight: 6,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5B4B6E',
  },
  filterLabelActive: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F05899', // Pink border from design
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1B0E22',
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60, // visual offset
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4A4A4A',
    marginTop: 16,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#8A7A9C',
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
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  modalOption: {
    paddingVertical: 14,
  },
  modalOptionText: {
    fontSize: 13,
    color: '#666666',
  },
});

export default RecentCallsScreen;
