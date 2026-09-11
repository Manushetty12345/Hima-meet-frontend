import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ClipboardList, Building2, History, ChevronRight, TrendingUp, BarChart3 } from 'lucide-react-native';

const CreatorEarningsScreen = ({ navigation }: any) => {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.pageTitle}>Wallet & Earnings</Text>
        <View style={styles.titleDivRow}>
          <View style={styles.titleDivLine} />
          <Text style={styles.titleDivStar}>✨</Text>
          <View style={styles.titleDivLine} />
        </View>
      </View>

      {/* Hero Balance Card */}
      <LinearGradient colors={['#2A1240', '#1A0B2E']} style={styles.heroCard}>
        <View style={styles.heroGlow} />
        
        <View style={styles.heroLabelRow}>
          <Text style={styles.heroStarSmall}>✨</Text>
          <Text style={styles.heroLabel}>AVAILABLE BALANCE</Text>
          <Text style={styles.heroStarSmall}>✨</Text>
        </View>

        <Text style={styles.heroAmount}>₹45,800</Text>

        <View style={styles.heroSubRow}>
          <Text style={styles.heroSub}>Payable ₹45,800</Text>
        </View>

        {/* Withdraw Button inside Hero */}
        <TouchableOpacity style={styles.withdrawBtnHero} activeOpacity={0.85} onPress={() => navigation.navigate('WithdrawalRequest')}>
          <LinearGradient colors={['#F91970', '#FF4D8D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.withdrawGradHero}>
            <TrendingUp size={18} color="#FFFFFF" />
            <Text style={styles.withdrawBtnTextHero}>Withdraw Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {[
          { label: 'Lifetime', value: '₹1,24,000' },
          { label: 'This Month', value: '₹14,200' },
          { label: 'This Week', value: '₹8,400' },
          { label: 'Today', value: '₹2,450' },
        ].map((item, idx) => (
          <View key={item.label} style={styles.statGridCard}>
            <LinearGradient colors={['#FBF7FF', '#EFDFFB']} style={styles.statIconBox}>
              <TrendingUp size={16} color="#5B0E8B" />
            </LinearGradient>
            <Text style={styles.statGridValue}>{item.value}</Text>
            <Text style={styles.statGridLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Chart Placeholder */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Earnings Breakdown</Text>
          <BarChart3 size={20} color="#8B7F98" />
        </View>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartPlaceholderText}>Chart data will appear here</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.sectionDivRow}>
        <View style={styles.sectionDivLine} />
        <Text style={styles.sectionDivStar}>✨</Text>
        <View style={styles.sectionDivLine} />
      </View>

      <View style={styles.card}>
        {[
          { label: 'Session Earnings', subtitle: 'View per-session breakdown', icon: ClipboardList, route: 'EarningsDetail' },
          { label: 'Bank Details', subtitle: 'Manage payout accounts', icon: Building2, route: 'BankDetails' },
          { label: 'Withdrawal History', subtitle: 'Track your past payouts', icon: History, route: 'WithdrawalHistory' },
        ].map((a, i) => {
          const Icon = a.icon;
          return (
            <TouchableOpacity key={a.label} style={[styles.actionRow, i < 2 && styles.actionRowBorder]} activeOpacity={0.7} onPress={() => navigation.navigate(a.route)}>
              <View style={styles.actionRowLeft}>
                <View style={styles.actionIcon}>
                  <Icon size={18} color="#EC1372" />
                </View>
                <View>
                  <Text style={styles.actionLabel}>{a.label}</Text>
                  <Text style={styles.actionSubLabel}>{a.subtitle}</Text>
                </View>
              </View>
              <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FBF6EC', // IVORY
    padding: 20,
    paddingTop: 60,
  },
  headerRow: {
    alignItems: 'center',
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2A1240',
    fontFamily: 'PlayfairDisplay-Bold',
  },
  titleDivRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  titleDivLine: {
    height: 1,
    width: 30,
    backgroundColor: 'rgba(91, 14, 139, 0.2)', // PLUM light
  },
  titleDivStar: {
    fontSize: 10,
    color: '#F5C542',
    marginHorizontal: 8,
  },
  heroCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#5B0E8B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  heroGlow: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(245, 197, 66, 0.1)', // GOLD glow
  },
  heroLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroStarSmall: {
    fontSize: 10,
    color: '#F5C542',
  },
  heroLabel: {
    fontSize: 12,
    color: '#F5C542', // GOLD
    fontWeight: '700',
    letterSpacing: 1,
    marginHorizontal: 8,
  },
  heroAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  heroSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  withdrawBtnHero: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  withdrawGradHero: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  withdrawBtnTextHero: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
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
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EBDFC4', // IVORY_LINE
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statGridValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2A1240',
    marginBottom: 4,
  },
  statGridLabel: {
    fontSize: 12,
    color: '#8B7F98',
    fontWeight: '500',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#EBDFC4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2A1240',
  },
  chartPlaceholder: {
    height: 180,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
  },
  chartPlaceholderText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  sectionDivRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  sectionDivLine: {
    height: 1,
    flex: 1,
    backgroundColor: '#EBDFC4', // IVORY_LINE
  },
  sectionDivStar: {
    fontSize: 12,
    color: '#F5C542', // GOLD
    marginHorizontal: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EBDFC4', // IVORY_LINE
    overflow: 'hidden',
    marginBottom: 40,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  actionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#EBDFC4', // IVORY_LINE
  },
  actionRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(236, 19, 114, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A1240',
    marginBottom: 2,
  },
  actionSubLabel: {
    fontSize: 13,
    color: '#8B7F98',
  },
});

export default CreatorEarningsScreen;
