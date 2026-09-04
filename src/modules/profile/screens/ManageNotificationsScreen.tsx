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
import { ArrowLeft, BellOff } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';
import apiClient from '../../../api/apiClient';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;
type Props = NativeStackScreenProps<AuthStackParamList, 'ManageNotifications'>;

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
        trackColor={{ false: '#E2DCE8', true: '#2DD36F' }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#E2DCE8"
        style={styles.toggle}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.statusBarSpacer} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={19} color="#EC1372" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Notifications</Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Creator online alerts</Text>
        <Text style={styles.sectionSubtitle}>
          Choose which creators can send you online now push notifications.
        </Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#EC1372" />
        </View>
      ) : creators.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconWrap}>
            <BellOff size={32} color="#8A7A9C" />
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
  container: {
    flex: 1,
    backgroundColor: '#F9F7FB',
  },
  statusBarSpacer: {
    height: STATUSBAR_HEIGHT,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBF5',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0EBF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1B0E22',
  },
  sectionHeader: {
    padding: 20,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4A3860',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#8A7A9C',
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
    backgroundColor: '#F0EBF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 13.5,
    color: '#8A7A9C',
    textAlign: 'center',
    lineHeight: 22,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  creatorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#5B0E8B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 14,
  },
  creatorInfo: {
    flex: 1,
  },
  creatorName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1B0E22',
    marginBottom: 4,
  },
  creatorSubtitle: {
    fontSize: 12,
    color: '#8A7A9C',
  },
  toggle: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
});

export default ManageNotificationsScreen;
