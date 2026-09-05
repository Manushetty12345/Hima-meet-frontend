import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  ActivityIndicator,
  Alert,
  Share,
  Clipboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  ArrowLeft,
  Copy,
  CheckCircle2,
  Gift,
  Users,
  Coins,
  Share2,
  ChevronRight,
  ArrowRight,
} from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';
import { getReferralStats, ReferralStats } from '../../../api/referralApi';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;
type Props = NativeStackScreenProps<AuthStackParamList, 'Refer'>;

const ReferralScreen: React.FC<Props> = ({ navigation }) => {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getReferralStats();
      setStats(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load referral info');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleCopy = () => {
    if (!stats) return;
    Clipboard.setString(stats.invite_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!stats) return;
    try {
      await Share.share({
        message: stats.share_message,
        title: 'Join Himameet App!',
      });
    } catch (error) {
      // user dismissed
    }
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
        <Text style={styles.headerTitle}>Share & Get Coins</Text>
      </View>

      {isLoading || !stats ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#EC1372" />
        </View>
      ) : (
        <View style={styles.content}>
          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <View style={styles.statIconWrap}>
                <Users size={20} color="#EC1372" />
              </View>
              <Text style={styles.statValue}>{stats.total_invites}</Text>
              <Text style={styles.statLabel}>My Invites</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <View style={[styles.statIconWrap, { backgroundColor: '#FFF6E5' }]}>
                <Coins size={20} color="#F5A623" />
              </View>
              <Text style={styles.statValue}>{stats.coins_per_invite}</Text>
              <Text style={styles.statLabel}>Per Invite</Text>
            </View>
          </View>

          {/* Total Earned Card */}
          <LinearGradient
            colors={['#EC1372', '#FF6B9D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.earnedCard}
          >
            <Text style={styles.earnedLabel}>Total Coins Earned</Text>
            <View style={styles.earnedRow}>
              <View style={styles.earnedIconWrap}>
                <Coins size={20} color="#F5A623" />
              </View>
              <Text style={styles.earnedValue}>{stats.total_coins_earned}</Text>
            </View>
          </LinearGradient>

          {/* Invite Code Card */}
          <View style={styles.codeCard}>
            <Text style={styles.codeLabel}>My Invite Code</Text>
            <View style={styles.codeRow}>
              <Text style={styles.codeText}>{stats.invite_code}</Text>
              <TouchableOpacity
                style={styles.copyButton}
                activeOpacity={0.7}
                onPress={handleCopy}
              >
                {copied
                  ? <CheckCircle2 size={20} color="#2DD36F" />
                  : <Copy size={20} color="#EC1372" />
                }
              </TouchableOpacity>
            </View>
          </View>

          {/* Share on WhatsApp */}
          <TouchableOpacity
            style={styles.whatsappButton}
            activeOpacity={0.85}
            onPress={handleShare}
          >
            <Share2 size={18} color="#FFFFFF" />
            <Text style={styles.whatsappButtonText}>Share on WhatsApp</Text>
          </TouchableOpacity>

          {/* How to Get Coins */}
          <View style={styles.howSection}>
            <View style={styles.howHeader}>
              <Text style={styles.howTitle}>How to Get Coins?</Text>
              <Gift size={16} color="#8A7A9C" />
            </View>
            <View style={styles.stepsRow}>
              <View style={styles.step}>
                <View style={[styles.stepIconWrap, { backgroundColor: '#FDE8F1' }]}>
                  <Share2 size={20} color="#EC1372" />
                </View>
                <Text style={styles.stepLabel}>Share your{'\n'}link</Text>
              </View>
              <ArrowRight size={18} color="#C9C3D2" style={{ marginTop: 10 }} />
              <View style={styles.step}>
                <View style={[styles.stepIconWrap, { backgroundColor: '#FFF6E5' }]}>
                  <Coins size={20} color="#F5A623" />
                </View>
                <Text style={styles.stepLabel}>Get FREE{'\n'}Coins</Text>
              </View>
            </View>
          </View>
        </View>
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 14,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4A0F6E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 18,
    gap: 6,
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FDE8F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1B0E22',
  },
  statLabel: {
    fontSize: 12,
    color: '#8A7A9C',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#F0EBF5',
    marginVertical: 12,
  },
  earnedCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  earnedLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 10,
  },
  earnedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  earnedIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  earnedValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  codeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#4A0F6E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  codeLabel: {
    fontSize: 12,
    color: '#8A7A9C',
    fontWeight: '500',
    marginBottom: 10,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#EC1372',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF5F9',
  },
  codeText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1B0E22',
    letterSpacing: 2,
  },
  copyButton: {
    padding: 4,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 14,
    paddingVertical: 16,
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  whatsappButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  howSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#4A0F6E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  howHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  howTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1B0E22',
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  step: {
    alignItems: 'center',
    gap: 8,
  },
  stepIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: {
    fontSize: 12,
    color: '#8A7A9C',
    textAlign: 'center',
    lineHeight: 17,
  },
});

export default ReferralScreen;
