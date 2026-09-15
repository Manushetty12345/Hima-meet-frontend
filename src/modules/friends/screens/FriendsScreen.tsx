import React, { useState, useCallback } from 'react';
import {
  View, ScrollView,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Platform,
  FlatList,
  ActivityIndicator,
  Animated,
  TextInput,
 Alert, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {  UserPlus, Search, Bell } from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import FriendRequestCard, { FriendRequestItem } from '../components/FriendRequestCard';
import FriendCard from '../components/FriendCard';
import { getFriends, getFavourites, getRequestsReceived, getRequestsSent } from '../api/friendsApi';
import apiClient from '../../../api/apiClient';
import { getSocket, initSocket } from '../../../api/socketClient';
import CreatorProfileModal from '../../home/components/CreatorProfileModal';
import RandomMatchModal from '../../home/components/RandomMatchModal';

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

// Light lavender header wash — matches Login / VerifyOtp / GenderSelect / SelectLanguage
const LILAC_WHITE = '#FBF7FF';
const LILAC_PALE = '#EFDFFB';

type RootStackParamList = {
  Friends: undefined;
  Home: undefined;
  Recent: undefined;
  Profile: undefined;
  [key: string]: undefined | object;
};

type Props = BottomTabScreenProps<RootStackParamList, 'Friends'>;

type TabKey = 'friends' | 'favourite' | 'requests' | 'sent';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'friends', label: 'Friends' },
  { key: 'favourite', label: 'Favourite' },
  { key: 'requests', label: 'Requests' },
  { key: 'sent', label: 'Sent' },
];


const EMPTY_STATE_COPY: Record<TabKey, { title: string; subtitle: string }> = {
  friends: {
    title: 'No friends yet',
    subtitle: 'Accept friend requests to chat with them here',
  },
  favourite: {
    title: 'No favourites yet',
    subtitle: 'Mark friends as favourite to find them here quickly',
  },
  requests: {
    title: 'No requests yet',
    subtitle: "You'll see incoming friend requests here",
  },
  sent: {
    title: 'No sent requests',
    subtitle: 'Requests you send will show up here',
  },
};

