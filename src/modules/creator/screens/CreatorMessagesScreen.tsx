import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Platform, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { MessageCircle, Phone, PhoneMissed, Video, Trash2 } from 'lucide-react-native';
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

  const handleDelete = async (callId: string) => {
    try {
      // Optimistic UI update
      setMissedCalls(prev => prev.filter(c => c.id !== callId));
      
      const res = await apiClient.delete(`/api/calls/missed/${callId}`);
      if (res.data?.status !== 'success') {
        // If it failed, we could revert, but for now we just log it
        console.error('Failed to delete on server');
      }
    } catch (err) {
      console.error('Failed to delete missed call:', err);
      // Revert if error? We'll let it be for simplicity
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
                <View key={call.id} style={styles.cardRow}>
                  {/* Left Column: Avatar */}
                  <View style={styles.leftContainer}>
                    <LinearGradient
                      colors={['#C850C0', '#FF1493']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.avatarRing}
                    >
                      <View style={styles.avatarInner}>
                        <Image source={{ uri: call.caller.avatar_url }} style={styles.avatar} />
                      </View>
                    </LinearGradient>
                  </View>

                  {/* Middle Column: Name + Time */}
                  <View style={styles.textContainer}>
                    <Text style={styles.name} numberOfLines={1}>{call.caller.name}</Text>
                    <View style={styles.timePill}>
                      <Text style={styles.timeText}>{formatDate(call.started_at)}</Text>
                    </View>
                  </View>

                  {/* Right Column: Icon & Delete */}
                  <View style={styles.actionsContainer}>
                    <TouchableOpacity onPress={() => handleDelete(call.id)} style={styles.deleteBtn}>
                      <Trash2 size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                    <View style={styles.callTypeIcon}>
                      {call.call_type === 'video' ? (
                        <Video size={18} color="#FF1493" fill="#FF1493" />
                      ) : (
                        <PhoneMissed size={18} color="#FF1493" />
                      )}
                    </View>
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
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#4A0F6E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  leftContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  avatarRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 10,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  timePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timeText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  deleteBtn: {
    padding: 8,
  },
  callTypeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
});

export default CreatorMessagesScreen;
