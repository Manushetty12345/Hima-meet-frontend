import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { ArrowLeft, Building2, IndianRupee, CheckCircle2 } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import apiClient from '../../../api/apiClient';

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
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) < 100) {
      Alert.alert('Error', 'Please enter a valid amount (Min. ₹100)');
      return;
    }
    if (Number(amount) > balance) {
      Alert.alert('Error', 'Insufficient balance.');
      return;
    }
    if (!bankDetails) {
      Alert.alert('Error', 'Please add a bank account first.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await apiClient.post('/api/creator/withdraw', { amount_inr: Number(amount) });
      if (res.data?.status === 'success') {
        Alert.alert('Success', 'Withdrawal request submitted!');
        navigation.goBack();
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit withdrawal request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#2A1240" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Withdraw Funds</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator color="#F91970" size="large" style={{ marginTop: 50 }} />
        ) : (
          <>
            {/* Balance Card */}
            <LinearGradient colors={['#2A1240', '#1A0B2E']} style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>AVAILABLE BALANCE</Text>
              <Text style={styles.balanceAmount}>₹{balance.toLocaleString('en-IN')}</Text>
            </LinearGradient>

            <Text style={styles.sectionTitle}>Withdrawal Amount</Text>
            <View style={styles.inputContainer}>
              <IndianRupee size={20} color="#8B7F98" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter amount (Min ₹100)"
                placeholderTextColor="#8B7F98"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>
            <Text style={{ fontSize: 12, color: '#8B7F98', marginTop: -20, marginBottom: 30, marginLeft: 16 }}>Min. withdrawal is ₹100</Text>

            <Text style={styles.sectionTitle}>Selected Bank Account</Text>
            {bankDetails ? (
              <TouchableOpacity style={styles.bankCard} activeOpacity={0.8} onPress={() => navigation.navigate('BankDetails')}>
                <View style={styles.bankIconContainer}>
                  <Building2 size={24} color="#EC1372" />
                </View>
                <View style={styles.bankInfo}>
                  <Text style={styles.bankName}>{bankDetails.bank_name || 'Bank Account'}</Text>
                  <Text style={styles.bankNumber}>**** **** {bankDetails.account_number?.slice(-4) || 'XXXX'}</Text>
                </View>
                <CheckCircle2 size={24} color="#F5C542" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.bankCard, { borderColor: '#EBDFC4' }]} activeOpacity={0.8} onPress={() => navigation.navigate('BankDetails')}>
                <Text style={{ color: '#F91970', paddingVertical: 10, fontWeight: '600' }}>+ Add Bank Account</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.submitBtn, (submitting || loading) && { opacity: 0.7 }]} activeOpacity={0.8} onPress={handleSubmit} disabled={submitting || loading}>
          <LinearGradient colors={['#F91970', '#FF4D8D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.submitGrad}>
            {submitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitBtnText}>Submit Request</Text>}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBF6EC' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#2A1240', marginLeft: 16 },
  content: { padding: 20 },
  balanceCard: { borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 30 },
  balanceLabel: { fontSize: 12, color: '#F5C542', fontWeight: '700', letterSpacing: 1, marginBottom: 8 },
  balanceAmount: { fontSize: 36, fontWeight: '800', color: '#FFFFFF' },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#2A1240', marginBottom: 12 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 16, marginBottom: 30, borderWidth: 1, borderColor: '#EBDFC4' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 56, fontSize: 16, color: '#2A1240', fontWeight: '600' },
  bankCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#F5C542' },
  bankIconContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(236, 19, 114, 0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  bankInfo: { flex: 1 },
  bankName: { fontSize: 16, fontWeight: '600', color: '#2A1240', marginBottom: 4 },
  bankNumber: { fontSize: 14, color: '#8B7F98' },
  footer: { padding: 20, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#EBDFC4' },
  submitBtn: { borderRadius: 16, overflow: 'hidden' },
  submitGrad: { paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});

export default WithdrawalRequestScreen;
