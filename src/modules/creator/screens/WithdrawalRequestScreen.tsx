import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { ArrowLeft, Building2, IndianRupee, CheckCircle2 } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const WithdrawalRequestScreen = ({ navigation }: any) => {
  const [amount, setAmount] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#2A1240" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Withdraw Funds</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Balance Card */}
        <LinearGradient colors={['#2A1240', '#1A0B2E']} style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>AVAILABLE BALANCE</Text>
          <Text style={styles.balanceAmount}>₹45,800</Text>
        </LinearGradient>

        <Text style={styles.sectionTitle}>Withdrawal Amount</Text>
        <View style={styles.inputContainer}>
          <IndianRupee size={20} color="#8B7F98" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter amount (Min ₹500)"
            placeholderTextColor="#8B7F98"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <Text style={styles.sectionTitle}>Select Bank Account</Text>
        <TouchableOpacity style={styles.bankCard} activeOpacity={0.8}>
          <View style={styles.bankIconContainer}>
            <Building2 size={24} color="#EC1372" />
          </View>
          <View style={styles.bankInfo}>
            <Text style={styles.bankName}>HDFC Bank</Text>
            <Text style={styles.bankNumber}>**** **** 4582</Text>
          </View>
          <CheckCircle2 size={24} color="#F5C542" />
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitBtn} activeOpacity={0.8}>
          <LinearGradient colors={['#F91970', '#FF4D8D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.submitGrad}>
            <Text style={styles.submitBtnText}>Submit Request</Text>
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
