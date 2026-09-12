import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Platform, StatusBar, RefreshControl } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { MessageCircle, Phone, PhoneMissed, Video, Trash2, Users } from 'lucide-react-native';
import CreatorEarningRow, { EarningRecord } from '../components/CreatorEarningRow';
import FriendRequestCard, { FriendRequestItem } from '../../friends/components/FriendRequestCard';
import apiClient from '../../../api/apiClient';
import { getSocket } from '../../../api/socketClient';
import { useNavigation } from '@react-navigation/native';

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

type FilterKey = 'chats' | 'calls' | 'missed' | 'friends';

const FILTERS = [
  { key: 'chats', label: 'Chats', icon: MessageCircle },
  { key: 'calls', label: 'Calls', icon: Phone },
  { key: 'missed', label: 'Missed', icon: PhoneMissed },
  { key: 'friends', label: 'Friends', icon: Users },
];

const CreatorMessagesScreen = () => {
  const [activeTab, setActiveTab] = useState<FilterKey>('chats');
  const [missedCalls, setMissedCalls] = useState<MissedCall[]>([]);
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const [refreshing, setRefreshing] = useState(false);
  
  const navigation = useNavigation<any>();

  React.useEffect(() => {
    let mounted = true;
    const socket = getSocket();

    if (socket) {
      socket.on('user_typing', (data: any) => {
        if (mounted && data.userId) {
          setTypingUsers(prev => ({ ...prev, [data.userId.toString()]: true }));
        }
      });
      socket.on('user_stopped_typing', (data: any) => {
        if (mounted && data.userId) {
          setTypingUsers(prev => ({ ...prev, [data.userId.toString()]: false }));
        }
      });
      socket.on('user_online', (data: any) => {
        if (mounted && data.userId) {
          setFriends(prev => prev.map(f => f.user_id?.toString() === data.userId?.toString() ? { ...f, isOnline: true } : f));
        }
      });
      socket.on('user_offline', (data: any) => {
        if (mounted && data.userId) {
          setFriends(prev => prev.map(f => f.user_id?.toString() === data.userId?.toString() ? { ...f, isOnline: false } : f));
        }
      });
      socket.on('new_message_alert', (data: any) => {
        if (mounted && data.conversation_id) {
          setFriends(prev => {
            const updated = prev.map(f => {
              if (f.conversationId?.toString() === data.conversation_id?.toString()) {
                return {
                  ...f,
                  unreadCount: (Number(f.unreadCount) || 0) + 1,
                  lastMessage: data.content,
                  lastMessageTime: data.timestamp,
                  lastMessageStatus: data.status,
                  lastMessageSenderId: data.sender_id
                };
              }
              return f;
            });
            // Move updated friend to top of the list
            const index = updated.findIndex(f => f.conversationId?.toString() === data.conversation_id?.toString());
            if (index > 0) {
              const item = updated.splice(index, 1)[0];
              updated.unshift(item);
            }
            return updated;
          });
        }
      });
    }

    return () => {
      mounted = false;
      if (socket) {
        socket.off('user_typing');
        socket.off('user_stopped_typing');
        socket.off('user_online');
        socket.off('user_offline');
        socket.off('new_message_alert');
      }
    };
  }, []);

  React.useEffect(() => {
    fetchMe();
  }, []);

  React.useEffect(() => {
    if (activeTab === 'missed') {
      fetchMissedCalls();
    } else if (activeTab === 'friends') {
      fetchFriendRequests();
    } else if (activeTab === 'chats') {
      fetchFriends();
    }
  }, [activeTab]);

  const fetchMe = async () => {
    try {
      const res = await apiClient.get('/api/user/me');
      if (res.data?.status === 'success') {
        setCurrentUserId(res.data.data.id);
      }
    } catch (err) {
      console.error('Failed to fetch me:', err);
    }
  };

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

  const fetchFriendRequests = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/friends/requests/received');
      if (res.data?.status === 'success') {
        // We only want 'pending' for female (received)
        const pending = res.data.data.filter((r: any) => r.status === 'received');
        setFriendRequests(pending);
      }
    } catch (err) {
      console.error('Failed to fetch friend requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFriends = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      const res = await apiClient.get('/api/friends/list');
      if (res.data?.status === 'success') {
        console.log('FRONTEND FRIENDS:', res.data.data.map((f: any) => ({ name: f.name, unread: f.unreadCount, cId: f.conversationId })));
        setFriends(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch friends:', err);
    } finally {
      if (!isRefresh) setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (activeTab === 'missed') {
      await fetchMissedCalls();
    } else if (activeTab === 'friends') {
      await fetchFriendRequests();
    } else if (activeTab === 'chats') {
      await fetchFriends(true);
    }
    setRefreshing(false);
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

        {/* Tabs */}
        <View style={styles.tabRow}>
          {FILTERS.map((filter) => {
            const isActive = activeTab === filter.key;
            return (
              <TouchableOpacity
                key={filter.key}
                style={styles.tabItem}
                activeOpacity={0.7}
                onPress={() => setActiveTab(filter.key as FilterKey)}
              >
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {filter.label}
                </Text>
                {isActive && (
                  <LinearGradient
                    colors={['#FF1493', '#C850C0']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.tabUnderline}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </LinearGradient>

      <ScrollView 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#5B0E8B']} tintColor={'#5B0E8B'} />
        }
      >
        {activeTab === 'chats' && (
          <View>
            {loading ? (
              <View style={styles.emptyState}>
                <ActivityIndicator size="large" color="#5B0E8B" />
              </View>
            ) : friends.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No active chats yet.</Text>
              </View>
            ) : (
              friends.map((friend: any) => (
                <FriendRequestCard
                  key={friend.user_id}
                  item={{
                    id: friend.user_id,
                    name: friend.name,
                    avatarUri: friend.avatar_url,
                    type: 'friend',
                    lastMessage: friend.lastMessage || 'Tap to chat',
                    lastMessageStatus: friend.lastMessageStatus,
                    lastMessageSenderId: friend.lastMessageSenderId,
                    lastMessageTime: friend.lastMessageTime,
                    unreadCount: Number(friend.unreadCount) || 0,
                    isOnline: friend.isOnline,
                    conversationId: friend.conversationId,
                  } as any}
                  currentUserId={currentUserId || undefined}
                  isTyping={typingUsers[friend.user_id?.toString()]}
                  onPress={() => navigation.navigate('ChatScreen', {
                    targetId: friend.user_id,
                    targetName: friend.name,
                    targetAvatar: friend.avatar_url
                  })}
                />
              ))
            )}
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
          <View>
            {loading ? (
              <View style={styles.emptyState}>
                <ActivityIndicator size="large" color="#5B0E8B" />
              </View>
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

        {activeTab === 'friends' && (
          <View>
            {loading ? (
              <View style={styles.emptyState}>
                <ActivityIndicator size="large" color="#5B0E8B" />
              </View>
            ) : friendRequests.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No friend requests yet.</Text>
              </View>
            ) : (
              friendRequests.map((request: any) => (
                <FriendRequestCard
                  key={request.user_id}
                  item={{
                    id: request.user_id,
                    name: request.name,
                    avatarUri: request.avatar_url,
                    type: 'received',
                  } as any}
                  onRemove={(id) => setFriendRequests(prev => prev.filter(r => r.user_id !== id))}
                />
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
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 4,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 28,
    paddingBottom: 18,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_MUTED,
    letterSpacing: 0.3,
  },
  tabLabelActive: {
    color: '#FF1493',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 14,
    height: 4,
    borderRadius: 2,
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
    borderRadius: 26,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    shadowColor: '#3A0F63',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  leftContainer: {
    alignItems: 'center',
    marginRight: 18,
  },
  avatarRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 10,
  },
  name: {
    fontSize: 18.5,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  timePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  timeText: {
    fontSize: 11.5,
    color: '#4B5563',
    fontWeight: '700',
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
