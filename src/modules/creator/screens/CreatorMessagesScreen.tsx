import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Platform, StatusBar, RefreshControl, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { MessageCircle, Phone, PhoneMissed, Video, Trash2, Users } from 'lucide-react-native';
import CreatorEarningRow, { EarningRecord } from '../components/CreatorEarningRow';
import FriendRequestCard, { FriendRequestItem } from '../../friends/components/FriendRequestCard';
import apiClient from '../../../api/apiClient';
import { getSocket } from '../../../api/socketClient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

// ---- Palette pulled from the Himameet mark ----
const PLUM_ROYAL = '#5B0E8B';
const IVORY = '#F9F5FF'; // Replaced yellowish with Earnings background
const IVORY_LINE = '#EFDFFB'; // Replaced yellowish with Earnings border
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
  const [callHistory, setCallHistory] = useState<EarningRecord[]>([]);
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  
  const [pages, setPages] = useState<Record<FilterKey, number>>({ chats: 1, calls: 1, missed: 1, friends: 1 });
  const [hasMore, setHasMore] = useState<Record<FilterKey, boolean>>({ chats: true, calls: true, missed: true, friends: true });
  const [isFetchingMore, setIsFetchingMore] = useState(false);
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

  useFocusEffect(
    React.useCallback(() => {
      if (activeTab === 'missed') {
        fetchMissedCalls(1);
      } else if (activeTab === 'friends') {
        fetchFriendRequests(1);
      } else if (activeTab === 'chats') {
        fetchFriends(1, true);
      } else if (activeTab === 'calls') {
        fetchCallHistory(1);
      }
    }, [activeTab])
  );

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

  const fetchCallHistory = async (page = 1) => {
    try {
      if (page === 1) setLoading(true);
      else setIsFetchingMore(true);
      const res = await apiClient.get(`/api/creator/calls/history?page=${page}&limit=20`);
      if (res.data?.status === 'success') {
        const rawData = res.data.data;
        const finalData: any[] = [];
        const pendingGifts: any[] = [];
        
        for (let i = 0; i < rawData.length; i++) {
          const current = rawData[i];
          current.earnings_coins = Number(current.earnings_coins || 0);
          
          if (current.call_type === 'gift') {
             pendingGifts.push(current);
          } else {
             // It's a call. Find all gifts for this caller that appeared before it in the list (sent during call)
              const giftsForCall = pendingGifts.filter(g => g.caller_name === current.caller_name);
             
             if (giftsForCall.length > 0) {
                // Sum coins
                const totalGiftCoins = giftsForCall.reduce((sum, g) => sum + g.earnings_coins, 0);
                current.original_call_coins = current.earnings_coins; // Store original before mutate
                current.earnings_coins += totalGiftCoins;
                
                // Build gift string
                const giftCounts: Record<string, number> = {};
                giftsForCall.forEach(g => {
                   const shortName = (g.status || '').replace('Gifted ', '').trim();
                   giftCounts[shortName] = (giftCounts[shortName] || 0) + 1;
                });
                
                let giftStr = '';
                for (const name in giftCounts) {
                   giftStr += ` • 🎁 ${name}${giftCounts[name] > 1 ? ' x' + giftCounts[name] : ''}`;
                }
                current.attached_gifts = giftStr;
                current.attached_gifts_data = giftsForCall; // Pass raw data for breakdown
                
                // Remove matched gifts
                for (const g of giftsForCall) {
                   const idx = pendingGifts.indexOf(g);
                   if (idx > -1) pendingGifts.splice(idx, 1);
                }
             }
             finalData.push({ ...current });
          }
        }
        
        // Any leftover gifts
        for (const g of pendingGifts) {
           finalData.push({ ...g, is_orphan_gift: true });
        }
        
        // Re-sort to maintain exact chronological order
        finalData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        const formatted = finalData.map((item: any) => {
          const dateObj = new Date(item.created_at);
          const timeString = dateObj.toLocaleDateString(undefined, {
            month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
          });
          const mins = Math.floor((item.duration_seconds || 0) / 60);
          const secs = (item.duration_seconds || 0) % 60;
          
          let durationStr = item.call_type === 'gift' ? '' : `${mins}m ${secs}s`;
          // We will remove attached_gifts string and let CreatorEarningRow handle the breakdown!
            
          return {
            id: item.call_id?.toString() || Math.random().toString(),
            name: item.caller_name || 'User',
            avatar_url: item.avatar_url,
            type: item.call_type === 'gift' ? 'gift' : (item.call_type === 'video' ? 'video' : 'voice'),
            duration: durationStr,
            status: item.status,
            coins: item.earnings_coins || 0,
            earned: (item.earnings_coins || 0) * 0.10, // Assuming 0.10 conversion rate
            time: timeString,
            originalCallCoins: item.original_call_coins !== undefined ? item.original_call_coins : (item.earnings_coins || 0),
            attachedGifts: item.attached_gifts_data || []
          };
        });
        setCallHistory(prev => page === 1 ? formatted : [...prev, ...formatted]);
        setHasMore(prev => ({ ...prev, calls: formatted.length >= 20 }));
        setPages(prev => ({ ...prev, calls: page }));
      }
    } catch (err) {
      console.error('Failed to fetch creator call history:', err);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  const fetchMissedCalls = async (page = 1) => {
    try {
      if (page === 1) setLoading(true);
      else setIsFetchingMore(true);
      const res = await apiClient.get(`/api/calls/missed?page=${page}&limit=20`);
      if (res.data?.status === 'success') {
        setMissedCalls(prev => page === 1 ? res.data.data : [...prev, ...res.data.data]);
        setHasMore(prev => ({ ...prev, missed: res.data.data.length >= 20 }));
        setPages(prev => ({ ...prev, missed: page }));
      }
    } catch (err) {
      console.error('Failed to fetch missed calls:', err);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  const fetchFriendRequests = async (page = 1) => {
    try {
      if (page === 1) setLoading(true);
      else setIsFetchingMore(true);
      const res = await apiClient.get(`/api/friends/requests/received?page=${page}&limit=20`);
      if (res.data?.status === 'success') {
        // We only want 'pending' for female (received)
        const pending = res.data.data.filter((r: any) => r.status === 'received');
        setFriendRequests(prev => page === 1 ? pending : [...prev, ...pending]);
        setHasMore(prev => ({ ...prev, friends: res.data.data.length >= 20 })); // we use res.data.data.length to judge pagination
        setPages(prev => ({ ...prev, friends: page }));
      }
    } catch (err) {
      console.error('Failed to fetch friend requests:', err);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  const fetchFriends = async (page = 1, isRefresh = false) => {
    try {
      if (page === 1 && !isRefresh) setLoading(true);
      else if (page > 1) setIsFetchingMore(true);
      const res = await apiClient.get(`/api/friends/list?page=${page}&limit=20&t=${Date.now()}`);
      if (res.data?.status === 'success') {
        setFriends(prev => page === 1 ? res.data.data : [...prev, ...res.data.data]);
        setHasMore(prev => ({ ...prev, chats: res.data.data.length >= 20 }));
        setPages(prev => ({ ...prev, chats: page }));
      }
    } catch (err) {
      console.error('Failed to fetch friends:', err);
    } finally {
      if (!isRefresh) setLoading(false);
      setIsFetchingMore(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (activeTab === 'missed') {
      await fetchMissedCalls(1);
    } else if (activeTab === 'friends') {
      await fetchFriendRequests(1);
    } else if (activeTab === 'chats') {
      await fetchFriends(1, true);
    } else if (activeTab === 'calls') {
      await fetchCallHistory(1);
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

  const getTabLabel = (key: FilterKey, label: string) => {
    const counts: Record<FilterKey, number> = {
      chats: friends.length,
      calls: callHistory.length,
      missed: missedCalls.length,
      friends: friendRequests.length,
    };
    const count = counts[key];
    return count > 0 ? `${label} (${count})` : label;
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
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.tabRow}
        >
          {FILTERS.map((filter) => {
            const isActive = activeTab === filter.key;
            
            if (isActive) {
              return (
                <TouchableOpacity key={filter.key} activeOpacity={0.85} style={styles.filterChipActive}>
                  <LinearGradient
                    colors={['#D4AF37', '#F5C542']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.filterGrad}
                  >
                    <Text style={styles.filterLabelActive}>{getTabLabel(filter.key as FilterKey, filter.label).toUpperCase()}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                key={filter.key}
                style={styles.filterChip}
                activeOpacity={0.7}
                onPress={() => setActiveTab(filter.key as FilterKey)}
              >
                <Text style={styles.filterLabel}>{getTabLabel(filter.key as FilterKey, filter.label).toUpperCase()}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </LinearGradient>

      <View style={{ flex: 1 }}>
        {activeTab === 'chats' && (
          <FlatList
            data={friends}
            keyExtractor={item => item.user_id?.toString() || Math.random().toString()}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#5B0E8B']} tintColor={'#5B0E8B'} />}
            onEndReached={() => {
              if (hasMore.chats && !isFetchingMore && !loading) {
                fetchFriends(pages.chats + 1, false);
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={isFetchingMore ? <ActivityIndicator size="small" color="#5B0E8B" style={{ marginVertical: 16 }} /> : undefined}
            ListEmptyComponent={loading ? (
              <View style={styles.emptyState}><ActivityIndicator size="large" color="#5B0E8B" /></View>
            ) : (
              <View style={styles.emptyState}><Text style={styles.emptyText}>No active chats yet.</Text></View>
            )}
            renderItem={({ item: friend }) => (
                <TouchableOpacity
                  style={styles.chatCard}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('ChatScreen', {
                    targetId: friend.user_id,
                    targetName: friend.name,
                    targetAvatar: friend.avatar_url
                  })}
                >
                  <LinearGradient
                    colors={['#8E2DE2', '#4A0F6E']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.chatAvatarRing}
                  >
                    <View style={styles.chatAvatarInner}>
                      <Image source={{ uri: friend.avatar_url }} style={styles.chatAvatar} />
                    </View>
                  </LinearGradient>

                  <View style={styles.chatTextContainer}>
                    <View style={styles.chatNameRow}>
                      <Text style={styles.chatName} numberOfLines={1}>{friend.name}</Text>
                    </View>
                    <View style={styles.chatNowBtn}>
                      <Text style={styles.chatNowText}>Chat Now</Text>
                    </View>
                  </View>

                  <View style={styles.chatRightColumn}>
                    <Text style={[styles.chatTime, Number(friend.unreadCount) > 0 ? { color: '#FF1493', fontWeight: '700' } : {}]}>
                      {friend.lastMessageTime ? formatDate(friend.lastMessageTime) : ''}
                    </Text>
                    {Number(friend.unreadCount) > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadBadgeText}>{friend.unreadCount}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
            )}
          />
        )}
        
        {activeTab === 'calls' && (
          <FlatList
            data={callHistory}
            keyExtractor={item => item.id?.toString() || Math.random().toString()}
            contentContainerStyle={[styles.content, { gap: 12 }]}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#5B0E8B']} tintColor={'#5B0E8B'} />}
            onEndReached={() => {
              if (hasMore.calls && !isFetchingMore && !loading) {
                fetchCallHistory(pages.calls + 1);
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={isFetchingMore ? <ActivityIndicator size="small" color="#5B0E8B" style={{ marginVertical: 16 }} /> : undefined}
            ListEmptyComponent={loading ? (
              <View style={styles.emptyState}><ActivityIndicator size="large" color="#5B0E8B" /></View>
            ) : (
              <View style={styles.emptyState}><Text style={styles.emptyText}>No call history yet.</Text></View>
            )}
            renderItem={({ item }) => (
                <CreatorEarningRow item={item} />
            )}
          />
        )}

        {activeTab === 'missed' && (
          <FlatList
            data={missedCalls}
            keyExtractor={item => item.id?.toString() || Math.random().toString()}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#5B0E8B']} tintColor={'#5B0E8B'} />}
            onEndReached={() => {
              if (hasMore.missed && !isFetchingMore && !loading) {
                fetchMissedCalls(pages.missed + 1);
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={isFetchingMore ? <ActivityIndicator size="small" color="#5B0E8B" style={{ marginVertical: 16 }} /> : undefined}
            ListEmptyComponent={loading ? (
              <View style={styles.emptyState}><ActivityIndicator size="large" color="#5B0E8B" /></View>
            ) : (
              <View style={styles.emptyState}><Text style={styles.emptyText}>No missed calls.</Text></View>
            )}
            renderItem={({ item: call }) => (
                <View style={styles.cardRow}>
                  <LinearGradient
                    colors={['#9C27B0', '#5B0E8B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 26,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 14,
                    }}
                  >
                    <View style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: '#FFFFFF',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 2,
                    }}>
                      <Image source={{ uri: call.caller.avatar_url }} style={{ width: 44, height: 44, borderRadius: 22 }} />
                    </View>
                  </LinearGradient>

                  <View style={styles.textContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <Text style={{ fontSize: 17, fontWeight: '700', color: '#1A1A2E', flex: 1, marginRight: 8 }} numberOfLines={1}>{call.caller.name}</Text>
                      <Text style={{ fontSize: 12, color: '#9B9BAD', fontWeight: '500' }}>{formatDate(call.started_at)}</Text>
                    </View>
                    <Text style={{ fontSize: 14, color: '#9B9BAD', fontWeight: '400' }}>Missed call</Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginLeft: 12 }}>
                    <TouchableOpacity onPress={() => handleDelete(call.id)} style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: '#FFF0F0',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: '#FFE0E0',
                    }}>
                      <Trash2 size={16} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                </View>
            )}
          />
        )}

        {activeTab === 'friends' && (
          <FlatList
            data={friendRequests}
            keyExtractor={item => item.user_id?.toString() || Math.random().toString()}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#5B0E8B']} tintColor={'#5B0E8B'} />}
            onEndReached={() => {
              if (hasMore.friends && !isFetchingMore && !loading) {
                fetchFriendRequests(pages.friends + 1);
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={isFetchingMore ? <ActivityIndicator size="small" color="#5B0E8B" style={{ marginVertical: 16 }} /> : undefined}
            ListEmptyComponent={loading ? (
              <View style={styles.emptyState}><ActivityIndicator size="large" color="#5B0E8B" /></View>
            ) : (
              <View style={styles.emptyState}><Text style={styles.emptyText}>No friend requests yet.</Text></View>
            )}
            renderItem={({ item: request }) => (
                <FriendRequestCard
                  item={{
                    id: request.user_id,
                    name: request.name,
                    avatarUri: request.avatar_url,
                    type: 'received',
                  } as any}
                  onRemove={(id) => setFriendRequests(prev => prev.filter(r => r.user_id !== id))}
                />
            )}
          />
        )}
      </View>
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
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: IVORY_LINE,
  },
  statusBarSpacer: {
    height: STATUSBAR_HEIGHT,
  },
  headerRow: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 12,
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
    gap: 10,
    marginTop: 8,
    paddingBottom: 16,
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
  filterLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5B0E8B',
    letterSpacing: 0.5,
  },
  filterLabelActive: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2A1240',
    letterSpacing: 0.5,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120, // ensure content isn't hidden behind bottom tabs
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
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
    marginBottom: 6,
    shadowColor: '#4A0F6E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  chatAvatarRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  chatAvatarInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  chatAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  chatTextContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 10,
  },
  chatNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    flex: 1,
  },
  chatNowBtn: {
    borderWidth: 1,
    borderColor: '#9C27B0',
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  chatNowText: {
    color: '#9C27B0',
    fontSize: 12,
    fontWeight: '500',
  },
  chatRightColumn: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: 4,
    height: 46, // roughly matches avatar inner content minus some padding
  },
  chatTime: {
    fontSize: 12,
    color: '#9B9BAD',
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: '#FF1493',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  }
});

export default CreatorMessagesScreen;
