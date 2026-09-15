const fs = require('fs');
const file = 'src/modules/profile/screens/TransactionsScreen.tsx';

const newContent = `import React, { useEffect, useState, useCallback } from 'react';
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
  PhoneCall,
  MessageCircle,
  Gift,
  CreditCard,
  Banknote,
  RefreshCw,
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
const TEXT_PLUM = '#2A1240';
const TEXT_MUTED = '#8B7F98';

// Background
const LILAC_PALE = '#F4E9FA';

// Status Colors
const CREDIT_GREEN = '#10B981';
const CREDIT_GREEN_BG = '#ECFDF5';
const DEBIT_ROSE = '#F43F5E';
const DEBIT_ROSE_BG = '#FFF1F2';
const PENDING_AMBER = '#F59E0B';
const PENDING_AMBER_BG = '#FEF3C7';
const SYSTEM_BLUE = '#3B82F6';
const SYSTEM_BLUE_BG = '#EFF6FF';
const PURPLE_ACCENT = '#8B5CF6';
const PURPLE_ACCENT_BG = '#F5F3FF';

// Determine icon/colors based on transaction type
const getTypeConfig = (type: string) => {
  const t = type?.toLowerCase() || '';
  
  if (t === 'call_earn') return { icon: PhoneCall, color: CREDIT_GREEN, bg: CREDIT_GREEN_BG, sign: '+' };
  if (t === 'chat_earn') return { icon: MessageCircle, color: CREDIT_GREEN, bg: CREDIT_GREEN_BG, sign: '+' };
  if (t === 'gift') return { icon: Gift, color: PURPLE_ACCENT, bg: PURPLE_ACCENT_BG, sign: '+' };
  if (t === 'purchase') return { icon: Coins, color: CREDIT_GREEN, bg: CREDIT_GREEN_BG, sign: '+' };
  if (t === 'referral_bonus') return { icon: Gift, color: GOLD_DEEP, bg: PENDING_AMBER_BG, sign: '+' };
  if (t === 'refund') return { icon: RefreshCw, color: SYSTEM_BLUE, bg: SYSTEM_BLUE_BG, sign: '+' };
  
  if (t === 'withdrawal') return { icon: Banknote, color: DEBIT_ROSE, bg: DEBIT_ROSE_BG, sign: '-' };
  if (t === 'call_spend') return { icon: PhoneCall, color: DEBIT_ROSE, bg: DEBIT_ROSE_BG, sign: '-' };
  if (t === 'chat_spend') return { icon: MessageCircle, color: DEBIT_ROSE, bg: DEBIT_ROSE_BG, sign: '-' };

  // Fallbacks
  if (t.includes('credit') || t.includes('add') || t.includes('recharge') || t.includes('bonus')) {
    return { icon: ArrowDownCircle, color: CREDIT_GREEN, bg: CREDIT_GREEN_BG, sign: '+' };
  }
  
  return { icon: ArrowUpCircle, color: DEBIT_ROSE, bg: DEBIT_ROSE_BG, sign: '-' };
};

const formatDate = (timestamp: string) => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + ' at ' + date.toLocaleTimeString('en-IN', {
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

  const renderItem = ({ item }: { item: Transaction }) => {
    const config = getTypeConfig(item.type);
    const Icon = config.icon;

    return (
      <View style={styles.transactionCard}>
        <View style={styles.cardLeft}>
          <View style={[styles.iconContainer, { backgroundColor: config.bg }]}>
            <Icon size={22} color={config.color} strokeWidth={2.2} />
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.typeText}>{formatType(item.type)}</Text>
            <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <Text style={[styles.amountText, { color: config.color }]}>
            {config.sign}{Math.abs(item.coins)}
          </Text>
          <Text style={[styles.coinLabel, { color: config.color }]}>Coins</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor={LILAC_PALE} />
      <View style={[styles.headerRow, { paddingTop: STATUSBAR_HEIGHT + 16 }]}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={22} color={TEXT_PLUM} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transactions</Text>
        <View style={{ width: 40 }} />
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={PLUM_ROYAL} />
        </View>
      ) : error ? (
        renderError()
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => String(item.transaction_id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchTransactions(true)}
              colors={[PLUM_ROYAL]}
              tintColor={PLUM_ROYAL}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: LILAC_PALE,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: LILAC_PALE,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    color: TEXT_PLUM,
    textAlign: 'center',
    fontFamily: 'PlayfairDisplay-Bold',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  
  // --- New Extraordinary Card Design ---
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: PLUM_ROYAL,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  detailsContainer: {
    flex: 1,
    paddingRight: 8,
  },
  typeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A0733',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  dateText: {
    fontSize: 12,
    color: '#8E8E9F',
    fontWeight: '500',
  },
  cardRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amountText: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  coinLabel: {
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  // --- Empty / Error States ---
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  emptyIconWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFF8E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: GOLD_DEEP,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: TEXT_PLUM,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 22,
  },
  errorText: {
    fontSize: 15,
    color: '#E02424',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 999,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_PLUM,
  },
});

export default TransactionsScreen;
`;

fs.writeFileSync(file, newContent);
console.log("Redesigned TransactionsScreen.tsx successfully!");
