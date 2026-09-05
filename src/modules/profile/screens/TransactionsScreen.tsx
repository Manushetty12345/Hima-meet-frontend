import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  ArrowLeft,
  ArrowDownCircle,
  ArrowUpCircle,
  Coins,
  FileText,
} from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';
import { getTransactions, Transaction } from '../../../api/transactionApi';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;
type Props = NativeStackScreenProps<AuthStackParamList, 'Transactions'>;

// Determine icon/colors based on transaction type
const getTypeConfig = (type: string) => {
  const t = type?.toLowerCase() || '';
  if (t.includes('purchase') || t.includes('credit') || t.includes('add') || t.includes('recharge') || t.includes('topup') || t.includes('reward') || t.includes('bonus') || t.includes('refund')) {
    return {
      icon: ArrowDownCircle,
      color: '#2DD36F',
      bg: '#E8FBF0',
      label: 'Credited',
      sign: '+',
    };
  }
  return {
    icon: ArrowUpCircle,
    color: '#EC1372',
    bg: '#FDE8F1',
    label: 'Debited',
    sign: '-',
  };
};

const formatDate = (timestamp: string) => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + '  ' + date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return timestamp;
  }
};

const formatType = (type: string) => {
  if (!type) return 'Transaction';
  return type
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
};

const TransactionsScreen: React.FC<Props> = ({ navigation }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async (refresh = false) => {
    try {
      if (refresh) setIsRefreshing(true);
      else setIsLoading(true);
      setError(null);
      const data = await getTransactions();
      setTransactions(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load transactions');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrap}>
        <FileText size={48} color="#D0C8DC" strokeWidth={1.2} />
      </View>
      <Text style={styles.emptyTitle}>No Transactions Yet</Text>
      <Text style={styles.emptySubtitle}>Your transaction history will appear here</Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={() => fetchTransactions()}>
        <Text style={styles.retryText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item, index }: { item: Transaction; index: number }) => {
    const config = getTypeConfig(item.type);
    const Icon = config.icon;

    return (
      <View style={[styles.itemRow, index === 0 && styles.itemRowFirst]}>
        <View style={[styles.itemIconWrap, { backgroundColor: config.bg }]}>
          <Icon size={22} color={config.color} strokeWidth={1.8} />
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.itemType} numberOfLines={1}>{formatType(item.type)}</Text>
          <Text style={styles.itemDate}>{formatDate(item.timestamp)}</Text>
          <View style={styles.itemStatusRow}>
            <View style={[
              styles.statusBadge,
              item.status === 'success' ? styles.statusSuccess : styles.statusPending
            ]}>
              <Text style={[
                styles.statusText,
                item.status === 'success' ? styles.statusTextSuccess : styles.statusTextPending
              ]}>
                {item.status?.toUpperCase() || 'COMPLETED'}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.itemRight}>
          <View style={styles.coinsRow}>
            <Coins size={13} color={config.color} />
            <Text style={[styles.coinsText, { color: config.color }]}>
              {config.sign}{Math.abs(item.coins)}
            </Text>
          </View>
          {item.amount_inr != null && item.amount_inr > 0 && (
            <Text style={styles.amountText}>₹{parseFloat(String(item.amount_inr)).toFixed(2)}</Text>
          )}
        </View>
      </View>
    );
  };

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
          <ArrowLeft size={20} color="#EC1372" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Transactions</Text>
          <Text style={styles.headerSubtitle}>View your transaction history</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#EC1372" />
        </View>
      ) : error ? (
        renderError()
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item, idx) => String(item.transaction_id ?? idx)}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={[
            styles.listContent,
            transactions.length === 0 && styles.listContentEmpty,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchTransactions(true)}
              colors={['#EC1372']}
              tintColor="#EC1372"
            />
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBF5',
    gap: 14,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0EBF5',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1B0E22',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#8A7A9C',
    marginTop: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#4A0F6E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  itemRowFirst: {},
  itemIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemType: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1B0E22',
    marginBottom: 3,
  },
  itemDate: {
    fontSize: 11,
    color: '#A0A0A0',
    marginBottom: 6,
  },
  itemStatusRow: {
    flexDirection: 'row',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  statusSuccess: {
    backgroundColor: '#E8FBF0',
  },
  statusPending: {
    backgroundColor: '#FFF3E0',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusTextSuccess: {
    color: '#2DD36F',
  },
  statusTextPending: {
    color: '#F5A623',
  },
  itemRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  coinsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  coinsText: {
    fontSize: 15,
    fontWeight: '800',
  },
  amountText: {
    fontSize: 11,
    color: '#8A7A9C',
    fontWeight: '500',
  },
  separator: {
    height: 10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIconWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F4F0F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B0E22',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#8A7A9C',
    textAlign: 'center',
    lineHeight: 20,
  },
  errorText: {
    fontSize: 14,
    color: '#EC1372',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#EC1372',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default TransactionsScreen;
