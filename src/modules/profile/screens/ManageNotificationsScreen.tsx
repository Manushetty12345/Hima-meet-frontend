import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  ActivityIndicator,
  FlatList,
  Image,
  Switch,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, BellOff } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';
import apiClient from '../../../api/apiClient';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;
type Props = NativeStackScreenProps<AuthStackParamList, 'ManageNotifications'>;

// ---- Palette pulled from the Himameet mark ----
const PLUM_ROYAL = '#5B0E8B';
const GOLD = '#F5C542';
const GOLD_DEEP = '#D4AF37';
const IVORY = '#FBF6EC';
const IVORY_LINE = '#EBDFC4';
const TEXT_PLUM = '#2A1240';
const TEXT_MUTED = '#8B7F98';

// Light lavender header wash — matches the rest of the flow
const LILAC_WHITE = '#FBF7FF';
const LILAC_PALE = '#EFDFFB';

type TrackedCreator = {
  creator_id: number;
  name: string;
  avatar_url: string;
  notify_enabled: boolean;
};

const ManageNotificationsScreen: React.FC<Props> = ({ navigation }) => {
  const [creators, setCreators] = useState<TrackedCreator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrackedCreators();
  }, []);

  const fetchTrackedCreators = async () => {
    try {
      const res = await apiClient.get('/api/user/tracked-creators');
      if (res.data?.data) {
        setCreators(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch tracked creators:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (creatorId: number, currentValue: boolean) => {
    const newValue = !currentValue;

    // Optimistic UI update
    setCreators(prev =>
      prev.map(c =>
        c.creator_id === creatorId ? { ...c, notify_enabled: newValue } : c
      )
    );

    try {
      await apiClient.post(`/api/creator/${creatorId}/notify-online`, {
        enabled: newValue,
      });
      // If toggled off, they disappear from the "tracked" list backend-wise
      // But we can keep them in the list until next reload so user can toggle back on easily
    } catch (error) {
      console.error('Failed to toggle notification:', error);
      // Revert on fail
      setCreators(prev =>
        prev.map(c =>
          c.creator_id === creatorId ? { ...c, notify_enabled: currentValue } : c
        )
      );
    }
  };

  const renderCreator = ({ item }: { item: TrackedCreator }) => (
    <View style={styles.creatorCard}>
      <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
      <View style={styles.creatorInfo}>
        <Text style={styles.creatorName}>{item.name}</Text>
        <Text style={styles.creatorSubtitle}>Notify when online</Text>
      </View>
      <Switch
        value={item.notify_enabled}
        onValueChange={() => handleToggle(item.creator_id, item.notify_enabled)}
        trackColor={{ false: IVORY_LINE, true: GOLD_DEEP }}
        thumbColor="#FFFFFF"
        ios_backgroundColor={IVORY_LINE}
        style={styles.toggle}
      />
    </View>
  );

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

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={20} color={PLUM_ROYAL} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manage Notifications</Text>
        </View>
      </LinearGradient>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Creator online alerts</Text>
        <Text style={styles.sectionSubtitle}>
          Choose which creators can send you online now push notifications.
        </Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={GOLD_DEEP} />
        </View>
      ) : creators.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconWrap}>
            <BellOff size={30} color={GOLD_DEEP} />
          </View>
          <Text style={styles.emptyText}>
            You're not tracking any creator yet. Tap the bell next to a creator in Chats to start.
          </Text>
        </View>
      ) : (
        <FlatList
          data={creators}
          keyExtractor={(item) => item.creator_id.toString()}
          renderItem={renderCreator}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
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
  },
  statusBarSpacer: {
    height: STATUSBAR_HEIGHT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(91, 14, 139, 0.10)',
    borderWidth: 1.5,
    borderColor: 'rgba(91, 14, 139, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: TEXT_PLUM,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  sectionHeader: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: TEXT_PLUM,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: TEXT_MUTED,
    lineHeight: 20,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 40,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(245, 197, 66, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 66, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 13.5,
    color: TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 22,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  creatorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    borderRadius: 18,
    marginBottom: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 14,
    backgroundColor: IVORY,
  },
  creatorInfo: {
    flex: 1,
  },
  creatorName: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_PLUM,
    marginBottom: 4,
  },
  creatorSubtitle: {
    fontSize: 12,
    color: TEXT_MUTED,
  },
  toggle: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
});

export default ManageNotificationsScreen;