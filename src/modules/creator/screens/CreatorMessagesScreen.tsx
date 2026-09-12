import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Platform, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { MessageCircle, Phone, PhoneMissed, Video } from 'lucide-react-native';
import CreatorEarningRow, { EarningRecord } from '../components/CreatorEarningRow';
import apiClient from '../../../api/apiClient';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

// ---- Palette pulled from the Himameet mark ----
const PLUM_ROYAL = '#5B0E8B';
const IVORY = '#FBF6EC';
const IVORY_LINE = '#EBDFC4';
const TEXT_PLUM = '#2A1240';
const TEXT_MUTED = '#8B7F98';
const LILAC_WHITE = '#FBF7FF';
const LILAC_PALE = '#EFDFFB';

const DUMMY_EARNINGS: EarningRecord[] = [
  { id: 'e1', name: 'Rahul Verma', type: 'voice', duration: '15 mins', coins: 150, earned: 75, time: 'Today, 10:30 AM' },
  { id: 'e2', name: 'Karan S.', type: 'video', duration: '5 mins', coins: 300, earned: 150, time: 'Yesterday, 8:15 PM' },
];

interface MissedCall {
  id: string;
  caller: {
    id: string;
    name: string;
    avatar_url: string;
  };
  call_type: 'audio' | 'video';
  started_at: string;
  end_reason: string;
}

type FilterKey = 'chats' | 'calls' | 'missed';

const FILTERS = [
  { key: 'chats', label: 'Chats', icon: MessageCircle },
  { key: 'calls', label: 'Calls', icon: Phone },
  { key: 'missed', label: 'Missed', icon: PhoneMissed },
];

const CreatorMessagesScreen = () => {
  const [activeTab, setActiveTab] = useState<FilterKey>('chats');
  const [missedCalls, setMissedCalls] = useState<MissedCall[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (activeTab === 'missed') {
      fetchMissedCalls();
    }
  }, [activeTab]);

  const fetchMissedCalls = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/calls/missed');
      if (res.data?.status === 'success') {
        setMissedCalls(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch missed calls:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

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
          <Text style={styles.title}>Messages</Text>
          <Text style={styles.subtitle}>Your chats and calls history</Text>
        </View>

        {/* Filters */}
        <View style={styles.filterRow}>
          {FILTERS.map((filter) => {
            const isActive = activeTab === filter.key;
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
                onPress={() => setActiveTab(filter.key as FilterKey)}
              >
                <Icon size={15} color={PLUM_ROYAL} style={styles.filterIcon} />
                <Text style={styles.filterLabel}>{filter.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'chats' && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No active chats yet.</Text>
          </View>
        )}
        
        {activeTab === 'calls' && (
          <View style={styles.card}>
            {DUMMY_EARNINGS.map(item => (
              <CreatorEarningRow key={item.id} item={item} />
            ))}
          </View>
        )}

        {activeTab === 'missed' && (
          <View style={styles.card}>
            {loading ? (
              <ActivityIndicator size="small" color="#5B0E8B" style={{ margin: 20 }} />
            ) : missedCalls.length === 0 ? (
              <Text style={styles.emptyText}>No missed calls.</Text>
            ) : (
              missedCalls.map(call => (
                <View key={call.id} style={styles.missedCallRow}>
                  <Image source={{ uri: call.caller.avatar_url }} style={styles.callerAvatar} />
                  <View style={styles.missedCallInfo}>
                    <Text style={styles.callerName}>{call.caller.name}</Text>
                    <View style={styles.missedCallMeta}>
                      <PhoneMissed size={12} color="#EF4444" />
                      <Text style={styles.missedCallTime}>{formatDate(call.started_at)}</Text>
                    </View>
                  </View>
                  <View style={styles.callTypeIcon}>
                    {call.call_type === 'video' ? (
                      <Video size={20} color="#9CA3AF" />
                    ) : (
                      <Phone size={20} color="#9CA3AF" />
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
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
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: IVORY_LINE,
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
    color: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#3A0F63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 15,
  },
  missedCallRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  callerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  missedCallInfo: {
    flex: 1,
  },
  callerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  missedCallMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  missedCallTime: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  callTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CreatorMessagesScreen;
