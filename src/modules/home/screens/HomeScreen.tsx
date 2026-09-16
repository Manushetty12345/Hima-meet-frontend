import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Platform,
  ScrollView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  MessageCircle,
  Users,
  Sparkles,
  Music,
  Film,
  Utensils,
  Heart,
  Plane,
  Phone,
  Video,
  Coins,
  Shuffle, X, BellOff,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../../../api/apiClient';
import { getSocket, initSocket } from '../../../api/socketClient';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import WelcomeOfferBottomSheet from '../components/WelcomeOfferBottomSheet';
import CreatorProfileModal from '../components/CreatorProfileModal';
import RandomMatchModal from '../components/RandomMatchModal';

const STATUSBAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

type RootStackParamList = {
  Home: undefined;
  Wallet: undefined;
  [key: string]: undefined | object;
};

type Props = BottomTabScreenProps<RootStackParamList, 'Home'>;



type FilterItem = {
  key: string;
  label: string;
  icon: LucideIcon;
};

// Static icon map for known interest names (fallback to Sparkles)
const INTEREST_ICON_MAP: Record<string, LucideIcon> = {
  music: Music,
  movies: Film,
  foodie: Utensils,
  food: Utensils,
  love: Heart,
  travel: Plane,
  chats: MessageCircle,
  all: Users,
  new: Sparkles,
  photography: Sparkles,
  gaming: Sparkles,
  fitness: Sparkles,
  sports: Sparkles,
  art: Sparkles,
  comedy: Sparkles,
  books: Sparkles,
  fashion: Sparkles,
  technology: Sparkles,
  cooking: Utensils,
};

const getIconForInterest = (name: string): LucideIcon => {
  const key = name.toLowerCase().trim();
  return INTEREST_ICON_MAP[key] ?? Sparkles;
};

const STATIC_FILTERS: FilterItem[] = [
  { key: 'all', label: 'All', icon: Users },
  { key: 'new', label: 'New', icon: Sparkles },
];

type CreatorItem = {
  id: string;
  name: string;
  avatarUri: string;
  isOnline: boolean;
  isNew?: boolean;
  callAvailable: boolean;
  callRate?: number;
  videoAvailable: boolean;
  videoRate?: number;
  isRandomFeatured?: boolean;
};




