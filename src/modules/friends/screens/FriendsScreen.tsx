import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Platform,
  FlatList,
  ActivityIndicator,
  Animated,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { UserPlus, Search, Bell } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
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
  const [toastIcon, setToastIcon] = useState<React.ReactNode>(null);
  const toastOpacity = React.useRef(new Animated.Value(0)).current;

  const showToast = (message: string, type: 'error' | 'info' = 'info', icon?: React.ReactNode) => {
    setToastMessage(message);
    setToastType(type);
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

  // Call & Modal state
  const [selectedCreator, setSelectedCreator] = useState<any>(null);
  const [showRandomMatch, setShowRandomMatch] = useState(false);
  const [randomMatchType, setRandomMatchType] = useState<'audio' | 'video'>('audio');
  const [randomMatchTarget, setRandomMatchTarget] = useState<any>(undefined);
  const [coinBalance, setCoinBalance] = useState(0);

  React.useEffect(() => {
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
  }, []);

  React.useEffect(() => {
    let socket = getSocket();
    
    const setupListeners = async () => {
      if (!socket) {
        socket = await initSocket();
      }
      if (!socket) return;

      const handleCallBusy = (data: { message: string }) => {
        setShowRandomMatch(false);
        showToast(data.message || 'The user is currently on another call. Please try again later.', 'error');
      };

      const handleCallDeclined = () => {
        setShowRandomMatch(false);
        showToast('User is not available right now.', 'error');
      };

      const handleCallAccepted = (data: { callId: number }) => {
        setShowRandomMatch(false);
        navigation.navigate(randomMatchType === 'audio' ? 'AudioCallScreen' : 'VideoCallScreen', {
          callId: data.callId,
          targetId: randomMatchTarget?.id,
          calleeName: randomMatchTarget?.name,
          calleeAvatar: randomMatchTarget?.avatarUri
        } as any);
      };

      socket.off('call_busy').on('call_busy', handleCallBusy);
      socket.off('call_declined').on('call_declined', handleCallDeclined);
      socket.off('call_accepted').on('call_accepted', handleCallAccepted);
    };

    setupListeners();

    return () => {
      if (socket) {
        socket.off('call_busy');
        socket.off('call_declined');
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
          const formatted = res.data.data.map((item: any) => ({
            id: item.user_id?.toString() || item.id?.toString(),
            name: item.name || item.full_name,
            avatarUri: item.avatar_url || 'https://hima-bucket.s3.amazonaws.com/default-avatar.png',
            isOnline: Boolean(item.is_online),
            callRate: item.voice?.rate_per_min,
            videoRate: item.video?.rate_per_min,
            // For requests tab, use the status from API (can be 'received' or 'accepted_by_receiver')
            type: activeTab === 'requests' ? (item.status || type) : type,
          }));
          setData(prev => ({ ...prev, [activeTab]: formatted }));
        }
      } catch (err) {
        console.error('Failed to fetch data for tab:', activeTab, err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);
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

        <View style={styles.tabRow}>
          {TABS.map(({ key, label }) => {
            const isActive = activeTab === key;
            return (
              <TouchableOpacity
                key={key}
                style={styles.tabItem}
                activeOpacity={0.7}
                onPress={() => setActiveTab(key)}
              >
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {getTabLabel(key, label)}
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

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={GOLD_DEEP} />
        </View>
      ) : (
        <View style={styles.listFlex}>
          {(activeTab === 'friends' || activeTab === 'favourite') && (
            <View style={styles.searchContainer}>
              <Search size={18} color="#9CA3AF" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name"
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          )}
          {data[activeTab].length > 0 ? (
            <FlatList
              data={data[activeTab].filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))}
              keyExtractor={item => item.id}
              renderItem={({ item }) => {
                if (activeTab === 'friends' || activeTab === 'favourite') {
                  return (
                    <FriendCard
                      item={{...item, lastMessage: ''}}
                      onPress={() => setSelectedCreator({ ...item, callAvailable: (item as any).isOnline, videoAvailable: (item as any).isOnline })}
                      onCall={() => initiateCallWithChecks(item, 'audio')}
                      onVideoCall={() => initiateCallWithChecks(item, 'video')}
                      onShowToast={showToast}
                    />
                  );
                }
                return (
                  <FriendRequestCard
                    item={item}
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
          {toastIcon}
          <Text style={[styles.toastText, toastType === 'error' && styles.toastTextError]}>
            {toastMessage}
          </Text>
        </Animated.View>
      )}

      {selectedCreator && (
        <CreatorProfileModal
          creator={selectedCreator}
          visible={!!selectedCreator}
          onClose={() => setSelectedCreator(null)}
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
    paddingBottom: 10,
  },
  statusBarSpacer: {
    height: STATUSBAR_HEIGHT,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 18,
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
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FF1493',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 44,
    backgroundColor: '#FFFFFF',
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
    bottom: Platform.OS === 'ios' ? 40 : 20,
    alignSelf: 'center',
    backgroundColor: '#2A1240',
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
  toastError: {
    backgroundColor: '#C8102E', // Keep it red for errors
  },
  toastInfo: {
    // Info uses the default #2A1240 background from container
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  toastTextError: {
    color: '#FFFFFF',
  },
});

export default FriendsScreen;