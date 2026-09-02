import React, { useState } from 'react';
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
  Shuffle,
  Home as HomeIcon,
  Clock,
  UserCircle2,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import WelcomeOfferBottomSheet from '../components/WelcomeOfferBottomSheet';

const STATUSBAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

type RootStackParamList = {
  Home: undefined;
  Wallet: undefined;
  [key: string]: undefined | object;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

type FilterKey =
  | 'chats'
  | 'all'
  | 'new'
  | 'music'
  | 'movies'
  | 'foodie'
  | 'love'
  | 'travel';

const FILTERS: { key: FilterKey; label: string; icon: LucideIcon }[] = [
  { key: 'chats', label: 'Chats', icon: MessageCircle },
  { key: 'all', label: 'All', icon: Users },
  { key: 'new', label: 'New', icon: Sparkles },
  { key: 'music', label: 'Music', icon: Music },
  { key: 'movies', label: 'Movies', icon: Film },
  { key: 'foodie', label: 'Foodie', icon: Utensils },
  { key: 'love', label: 'Love', icon: Heart },
  { key: 'travel', label: 'Travel', icon: Plane },
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

const CREATORS: CreatorItem[] = [
  {
    id: 'c1',
    name: 'Yamuna',
    avatarUri: 'https://i.pravatar.cc/200?img=31',
    isOnline: true,
    callAvailable: true,
    callRate: 10,
    videoAvailable: false,
  },
  {
    id: 'c2',
    name: 'Latha',
    avatarUri: 'https://i.pravatar.cc/200?img=32',
    isOnline: true,
    callAvailable: true,
    callRate: 10,
    videoAvailable: true,
    videoRate: 60,
  },
  {
    id: 'c3',
    name: 'Madhavi',
    avatarUri: 'https://i.pravatar.cc/200?img=33',
    isOnline: true,
    callAvailable: true,
    callRate: 10,
    videoAvailable: false,
  },
  {
    id: 'c4',
    name: 'Vidya',
    avatarUri: 'https://i.pravatar.cc/200?img=34',
    isOnline: true,
    callAvailable: false,
    videoAvailable: true,
    videoRate: 60,
  },
  {
    id: 'c5',
    name: 'Harini',
    avatarUri: 'https://i.pravatar.cc/200?img=35',
    isOnline: true,
    callAvailable: true,
    callRate: 10,
    videoAvailable: false,
  },
  {
    id: 'c6',
    name: 'snitha',
    avatarUri: 'https://i.pravatar.cc/200?img=36',
    isOnline: true,
    callAvailable: true,
    callRate: 10,
    videoAvailable: false,
  },
  {
    id: 'c7',
    name: 'Usha',
    avatarUri: 'https://i.pravatar.cc/200?img=37',
    isOnline: true,
    isNew: true,
    callAvailable: true,
    callRate: 10,
    videoAvailable: true,
    videoRate: 60,
  },
];

type NavKey = 'home' | 'recent' | 'friends' | 'profile';

const NAV_ITEMS: { key: NavKey; label: string; icon: LucideIcon }[] = [
  { key: 'home', label: 'Home', icon: HomeIcon },
  { key: 'recent', label: 'Recent', icon: Clock },
  { key: 'friends', label: 'Friends', icon: Users },
  { key: 'profile', label: 'Profile', icon: UserCircle2 },
];

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [activeNav, setActiveNav] = useState<NavKey>('home');
  const [coinBalance] = useState(0);
  const [showWelcomeOffer, setShowWelcomeOffer] = useState(true);

  const handleCall = (creator: CreatorItem) => {
    if (!creator.callAvailable) return;
    // TODO: navigate to your voice-call screen / start call flow with creator.id
  };

  const handleVideoCall = (creator: CreatorItem) => {
    if (!creator.videoAvailable) return;
    // TODO: navigate to your video-call screen / start call flow with creator.id
  };

  const handleRandom = () => {
    // TODO: navigate to your random-match flow
  };

  const renderCreator = ({ item }: { item: CreatorItem }) => (
    <View style={styles.creatorCard}>
      <View style={styles.avatarWrap}>
        <Image source={{ uri: item.avatarUri }} style={styles.avatarImage} />
        {item.isOnline && <View style={styles.onlineDot} />}
      </View>

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
                <Coins size={10} color="#E8B44A" />
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
                <Coins size={10} color="#E8B44A" />
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
        <View style={styles.brandIcon}>
          <MessageCircle size={18} color="#FFFFFF" />
        </View>
        <View style={styles.brandTextBlock}>
          <Text style={styles.brandTitle}>Hi ma</Text>
          <Text style={styles.brandSubtitle}>Where Feelings Connect</Text>
        </View>

        <TouchableOpacity 
          style={styles.balancePill}
          onPress={() => navigation.navigate('Wallet')}
          activeOpacity={0.8}
        >
          <View style={styles.balanceCoinDot}>
            <Coins size={14} color="#F4C430" fill="#F4C430" />
          </View>
          <Text style={styles.balanceText}>{coinBalance}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map(filter => {
          const isActive = filter.key === activeFilter;
          const FilterIcon = filter.icon;
          return (
            <TouchableOpacity
              key={filter.key}
              activeOpacity={0.85}
              onPress={() => setActiveFilter(filter.key)}
            >
              {isActive ? (
                <LinearGradient
                  colors={['#8E2DE2', '#E0116F']}
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

      <FlatList
        data={CREATORS}
        keyExtractor={item => item.id}
        renderItem={renderCreator}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.bottomNav}>
        {NAV_ITEMS.map(navItem => {
          const isActive = navItem.key === activeNav;
          const NavIcon = navItem.icon;
          return (
            <TouchableOpacity
              key={navItem.key}
              activeOpacity={0.8}
              style={styles.navItem}
              onPress={() => {
                if (navItem.key !== 'home') {
                  navigation.navigate(
                    navItem.key === 'friends'
                      ? 'Friends'
                      : navItem.key === 'recent'
                      ? 'Recent'
                      : 'Profile'
                  );
                }
              }}
            >
              <NavIcon
                size={22}
                color={isActive ? '#EC1372' : '#B4A6BE'}
                fill={isActive && navItem.key === 'home' ? '#EC1372' : 'transparent'}
              />
              <Text
                style={[
                  styles.navLabel,
                  isActive && styles.navLabelActive,
                ]}
              >
                {navItem.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <WelcomeOfferBottomSheet
        visible={showWelcomeOffer}
        onClose={() => setShowWelcomeOffer(false)}
        onAddCoins={() => {
          console.log('Add coins clicked');
          setShowWelcomeOffer(false);
        }}
        onViewMorePlans={() => {
          console.log('View more plans clicked');
          setShowWelcomeOffer(false);
        }}
      />
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
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#EC1372',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  brandTextBlock: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1B0E22',
  },
  brandSubtitle: {
    fontSize: 11,
    color: '#8A7A9C',
  },
  balancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF1493',
    borderRadius: 24,
    paddingLeft: 4,
    paddingRight: 16,
    paddingVertical: 4,
  },
  balanceCoinDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  balanceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  filterRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: 'transparent',
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  filterPillActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  filterText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#8A7A9C',
  },
  filterTextActive: {
    fontSize: 12.5,
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
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#EC1372',
    padding: 2,
    marginRight: 14,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#2FA35C',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  creatorNameBlock: {
    flex: 1,
  },
  creatorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  creatorName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1B0E22',
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
    fontWeight: '600',
    color: '#8A7A9C',
  },
  offlineText: {
    fontSize: 10.5,
    color: '#B4A6BE',
  },
  randomButtonWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  randomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  randomButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
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
});

export default HomeScreen;

