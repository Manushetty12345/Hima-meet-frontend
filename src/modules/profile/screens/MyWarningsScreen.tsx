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
          <AlertOctagon size={18} color="#FF3B3B" />
          <Text style={styles.warningDate}>{dateStr}</Text>
        </View>
        <Text style={styles.warningReason}>{item.reason}</Text>
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
          <ArrowLeft size={19} color="#EC1372" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>My Warnings</Text>
          <Text style={styles.headerSubtitle}>Your account warning status</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#EC1372" />
        </View>
      ) : (
        <View style={styles.content}>
          {/* Status Banner */}
          <LinearGradient
            colors={hasWarnings ? ['#FF416C', '#FF4B2B'] : ['#8E2DE2', '#EC1372']}
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
                    hasWarnings && { color: '#FF3B3B' },
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
                hasWarnings && { backgroundColor: '#FF3B3B' },
              ]}
            />
            <Text style={[styles.infoCardText, hasWarnings && { color: '#FF3B3B' }]}>
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
              <CheckCircle2 size={48} color="#2DD36F" strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>All Clear!</Text>
              <Text style={styles.emptySubtitle}>
                Thank you for helping us maintain a safe and respectful community on Himameet.
              </Text>
            </View>
          )}

          {/* Footer Notice */}
          <View style={styles.footerNotice}>
            <AlertOctagon size={16} color="#EC1372" style={{ marginTop: 2 }} />
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
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBF5',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0EBF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1B0E22',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#8A7A9C',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#8E2DE2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
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
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EC1372',
    letterSpacing: 0.5,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F3EDF9',
    alignItems: 'center',
  },
  infoCardWarning: {
    backgroundColor: '#FFF0F0',
    borderColor: '#FFE0E0',
  },
  verticalAccent: {
    width: 3,
    height: '100%',
    backgroundColor: '#EC1372',
    marginRight: 12,
    borderRadius: 2,
  },
  infoCardText: {
    flex: 1,
    fontSize: 13.5,
    color: '#8E2DE2',
    lineHeight: 20,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 20,
  },
  warningCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFE0E0',
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  warningDate: {
    fontSize: 12,
    color: '#8A7A9C',
    fontWeight: '600',
  },
  warningReason: {
    fontSize: 14,
    color: '#1B0E22',
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
    color: '#1B0E22',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#8A7A9C',
    textAlign: 'center',
    lineHeight: 20,
  },
  footerNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FDE8F1',
    padding: 16,
    borderRadius: 16,
    marginTop: 'auto',
    marginBottom: 16,
    gap: 12,
  },
  footerNoticeText: {
    flex: 1,
    fontSize: 12.5,
    color: '#4A3860',
    lineHeight: 18,
  },
});

export default MyWarningsScreen;
