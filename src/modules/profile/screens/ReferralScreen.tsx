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
  ArrowRight,
} from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';
import { getReferralStats, ReferralStats } from '../../../api/referralApi';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;
type Props = NativeStackScreenProps<AuthStackParamList, 'Refer'>;

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

const WHATSAPP_GREEN = '#25D366';
const SUCCESS_GREEN = '#2DD36F';

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
          <Text style={styles.headerTitle}>Share & Get Coins</Text>
        </View>
      </LinearGradient>

      {isLoading || !stats ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={GOLD_DEEP} />
        </View>
      ) : (
        <View style={styles.content}>
          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <View style={styles.statIconWrap}>
                <Users size={20} color={PLUM_ROYAL} />
              </View>
              <Text style={styles.statValue}>{stats.total_invites}</Text>
              <Text style={styles.statLabel}>My Invites</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <View style={[styles.statIconWrap, { backgroundColor: 'rgba(245, 197, 66, 0.16)' }]}>
                <Coins size={20} color={GOLD_DEEP} />
              </View>
              <Text style={styles.statValue}>{stats.coins_per_invite}</Text>
              <Text style={styles.statLabel}>Per Invite</Text>
            </View>
          </View>

          {/* Total Earned Card */}
          <LinearGradient
            colors={[PLUM_ROYAL, '#8E2DE2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.earnedCard}
          >
            <Text style={styles.earnedLabel}>Total Coins Earned</Text>
            <View style={styles.earnedRow}>
              <View style={styles.earnedIconWrap}>
                <Coins size={20} color={GOLD} />
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
                  ? <CheckCircle2 size={20} color={SUCCESS_GREEN} />
                  : <Copy size={20} color={GOLD_DEEP} />
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
              <Gift size={16} color={GOLD_DEEP} />
            </View>
            <View style={styles.stepsRow}>
              <View style={styles.step}>
                <View style={[styles.stepIconWrap, { backgroundColor: 'rgba(91, 14, 139, 0.10)' }]}>
                  <Share2 size={20} color={PLUM_ROYAL} />
                </View>
                <Text style={styles.stepLabel}>Share your{'\n'}link</Text>
              </View>
              <ArrowRight size={18} color={IVORY_LINE} style={{ marginTop: 10 }} />
              <View style={styles.step}>
                <View style={[styles.stepIconWrap, { backgroundColor: 'rgba(245, 197, 66, 0.16)' }]}>
                  <Coins size={20} color={GOLD_DEEP} />
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 14,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    borderRadius: 18,
    overflow: 'hidden',
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
    backgroundColor: 'rgba(91, 14, 139, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: TEXT_PLUM,
  },
  statLabel: {
    fontSize: 12,
    color: TEXT_MUTED,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: IVORY_LINE,
    marginVertical: 12,
  },
  earnedCard: {
    borderRadius: 18,
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
    backgroundColor: 'rgba(255,255,255,0.2)',
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
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    borderRadius: 18,
    padding: 18,
  },
  codeLabel: {
    fontSize: 12,
    color: TEXT_MUTED,
    fontWeight: '500',
    marginBottom: 10,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: GOLD_DEEP,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(245, 197, 66, 0.08)',
  },
  codeText: {
    fontSize: 22,
    fontWeight: '900',
    color: TEXT_PLUM,
    letterSpacing: 2,
  },
  copyButton: {
    padding: 4,
  },
  whatsappButton: {
    backgroundColor: WHATSAPP_GREEN,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 999,
    paddingVertical: 16,
  },
  whatsappButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  howSection: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    borderRadius: 18,
    padding: 18,
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
    color: TEXT_PLUM,
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
    color: TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 17,
  },
});

export default ReferralScreen;