const FriendsScreen: React.FC<Props> = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<TabKey>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'error' | 'info'>('info');
  const [toastShowLogo, setToastShowLogo] = useState<boolean>(false);
  const toastOpacity = React.useRef(new Animated.Value(0)).current;

  const showToast = (message: string, type: 'error' | 'info' = 'info', showLogo: boolean = false) => {
    setToastMessage(message);
    setToastType(type);
    setToastShowLogo(showLogo);
    
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

  // Call & Modal state
  const [selectedCreator, setSelectedCreator] = useState<any>(null);
  const [showRandomMatch, setShowRandomMatch] = useState(false);
  const [randomMatchType, setRandomMatchType] = useState<'audio' | 'video'>('audio');
  const [randomMatchTarget, setRandomMatchTarget] = useState<any>(undefined);
  const [coinBalance, setCoinBalance] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const fetchBalance = async () => {
        try {
          const res = await apiClient.get('/api/wallet/balance');
          const balance = res.data?.data?.coin_balance ?? 0;
          setCoinBalance(balance);
        } catch (error) {
          console.log('FriendsScreen fetch balance error:', error);
        }
      };
      fetchBalance();
    }, [])
  );

  React.useEffect(() => {
    let socket = getSocket();
    
    const setupListeners = async () => {
      if (!socket) {
        socket = await initSocket();
      }
      if (!socket) return;

      const handleCallBusy = (data: { message: string }) => {
        setShowRandomMatch(false);
        showToast(data.message || 'The user is currently on another call. Please try again.', 'error', true);
      };

      const handleCallDeclined = () => {
        setShowRandomMatch(false);
        showToast('User is not available right now.', 'error', true);
      };

      const handleInsufficientCoins = () => {
        setShowRandomMatch(false);
        const type = randomMatchType;
        const creator = randomMatchTarget;
        const rate = type === 'audio' ? creator?.callRate : creator?.videoRate;
        const requiredCoins = rate || (type === 'audio' ? 20 : 40);
        navigation.navigate('Wallet', { 
          showWarning: 'insufficient_coins',
          requiredCoins,
          callType: type
        } as any);
      };

      const handleCallAccepted = (data: { callId: number, agoraToken?: string, rate?: number }) => {
        setShowRandomMatch(false);
        navigation.navigate(randomMatchType === 'audio' ? 'AudioCallScreen' : 'VideoCallScreen', {
          callId: data.callId,
          targetId: randomMatchTarget?.id,
          calleeName: randomMatchTarget?.name,
          calleeAvatar: randomMatchTarget?.avatarUri,
          agoraToken: data.agoraToken || '',
          callRate: data.rate || (randomMatchType === 'audio' ? 20 : 40),
        } as any);
      };

      socket.off('call_busy').on('call_busy', handleCallBusy);
      socket.off('call_declined').on('call_declined', handleCallDeclined);
      socket.off('call_blocked_insufficient_coins').on('call_blocked_insufficient_coins', handleInsufficientCoins);
      socket.off('call_accepted').on('call_accepted', handleCallAccepted);
    };

    setupListeners();

    return () => {
      if (socket) {
        socket.off('call_busy');
        socket.off('call_declined');
        socket.off('call_blocked_insufficient_coins');
        socket.off('call_accepted');
      }
    };
  }, [navigation, randomMatchType, randomMatchTarget]);

  const initiateCallWithChecks = async (creator: any, type: 'audio' | 'video') => {
    if (!creator.isOnline) {
      showToast(`This user is not available for ${type} calls right now.`, 'error');
      return;
    }
    const rate = type === 'audio' ? creator.callRate : creator.videoRate;
    const requiredCoins = rate || (type === 'audio' ? 20 : 40);

    if (coinBalance < requiredCoins) {
      navigation.navigate('Wallet', { 
        showWarning: 'insufficient_coins',
        requiredCoins,
        callType: type
      } as any);
      return;
    }

    setRandomMatchTarget(creator);
    setRandomMatchType(type);
    setShowRandomMatch(true);

    let socket = getSocket();
    if (!socket) {
      socket = await initSocket();
    }
    
    if (socket) {
      socket.emit('initiate_call', {
        targetId: creator.id,
        type,
        rate: requiredCoins
      });
    }
  };

  const [data, setData] = useState<Record<TabKey, FriendRequestItem[]>>({
    friends: [],
    favourite: [],
    requests: [],
    sent: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [refreshToggle, setRefreshToggle] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await apiClient.get('/api/user/me');
        if (res.data?.status === 'success') {
          setCurrentUserId(res.data.data.id);
        }
      } catch (err) {
        console.error('Failed to fetch me in friends screen:', err);
      }
    };
    fetchMe();
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let res;
        let type: 'friend' | 'favourite' | 'received' | 'sent' = 'friend';
        switch (activeTab) {
          case 'friends':
            res = await getFriends();
            type = 'friend';
            break;
          case 'favourite':
            res = await getFavourites();
            type = 'favourite';
            break;
          case 'requests':
            res = await getRequestsReceived();
            type = 'received';
            break;
          case 'sent':
            res = await getRequestsSent();
            type = 'sent';
            break;
        }

        if (res?.data?.data) {
          let formatted = res.data.data.map((item: any) => ({
            id: item.user_id?.toString() || item.id?.toString(),
            name: item.name || item.full_name,
            avatarUri: item.avatar_url || 'https://hima-bucket.s3.amazonaws.com/default-avatar.png',
            isOnline: Boolean(item.isOnline !== undefined ? item.isOnline : item.is_online),
            callAvailable: Boolean(item.isVoiceOnline),
            callRate: item.voice_rate,
            videoAvailable: Boolean(item.isVideoOnline),
            videoRate: item.video_rate,
            lastMessage: item.lastMessage,
            lastMessageStatus: item.lastMessageStatus,
            lastMessageSenderId: item.lastMessageSenderId,
            lastMessageTime: item.lastMessageTime,
              is_pinned: !!item.is_pinned,
            lastSeen: item.lastSeen,
            // For requests tab, use the status from API (can be 'received' or 'accepted_by_receiver')
            type: activeTab === 'requests' ? (item.status || type) : type,
          }));
            formatted.sort((a: any, b: any) => {
              if (a.is_pinned && !b.is_pinned) return -1;
              if (!a.is_pinned && b.is_pinned) return 1;
              return 0;
            });
          setData(prev => ({ ...prev, [activeTab]: formatted }));
        }
      } catch (err) {
        console.error('Failed to fetch data for tab:', activeTab, err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    
    // WebSocket auto-refresh
    const socket = getSocket();
    if (socket) {
      socket.off('friend_update').on('friend_update', () => {
        console.log('?? [WebSocket] friend_update received - automatically refreshing Friends tab!');
        fetchData();
      });

      socket.off('availability_changed').on('availability_changed', (payload: any) => {
        setData(prevData => {
          const newData = { ...prevData };
          (Object.keys(newData) as Array<keyof typeof newData>).forEach(tab => {
            newData[tab] = newData[tab].map(item => {
              if (item.id === payload.userId?.toString()) {
                return {
                  ...item,
                  callAvailable: payload.call_type === 'voice' ? payload.is_online : item.callAvailable,
                  videoAvailable: payload.call_type === 'video' ? payload.is_online : item.videoAvailable
                };
              }
              return item;
            });
          });
          return newData;
        });
      });

      socket.off('user_online').on('user_online', (payload: any) => {
        setData(prevData => {
          const newData = { ...prevData };
          (Object.keys(newData) as Array<keyof typeof newData>).forEach(tab => {
            newData[tab] = newData[tab].map(item => {
              if (item.id === payload.userId?.toString()) return { ...item, isOnline: true };
              return item;
            });
          });
          return newData;
        });
      });

      socket.off('user_offline').on('user_offline', (payload: any) => {
        setData(prevData => {
          const newData = { ...prevData };
          (Object.keys(newData) as Array<keyof typeof newData>).forEach(tab => {
            newData[tab] = newData[tab].map(item => {
              if (item.id === payload.userId?.toString()) return { ...item, isOnline: false };
              return item;
            });
          });
          return newData;
        });
      });
    }

    return () => {
      
      if (socket) {
        socket.off('friend_update');
        socket.off('availability_changed');
        socket.off('user_online');
        socket.off('user_offline');
      }

    };
  }, [activeTab, refreshToggle]);
  const renderEmptyState = (tab: TabKey) => (
    <View style={styles.emptyState}>
      <LinearGradient
        colors={['#F6EFDD', IVORY]}
        style={styles.emptyIconCircle}
      >
        <UserPlus size={36} color={GOLD_DEEP} strokeWidth={1.6} />
      </LinearGradient>
      <Text style={styles.emptyTitle}>{EMPTY_STATE_COPY[tab].title}</Text>
      <Text style={styles.emptySubtitle}>{EMPTY_STATE_COPY[tab].subtitle}</Text>
    </View>
  );

  const requestCount = data.requests.length;
  const sentCount = data.sent.length;
  const friendsCount = data.friends.length;
  const favouriteCount = data.favourite.length;

  const getTabLabel = (key: TabKey, label: string) => {
    const counts: Record<TabKey, number> = {
      friends: friendsCount,
      favourite: favouriteCount,
      requests: requestCount,
      sent: sentCount,
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
          <View style={styles.headerTextBlock}>
            <Text style={styles.headerTitle}>Friends</Text>
            <Text style={styles.headerSubtitle}>Your circle of connections</Text>
          </View>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.tabRow}
        >
          {TABS.map(({ key, label }) => {
            const isActive = activeTab === key;
            
            if (isActive) {
              return (
                <TouchableOpacity key={key} activeOpacity={0.85} style={styles.filterChipActive}>
                  <LinearGradient
                    colors={['#D4AF37', '#F5C542']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.filterGrad}
                  >
                    <Text style={styles.filterLabelActive}>{getTabLabel(key, label).toUpperCase()}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                key={key}
                style={styles.filterChip}
                activeOpacity={0.7}
                onPress={() => setActiveTab(key)}
              >
                <Text style={styles.filterLabel}>{getTabLabel(key, label).toUpperCase()}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name"
            placeholderTextColor="#8B7F98"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Search size={18} color="#4B5563" />
        </View>
      </LinearGradient>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={GOLD_DEEP} />
        </View>
      ) : (
        <View style={styles.listFlex}>
          {data[activeTab].length > 0 ? (
            <FlatList
              data={data[activeTab].filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))}
              keyExtractor={item => item.id}
              renderItem={({ item }) => {
                if (activeTab === 'friends' || activeTab === 'favourite') {
                  return (
                    <FriendCard
                      item={{...item, lastMessage: ''}}
                      onPress={() => setSelectedCreator({ 
                        ...item, 
                        callAvailable: item.callAvailable, 
                        videoAvailable: item.videoAvailable 
                      })}
                      onCall={() => initiateCallWithChecks(item, 'audio')}
                      onVideoCall={() => initiateCallWithChecks(item, 'video')}
                      onShowToast={showToast}
                    />
                  );
                }
                return (
                  <FriendRequestCard
                    item={item}
                    currentUserId={currentUserId || undefined}
                    onRemove={(id) =>
                      setData(prev => ({
                        ...prev,
                        [activeTab]: prev[activeTab].filter(i => i.id !== id),
                      }))
                    }
                    onAccepted={() => {
                      // Auto-switch to FRIENDS tab after accepting
                      setActiveTab('friends');
                    }}
                  />
                );
              }}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            renderEmptyState(activeTab)
          )}
        </View>
      )}

      {/* Toast */}
      {toastMessage && (
        <Animated.View style={[
          styles.toastContainer, 
          toastType === 'error' ? styles.toastError : styles.toastInfo,
          { opacity: toastOpacity }
        ]}>
          {toastShowLogo && <Image source={require('../../../assets/images/logo1.png')} style={{width: 20, height: 20, marginRight: 10, resizeMode: 'contain'}} />}
          <Text style={[styles.toastText, toastType === 'error' && styles.toastTextError]}>
            {toastMessage}
          </Text>
        </Animated.View>
      )}

      {selectedCreator && (
        <CreatorProfileModal
          creator={selectedCreator}
          visible={!!selectedCreator}
          onClose={() => { setSelectedCreator(null); setRefreshToggle(prev => prev + 1); }}
          onSendFriendRequest={() => {}}
          onViewProfile={() => {
            setSelectedCreator(null);
            navigation.navigate('CreatorFullProfile', { creatorId: selectedCreator.id });
          }}
          onCall={() => {
            setSelectedCreator(null);
            initiateCallWithChecks(selectedCreator, 'audio');
          }}
          onVideoCall={() => {
            setSelectedCreator(null);
            initiateCallWithChecks(selectedCreator, 'video');
          }}
        />
      )}

      {showRandomMatch && (
        <RandomMatchModal
          visible={showRandomMatch}
          onClose={() => setShowRandomMatch(false)}
          mode={randomMatchType}
          targetUser={randomMatchTarget ? { id: randomMatchTarget.id?.toString() || '0', name: randomMatchTarget.name, avatarUri: randomMatchTarget.avatarUri } : undefined}
          onMatchFound={(targetUserId) => {
            // Unused here, we already initiate call manually
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  headerGradient: {
    overflow: 'hidden',
    paddingBottom: 0,
  },
  statusBarSpacer: {
    height: STATUSBAR_HEIGHT,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerTextBlock: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: TEXT_PLUM,
    marginBottom: 4,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  headerSubtitle: {
    fontSize: 13.5,
    color: TEXT_MUTED,
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 10,
    marginTop: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#EBDFC4',
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
  tabBadge: {
    marginLeft: 7,
    minWidth: 21,
    height: 21,
    borderRadius: 10.5,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 127, 152, 0.16)',
  },
  tabBadgeActive: {
    backgroundColor: GOLD_DEEP,
  },
  tabBadgeText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: TEXT_MUTED,
  },
  tabBadgeTextActive: {
    color: '#2A1240',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 14,
    height: 4,
    borderRadius: 2,
  },
  listFlex: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#EBDFC4',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 48,
    marginHorizontal: 24,
    marginTop: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A2E',
  },
  toastContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 160 : 140, // Moved up slightly more
    alignSelf: 'center',
    backgroundColor: '#2A1240', // Deep purple
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 9999,
  },
  toastError: {},
  toastInfo: {},
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  toastTextError: {},
});

export default FriendsScreen;