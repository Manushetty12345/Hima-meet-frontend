import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Platform, StatusBar, KeyboardAvoidingView } from 'react-native';
import { ArrowLeft, Building2, IndianRupee, CheckCircle2, ChevronRight, Wallet } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import apiClient from '../../../api/apiClient';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;
const LILAC_WHITE = '#FBF7FF';
const LILAC_PALE = '#EFDFFB';
const TEXT_PLUM = '#2A1240';
const TEXT_MUTED = '#8B7F98';

const WithdrawalRequestScreen = ({ navigation }: any) => {
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [bankDetails, setBankDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [earnRes, bankRes] = await Promise.all([
        apiClient.get('/api/creator/earnings/summary'),
        apiClient.get('/api/creator/bank-details').catch(() => null)
      ]);

      if (earnRes.data?.status === 'success') {
        setBalance(earnRes.data.data.available_balance_inr || 0);
      }
      
      if (bankRes && bankRes.data?.status === 'success') {
        setBankDetails(bankRes.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch withdrawal data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    return unsubscribe;
  }, [navigation]);

  const handleSubmit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) < 100) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount (Minimum ₹100).');
      return;
    }
    if (Number(amount) > balance) {
      Alert.alert('Insufficient Balance', 'You cannot withdraw more than your available balance.');
      return;
    }
    if (!bankDetails) {
      Alert.alert('Bank Account Required', 'Please add your bank account details before withdrawing funds.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await apiClient.post('/api/creator/withdraw', { amount_inr: Number(amount) });
      if (res.data?.status === 'success') {
        Alert.alert('Request Submitted', 'Your withdrawal request has been successfully submitted and is pending approval.');
        navigation.goBack();
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit withdrawal request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={styles.container}>
        {/* Lilac Gradient Header */}
        <LinearGradient colors={[LILAC_WHITE, LILAC_PALE]} style={styles.headerGradient}>
          <View style={styles.statusBarSpacer} />
          <View style={styles.headerRow}>
            <TouchableOpacity 
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <ArrowLeft size={24} color={TEXT_PLUM} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Withdraw Funds</Text>
            <View style={{ width: 44 }} />
          </View>
        </LinearGradient>

        <ScrollView 
          style={{ flex: 1 }} 
          contentContainerStyle={styles.content} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {loading ? (
            <ActivityIndicator color={TEXT_PLUM} size="large" style={{ marginTop: 100 }} />
          ) : (
            <>
              {/* Premium Gold/Plum Balance Card */}
              <LinearGradient colors={['#2A1240', '#411C63']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.balanceCard}>
                <View style={styles.balanceHeader}>
                  <Wallet size={20} color="#F5C542" />
                  <Text style={styles.balanceLabel}>AVAILABLE BALANCE</Text>
                </View>
                <Text style={styles.balanceAmount}>₹{balance.toLocaleString('en-IN')}</Text>
                <View style={styles.balanceGlow} />
              </LinearGradient>

              <Text style={styles.sectionTitle}>Withdrawal Amount</Text>
              <View style={styles.inputWrapper}>
                <IndianRupee size={22} color={TEXT_PLUM} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter amount (Min ₹100)"
                  placeholderTextColor={TEXT_MUTED}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                  maxLength={8}
                />
              </View>
              <Text style={styles.helperText}>Minimum withdrawal limit is ₹100</Text>

              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Transfer To</Text>
                {bankDetails && (
                  <TouchableOpacity onPress={() => navigation.navigate('BankDetails')}>
                    <Text style={styles.editBtn}>Edit Details</Text>
                  </TouchableOpacity>
                )}
              </View>

              {bankDetails ? (
                <TouchableOpacity style={styles.bankCard} activeOpacity={0.8} onPress={() => navigation.navigate('BankDetails')}>
                  <View style={styles.bankIconContainer}>
                    <Building2 size={24} color="#5B0E8B" />
                  </View>
                  <View style={styles.bankInfo}>
                    <Text style={styles.bankName}>{bankDetails.account_holder_name || 'Bank Account'}</Text>
                    <Text style={styles.bankNumber}>A/C: •••• •••• {String(bankDetails.account_number || '').slice(-4)}</Text>
                    <View style={styles.verifiedBadge}>
                      <CheckCircle2 size={12} color="#10B981" />
                      <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                  </View>
                  <ChevronRight size={24} color={TEXT_MUTED} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.emptyBankCard} activeOpacity={0.8} onPress={() => navigation.navigate('BankDetails')}>
                  <View style={styles.emptyBankIconContainer}>
                    <Building2 size={24} color="#F91970" />
                  </View>
                  <View style={styles.bankInfo}>
                    <Text style={styles.emptyBankTitle}>No Bank Added</Text>
                    <Text style={styles.emptyBankSub}>Link a bank account to withdraw funds</Text>
                  </View>
                  <ChevronRight size={24} color={TEXT_MUTED} />
                </TouchableOpacity>
              )}
              
              {/* Extra padding so users can scroll up to see bank details if keyboard is tall */}
              <View style={{ height: 100 }} />
            </>
          )}
        </ScrollView>

        {/* Normal Flex Footer Button */}
        {!loading && (
          <View style={styles.footer}>
            <TouchableOpacity 
              style={[styles.submitBtn, (submitting || !amount || Number(amount) < 100 || Number(amount) > balance || !bankDetails) && { opacity: 0.5 }]} 
              activeOpacity={0.8} 
              onPress={handleSubmit} 
              disabled={submitting || !amount || Number(amount) < 100 || Number(amount) > balance || !bankDetails}
            >
              <LinearGradient colors={['#F91970', '#FF4D8D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.submitGrad}>
                {submitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitBtnText}>Submit Request</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_PLUM,
    letterSpacing: -0.3,
  },
  content: { padding: 24 },
  
  balanceCard: { 
    borderRadius: 24, 
    padding: 28, 
    marginBottom: 32,
    shadowColor: '#2A1240',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
    overflow: 'hidden',
  },
  balanceHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  balanceLabel: { fontSize: 13, color: '#F5C542', fontWeight: '800', letterSpacing: 1.5, marginLeft: 8 },
  balanceAmount: { fontSize: 42, fontWeight: '800', color: '#FFFFFF', letterSpacing: -1 },
  balanceGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#F5C542',
    opacity: 0.1,
  },

  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: TEXT_PLUM, marginBottom: 16 },
  editBtn: { fontSize: 14, fontWeight: '600', color: '#5B0E8B', marginBottom: 16 },

  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F9F5FF', 
    borderRadius: 20, 
    paddingHorizontal: 20, 
    borderWidth: 1.5, 
    borderColor: '#EFDFFB',
    marginBottom: 12,
  },
  inputWrapperFocused: {
    borderColor: '#5B0E8B',
    backgroundColor: '#FFFFFF',
    shadowColor: '#5B0E8B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, height: 64, fontSize: 24, color: TEXT_PLUM, fontWeight: '700' },
  helperText: { fontSize: 13, color: TEXT_MUTED, marginLeft: 8, marginBottom: 36 },

  bankCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
    padding: 20, 
    borderWidth: 1, 
    borderColor: '#EFDFFB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  bankIconContainer: { 
    width: 52, 
    height: 52, 
    borderRadius: 26, 
    backgroundColor: '#FBF7FF', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#EFDFFB',
  },
  bankInfo: { flex: 1 },
  bankName: { fontSize: 16, fontWeight: '700', color: TEXT_PLUM, marginBottom: 4 },
  bankNumber: { fontSize: 14, color: TEXT_MUTED, fontWeight: '500', marginBottom: 6 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
  verifiedText: { fontSize: 11, fontWeight: '700', color: '#10B981', marginLeft: 4 },

  emptyBankCard: {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF0F5', 
    borderRadius: 20, 
    padding: 20, 
    borderWidth: 1.5, 
    borderColor: '#F91970',
    borderStyle: 'dashed',
  },
  emptyBankIconContainer: {
    width: 52, 
    height: 52, 
    borderRadius: 26, 
    backgroundColor: '#FFFFFF', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 16,
  },
  emptyBankTitle: { fontSize: 16, fontWeight: '700', color: '#F91970', marginBottom: 4 },
  emptyBankSub: { fontSize: 13, color: TEXT_MUTED },

  footer: { 
    padding: 24, 
    paddingBottom: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: '#FFFFFF', 
    borderTopWidth: 1, 
    borderTopColor: '#EFDFFB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 10,
  },
  submitBtn: { borderRadius: 20, overflow: 'hidden' },
  submitGrad: { paddingVertical: 20, alignItems: 'center', justifyContent: 'center' },
  submitBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', letterSpacing: 0.5 },
});

export default WithdrawalRequestScreen;
