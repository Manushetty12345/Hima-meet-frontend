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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { UserPlus } from 'lucide-react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import FriendRequestCard, { FriendRequestItem } from '../components/FriendRequestCard';
import { getFriends, getFavourites, getRequestsReceived, getRequestsSent } from '../api/friendsApi';

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
  const [activeTab, setActiveTab] = useState<TabKey>('friends');
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
            type,
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
                  {label}
                </Text>
                {key === 'requests' && requestCount > 0 && (
                  <View style={[styles.tabBadge, isActive && styles.tabBadgeActive]}>
                    <Text
                      style={[styles.tabBadgeText, isActive && styles.tabBadgeTextActive]}
                    >
                      {requestCount}
                    </Text>
                  </View>
                )}
                {isActive && (
                  <LinearGradient
                    colors={[GOLD, GOLD_DEEP]}
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
      ) : data[activeTab].length > 0 ? (
        <View style={styles.listFlex}>
          <FlatList
            data={data[activeTab]}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <FriendRequestCard item={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        renderEmptyState(activeTab)
      )}
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
    fontSize: 16.5,
    fontWeight: '700',
    color: TEXT_MUTED,
  },
  tabLabelActive: {
    color: TEXT_PLUM,
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
});

export default FriendsScreen;