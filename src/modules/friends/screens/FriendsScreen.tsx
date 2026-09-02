import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Platform,
  FlatList,
} from 'react-native';
import {
  UserPlus,
  Home as HomeIcon,
  Clock,
  Users,
  UserCircle2,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import FriendRequestCard, { FriendRequestItem } from '../components/FriendRequestCard';

const STATUSBAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

type RootStackParamList = {
  Friends: undefined;
  Home: undefined;
  Recent: undefined;
  Profile: undefined;
  [key: string]: undefined | object;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Friends'>;

type TabKey = 'friends' | 'favourite' | 'requests' | 'sent';

const DUMMY_DATA: Record<TabKey, FriendRequestItem[]> = {
  friends: [
    { id: 'f1', name: 'Priya', avatarUri: 'https://i.pravatar.cc/200?img=41', type: 'friend' },
    { id: 'f2', name: 'Neha', avatarUri: 'https://i.pravatar.cc/200?img=42', type: 'friend' },
  ],
  favourite: [
    { id: 'fav1', name: 'Anita', avatarUri: 'https://i.pravatar.cc/200?img=45', type: 'favourite' },
  ],
  requests: [
    { id: 'req1', name: 'Meera', avatarUri: 'https://i.pravatar.cc/200?img=47', type: 'received' },
  ],
  sent: [
    { id: 's1', name: 'Latha', avatarUri: 'https://i.pravatar.cc/200?img=32', type: 'sent' },
    { id: 's2', name: 'Sarika', avatarUri: 'https://i.pravatar.cc/200?img=38', type: 'sent' },
  ],
};

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

type NavKey = 'home' | 'recent' | 'friends' | 'profile';

const NAV_ITEMS: { key: NavKey; label: string; icon: LucideIcon }[] = [
  { key: 'home', label: 'Home', icon: HomeIcon },
  { key: 'recent', label: 'Recent', icon: Clock },
  { key: 'friends', label: 'Friends', icon: Users },
  { key: 'profile', label: 'Profile', icon: UserCircle2 },
];

const FriendsScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('friends');

  const renderEmptyState = (tab: TabKey) => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconCircle}>
        <UserPlus size={40} color="#C9C3D2" strokeWidth={1.6} />
      </View>
      <Text style={styles.emptyTitle}>{EMPTY_STATE_COPY[tab].title}</Text>
      <Text style={styles.emptySubtitle}>
        {EMPTY_STATE_COPY[tab].subtitle}
      </Text>
    </View>
  );

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.statusBarSpacer} />

      <View style={styles.headerRow}>
        <View style={styles.headerTextBlock}>
          <Text style={styles.headerTitle}>Friends</Text>
          <Text style={styles.headerSubtitle}>Your friends and requests</Text>
        </View>

        <View style={styles.decorWrap}>
          <View style={[styles.decorDot, styles.decorDot1]} />
          <View style={[styles.decorDot, styles.decorDot2]} />
          <View style={[styles.decorDot, styles.decorDot3]} />
          <View style={[styles.decorRing, styles.decorRing1]} />
          <View style={[styles.decorRing, styles.decorRing2]} />
        </View>
      </View>

      <View style={styles.tabRow}>
        {(['friends', 'favourite', 'requests', 'sent'] as TabKey[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabLabel,
                activeTab === tab && styles.tabLabelActive,
              ]}
            >
              {tab.toUpperCase()} {tab === 'sent' && `(${DUMMY_DATA.sent.length})`}
            </Text>
            {activeTab === tab && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.tabDivider} />

      {DUMMY_DATA[activeTab].length > 0 ? (
        <FlatList
          data={DUMMY_DATA[activeTab]}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <FriendRequestCard item={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmptyState(activeTab)
      )}

      <View style={styles.bottomNav}>
        {NAV_ITEMS.map(navItem => {
          const isActive = navItem.key === 'friends';
          const NavIcon = navItem.icon;
          return (
            <TouchableOpacity
              key={navItem.key}
              activeOpacity={0.8}
              style={styles.navItem}
              onPress={() => {
                if (navItem.key !== 'friends') {
                  navigation.navigate(
                    navItem.key === 'home'
                      ? 'Home'
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
                fill={isActive ? '#EC1372' : 'transparent'}
              />
              <Text
                style={[styles.navLabel, isActive && styles.navLabelActive]}
              >
                {navItem.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  statusBarSpacer: {
    height: STATUSBAR_HEIGHT,
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 16,
  },
  headerTextBlock: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1B0E22',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#8A7A9C',
  },
  decorWrap: {
    width: 60,
    height: 40,
  },
  decorDot: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#EC1372',
  },
  decorDot1: {
    width: 14,
    height: 14,
    top: 0,
    right: 4,
  },
  decorDot2: {
    width: 8,
    height: 8,
    top: 18,
    right: 24,
    opacity: 0.6,
  },
  decorDot3: {
    width: 5,
    height: 5,
    top: 4,
    right: 34,
    opacity: 0.4,
  },
  decorRing: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#F5C8DC',
  },
  decorRing1: {
    width: 12,
    height: 12,
    top: 22,
    right: 2,
  },
  decorRing2: {
    width: 7,
    height: 7,
    top: 10,
    right: 44,
    borderColor: '#F0A8C7',
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  tabItem: {
    marginRight: 22,
    paddingBottom: 10,
  },
  tabLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#B4A6BE',
    letterSpacing: 0.3,
  },
  tabLabelActive: {
    color: '#EC1372',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2.5,
    backgroundColor: '#EC1372',
    borderRadius: 2,
  },
  tabDivider: {
    height: 1,
    backgroundColor: '#F1EAF6',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 80,
  },
  emptyIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#F7F5FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1B0E22',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#8A7A9C',
    textAlign: 'center',
    lineHeight: 19,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
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

export default FriendsScreen;

