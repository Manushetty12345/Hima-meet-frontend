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
import LinearGradient from 'react-native-linear-gradient';
import {
  ArrowLeft,
  ArrowDownCircle,
  ArrowUpCircle,
  Coins,
  FileText,
  Sparkles,
  Crown,
} from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';
import { getTransactions, Transaction } from '../../../api/transactionApi';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;
type Props = NativeStackScreenProps<AuthStackParamList, 'Transactions'>;

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

const CREDIT_GREEN = '#2DD36F';
const CREDIT_GREEN_BG = '#E8FBF0';
const DEBIT_ROSE = '#C4176B';
const DEBIT_ROSE_BG = '#FCE7F2';
const PENDING_AMBER = '#C98A1B';
const PENDING_AMBER_BG = '#FFF3E0';

// Any transaction at or above this bar gets the extraordinary treatment
const EXTRAORDINARY_COIN_THRESHOLD = 5000;
const EXTRAORDINARY_AMOUNT_THRESHOLD = 999;

// Determine icon/colors based on transaction type
const getTypeConfig = (type: string) => {
  const t = type?.toLowerCase() || '';
  if (t.includes('purchase') || t.includes('credit') || t.includes('add') || t.includes('recharge') || t.includes('topup') || t.includes('reward') || t.includes('bonus') || t.includes('refund')) {
    return {
      icon: ArrowDownCircle,
      color: CREDIT_GREEN,
      bg: CREDIT_GREEN_BG,
      label: 'Credited',
      sign: '+',
    };
  }
  return {
    icon: ArrowUpCircle,
    color: DEBIT_ROSE,
    bg: DEBIT_ROSE_BG,
    label: 'Debited',
    sign: '-',
  };
};

const isExtraordinary = (item: Transaction) => {
  const t = item.type?.toLowerCase() || '';
  const isCreditLike = t.includes('purchase') || t.includes('add') || t.includes('recharge') || t.includes('topup');
  if (!isCreditLike) return false;
  const bigCoins = Math.abs(item.coins) >= EXTRAORDINARY_COIN_THRESHOLD;
  const bigAmount = item.amount_inr != null && parseFloat(String(item.amount_inr)) >= EXTRAORDINARY_AMOUNT_THRESHOLD;
  return bigCoins || bigAmount;
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
        <FileText size={44} color={GOLD_DEEP} strokeWidth={1.2} />
      </View>
      <Text style={styles.emptyTitle}>No Transactions Yet</Text>
      <Text style={styles.emptySubtitle}>Your transaction history will appear here</Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity activeOpacity={0.85} onPress={() => fetchTransactions()}>
        <LinearGradient
          colors={[GOLD, GOLD_DEEP]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.retryButton}
        >
          <Text style={styles.retryText}>Retry</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderExtraordinaryItem = (item: Transaction) => {
    return (
      <LinearGradient
        colors={['#FFFDF7', '#FFF6E0', '#FFFDF7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.extraordinaryPurchaseCard}
      >
        <View style={styles.extraordinaryBadgeWrap}>
          <LinearGradient
            colors={[GOLD, GOLD_DEEP]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.extraordinaryBadge}
          >
            <Sparkles size={11} color="#3D2600" strokeWidth={2.2} />
            <Text style={styles.extraordinaryBadgeText}>PREMIUM</Text>
          </LinearGradient>
        </View>

        <View style={styles.extraordinaryRow}>
          <View style={styles.purchaseIconGlow}>
            <LinearGradient
              colors={[GOLD, GOLD_DEEP]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.purchaseIconCircle}
            >
              <Crown size={24} color="#3D2600" strokeWidth={1.8} />
            </LinearGradient>
          </View>

          <View style={styles.itemContent}>
            <Text style={styles.purchaseTitle} numberOfLines={1}>{formatType(item.type)}</Text>
            <Text style={styles.purchaseDate}>{formatDate(item.timestamp)}</Text>
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
              <Coins size={16} color={GOLD_DEEP} />
              <Text style={styles.purchaseCoinsText}>+{Math.abs(item.coins)}</Text>
            </View>
            {item.amount_inr != null && item.amount_inr > 0 && (
              <Text style={styles.purchaseAmountText}>₹{parseFloat(String(item.amount_inr)).toFixed(2)}</Text>
            )}
          </View>
        </View>
      </LinearGradient>
    );
  };

  const renderStandardItem = (item: Transaction, index: number) => {
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

  const renderItem = ({ item, index }: { item: Transaction; index: number }) => {
    if (isExtraordinary(item)) {
      return renderExtraordinaryItem(item);
    }
    return renderStandardItem(item, index);
  };

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
          <View>
            <Text style={styles.headerTitle}>Transactions</Text>
            <Text style={styles.headerSubtitle}>View your transaction history</Text>
          </View>
        </View>
      </LinearGradient>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={GOLD_DEEP} />
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
              colors={[GOLD_DEEP]}
              tintColor={GOLD_DEEP}
            />
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    gap: 14,
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: TEXT_PLUM,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  headerSubtitle: {
    fontSize: 12.5,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    borderRadius: 18,
    padding: 14,
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
    fontSize: 14.5,
    fontWeight: '700',
    color: TEXT_PLUM,
    marginBottom: 3,
  },
  itemDate: {
    fontSize: 11,
    color: TEXT_MUTED,
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
    backgroundColor: CREDIT_GREEN_BG,
  },
  statusPending: {
    backgroundColor: PENDING_AMBER_BG,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusTextSuccess: {
    color: CREDIT_GREEN,
  },
  statusTextPending: {
    color: PENDING_AMBER,
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
    color: TEXT_MUTED,
    fontWeight: '500',
  },
  separator: {
    height: 10,
  },
  // --- Extraordinary Purchase Card Styles ---
  extraordinaryPurchaseCard: {
    borderWidth: 1.5,
    borderColor: '#F5C54270',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    marginHorizontal: 2,
    borderRadius: 18,
    padding: 16,
    paddingTop: 22,
  },
  extraordinaryBadgeWrap: {
    position: 'absolute',
    top: -10,
    left: 16,
    zIndex: 2,
  },
  extraordinaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  extraordinaryBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#3D2600',
    letterSpacing: 0.8,
  },
  extraordinaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  purchaseIconGlow: {
    shadowColor: '#F5C542',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
    marginRight: 14,
  },
  purchaseIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  purchaseTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#704705',
    marginBottom: 4,
  },
  purchaseDate: {
    fontSize: 12,
    color: '#A17316',
    fontWeight: '600',
    marginBottom: 6,
  },
  purchaseCoinsText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#D4AF37',
  },
  purchaseAmountText: {
    fontSize: 13,
    color: '#A17316',
    fontWeight: '700',
    marginTop: 2,
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(245, 197, 66, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 66, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: TEXT_PLUM,
    marginBottom: 8,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  emptySubtitle: {
    fontSize: 13,
    color: TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorText: {
    fontSize: 14,
    color: TEXT_PLUM,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 999,
  },
  retryText: {
    color: '#1A0733',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default TransactionsScreen;