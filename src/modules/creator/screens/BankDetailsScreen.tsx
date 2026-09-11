import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { ArrowLeft, Building2, Plus, CheckCircle2 } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const BankDetailsScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#2A1240" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bank Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Saved Accounts</Text>
        
        <TouchableOpacity style={styles.bankCardActive} activeOpacity={0.9}>
          <View style={styles.bankIconContainer}>
            <Building2 size={24} color="#EC1372" />
          </View>
          <View style={styles.bankInfo}>
            <Text style={styles.bankName}>HDFC Bank</Text>
            <Text style={styles.bankNumber}>**** **** 4582</Text>
          </View>
          <CheckCircle2 size={24} color="#F5C542" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.bankCard} activeOpacity={0.7}>
          <View style={styles.bankIconContainerInactive}>
            <Building2 size={24} color="#8B7F98" />
          </View>
          <View style={styles.bankInfo}>
            <Text style={styles.bankNameInactive}>State Bank of India</Text>
            <Text style={styles.bankNumber}>**** **** 1120</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Add New Bank Account</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Account Holder Name</Text>
          <TextInput style={styles.input} placeholder="e.g. Rahul Sharma" placeholderTextColor="#8B7F98" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Account Number</Text>
          <TextInput style={styles.input} placeholder="Enter account number" placeholderTextColor="#8B7F98" keyboardType="numeric" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>IFSC Code</Text>
          <TextInput style={styles.input} placeholder="e.g. HDFC0001234" placeholderTextColor="#8B7F98" autoCapitalize="characters" />
        </View>

        <TouchableOpacity style={styles.submitBtn} activeOpacity={0.8}>
          <LinearGradient colors={['#5B0E8B', '#3E0A5F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.submitGrad}>
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.submitBtnText}>Add Bank Account</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBF6EC' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#2A1240', marginLeft: 16 },
  content: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#2A1240', marginBottom: 16 },
  bankCardActive: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1.5, borderColor: '#F5C542' },
  bankCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#EBDFC4' },
  bankIconContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(236, 19, 114, 0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  bankIconContainerInactive: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  bankInfo: { flex: 1 },
  bankName: { fontSize: 16, fontWeight: '700', color: '#2A1240', marginBottom: 4 },
  bankNameInactive: { fontSize: 16, fontWeight: '600', color: '#8B7F98', marginBottom: 4 },
  bankNumber: { fontSize: 14, color: '#8B7F98' },
  divider: { height: 1, backgroundColor: '#EBDFC4', marginVertical: 24 },
  inputContainer: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#2A1240', marginBottom: 8 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EBDFC4', borderRadius: 12, paddingHorizontal: 16, height: 50, fontSize: 15, color: '#2A1240' },
  submitBtn: { borderRadius: 16, overflow: 'hidden', marginTop: 12 },
  submitGrad: { flexDirection: 'row', paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginLeft: 8 },
});

export default BankDetailsScreen;
