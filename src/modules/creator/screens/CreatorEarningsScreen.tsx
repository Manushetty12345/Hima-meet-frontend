import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar, Platform, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { ClipboardList, Building2, History, ChevronRight, TrendingUp, BarChart3, ArrowLeft, Coins, Wallet } from 'lucide-react-native';
import apiClient from '../../../api/apiClient';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

const LILAC_WHITE = '#FBF7FF';
const LILAC_PALE = '#EFDFFB';
const PLUM_ROYAL = '#5B0E8B';
const TEXT_PLUM = '#2A1240';
const TEXT_MUTED = '#8B7F98';

const CreatorEarningsScreen = ({ navigation }: any) => {
  const [earningsSummary, setEarningsSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchEarnings = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else if (!earningsSummary) {
        setLoading(true);
      }
      const res = await apiClient.get('/api/creator/earnings/summary');
      if (res.data?.status === 'success') {
        setEarningsSummary(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch earnings summary:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEarnings();
      // Auto refresh every 10 seconds while focused
      const interval = setInterval(() => {
        fetchEarnings();
      }, 10000);
      return () => clearInterval(interval);
    }, [])
  );

  const totalEarned = earningsSummary?.lifetime_earnings_inr || 0;
  const totalCoins = earningsSummary?.lifetime_earnings_coins || 0;
  const withdrawn = earningsSummary?.withdrawn_inr || 0;
  const withdrawnCoins = earningsSummary?.withdrawn_coins || 0;
  const currentBalance = earningsSummary?.available_balance_inr || 0;
  const currentBalanceCoins = earningsSummary?.available_balance_coins || 0;

  const thisMonth = earningsSummary?.this_month_earnings_inr || 0;
  const thisWeek = earningsSummary?.this_week_earnings_inr || 0;
  const today = earningsSummary?.today_earnings_inr || 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Premium Header */}
      <LinearGradient
        colors={[LILAC_WHITE, LILAC_PALE]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.statusBarSpacer} />
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={24} color={TEXT_PLUM} />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Wallet & Earnings</Text>
            <Text style={styles.subtitle}>Manage your payouts and history</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => fetchEarnings(true)}
            colors={['#5B0E8B']}
            tintColor="#5B0E8B"
          />
        }
      >
        {loading && !earningsSummary ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#F91970" />
          </View>
        ) : (
          <>
            {/* Extraordinary Glassmorphic Hero Balance Card */}
            <LinearGradient colors={['#5B0E8B', '#9C27B0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroCard}>
              {/* Decorative elements */}
              <View style={styles.glassOverlay} />
              <View style={styles.heroGlow} />
              <View style={styles.heroGlowBottom} />
              
              <View style={styles.heroTopRow}>
                <View style={styles.heroLabelBox}>
                  <Text style={styles.heroLabel}>AVAILABLE BALANCE</Text>
                </View>
                <Wallet size={20} color="#FFFFFF" opacity={0.8} />
              </View>
              
              <Text style={styles.heroAmount}>₹{currentBalance.toFixed(2)}</Text>
              
              <View style={styles.coinPill}>
                <Coins size={14} color="#F5C542" />
                <Text style={styles.coinPillText}>{currentBalanceCoins} coins</Text>
              </View>

              <View style={styles.heroDivider} />

              <View style={styles.breakdownRow}>
                <View style={styles.breakdownCol}>
                  <Text style={styles.breakdownLabel}>TOTAL EARNED</Text>
                  <Text style={styles.breakdownValue}>₹{totalEarned.toFixed(2)}</Text>
                </View>
                
                <View style={styles.dividerVertical} />
                
                <View style={styles.breakdownCol}>
                  <Text style={styles.breakdownLabel}>WITHDRAWN</Text>
                  <Text style={styles.breakdownValue}>₹{withdrawn.toFixed(2)}</Text>
                </View>
              </View>

              {/* Enhanced Withdraw Button */}
              <TouchableOpacity style={styles.withdrawBtnHero} activeOpacity={0.85} onPress={() => navigation.navigate('WithdrawalRequest')}>
                <LinearGradient colors={['#FFD700', '#F5C542']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.withdrawGradHero}>
                  <Text style={styles.withdrawBtnTextHero}>Withdraw Funds</Text>
                  <ChevronRight size={18} color="#2A1240" />
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Earnings Overview</Text>
            </View>

            {/* Redesigned Stats Grid */}
            <View style={styles.statsGrid}>
              {[
                { label: 'Lifetime', value: `₹${totalEarned.toLocaleString('en-IN')}`, icon: TrendingUp },
                { label: 'This Month', value: `₹${thisMonth.toLocaleString('en-IN')}`, icon: BarChart3 },
                { label: 'This Week', value: `₹${thisWeek.toLocaleString('en-IN')}`, icon: BarChart3 },
                { label: 'Today', value: `₹${today.toLocaleString('en-IN')}`, icon: TrendingUp },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <View key={item.label} style={styles.statGridCard}>
                    <View style={styles.statTopRow}>
                      <View style={styles.statIconBox}>
                        <Icon size={14} color="#9C27B0" />
                      </View>
                      <Text style={styles.statGridLabel}>{item.label}</Text>
                    </View>
                    <Text style={styles.statGridValue}>{item.value}</Text>
                  </View>
                );
              })}
            </View>
          </>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>

        {/* Premium Quick Actions */}
        <View style={styles.card}>
          {[
            { label: 'Bank Details', subtitle: 'Manage payout accounts', icon: Building2, route: 'BankDetails' },
            { label: 'Withdrawal History', subtitle: 'Track your past payouts', icon: History, route: 'WithdrawalHistory' },
          ].map((a, i) => {
            const Icon = a.icon;
            return (
              <TouchableOpacity key={a.label} style={[styles.actionRow, i < 1 && styles.actionRowBorder]} activeOpacity={0.7} onPress={() => navigation.navigate(a.route)}>
                <View style={styles.actionRowLeft}>
                  <LinearGradient colors={['#FBF7FF', '#EFDFFB']} style={styles.actionIconBg}>
                    <Icon size={20} color="#5B0E8B" />
                  </LinearGradient>
                  <View>
                    <Text style={styles.actionLabel}>{a.label}</Text>
                    <Text style={styles.actionSubLabel}>{a.subtitle}</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#D1D5DB" />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F5FF',
  },
  headerGradient: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EBDFC4',
  },
  statusBarSpacer: {
    height: STATUSBAR_HEIGHT,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  backButton: {
    marginRight: 16,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EBDFC4',
    shadowColor: '#5B0E8B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: TEXT_PLUM,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: TEXT_MUTED,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 160, // Increased more to prevent bottom bar overlap
  },
  heroCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 28,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#5B0E8B',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  glassOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  heroGlow: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(212, 175, 55, 0.15)', // Gold glow
  },
  heroGlowBottom: {
    position: 'absolute',
    bottom: -60,
    left: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroLabelBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  heroLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  heroAmount: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  coinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  coinPillText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
  heroDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginVertical: 20,
    width: '100%',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  breakdownCol: {
    flex: 1,
  },
  dividerVertical: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    height: '100%',
    marginHorizontal: 16,
  },
  breakdownLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  breakdownValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  withdrawBtnHero: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  withdrawGradHero: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  withdrawBtnTextHero: {
    color: '#2A1240',
    fontSize: 16,
    fontWeight: '800',
    marginRight: 6,
  },
  sectionHeader: {
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_PLUM,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statGridCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#5B0E8B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  statTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  statGridLabel: {
    fontSize: 13,
    color: TEXT_MUTED,
    fontWeight: '500',
  },
  statGridValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2A1240',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 8,
    shadowColor: '#5B0E8B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  actionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  actionRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  actionSubLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
});

export default CreatorEarningsScreen;