const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [filters, setFilters] = useState<FilterItem[]>(STATIC_FILTERS);
  const [creators, setCreators] = useState<CreatorItem[]>([]);
  const [loadingCreators, setLoadingCreators] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const activeFilterRef = React.useRef<string>('all');

  const fetchCreators = useCallback(async (filterKey: string) => {
    setLoadingCreators(true);
    try {
      const params: Record<string, string> = {};
      if (filterKey !== 'all') {
        // Find label for the filter key
        params.filter = filterKey;
      }
      const res = await apiClient.get('/api/feed/creators', { params });
      const data = res.data?.data ?? [];
      const mapped: CreatorItem[] = data.map((c: any) => ({
        id: String(c.creator_id),
        name: c.name,
        avatarUri: c.avatar_url,
        isOnline: c.is_online,
        lastSeen: c.last_seen_at,
        isNew: c.is_new,
        callAvailable: c.voice?.status === 'available',
        callRate: c.voice?.rate_per_min,
        videoAvailable: c.video?.status === 'available',
        videoRate: c.video?.rate_per_min,
      }));
      setCreators(mapped);
    } catch (e) {
      console.log('HomeScreen fetch creators error:', e);
    } finally {
      setLoadingCreators(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCreators(activeFilterRef.current);
  }, [fetchCreators]);
  const [coinBalance, setCoinBalance] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const fetchInterests = async () => {
        try {
          const res = await apiClient.get('/api/onboarding/interests');
          const interests: { id: number; name: string }[] = res.data?.data ?? [];
          const dynamicFilters: FilterItem[] = [
            ...STATIC_FILTERS,
            ...interests.map(i => ({
              key: String(i.id),
              label: i.name,
              icon: getIconForInterest(i.name),
            })),
          ];
          setFilters(dynamicFilters);
        } catch (e) {
          console.log('HomeScreen fetch interests error:', e);
        }
      };
      fetchInterests();
      const fetchBalance = async () => {
        try {
          const res = await apiClient.get('/api/wallet/balance');
          const balance = res.data?.data?.coin_balance ?? 0;
          setCoinBalance(balance);
        } catch (error) {
          console.log('HomeScreen fetch balance error:', error);
        }
      };
      fetchBalance();
      fetchCreators(activeFilterRef.current);
    }, [fetchCreators])
  );
  const [showWelcomeOffer, setShowWelcomeOffer] = useState(false); // Disabled as per user request
  const [selectedCreator, setSelectedCreator] = useState<CreatorItem | null>(null);
  const [showRandomMatch, setShowRandomMatch] = useState(false);
  const [randomMatchType, setRandomMatchType] = useState<'audio' | 'video'>('audio');
  const [isFabExpanded, setIsFabExpanded] = useState(false);

  const [randomMatchTarget, setRandomMatchTarget] = useState<CreatorItem | undefined>(undefined);

  // Refs to avoid stale closures in socket event handlers
  const randomMatchTargetRef = React.useRef<CreatorItem | undefined>(undefined);
  const randomMatchTypeRef = React.useRef<'audio' | 'video'>('audio');

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastAnim = React.useRef(new Animated.Value(0)).current;
  const callTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCallTimeout = () => {
    if (callTimeoutRef.current) {
      clearTimeout(callTimeoutRef.current);
      callTimeoutRef.current = null;
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2500),
      Animated.timing(toastAnim, { toValue: 0, duration: 300, useNativeDriver: true })
    ]).start(() => setToastMessage(null));
  };

  React.useEffect(() => {
    let socket = getSocket();
    
    const setupListeners = async () => {
      if (!socket) {
        socket = await initSocket();
      }
      if (!socket) return;

      const handleCallBusy = (data: { message: string }) => {
        clearCallTimeout();
        setShowRandomMatch(false);
        showToast(data.message || 'The user is currently on another call. Please try again.');
      };

      const handleCallDeclined = () => {
        clearCallTimeout();
        setShowRandomMatch(false);
        showToast('User is not available right now.');
      };

      const handleInsufficientCoins = () => {
        clearCallTimeout();
        setShowRandomMatch(false);
        const type = randomMatchTypeRef.current;
        const creator = randomMatchTargetRef.current;
        const rate = type === 'audio' ? creator?.callRate : creator?.videoRate;
        const requiredCoins = rate || (type === 'audio' ? 20 : 40);
        navigation.navigate('Wallet', { 
          showWarning: 'insufficient_coins',
          requiredCoins,
          callType: type
        } as any);
      };

      const handleCallAccepted = (data: { callId: number, agoraToken?: string, rate?: number, receiverId?: string, receiverName?: string, receiverAvatar?: string }) => {
        clearCallTimeout();
        setShowRandomMatch(false);
        // Use refs (not state) to avoid stale closure bug
        const callType = randomMatchTypeRef.current;
        const callTarget = randomMatchTargetRef.current;
        setTimeout(() => {
          navigation.navigate(callType === 'audio' ? 'AudioCallScreen' : 'VideoCallScreen', {
            callId: data.callId,
            targetId: data.receiverId || callTarget?.id,
            calleeName: data.receiverName || callTarget?.name,
            calleeAvatar: data.receiverAvatar || callTarget?.avatarUri,
            agoraToken: data.agoraToken || '',
            callRate: data.rate || (callType === 'audio' ? 20 : 40),
          } as any);
        }, 300);
      };

      const handleUserOffline = (data: { userId: string | number }) => {
        setCreators(prev => prev.map(c => 
          c.id === String(data.userId) ? { ...c, isOnline: false } : c
        ));
      };

      const handleUserOnline = (data: { userId: string | number }) => {
        setCreators(prev => prev.map(c => 
          c.id === String(data.userId) ? { ...c, isOnline: true } : c
        ));
      };

      const handleAvailabilityChanged = (payload: any) => {
        setCreators(prev => prev.map(c => {
          if (c.id === payload.userId?.toString()) {
            return {
              ...c,
              callAvailable: payload.call_type === 'voice' ? payload.is_online : c.callAvailable,
              videoAvailable: payload.call_type === 'video' ? payload.is_online : c.videoAvailable
            };
          }
          return c;
        }));
      };


      socket.off('call_busy').on('call_busy', handleCallBusy);
      socket.off('call_declined').on('call_declined', handleCallDeclined);
      socket.off('call_blocked_insufficient_coins').on('call_blocked_insufficient_coins', handleInsufficientCoins);
      socket.off('call_accepted').on('call_accepted', handleCallAccepted);
      socket.off('user_offline').on('user_offline', handleUserOffline);
      socket.off('user_online').on('user_online', handleUserOnline);
      socket.off('availability_changed').on('availability_changed', handleAvailabilityChanged);
      socket.off('cancel_incoming_call').on('cancel_incoming_call', (data) => {
        // If we are showing the random match modal, close it
        // Or if we are in an incoming call screen... wait, this is for the RECEIVER.
        // The receiver's incoming call modal is usually in a global provider or App.tsx.
        // However, if the receiver is on the HomeScreen, we should emit an event or close their modal.
        // Actually, where is the receiver's IncomingCallModal?
      });
    };

    setupListeners();

      return () => {
        if (socket) {
          socket.off('call_busy');
          socket.off('call_declined');
          socket.off('call_blocked_insufficient_coins');
          socket.off('call_accepted');
          socket.off('user_offline');
          socket.off('user_online');
          socket.off('availability_changed');
        }
      };
  }, [navigation, randomMatchType, randomMatchTarget]);

  const executeSocketCall = async () => {
    const creator = randomMatchTargetRef.current;
    const type = randomMatchTypeRef.current;
    
    let socket = getSocket();
    if (!socket) socket = await initSocket();
    if (!socket) return;

    if (creator && creator.id !== 'random-broadcast-dummy') {
      // 1-ON-1 DIRECT CALL (Normal Flow)
      const rate = type === 'audio' ? creator.callRate : creator.videoRate;
      const requiredCoins = rate || (type === 'audio' ? 20 : 40);
      socket.emit('initiate_call', { targetId: creator.id, type, rate: requiredCoins });
    } else {
      // BROADCAST RANDOM CALL
      socket.emit('initiate_random_broadcast', { type });
    }

    clearCallTimeout();
    callTimeoutRef.current = setTimeout(() => {
      setShowRandomMatch(false);
      showToast('No user is available right now.');
    }, 35000);
  };

  const initiateCallWithChecks = async (creator: CreatorItem, type: 'audio' | 'video') => {
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
    // Keep refs in sync so socket handlers never see stale closures
    randomMatchTargetRef.current = creator;
    randomMatchTypeRef.current = type;
    setShowRandomMatch(true);
  };

  const handleCall = (creator: CreatorItem) => {
    if (!creator.callAvailable) return;
    initiateCallWithChecks(creator, 'audio');
  };

  const handleVideoCall = (creator: CreatorItem) => {
    if (!creator.videoAvailable) return;
    initiateCallWithChecks(creator, 'video');
  };

  const handleRandom = () => {
    setRandomMatchTarget(undefined);
    setRandomMatchType(Math.random() > 0.5 ? 'audio' : 'video');
    setShowRandomMatch(true);
  };

  const renderCreator = ({ item }: { item: CreatorItem }) => (
    <View style={styles.creatorCard}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setSelectedCreator(item)}
        style={styles.avatarContainer}
      >
        <LinearGradient
          colors={['#5B0E8B', '#3A0F63']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatarRing}
        >
          <View style={styles.avatarInner}>
            <Image source={{ uri: item.avatarUri }} style={styles.avatarImage} />
          </View>
        </LinearGradient>
        {(item.callAvailable || item.videoAvailable) && (
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Available</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.creatorNameBlock}>
        <View style={styles.creatorNameRow}>
          <Text style={styles.creatorName}>{item.name}</Text>
          {item.isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <View style={styles.callAction}>
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={!(item.isOnline && item.callAvailable)}
            onPress={() => handleCall(item)}
            style={[styles.callBtn, (item.isOnline && item.callAvailable) && styles.callBtnOnline]}
          >
            <Phone size={14} color={(item.isOnline && item.callAvailable) ? '#9C27B0' : '#D1D5DB'} fill={(item.isOnline && item.callAvailable) ? '#9C27B0' : '#D1D5DB'} />
          </TouchableOpacity>
          {(item.isOnline && item.callAvailable) ? (
            <View style={styles.rateContainer}>
              <View style={styles.coinBadge}>
                <Text style={styles.coinBadgeText}>H</Text>
              </View>
              <Text style={styles.rateText}>{Math.round(Number(item.callRate)) || 20}/min</Text>
            </View>
          ) : (
            <Text style={styles.offlineText}>Offline</Text>
          )}
        </View>

        <View style={styles.verticalDivider} />

        <View style={styles.callAction}>
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={!(item.isOnline && item.videoAvailable)}
            onPress={() => handleVideoCall(item)}
            style={[styles.callBtn, (item.isOnline && item.videoAvailable) && styles.callBtnOnline]}
          >
            <Video size={14} color={(item.isOnline && item.videoAvailable) ? '#9C27B0' : '#D1D5DB'} fill={(item.isOnline && item.videoAvailable) ? '#9C27B0' : '#D1D5DB'} />
          </TouchableOpacity>
          {(item.isOnline && item.videoAvailable) ? (
            <View style={styles.rateContainer}>
              <View style={styles.coinBadge}>
                <Text style={styles.coinBadgeText}>H</Text>
              </View>
              <Text style={styles.rateText}>{Math.round(Number(item.videoRate)) || 40}/min</Text>
            </View>
          ) : (
            <Text style={styles.offlineText}>Offline</Text>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['#FBF7FF', '#EFDFFB']}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.statusBarSpacer} />

        <View style={styles.headerRow}>
        <Image
          source={require('../../../assets/images/logo1.png')}
          style={styles.brandIcon}
          resizeMode="contain"
        />
        <View style={styles.brandTextBlock}>
          <Text style={styles.brandTitle}>Himameet</Text>
          <Text style={styles.brandSubtitle}>Where Feelings Connect</Text>
        </View>

          <TouchableOpacity
            style={styles.balancePillWrapper}
            onPress={() => navigation.navigate('Wallet')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#D4AF37', '#F5C542']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.balancePillGrad}
            >
              <View style={styles.balanceCoinDot}>
                <Coins size={14} color="#D4AF37" fill="#F4C430" />
              </View>
              <Text style={styles.balanceText}>{coinBalance}</Text>
            </LinearGradient>
          </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {filters.map(filter => {
            const isActive = filter.key === activeFilter;
            const FilterIcon = filter.icon;
            if (isActive) {
              return (
                <TouchableOpacity
                  key={filter.key}
                  activeOpacity={0.85}
                  style={styles.filterPillActiveContainer}
                  onPress={() => {
                    const label = filter.label;
                    setActiveFilter(filter.key);
                    activeFilterRef.current = filter.key === 'all' ? 'all' : label;
                    fetchCreators(filter.key === 'all' ? 'all' : label);
                  }}
                >
                  <LinearGradient
                    colors={['#D4AF37', '#F5C542']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.filterPillActiveGrad}
                  >
                    <FilterIcon size={14} color="#2A1240" />
                    <Text style={styles.filterTextActive}>{filter.label.toUpperCase()}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                key={filter.key}
                activeOpacity={0.7}
                style={styles.filterPill}
                onPress={() => {
                  const label = filter.label;
                  setActiveFilter(filter.key);
                  activeFilterRef.current = filter.key === 'all' ? 'all' : label;
                  fetchCreators(filter.key === 'all' ? 'all' : label);
                }}
              >
                <FilterIcon size={14} color="#5B0E8B" />
                <Text style={styles.filterText}>{filter.label.toUpperCase()}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      </LinearGradient>

      <FlatList
        data={creators}
        keyExtractor={item => item.id}
        renderItem={renderCreator}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#9C27B0']} tintColor="#9C27B0" />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />



      <WelcomeOfferBottomSheet
        visible={showWelcomeOffer}
        onClose={() => setShowWelcomeOffer(false)}
        onAddCoins={() => {
          setShowWelcomeOffer(false);
          navigation.navigate('Wallet');
        }}
        onViewMorePlans={() => {
          setShowWelcomeOffer(false);
          navigation.navigate('Wallet');
        }}
      />

      <CreatorProfileModal
        creator={selectedCreator}
        visible={!!selectedCreator}
        onClose={() => setSelectedCreator(null)}
        onSendFriendRequest={(creator) => {
          // Friend request - handled by API
        }}
        onViewProfile={(creator) => {
          setSelectedCreator(null);
          // Navigate to full creator profile screen
          navigation.navigate('CreatorFullProfile', { creator });
        }}
        onCall={(creator) => {
          setSelectedCreator(null);
          handleCall(creator);
        }}
        onVideoCall={(creator) => {
          setSelectedCreator(null);
          handleVideoCall(creator);
        }}
      />

      <RandomMatchModal
        visible={showRandomMatch}
        onClose={() => {
          setShowRandomMatch(false);
          const socket = getSocket();
          if (socket) socket.emit('cancel_call', { targetId: randomMatchTarget?.id });
        }}
        mode={randomMatchType}
        targetUser={randomMatchTarget}
        onProceedWithDirectCall={executeSocketCall}
        onMatchFound={(creator: any) => {
            // Construct a partial CreatorItem for the checks
            const mockCreator = {
              id: creator.id,
              name: creator.name,
              avatarUri: creator.avatarUri,
              callAvailable: true,
              videoAvailable: true,
              callRate: creator.callRate || 20,
              videoRate: creator.videoRate || 40,
            } as any;
          initiateCallWithChecks(mockCreator, randomMatchType);
        }}
      />

      {/* Floating Random Button */}
      {isFabExpanded ? (
        <View style={styles.expandedFabContainer}>
          <TouchableOpacity
            style={[styles.fabActionCircle, { backgroundColor: '#D4AF37' }]}
            activeOpacity={0.8}
            onPress={() => {
              setRandomMatchType('audio');
              setShowRandomMatch(true);
              setIsFabExpanded(false);
            }}
          >
            <Phone size={24} color="#FFFFFF" fill="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.fabActionCircle, { backgroundColor: '#3A0F63' }]}
            activeOpacity={0.8}
            onPress={() => {
              setRandomMatchType('video');
              setShowRandomMatch(true);
              setIsFabExpanded(false);
            }}
          >
            <Video size={24} color="#FFFFFF" fill="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.fabActionCircle, { backgroundColor: '#E5DFEB' }]}
            activeOpacity={0.8}
            onPress={() => setIsFabExpanded(false)}
          >
            <X size={24} color="#333333" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.fab} activeOpacity={0.9} onPress={() => setIsFabExpanded(true)}>
          <LinearGradient
            colors={['#3A0F63', '#6A2A9A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.fabGradient}
          >
            <Shuffle size={22} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.fabText}>Random</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* Animated Toast */}
      {toastMessage && (
        <Animated.View style={[
          styles.toastContainer,
          {
            opacity: toastAnim,
            transform: [{
              translateY: toastAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
              })
            }]
          }
        ]}>
          <Image source={require('../../../assets/images/logo1.png')} style={styles.toastIcon} />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#F6F3FA',
  },
  headerGradient: {
    overflow: 'hidden',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 12,
    shadowColor: '#3A0F63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  statusBarSpacer: {
    height: STATUSBAR_HEIGHT,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
  },
  brandIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    marginRight: 10,
  },
  brandTextBlock: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333333',
  },
  brandSubtitle: {
    fontSize: 12,
    color: '#8A7A9C',
    marginTop: 2,
  },
  balancePillWrapper: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'transparent',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  balancePillGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  balanceCoinDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  filterContainer: {
    height: 58,
  },
  filterRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#EBDFC4',
    backgroundColor: '#FFFFFF',
    shadowColor: '#3A0F63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
    gap: 6,
  },
  filterPillActiveContainer: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'transparent',
    shadowColor: '#3A0F63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  filterPillActiveGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B0E8B',
    letterSpacing: 0.5,
  },
  filterTextActive: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2A1240',
    letterSpacing: 0.5,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  creatorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#4A0F6E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    alignItems: 'center',
    marginRight: 10,
    width: 52,
  },
  avatarRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  avatarImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9C27B0',
  },
  liveText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#9C27B0',
  },
  creatorNameBlock: {
    flex: 1,
    alignSelf: 'flex-start',
    marginTop: 14,
  },
  creatorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  creatorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  newBadge: {
    backgroundColor: '#9C27B0',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  newBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  callAction: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
  },
  verticalDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 6,
  },
  callBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  callBtnOnline: {
    borderColor: '#F3E5F5',
  },
  offlineText: {
    fontSize: 9,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  coinBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FBC02D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinBadgeText: {
    fontSize: 7,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  rateText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#374151',
  },
  fab: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    borderRadius: 36,
    shadowColor: '#FF1493',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 36,
    gap: 10,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  expandedFabContainer: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    alignItems: 'center',
    gap: 16,
  },
  fabActionCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  toastContainer: {
      position: 'absolute',
      bottom: 120,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A1240',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 9999,
  },
  toastIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
    resizeMode: 'contain',
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default HomeScreen;

