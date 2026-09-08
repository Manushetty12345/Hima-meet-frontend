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
  Shuffle, X,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../../../api/apiClient';
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
    }
  }, []);
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
  const [showWelcomeOffer, setShowWelcomeOffer] = useState(true);
  const [selectedCreator, setSelectedCreator] = useState<CreatorItem | null>(null);
  const [showRandomMatch, setShowRandomMatch] = useState(false);
  const [randomMatchType, setRandomMatchType] = useState<'audio' | 'video'>('audio');
  const [isFabExpanded, setIsFabExpanded] = useState(false);

  const handleCall = (creator: CreatorItem) => {
    if (!creator.callAvailable) return;
    // @ts-ignore
    navigation.navigate('AudioCallScreen', { calleeName: creator.name });
  };

  const handleVideoCall = (creator: CreatorItem) => {
    if (!creator.videoAvailable) return;
    // @ts-ignore
    navigation.navigate('VideoCallScreen', { calleeName: creator.name });
  };

  const handleRandom = () => {
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
        <View style={styles.avatarWrap}>
          <Image source={{ uri: item.avatarUri }} style={styles.avatarImage} />
        </View>
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

      <View style={styles.actionsRow}>
        <View style={styles.actionCol}>
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={!item.callAvailable}
            onPress={() => handleCall(item)}
            style={[
              styles.actionCircle,
              item.callAvailable
                ? styles.actionCircleActive
                : styles.actionCircleDisabled,
            ]}
          >
            <Phone
              size={18}
              color={item.callAvailable ? '#EC1372' : '#B9AFC4'}
              fill={item.callAvailable ? '#EC1372' : 'transparent'}
            />
          </TouchableOpacity>
          <View style={styles.actionTextContainer}>
            {item.callAvailable ? (
              <View style={styles.rateRow}>
                <Coins size={10} color="#C8860A" />
                <Text style={styles.rateText}>{item.callRate}/min</Text>
              </View>
            ) : (
              <Text style={styles.offlineText}>Offline</Text>
            )}
          </View>
        </View>

        <View style={styles.actionCol}>
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={!item.videoAvailable}
            onPress={() => handleVideoCall(item)}
            style={[
              styles.actionCircle,
              item.videoAvailable
                ? styles.actionCircleActive
                : styles.actionCircleDisabled,
            ]}
          >
            <Video
              size={18}
              color={item.videoAvailable ? '#8E2DE2' : '#B9AFC4'}
              fill={item.videoAvailable ? '#8E2DE2' : '#B9AFC4'}
            />
          </TouchableOpacity>
          <View style={styles.actionTextContainer}>
            {item.videoAvailable ? (
              <View style={styles.rateRow}>
                <Coins size={10} color="#C8860A" />
                <Text style={styles.rateText}>{item.videoRate}/min</Text>
              </View>
            ) : (
              <Text style={styles.offlineText}>Offline</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" />
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
          style={styles.balancePill}
          onPress={() => navigation.navigate('Wallet')}
          activeOpacity={0.8}
        >
          <View style={styles.balanceCoinDot}>
            <Coins size={18} color="#F4C430" fill="#F4C430" />
          </View>
          <Text style={styles.balanceText}>{coinBalance}</Text>
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
            return (
              <TouchableOpacity
                key={filter.key}
                activeOpacity={0.85}
                onPress={() => {
                    const label = filter.label;
                    setActiveFilter(filter.key);
                    activeFilterRef.current = filter.key === 'all' ? 'all' : label;
                    fetchCreators(filter.key === 'all' ? 'all' : label);
                  }}
              >
                {isActive ? (
                  <LinearGradient
                    colors={['#9C27B0', '#FF1493']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.filterPillActive}
                  >
                    <FilterIcon size={13} color="#FFFFFF" />
                    <Text style={styles.filterTextActive}>{filter.label}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.filterPill}>
                    <FilterIcon size={13} color="#8A7A9C" />
                    <Text style={styles.filterText}>{filter.label}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={creators}
        keyExtractor={item => item.id}
        renderItem={renderCreator}
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
        onClose={() => setShowRandomMatch(false)}
        mode={randomMatchType}
      />

      {/* Floating Random Button */}
      {isFabExpanded ? (
        <View style={styles.expandedFabContainer}>
          <TouchableOpacity 
            style={[styles.fabActionCircle, { backgroundColor: '#FF1493' }]}
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
            style={[styles.fabActionCircle, { backgroundColor: '#9C27B0' }]}
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
            colors={['#FF1493', '#FF1493']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.fabGradient}
          >
            <Shuffle size={22} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.fabText}>Random</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#F6F3FA',
  },
  statusBarSpacer: {
    height: STATUSBAR_HEIGHT,
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
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
  balancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF1493',
    borderRadius: 28,
    paddingLeft: 6,
    paddingRight: 20,
    paddingVertical: 6,
  },
  balanceCoinDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  balanceText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  filterContainer: {
    height: 58,
    backgroundColor: '#FFFFFF',
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
    gap: 6,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  filterPillActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  filterText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#8A7A9C',
  },
  filterTextActive: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
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
    marginRight: 14,
    width: 60,
  },
  avatarWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#9C27B0',
    padding: 2,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
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
    backgroundColor: '#2ECC71',
  },
  liveText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#2ECC71',
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
    fontSize: 18,
    fontWeight: '800',
    color: '#333333',
  },
  newBadge: {
    backgroundColor: '#EC1372',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  newBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 14,
  },
  actionCol: {
    alignItems: 'center',
  },
  actionCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  actionCircleActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionCircleDisabled: {
    backgroundColor: '#F0EBF5',
  },
  actionTextContainer: {
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rateText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#C8860A',
  },
  offlineText: {
    fontSize: 10.5,
    color: '#B4A6BE',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
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
    bottom: 20,
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

});

export default HomeScreen;

