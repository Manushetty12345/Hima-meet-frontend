import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  ArrowLeft,
  AlertOctagon,
  Info,
  CheckCircle2,
} from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';
import apiClient from '../../../api/apiClient';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;
type Props = NativeStackScreenProps<AuthStackParamList, 'MyWarnings'>;

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

const DANGER = '#D14343';
const DANGER_BG = 'rgba(209, 67, 67, 0.08)';
const DANGER_BORDER = 'rgba(209, 67, 67, 0.25)';
const SUCCESS_GREEN = '#2DD36F';

type WarningItem = {
  id: number;
  reason: string;
  issued_at: string;
};

const MyWarningsScreen: React.FC<Props> = ({ navigation }) => {
  const [warnings, setWarnings] = useState<WarningItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWarnings = async () => {
      try {
        const res = await apiClient.get('/api/user/warnings');
        setWarnings(res.data?.data || []);
      } catch (error) {
        console.error('Failed to fetch warnings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWarnings();
  }, []);

  const hasWarnings = warnings.length > 0;

  const renderWarning = ({ item }: { item: WarningItem }) => {
    const dateStr = new Date(item.issued_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    return (
      <View style={styles.warningCard}>
        <View style={styles.warningHeader}>
          <AlertOctagon size={18} color={DANGER} />
          <Text style={styles.warningDate}>{dateStr}</Text>
        </View>
        <Text style={styles.warningReason}>{item.reason}</Text>
      </View>
    );
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
            <Text style={styles.headerTitle}>My Warnings</Text>
            <Text style={styles.headerSubtitle}>Your account warning status</Text>
          </View>
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={GOLD_DEEP} />
        </View>
      ) : (
        <View style={styles.content}>
          {/* Status Banner */}
          <LinearGradient
            colors={hasWarnings ? [DANGER, '#FF6B6B'] : [PLUM_ROYAL, '#8E2DE2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statusBanner}
          >
            <View style={styles.statusIconWrap}>
              {hasWarnings ? (
                <AlertOctagon size={24} color="#FFFFFF" />
              ) : (
                <Info size={24} color="#FFFFFF" />
              )}
            </View>
            <View style={styles.statusBadgeWrap}>
              <View style={styles.statusBadge}>
                <Text
                  style={[
                    styles.statusBadgeText,
                    hasWarnings && { color: DANGER },
                  ]}
                >
                  CURRENT LEVEL : {hasWarnings ? 'WARNING ISSUED' : 'GOOD STANDING'}
                </Text>
              </View>
            </View>
          </LinearGradient>

          {/* Main Info Card */}
          <View style={[styles.infoCard, hasWarnings && styles.infoCardWarning]}>
            <View
              style={[
                styles.verticalAccent,
                hasWarnings && { backgroundColor: DANGER },
              ]}
            />
            <Text style={[styles.infoCardText, hasWarnings && { color: DANGER }]}>
              {hasWarnings
                ? 'You have received warnings for violating our guidelines. Please review them below.'
                : 'You have no warnings. Please keep following our community guidelines.'}
            </Text>
          </View>

          {/* Warning List or Empty State */}
          {hasWarnings ? (
            <FlatList
              data={warnings}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderWarning}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyStateContainer}>
              <CheckCircle2 size={48} color={SUCCESS_GREEN} strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>All Clear!</Text>
              <Text style={styles.emptySubtitle}>
                Thank you for helping us maintain a safe and respectful community on Himameet.
              </Text>
            </View>
          )}

          {/* Footer Notice */}
          <View style={styles.footerNotice}>
            <AlertOctagon size={16} color={GOLD_DEEP} style={{ marginTop: 2 }} />
            <Text style={styles.footerNoticeText}>
              Repeated violations may lead to account suspension. Please follow our community guidelines.
            </Text>
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
    marginRight: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: TEXT_PLUM,
    marginBottom: 2,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  headerSubtitle: {
    fontSize: 12,
    color: TEXT_MUTED,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
  },
  statusIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  statusBadgeWrap: {
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: GOLD_DEEP,
    letterSpacing: 0.5,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    alignItems: 'center',
  },
  infoCardWarning: {
    backgroundColor: DANGER_BG,
    borderColor: DANGER_BORDER,
  },
  verticalAccent: {
    width: 3,
    height: '100%',
    backgroundColor: GOLD_DEEP,
    marginRight: 12,
    borderRadius: 2,
  },
  infoCardText: {
    flex: 1,
    fontSize: 13.5,
    color: TEXT_PLUM,
    lineHeight: 20,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 20,
  },
  warningCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: DANGER_BORDER,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  warningDate: {
    fontSize: 12,
    color: TEXT_MUTED,
    fontWeight: '600',
  },
  warningReason: {
    fontSize: 14,
    color: TEXT_PLUM,
    fontWeight: '500',
    lineHeight: 20,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_PLUM,
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  emptySubtitle: {
    fontSize: 13,
    color: TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 20,
  },
  footerNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(245, 197, 66, 0.12)',
    padding: 16,
    borderRadius: 18,
    marginTop: 'auto',
    marginBottom: 16,
    gap: 12,
  },
  footerNoticeText: {
    flex: 1,
    fontSize: 12.5,
    color: TEXT_PLUM,
    lineHeight: 18,
  },
});

export default MyWarningsScreen;