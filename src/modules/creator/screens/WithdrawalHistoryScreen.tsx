import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Platform, StatusBar } from 'react-native';
import { ArrowLeft, Clock, CheckCircle2, XCircle, Wallet } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import apiClient from '../../../api/apiClient';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;
const LILAC_WHITE = '#FBF7FF';
const LILAC_PALE = '#EFDFFB';
const TEXT_PLUM = '#2A1240';
const TEXT_MUTED = '#8B7F98';

const WithdrawalHistoryScreen = ({ navigation }: any) => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchHistory = async (pageNum = 1) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await apiClient.get(`/api/creator/withdrawals?page=${pageNum}&limit=10`);
      
      if (res.data?.status === 'success') {
        const newData = res.data.data;
        if (pageNum === 1) {
          setHistory(newData);
        } else {
          setHistory(prev => [...prev, ...newData]);
        }
        
        // Check if there's more data
        const pagination = res.data.pagination;
        if (pagination && pageNum >= pagination.totalPages) {
          setHasMore(false);
        } else if (newData.length < 10) {
          setHasMore(false); // Fallback if pagination metadata is missing
        }
      }
    } catch (error) {
      console.error('Failed to fetch withdrawal history:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchHistory(1);
  }, []);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchHistory(nextPage);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return (
          <View style={[styles.statusBadge, { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }]}>
            <Clock size={12} color="#D97706" />
            <Text style={[styles.statusText, { color: '#D97706' }]}>Pending</Text>
          </View>
        );
      case 'completed':
      case 'success':
        return (
          <View style={[styles.statusBadge, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
            <CheckCircle2 size={12} color="#059669" />
            <Text style={[styles.statusText, { color: '#059669' }]}>Completed</Text>
          </View>
        );
      case 'failed':
        return (
          <View style={[styles.statusBadge, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
            <XCircle size={12} color="#DC2626" />
            <Text style={[styles.statusText, { color: '#DC2626' }]}>Failed</Text>
          </View>
        );
      default:
        return null;
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const dateObj = new Date(item.requested_at);
    return (
      <View style={styles.cardWrapper}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.amountContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <Text style={styles.amount}>{Number(item.amount_inr).toLocaleString('en-IN')}</Text>
            </View>
            {renderStatusBadge(item.status)}
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.cardFooter}>
            <View style={styles.footerCol}>
              <Text style={styles.label}>Date & Time</Text>
              <Text style={styles.value}>{dateObj.toLocaleDateString('en-GB')} • {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
            <View style={[styles.footerCol, { alignItems: 'flex-end' }]}>
              <Text style={styles.label}>Request ID</Text>
              <Text style={styles.value}>#{item.request_id}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Wallet size={48} color="#EFDFFB" />
      </View>
      <Text style={styles.emptyTitle}>No Withdrawals Yet</Text>
      <Text style={styles.emptySubtitle}>When you request to withdraw your earnings, they will securely appear here.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Lilac Gradient Header */}
      <LinearGradient colors={[LILAC_WHITE, LILAC_PALE]} style={styles.headerGradient}>
        <View style={styles.statusBarSpacer} />
        <View style={styles.headerRow}>
          <TouchableOpacity 
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={TEXT_PLUM} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Withdrawal History</Text>
          <View style={{ width: 44 }} />
        </View>
      </LinearGradient>

      {loading && page === 1 ? (
        <ActivityIndicator color={TEXT_PLUM} size="large" style={{ marginTop: 100 }} />
      ) : (
        <FlatList
          data={history}
          keyExtractor={item => String(item.request_id)}
          renderItem={renderItem}
          contentContainerStyle={history.length === 0 ? { flex: 1 } : styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator color={TEXT_PLUM} size="small" style={{ marginVertical: 20 }} />
            ) : undefined
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerGradient: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EBDFC4',
  },
  statusBarSpacer: { height: STATUSBAR_HEIGHT },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: TEXT_PLUM, letterSpacing: -0.3 },
  
  listContent: { padding: 20, paddingBottom: 40 },
  
  cardWrapper: {
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#2A1240',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  card: { 
    borderRadius: 20, 
    padding: 20, 
    borderWidth: 1, 
    borderColor: '#F9F5FF',
    overflow: 'hidden',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  amountContainer: { flexDirection: 'row', alignItems: 'flex-start' },
  currencySymbol: { fontSize: 16, fontWeight: '600', color: TEXT_MUTED, marginTop: 4, marginRight: 2 },
  amount: { fontSize: 28, fontWeight: '800', color: TEXT_PLUM, letterSpacing: -0.5 },
  
  statusBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20,
    borderWidth: 1,
  },
  statusText: { fontSize: 12, fontWeight: '700', marginLeft: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  
  divider: { height: 1.5, backgroundColor: '#F9F5FF', marginBottom: 16, borderStyle: 'dashed' },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  footerCol: { flex: 1 },
  label: { fontSize: 11, color: TEXT_MUTED, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  value: { fontSize: 13, fontWeight: '700', color: TEXT_PLUM },

  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyIconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#FBF7FF', alignItems: 'center', justifyContent: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#EFDFFB' },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: TEXT_PLUM, marginBottom: 12 },
  emptySubtitle: { fontSize: 14, color: TEXT_MUTED, textAlign: 'center', lineHeight: 22 },
});

export default WithdrawalHistoryScreen;
