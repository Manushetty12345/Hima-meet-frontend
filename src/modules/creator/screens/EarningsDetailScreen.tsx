import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { ArrowLeft, Phone, Video, MessageCircle } from 'lucide-react-native';
import apiClient from '../../../api/apiClient';

const EarningsDetailScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState('Today');
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessionEarnings = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/creator/calls/history');
      if (res.data?.status === 'success') {
        const formatted = res.data.data.map((item: any) => {
          const dateObj = new Date(item.created_at);
          return {
            id: String(item.call_id),
            type: item.call_type || 'voice', // fallback
            user: item.caller_name || 'User',
            duration: item.duration_seconds ? `${Math.floor(item.duration_seconds / 60)}m ${item.duration_seconds % 60}s` : '0m 0s',
            amount: Number(item.earnings_coins || 0) / 10, // Assuming 10 coins = 1 INR
            date: dateObj.toLocaleDateString(),
            time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: dateObj.getTime(),
          };
        });
        setHistory(formatted);
      }
    } catch (error) {
      console.error('Failed to fetch session earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionEarnings();
  }, []);

  const getFilteredData = () => {
    const now = new Date();
    return history.filter(item => {
      const itemDate = new Date(item.timestamp);
      if (activeTab === 'Today') {
        return itemDate.toDateString() === now.toDateString();
      }
      if (activeTab === 'This Week') {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return itemDate >= weekAgo;
      }
      if (activeTab === 'This Month') {
        return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  };

  const renderIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'video': return <Video size={20} color="#EC1372" />;
      case 'audio': 
      case 'voice': return <Phone size={20} color="#5B0E8B" />;
      case 'chat': return <MessageCircle size={20} color="#F5C542" />;
      default: return <Phone size={20} color="#5B0E8B" />;
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.sessionCard}>
      <View style={styles.iconContainer}>{renderIcon(item.type)}</View>
      <View style={styles.sessionInfo}>
        <Text style={styles.sessionUser}>{item.user}</Text>
        <Text style={styles.sessionMeta}>{item.duration} • {item.date}, {item.time}</Text>
      </View>
      <Text style={styles.sessionAmount}>+₹{item.amount}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#2A1240" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Session Earnings</Text>
      </View>

      <View style={styles.tabsContainer}>
        {['Today', 'This Week', 'This Month'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color="#F91970" size="large" style={{ marginTop: 50 }} />
      ) : getFilteredData().length === 0 ? (
        <Text style={{ textAlign: 'center', color: '#8B7F98', marginTop: 50 }}>No earnings in this period.</Text>
      ) : (
        <FlatList
          data={getFilteredData()}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBF6EC' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#2A1240', marginLeft: 16 },
  tabsContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 10 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#5B0E8B' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#8B7F98' },
  activeTabText: { color: '#5B0E8B' },
  listContent: { padding: 20, paddingTop: 10 },
  sessionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, elevation: 2, borderWidth: 1, borderColor: '#EBDFC4' },
  iconContainer: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FBF6EC', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  sessionInfo: { flex: 1 },
  sessionUser: { fontSize: 16, fontWeight: '600', color: '#2A1240', marginBottom: 4 },
  sessionMeta: { fontSize: 13, color: '#8B7F98' },
  sessionAmount: { fontSize: 16, fontWeight: '700', color: '#10B981' },
});

export default EarningsDetailScreen;
