import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { ArrowLeft, Building2, Plus, CheckCircle2 } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import apiClient from '../../../api/apiClient';

import { launchImageLibrary, Asset } from 'react-native-image-picker';

const BankDetailsScreen = ({ navigation }: any) => {
  const [bankDetails, setBankDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  
  const [name, setName] = useState('');
  const [accNo, setAccNo] = useState('');
  const [confirmAccNo, setConfirmAccNo] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [bankName, setBankName] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [upiId, setUpiId] = useState('');
  const [phone, setPhone] = useState('');
  const [passbookFile, setPassbookFile] = useState<Asset | null>(null);
  const [panPhotoFile, setPanPhotoFile] = useState<Asset | null>(null);

  const fetchBankDetails = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/creator/bank-details');
      if (res.data?.status === 'success' && res.data.data) {
        setBankDetails(res.data.data);
      }
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error('Failed to fetch bank details:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePickFile = async (type: 'passbook' | 'pan') => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.assets && result.assets.length > 0) {
      if (type === 'passbook') setPassbookFile(result.assets[0]);
      if (type === 'pan') setPanPhotoFile(result.assets[0]);
    }
  };

  const handleSave = async () => {
    if (!name || !accNo || !confirmAccNo || !ifsc || !panNumber || !phone) {
      Alert.alert('Error', 'Please fill all required details (including PAN and Phone)');
      return;
    }
    if (accNo !== confirmAccNo) {
      Alert.alert('Error', 'Account Numbers do not match');
      return;
    }
    try {
      setSaving(true);
      
      const formData = new FormData();
      formData.append('account_holder_name', name);
      formData.append('account_number', accNo);
      formData.append('ifsc_code', ifsc);
      formData.append('bank_name', bankName);
      formData.append('pan_number', panNumber);
      formData.append('upi_id', upiId);
      formData.append('phone_number', phone);
      
      if (passbookFile && passbookFile.uri) {
        formData.append('passbook_photo', {
          uri: passbookFile.uri,
          type: passbookFile.type || 'image/jpeg',
          name: passbookFile.fileName || 'passbook.jpg'
        } as any);
      }

      if (panPhotoFile && panPhotoFile.uri) {
        formData.append('pan_photo', {
          uri: panPhotoFile.uri,
          type: panPhotoFile.type || 'image/jpeg',
          name: panPhotoFile.fileName || 'pan.jpg'
        } as any);
      }

      const res = await apiClient.post('/api/creator/bank-details', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (res.data?.status === 'success') {
        Alert.alert('Success', 'Bank details saved successfully');
        fetchBankDetails();
        setName(''); setAccNo(''); setConfirmAccNo(''); setIfsc(''); setBankName(''); setPanNumber(''); setUpiId(''); setPhone(''); setPassbookFile(null); setPanPhotoFile(null);
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to save bank details (DB error)');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchBankDetails();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#2A1240" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bank Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Saved Account</Text>
        
        {loading ? (
          <ActivityIndicator color="#F91970" size="small" />
        ) : bankDetails ? (
          <TouchableOpacity style={styles.bankCardActive} activeOpacity={0.9}>
            <View style={styles.bankIconContainer}>
              <Building2 size={24} color="#EC1372" />
            </View>
            <View style={styles.bankInfo}>
              <Text style={styles.bankName}>{bankDetails.bank_name || 'Bank Account'}</Text>
              <Text style={styles.bankNumber}>**** **** {bankDetails.account_number?.slice(-4) || 'XXXX'}</Text>
              <Text style={{ fontSize: 12, color: '#8B7F98', marginTop: 2 }}>{bankDetails.account_holder_name}</Text>
            </View>
            <CheckCircle2 size={24} color="#F5C542" />
          </TouchableOpacity>
        ) : (
          <Text style={{ color: '#8B7F98', marginBottom: 20 }}>No saved account found.</Text>
        )}

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>{bankDetails ? 'Update Bank Account' : 'Add New Bank Account'}</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Account Holder Name</Text>
          <TextInput style={styles.input} placeholder="e.g. Rahul Sharma" placeholderTextColor="#8B7F98" value={name} onChangeText={setName} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Bank Name</Text>
          <TextInput style={styles.input} placeholder="e.g. State Bank of India" placeholderTextColor="#8B7F98" value={bankName} onChangeText={setBankName} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Account Number</Text>
          <TextInput style={styles.input} placeholder="e.g. 1234567890" placeholderTextColor="#8B7F98" keyboardType="number-pad" value={accNo} onChangeText={setAccNo} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Confirm Account Number</Text>
          <TextInput style={styles.input} placeholder="e.g. 1234567890" placeholderTextColor="#8B7F98" keyboardType="number-pad" value={confirmAccNo} onChangeText={setConfirmAccNo} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>IFSC Code</Text>
          <TextInput style={styles.input} placeholder="e.g. HDFC0001234" placeholderTextColor="#8B7F98" autoCapitalize="characters" value={ifsc} onChangeText={setIfsc} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>PAN Number</Text>
          <TextInput style={styles.input} placeholder="e.g. ABCDE1234F" placeholderTextColor="#8B7F98" autoCapitalize="characters" value={panNumber} onChangeText={setPanNumber} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Upload PAN Card Photo</Text>
          <TouchableOpacity style={[styles.input, { justifyContent: 'center' }]} onPress={() => handlePickFile('pan')} activeOpacity={0.8}>
            <Text style={{ color: panPhotoFile ? '#2A1240' : '#8B7F98' }}>
              {panPhotoFile ? panPhotoFile.fileName || 'Photo Selected' : 'Tap to upload PAN Card...'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Upload Cancelled Cheque / Passbook</Text>
          <TouchableOpacity style={[styles.input, { justifyContent: 'center' }]} onPress={() => handlePickFile('passbook')} activeOpacity={0.8}>
            <Text style={{ color: passbookFile ? '#2A1240' : '#8B7F98' }}>
              {passbookFile ? passbookFile.fileName || 'Photo Selected' : 'Tap to upload Passbook...'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput style={styles.input} placeholder="e.g. 9876543210" placeholderTextColor="#8B7F98" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>UPI ID (Alternative Fast Payout)</Text>
          <TextInput style={styles.input} placeholder="e.g. username@upi" placeholderTextColor="#8B7F98" autoCapitalize="none" value={upiId} onChangeText={setUpiId} />
        </View>

        <TouchableOpacity style={[styles.submitBtn, saving && {opacity: 0.7}]} activeOpacity={0.8} onPress={handleSave} disabled={saving}>
          <LinearGradient colors={['#5B0E8B', '#3E0A5F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.submitGrad}>
            {saving ? <ActivityIndicator color="#FFF" /> : (
              <>
                <Plus size={20} color="#FFFFFF" />
                <Text style={styles.submitBtnText}>{bankDetails ? 'Update Bank Account' : 'Add Bank Account'}</Text>
              </>
            )}
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
