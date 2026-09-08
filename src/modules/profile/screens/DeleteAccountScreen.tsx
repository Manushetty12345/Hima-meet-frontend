import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, AlertTriangle } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';
import { getDeleteReasons, deleteAccount, DeleteReason } from '../../../api/privacyApi';
import { logout } from '../../auth/api/authApi';
import { clearAuthToken } from '../../../api/apiClient';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

type Props = NativeStackScreenProps<AuthStackParamList, 'DeleteAccount'>;

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

const WARN_AMBER = '#C98A1B';
const WARN_AMBER_BG = 'rgba(245, 197, 66, 0.14)';

const DeleteAccountScreen: React.FC<Props> = ({ navigation }) => {
  const [reasons, setReasons] = useState<DeleteReason[]>([]);
  const [selectedReasonId, setSelectedReasonId] = useState<number | null>(null);
  const [otherReason, setOtherReason] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchReasons = async () => {
      try {
        const data = await getDeleteReasons();
        setReasons(data);
      } catch (error) {
        console.error('Failed to fetch delete reasons:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReasons();
  }, []);

  const handleDelete = async () => {
    if (!selectedReasonId) return;

    Alert.alert(
      'Confirm Deletion',
      'Are you absolutely sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);
              const selectedReasonObj = reasons.find(r => r.id === selectedReasonId);
              const isOther = selectedReasonObj?.reason.toLowerCase() === 'other';
              const textToSend = isOther ? otherReason : undefined;

              await deleteAccount(selectedReasonId, textToSend);

              // Clear session and logout
              await logout();
              await clearAuthToken();

              // Navigate back to Login
              navigation.reset({
                index: 0,
                routes: [{ name: 'LoginScreen' }],
              });
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete account');
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const isOtherSelected = reasons.find(r => r.id === selectedReasonId)?.reason.toLowerCase() === 'other';
  const isSubmitDisabled = !selectedReasonId || isDeleting || (isOtherSelected && !otherReason.trim());

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
          <Text style={styles.headerTitle}>Delete Account</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Warning Card */}
        <View style={styles.warningCard}>
          <AlertTriangle size={34} color={WARN_AMBER} style={styles.warningIcon} />
          <Text style={styles.warningTitle}>Important Information</Text>

          <View style={styles.bulletRow}>
            <View style={styles.bullet} />
            <Text style={styles.warningText}>
              Information related to account will be kept for 30 days and will be completely purged after no activity for continuous 30 days.
            </Text>
          </View>

          <View style={styles.bulletRow}>
            <View style={styles.bullet} />
            <Text style={styles.warningText}>
              After the account is deleted, you will no longer be able to log in or use the account, and the account cannot be recovered.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Please select at least one reason for deleting your account
        </Text>

        {isLoading ? (
          <ActivityIndicator size="large" color={GOLD_DEEP} style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.reasonsGrid}>
            {reasons.map((item) => {
              const isSelected = selectedReasonId === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.7}
                  style={[styles.reasonPill, isSelected && styles.reasonPillSelected]}
                  onPress={() => setSelectedReasonId(item.id)}
                >
                  <Text style={[styles.reasonText, isSelected && styles.reasonTextSelected]}>
                    {item.reason}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {(() => {
          const selectedObj = reasons.find(r => r.id === selectedReasonId);
          if (selectedObj && selectedObj.reason.toLowerCase() === 'other') {
            return (
              <View style={styles.otherInputContainer}>
                <Text style={styles.otherInputLabel}>Please specify your reason:</Text>
                <TextInput
                  style={styles.otherInput}
                  placeholder="Type your reason here..."
                  placeholderTextColor={TEXT_MUTED}
                  value={otherReason}
                  onChangeText={setOtherReason}
                  multiline
                  textAlignVertical="top"
                />
              </View>
            );
          }
          return null;
        })()}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.helpText}>Need Help? Please write to: support@himameet.com</Text>
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={isSubmitDisabled}
          onPress={handleDelete}
          style={styles.submitButtonWrapper}
        >
          {isSubmitDisabled ? (
            <View style={[styles.submitButton, styles.submitButtonDisabled]}>
              {isDeleting ? (
                <ActivityIndicator color={TEXT_MUTED} />
              ) : (
                <Text style={styles.submitButtonTextDisabled}>Delete Account</Text>
              )}
            </View>
          ) : (
            <LinearGradient
              colors={[GOLD, GOLD_DEEP]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>Delete Account</Text>
            </LinearGradient>
          )}
        </TouchableOpacity>
      </View>
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
    fontFamily: 'PlayfairDisplay-Bold',
  },
  content: {
    padding: 20,
  },
  warningCard: {
    backgroundColor: WARN_AMBER_BG,
    borderWidth: 1.5,
    borderColor: 'rgba(245, 197, 66, 0.4)',
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  warningIcon: {
    marginBottom: 12,
  },
  warningTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: WARN_AMBER,
    marginBottom: 16,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    width: '100%',
  },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: TEXT_PLUM,
    marginTop: 6,
    marginRight: 10,
  },
  warningText: {
    flex: 1,
    fontSize: 12.5,
    color: TEXT_MUTED,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_PLUM,
    marginBottom: 16,
  },
  reasonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  reasonPill: {
    width: '48%',
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  reasonPillSelected: {
    borderColor: GOLD_DEEP,
    backgroundColor: 'rgba(245, 197, 66, 0.10)',
  },
  reasonText: {
    fontSize: 12.5,
    color: TEXT_MUTED,
    textAlign: 'center',
  },
  reasonTextSelected: {
    color: GOLD_DEEP,
    fontWeight: '700',
  },
  otherInputContainer: {
    marginTop: 20,
  },
  otherInputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_PLUM,
    marginBottom: 8,
  },
  otherInput: {
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    borderRadius: 14,
    padding: 12,
    fontSize: 14,
    color: TEXT_PLUM,
    backgroundColor: '#FFFFFF',
    minHeight: 80,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    borderTopWidth: 1.5,
    borderTopColor: IVORY_LINE,
    backgroundColor: IVORY,
  },
  helpText: {
    textAlign: 'center',
    fontSize: 12,
    color: TEXT_MUTED,
    marginBottom: 16,
  },
  submitButtonWrapper: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  submitButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: IVORY_LINE,
  },
  submitButtonText: {
    color: '#1A0733',
    fontSize: 15,
    fontWeight: '700',
  },
  submitButtonTextDisabled: {
    color: TEXT_MUTED,
    fontSize: 15,
    fontWeight: '700',
  },
});

export default DeleteAccountScreen;