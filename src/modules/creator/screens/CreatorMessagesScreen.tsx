import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import CreatorEarningRow, { EarningRecord } from '../components/CreatorEarningRow';
import { PhoneMissed, Video, Phone } from 'lucide-react-native';
import apiClient from '../../../api/apiClient';

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

const CreatorMessagesScreen = () => {
  const [activeTab, setActiveTab] = useState<'chats' | 'calls' | 'missed'>('chats');
  const [missedCalls, setMissedCalls] = useState<MissedCall[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (activeTab === 'missed') {
      fetchMissedCalls();
    }
  }, [activeTab]);

  const fetchMissedCalls = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/calls/missed');
      if (res.data?.status === 'success') {
        setMissedCalls(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch missed calls:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Messages</Text>

      {/* Top Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'chats' && styles.activeTab]}
          onPress={() => setActiveTab('chats')}
        >
          <Text style={[styles.tabText, activeTab === 'chats' && styles.activeTabText]}>Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'calls' && styles.activeTab]}
          onPress={() => setActiveTab('calls')}
        >
          <Text style={[styles.tabText, activeTab === 'calls' && styles.activeTabText]}>Calls</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'missed' && styles.activeTab]}
          onPress={() => setActiveTab('missed')}
        >
          <Text style={[styles.tabText, activeTab === 'missed' && styles.activeTabText]}>Missed</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'chats' && (
          <View style={styles.card}>
            <Text style={styles.emptyText}>No active chats yet.</Text>
          </View>
        )}
        
        {activeTab === 'calls' && (
          <View style={styles.card}>
            {DUMMY_EARNINGS.map(item => (
              <CreatorEarningRow key={item.id} item={item} />
            ))}
          </View>
        )}

        {activeTab === 'missed' && (
          <View style={styles.card}>
            {loading ? (
              <ActivityIndicator size="small" color="#5B0E8B" style={{ margin: 20 }} />
            ) : missedCalls.length === 0 ? (
              <Text style={styles.emptyText}>No missed calls.</Text>
            ) : (
              missedCalls.map(call => (
                <View key={call.id} style={styles.missedCallRow}>
                  <Image source={{ uri: call.caller.avatar_url }} style={styles.callerAvatar} />
                  <View style={styles.missedCallInfo}>
                    <Text style={styles.callerName}>{call.caller.name}</Text>
                    <View style={styles.missedCallMeta}>
                      <PhoneMissed size={12} color="#EF4444" />
                      <Text style={styles.missedCallTime}>{formatDate(call.started_at)}</Text>
                    </View>
                  </View>
                  <View style={styles.callTypeIcon}>
                    {call.call_type === 'video' ? (
                      <Video size={20} color="#9CA3AF" />
                    ) : (
                      <Phone size={20} color="#9CA3AF" />
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 60,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2A1240',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
  },
  activeTab: {
    borderBottomColor: '#5B0E8B',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  activeTabText: {
    color: '#5B0E8B',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    padding: 20,
  },
  missedCallRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  callerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  missedCallInfo: {
    flex: 1,
  },
  callerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  missedCallMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  missedCallTime: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  callTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CreatorMessagesScreen;
