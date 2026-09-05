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
import { ArrowLeft, AlertTriangle } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';
import { getDeleteReasons, deleteAccount, DeleteReason } from '../../../api/privacyApi';
import { logout } from '../../auth/api/authApi';
import { clearAuthToken } from '../../../api/apiClient';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

type Props = NativeStackScreenProps<AuthStackParamList, 'DeleteAccount'>;

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
        <Text style={styles.headerTitle}>Delete Account</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Warning Card */}
        <View style={styles.warningCard}>
          <AlertTriangle size={36} color="#F5A623" style={styles.warningIcon} />
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
          <ActivityIndicator size="large" color="#EC1372" style={{ marginTop: 20 }} />
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
                  placeholderTextColor="#A0A0A0"
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
          activeOpacity={0.8}
          style={[
            styles.submitButton, 
            (!selectedReasonId || isDeleting || (reasons.find(r => r.id === selectedReasonId)?.reason.toLowerCase() === 'other' && !otherReason.trim())) && styles.submitButtonDisabled
          ]}
          disabled={!selectedReasonId || isDeleting || (reasons.find(r => r.id === selectedReasonId)?.reason.toLowerCase() === 'other' && !otherReason.trim())}
          onPress={handleDelete}
        >
          {isDeleting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Delete Account</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    fontWeight: '700',
    color: '#1B0E22',
  },
  content: {
    padding: 16,
  },
  warningCard: {
    backgroundColor: '#FFF6E5',
    borderRadius: 16,
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
    color: '#E07D00',
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
    backgroundColor: '#1B0E22',
    marginTop: 6,
    marginRight: 10,
  },
  warningText: {
    flex: 1,
    fontSize: 12.5,
    color: '#4A4A4A',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1B0E22',
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
    borderWidth: 1,
    borderColor: '#E8E4EE',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  reasonPillSelected: {
    borderColor: '#EC1372',
    backgroundColor: '#FFF1F6',
  },
  reasonText: {
    fontSize: 12.5,
    color: '#4A4A4A',
    textAlign: 'center',
  },
  reasonTextSelected: {
    color: '#EC1372',
    fontWeight: '600',
  },
  otherInputContainer: {
    marginTop: 20,
  },
  otherInputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B0E22',
    marginBottom: 8,
  },
  otherInput: {
    borderWidth: 1,
    borderColor: '#E8E4EE',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#1B0E22',
    backgroundColor: '#FFFFFF',
    minHeight: 80,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    borderTopWidth: 1,
    borderTopColor: '#F0EBF5',
    backgroundColor: '#FFFFFF',
  },
  helpText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#8A7A9C',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#EC1372',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#E8E4EE',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default DeleteAccountScreen;
