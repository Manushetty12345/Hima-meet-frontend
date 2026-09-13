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
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Search,
  Users2,
  PhoneMissed,
  Clock4,
  ArrowDownAZ,
  PhoneOff,
  Check,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import CallHistoryItem, { CallHistoryRecord } from '../components/CallHistoryItem';
import { getCallHistory } from '../api/recentApi';

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

// Light lavender header wash — matches every other screen in the app
const LILAC_WHITE = '#FBF7FF';
const LILAC_PALE = '#EFDFFB';

type RootStackParamList = {
  Recent: undefined;
  Home: undefined;
  Friends: undefined;
  Profile: undefined;
  [key: string]: undefined | object;
};

type Props = BottomTabScreenProps<RootStackParamList, 'Recent'>;

type FilterKey = 'all' | 'missed' | 'talk_time' | 'a_z';

const FILTERS: { key: FilterKey; label: string; icon: LucideIcon }[] = [
  { key: 'all', label: 'All', icon: Users2 },
  { key: 'missed', label: 'Missed', icon: PhoneMissed },
  { key: 'talk_time', label: 'Talk Time', icon: Clock4 },
  { key: 'a_z', label: 'A - Z', icon: ArrowDownAZ },
];

const TALK_TIME_RANGES = ['Last 7 days', 'Last 15 days', 'Last 30 days'];



const RecentCallsScreen: React.FC<Props> = () => {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTalkTimeModal, setShowTalkTimeModal] = useState(false);
  const [talkTimeRange, setTalkTimeRange] = useState(TALK_TIME_RANGES[0]);
  
  const [calls, setCalls] = useState<(CallHistoryRecord & { rawDate: Date })[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    const fetchCalls = async () => {
      setIsLoading(true);
      try {
        const res = await getCallHistory();
        if (res?.data?.data) {
          const formatted = res.data.data.map((item: any) => {
            const isMissed = item.status === 'missed' || item.status === 'rejected';
            const dateObj = new Date(item.timestamp);
            
            // Format time (e.g. "Today, 10:30 AM" or "Aug 12")
            const timeString = dateObj.toLocaleDateString(undefined, {
              month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
            });

            return {
              id: item.call_id?.toString() || Math.random().toString(),
              name: item.user?.name || 'Unknown',
              avatarUri: item.user?.avatar_url || 'https://hima-bucket.s3.amazonaws.com/default-female.png',
              type: isMissed ? 'missed' : 'incoming', // Default to incoming since backend doesn't specify direction yet
              media: item.call_type === 'video' ? 'video' : 'audio',
              time: timeString,
              duration: item.duration_seconds ? `${item.duration_seconds} sec` : '0 sec',
              rawDate: dateObj,
              isOnline: item.is_online,
              callRate: item.voice_rate,
              videoRate: item.video_rate,
            };
          });
          setCalls(formatted);
        }
      } catch (err) {
        console.error('Failed to fetch call history:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCalls();
  }, []);

  const handleFilterPress = (key: FilterKey) => {
    if (key === 'talk_time') {
      setShowTalkTimeModal(true);
      return;
    }
    setActiveFilter(key);
  };

  // Filter and Sort Data
  const displayedCalls = React.useMemo(() => {
    let result = [...calls];

    // Search filter
    if (searchQuery.trim()) {
      result = result.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Tab filters
    if (activeFilter === 'missed') {
      result = result.filter(c => c.type === 'missed');
    }
    
    if (activeFilter === 'talk_time') {
      // Filter by selected range
      const now = new Date();
      let days = 7;
      if (talkTimeRange === 'Last 15 days') days = 15;
      if (talkTimeRange === 'Last 30 days') days = 30;
      
      const cutoff = new Date(now.setDate(now.getDate() - days));
      result = result.filter(c => c.rawDate >= cutoff);
    }

    if (activeFilter === 'a_z') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Default sort by date desc
      result.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
    }

    return result;
  }, [calls, activeFilter, searchQuery, talkTimeRange]);

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
          <Text style={styles.title}>Recent Calls</Text>
          <Text style={styles.subtitle}>Your call history</Text>
        </View>

        {/* Filters */}
        <View style={styles.filterRow}>
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.key;
            const Icon = filter.icon;

            if (isActive) {
              return (
                <TouchableOpacity key={filter.key} activeOpacity={0.85} style={styles.filterChipActive}>
                  <LinearGradient
                    colors={['#A822D1', '#FF1493']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.filterGrad}
                  >
                    <Icon size={15} color="#FFFFFF" style={styles.filterIcon} />
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
                <Icon size={15} color={PLUM_ROYAL} style={styles.filterIcon} />
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
            placeholderTextColor={TEXT_MUTED}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Search size={18} color="#4B5563" />
        </View>
      </LinearGradient>

      {/* List / Empty State */}
      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={GOLD_DEEP} />
          </View>
        ) : displayedCalls.length > 0 ? (
          <FlatList
            data={displayedCalls}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CallHistoryItem item={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <LinearGradient colors={['#F6EFDD', IVORY]} style={styles.emptyIconCircle}>
              <PhoneOff size={34} color={GOLD_DEEP} strokeWidth={1.6} />
            </LinearGradient>
            <Text style={styles.emptyTitle}>No calls found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your filters or search query</Text>
          </View>
        )}
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
            <Text style={styles.modalTitle}>Select talk time range</Text>
            {TALK_TIME_RANGES.map((range) => {
              const isSelected = range === talkTimeRange;
              return (
                <TouchableOpacity
                  key={range}
                  style={styles.modalOption}
                  onPress={() => {
                    setTalkTimeRange(range);
                    setActiveFilter('talk_time');
                    setShowTalkTimeModal(false);
                  }}
                >
                  <Text
                    style={[styles.modalOptionText, isSelected && styles.modalOptionTextActive]}
                  >
                    {range}
                  </Text>
                  {isSelected && <Check size={17} color={GOLD_DEEP} strokeWidth={2.5} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: TEXT_PLUM,
    marginBottom: 4,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  subtitle: {
    fontSize: 13.5,
    color: TEXT_MUTED,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 9,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    backgroundColor: '#FFFFFF',
  },
  filterChipActive: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'transparent',
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
    fontSize: 13,
    fontWeight: '700',
    color: PLUM_ROYAL,
  },
  filterLabelActive: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2A1240',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 12,
    backgroundColor: LILAC_PALE,
    borderWidth: 1.5,
    borderColor: PLUM_ROYAL,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 14.5,
    color: TEXT_PLUM,
  },
  content: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 80,
  },
  emptyIconCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
  },
  emptyTitle: {
    fontSize: 17.5,
    fontWeight: '800',
    color: TEXT_PLUM,
    marginBottom: 8,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  emptySubtitle: {
    fontSize: 13.5,
    color: TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(42, 18, 64, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 22,
    paddingHorizontal: 24,
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    shadowColor: '#3A0F63',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: TEXT_PLUM,
    marginBottom: 14,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  modalOptionText: {
    fontSize: 14.5,
    color: TEXT_MUTED,
    fontWeight: '600',
  },
  modalOptionTextActive: {
    color: TEXT_PLUM,
    fontWeight: '700',
  },
});

export default RecentCallsScreen;