import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ToastAndroid,
  Platform,
  Modal,
  TextInput,
  StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { ShieldAlert, Clock, Coins, Home } from 'lucide-react-native';
import { AuthStackParamList } from '../../../navigation/AuthNavigator';
import apiClient from '../../../api/apiClient';

type Props = NativeStackScreenProps<AuthStackParamList, 'CreatorCallSummaryScreen'>;

const CreatorCallSummaryScreen: React.FC<Props> = ({ navigation, route }) => {
  const { callerId, callerName = 'User', callerAvatar, coinsEarned = 0, callDurationSeconds = 0 } = route.params || {};

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const handleReturnHome = () => {
    navigation.popToTop();
  };

  const handleReport = () => {
    setShowReportModal(true);
  };

  const handleReportSubmit = async () => {
    if (!reportReason.trim()) {
      ToastAndroid.show('Please enter a reason', ToastAndroid.SHORT);
      return;
    }
    if (!callerId) {
      ToastAndroid.show('Unable to identify user', ToastAndroid.SHORT);
      return;
    }
    
    try {
      await apiClient.post(`/api/creator/${callerId}/report`, {
        reason: 'User Feedback',
        description: reportReason,
      });
      ToastAndroid.show('User reported successfully.', ToastAndroid.SHORT);
      setShowReportModal(false);
      setReportReason('');
    } catch (error) {
      console.log('Error reporting user', error);
      ToastAndroid.show('Failed to report user', ToastAndroid.SHORT);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <View style={styles.container}>
      {/* @ts-ignore */}
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      <LinearGradient 
        colors={['#FFFAFC', '#FBF7FF', '#F6F3FA']} 
        style={styles.container} 
      >
        <View style={styles.safeArea}>
          
          <View style={styles.header}>
            <Text style={styles.title}>Call Ended</Text>
            <Text style={styles.subtitle}>Here is your summary</Text>
          </View>

          <View style={styles.card}>
            {/* Avatar Row */}
            <View style={styles.avatarRow}>
              <View style={styles.avatarWrapper}>
                {callerAvatar ? (
                  <Image source={{ uri: callerAvatar }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, { backgroundColor: '#E2E8F0' }]} />
                )}
              </View>
              <Text style={styles.callerName}>{callerName}</Text>
            </View>

            <View style={styles.divider} />

            {/* Stats Row */}
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <View style={[styles.iconBg, { backgroundColor: 'rgba(236, 19, 114, 0.1)' }]}>
                  <Clock size={24} color="#EC1372" />
                </View>
                <Text style={styles.statLabel}>Duration</Text>
                <Text style={styles.statValue}>{formatTime(callDurationSeconds)}</Text>
              </View>

              <View style={styles.statBox}>
                <View style={[styles.iconBg, { backgroundColor: 'rgba(245, 197, 66, 0.15)' }]}>
                  <Coins size={24} color="#D4AF37" />
                </View>
                <Text style={styles.statLabel}>Earned</Text>
                <Text style={[styles.statValue, { color: '#D4AF37' }]}>+{coinsEarned}</Text>
              </View>
            </View>
          </View>

          <View style={{ flex: 1 }} />

          {/* Action Buttons */}
          <TouchableOpacity 
            style={styles.reportBtn} 
            activeOpacity={0.7}
            onPress={handleReport}
          >
            <ShieldAlert size={20} color="#EF4444" />
            <Text style={styles.reportBtnText}>Report User</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.homeBtnWrapper} 
            activeOpacity={0.8}
            onPress={handleReturnHome}
          >
            <LinearGradient colors={['#EC1372', '#9C27B0']} style={styles.homeBtn}>
              <Home size={20} color="#FFFFFF" />
              <Text style={styles.homeBtnText}>Return to Dashboard</Text>
            </LinearGradient>
          </TouchableOpacity>

        </View>
      </LinearGradient>

      {/* Report User Modal */}
      <Modal visible={showReportModal} transparent animationType="slide" onRequestClose={() => setShowReportModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Report User</Text>
            <TextInput
              style={styles.textInput}
              placeholder={`Why are you reporting ${callerName}?`}
              placeholderTextColor="#8B7F98"
              value={reportReason}
              onChangeText={setReportReason}
              multiline
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShowReportModal(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSubmit} onPress={handleReportSubmit}>
                <Text style={styles.modalSubmitText}>Submit Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAFC',
  },
  safeArea: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 100 : 90,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2A1240',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B7F98',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#4A0F6E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(91, 14, 139, 0.05)',
  },
  avatarRow: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrapper: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: '#F6F3FA',
    shadowColor: '#4A0F6E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 44,
  },
  callerName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2A1240',
  },
  divider: {
    height: 1,
    backgroundColor: '#F6F3FA',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  iconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: '#8B7F98',
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2A1240',
  },
  reportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    marginBottom: 16,
    gap: 8,
  },
  reportBtnText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '700',
  },
  homeBtnWrapper: {
    shadowColor: '#EC1372',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  homeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    gap: 10,
  },
  homeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(42, 18, 64, 0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2A1240',
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: '#F6F3FA',
    borderRadius: 16,
    padding: 16,
    color: '#2A1240',
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalCancel: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#F6F3FA',
  },
  modalCancelText: {
    color: '#8B7F98',
    fontWeight: '600',
  },
  modalSubmit: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#EF4444',
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default CreatorCallSummaryScreen;
