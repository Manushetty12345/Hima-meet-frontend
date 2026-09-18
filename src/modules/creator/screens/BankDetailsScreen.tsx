import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StatusBar, Modal, Image } from 'react-native';
import { ArrowLeft, Building2, CheckCircle2, Lock, Camera, Image as ImageIcon, X } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import apiClient from '../../../api/apiClient';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;
const LILAC_WHITE = '#FBF7FF';
const LILAC_PALE = '#EFDFFB';
const TEXT_PLUM = '#2A1240';
const TEXT_MUTED = '#8B7F98';

const BankDetailsScreen = ({ navigation }: any) => {
  const [bankDetails, setBankDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [accNo, setAccNo] = useState('');
  const [confirmAccNo, setConfirmAccNo] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [upiId, setUpiId] = useState('');
  const [passbookFile, setPassbookFile] = useState<Asset | null>(null);
  const [panPhotoFile, setPanPhotoFile] = useState<Asset | null>(null);
  
  const [pickerVisible, setPickerVisible] = useState(false);
  const [currentPickerType, setCurrentPickerType] = useState<'passbook' | 'pan'>('passbook');

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

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const openPickerModal = (type: 'passbook' | 'pan') => {
    setCurrentPickerType(type);
    setPickerVisible(true);
  };

  const handlePickMedia = async (mode: 'camera' | 'gallery') => {
    setPickerVisible(false);
    const options = { mediaType: 'photo' as const };
    
    let result;
    if (mode === 'camera') {
      result = await launchCamera(options);
    } else {
      result = await launchImageLibrary(options);
    }

    if (result.assets && result.assets.length > 0) {
      if (currentPickerType === 'passbook') setPassbookFile(result.assets[0]);
      if (currentPickerType === 'pan') setPanPhotoFile(result.assets[0]);
    }
  };

  const handleSave = async () => {
    if (!name || !accNo || !confirmAccNo || !ifsc || !panNumber || !phone) {
      Alert.alert('Missing Info', 'Please fill all required text fields.');
      return;
    }

    if (accNo !== confirmAccNo) {
      Alert.alert('Error', 'Account Numbers do not match.');
      return;
    }

    // RegEx Validations
    if (!/^[0-9]{9,18}$/.test(accNo)) {
      Alert.alert('Invalid Format', 'Account Number must be 9-18 digits.');
      return;
    }

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
      Alert.alert('Invalid Format', 'IFSC Code format is incorrect. (e.g., SBIN0001234)');
      return;
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) {
      Alert.alert('Invalid Format', 'PAN Number format is incorrect. (e.g., ABCDE1234F)');
      return;
    }

    if (!passbookFile && !bankDetails?.passbook_image_url) {
       Alert.alert('Missing Photo', 'Please upload your Passbook or Cancelled Cheque photo.');
       return;
    }

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('account_holder_name', name);
      formData.append('account_number', accNo);
      formData.append('ifsc_code', ifsc);
      formData.append('pan_number', panNumber);
      formData.append('phone_number', phone);
      formData.append('upi_id', upiId);

      if (passbookFile?.uri) {
        formData.append('passbook_photo', {
          uri: passbookFile.uri,
          type: passbookFile.type || 'image/jpeg',
          name: passbookFile.fileName || 'passbook.jpg'
        } as any);
      }
      if (panPhotoFile?.uri) {
        formData.append('pan_photo', {
          uri: panPhotoFile.uri,
          type: panPhotoFile.type || 'image/jpeg',
          name: panPhotoFile.fileName || 'pan.jpg'
        } as any);
      }

      const res = await apiClient.post('/api/creator/bank-details', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      if (res.data?.status === 'success') {
        Alert.alert('Success', 'Bank details saved securely.');
        fetchBankDetails();
        setName(''); setAccNo(''); setConfirmAccNo(''); setIfsc(''); setPanNumber(''); setPhone(''); setUpiId('');
        setPassbookFile(null); setPanPhotoFile(null);
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to save bank details.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setName(bankDetails.account_holder_name || '');
    setAccNo(bankDetails.account_number || '');
    setConfirmAccNo(bankDetails.account_number || '');
    setIfsc(bankDetails.ifsc_code || '');
    setPanNumber(bankDetails.pan_number || '');
    setPhone(bankDetails.phone_number || '');
    setUpiId(bankDetails.upi_id || '');
    setBankDetails(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={[LILAC_WHITE, LILAC_PALE]} start={{ x: 0.15, y: 0 }} end={{ x: 0.85, y: 1 }} style={styles.headerGradient}>
        <View style={styles.statusBarSpacer} />
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={24} color={TEXT_PLUM} />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Bank Details</Text>
            <Text style={styles.subtitle}>Secure payout information</Text>
          </View>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#5B0E8B" />
            </View>
          ) : bankDetails ? (
            <View style={styles.savedCard}>
              <LinearGradient colors={['#5B0E8B', '#9C27B0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.savedGradient}>
                <View style={styles.savedTopRow}>
                  <Building2 size={24} color="#F5C542" />
                  <View style={styles.lockedPill}>
                    <Lock size={12} color="#FFFFFF" />
                    <Text style={styles.lockedText}>Verified & Locked</Text>
                  </View>
                </View>

                <Text style={styles.savedName}>{bankDetails.account_holder_name}</Text>
                <Text style={styles.savedAccNo}>•••• •••• {String(bankDetails.account_number || '').slice(-4)}</Text>
                
                <View style={styles.savedDivider} />
                
                <View style={styles.savedBottomRow}>
                  <View>
                    <Text style={styles.savedLabel}>IFSC CODE</Text>
                    <Text style={styles.savedValue}>{bankDetails.ifsc_code}</Text>
                  </View>
                  <View>
                    <Text style={styles.savedLabel}>PAN NUMBER</Text>
                    <Text style={styles.savedValue}>{bankDetails.pan_number}</Text>
                  </View>
                </View>
              </LinearGradient>
              
              <TouchableOpacity style={styles.editButton} onPress={handleEdit} activeOpacity={0.85}>
                <Text style={styles.editButtonText}>Edit Bank Details</Text>
              </TouchableOpacity>
              
              <Text style={styles.infoText}>
                Make sure your details are exactly as they appear on your bank records to avoid failed payouts.
              </Text>
            </View>
          ) : (
            <View>
              <Text style={styles.instructionText}>
                Please enter your details carefully. Photos of your Passbook & PAN are required for verification.
              </Text>

              <View style={styles.glassCard}>
                <Text style={styles.inputLabel}>Account Holder Name</Text>
                <TextInput style={styles.input} placeholder="As per bank records" placeholderTextColor="#9CA3AF" value={name} onChangeText={setName} />

                <Text style={styles.inputLabel}>Account Number</Text>
                <TextInput style={styles.input} placeholder="Enter Account Number" placeholderTextColor="#9CA3AF" value={accNo} onChangeText={setAccNo} keyboardType="numeric" secureTextEntry={true} />

                <Text style={styles.inputLabel}>Confirm Account Number</Text>
                <TextInput style={styles.input} placeholder="Re-enter Account Number" placeholderTextColor="#9CA3AF" value={confirmAccNo} onChangeText={setConfirmAccNo} keyboardType="numeric" />

                <Text style={styles.inputLabel}>IFSC Code</Text>
                <TextInput style={styles.input} placeholder="e.g. SBIN0001234" placeholderTextColor="#9CA3AF" value={ifsc} onChangeText={(val) => setIfsc(val.toUpperCase())} autoCapitalize="characters" />

                <Text style={styles.inputLabel}>PAN Number</Text>
                <TextInput style={styles.input} placeholder="e.g. ABCDE1234F" placeholderTextColor="#9CA3AF" value={panNumber} onChangeText={(val) => setPanNumber(val.toUpperCase())} autoCapitalize="characters" />
                
                <Text style={styles.inputLabel}>Phone Number (Linked to Bank)</Text>
                <TextInput style={styles.input} placeholder="10-digit number" placeholderTextColor="#9CA3AF" value={phone} onChangeText={setPhone} keyboardType="numeric" maxLength={10} />

                <Text style={styles.inputLabel}>UPI ID (Optional)</Text>
                <TextInput style={styles.input} placeholder="e.g. name@okhdfcbank" placeholderTextColor="#9CA3AF" value={upiId} onChangeText={setUpiId} autoCapitalize="none" />
              </View>

              <View style={styles.glassCard}>
                <Text style={styles.sectionTitle}>Required Documents</Text>
                
                <TouchableOpacity style={styles.uploadBox} onPress={() => openPickerModal('passbook')}>
                  <View style={styles.uploadIconWrap}>
                    {passbookFile ? <CheckCircle2 color="#34D399" size={24} /> : <Camera color="#5B0E8B" size={24} />}
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.uploadTitle}>Passbook / Cancelled Cheque</Text>
                    <Text style={styles.uploadSub}>{passbookFile ? 'Photo selected' : 'Tap to upload photo'}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.uploadBox} onPress={() => openPickerModal('pan')}>
                  <View style={styles.uploadIconWrap}>
                    {panPhotoFile ? <CheckCircle2 color="#34D399" size={24} /> : <ImageIcon color="#5B0E8B" size={24} />}
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.uploadTitle}>PAN Card Photo (Optional)</Text>
                    <Text style={styles.uploadSub}>{panPhotoFile ? 'Photo selected' : 'Tap to upload photo'}</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={[styles.saveButton, saving && styles.saveButtonDisabled]} activeOpacity={0.85} onPress={handleSave} disabled={saving}>
                <LinearGradient colors={['#D4AF37', '#F5C542']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saveBtnGradient}>
                  {saving ? (
                    <ActivityIndicator color="#2A1240" />
                  ) : (
                    <>
                      <CheckCircle2 size={20} color="#2A1240" />
                      <Text style={styles.saveBtnText}>Save Securely</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Picker Modal */}
      <Modal visible={pickerVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setPickerVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Upload Photo</Text>
              <TouchableOpacity onPress={() => setPickerVisible(false)}>
                <X size={24} color={TEXT_PLUM} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalOptions}>
              <TouchableOpacity style={styles.modalOptionBtn} onPress={() => handlePickMedia('camera')}>
                <View style={[styles.modalIconWrap, { backgroundColor: '#F9F5FF' }]}>
                  <Camera size={28} color="#5B0E8B" />
                </View>
                <Text style={styles.modalOptionText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalOptionBtn} onPress={() => handlePickMedia('gallery')}>
                <View style={[styles.modalIconWrap, { backgroundColor: '#F0F9FF' }]}>
                  <ImageIcon size={28} color="#0284C7" />
                </View>
                <Text style={styles.modalOptionText}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F5FF' },
  flex: { flex: 1 },
  headerGradient: { paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#EBDFC4' },
  statusBarSpacer: { height: STATUSBAR_HEIGHT },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12 },
  backButton: { marginRight: 16, width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#EBDFC4', shadowColor: '#5B0E8B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  title: { fontSize: 24, fontWeight: '800', color: TEXT_PLUM, marginBottom: 2 },
  subtitle: { fontSize: 13, color: TEXT_MUTED },
  scrollContent: { flexGrow: 1, padding: 20, paddingBottom: 60 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  instructionText: { fontSize: 14, color: TEXT_MUTED, marginBottom: 24, lineHeight: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: TEXT_PLUM, marginBottom: 16 },
  glassCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, shadowColor: '#5B0E8B', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.06, shadowRadius: 16, elevation: 4, marginBottom: 30, borderWidth: 1, borderColor: '#F3E8FF' },
  inputLabel: { fontSize: 13, fontWeight: '700', color: TEXT_PLUM, marginBottom: 8, marginLeft: 4 },
  input: { backgroundColor: '#F9F5FF', borderWidth: 1, borderColor: '#EFDFFB', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: TEXT_PLUM, marginBottom: 20 },
  uploadBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F5FF', borderWidth: 1, borderColor: '#EFDFFB', borderRadius: 16, padding: 16, marginBottom: 16 },
  uploadIconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F3E8FF', alignItems: 'center', justifyContent: 'center' },
  uploadTitle: { fontSize: 15, fontWeight: '700', color: TEXT_PLUM, marginBottom: 4 },
  uploadSub: { fontSize: 13, color: TEXT_MUTED },
  saveButton: { borderRadius: 16, overflow: 'hidden', shadowColor: '#F5C542', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4, marginBottom: 40 },
  saveButtonDisabled: { opacity: 0.7 },
  saveBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 },
  saveBtnText: { color: '#2A1240', fontSize: 16, fontWeight: '800' },
  savedCard: { marginTop: 10 },
  savedGradient: { borderRadius: 24, padding: 24, shadowColor: '#5B0E8B', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 8, marginBottom: 20 },
  savedTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  lockedPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4 },
  lockedText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  savedName: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginBottom: 4, letterSpacing: 1 },
  savedAccNo: { color: 'rgba(255, 255, 255, 0.9)', fontSize: 22, fontWeight: '800', letterSpacing: 2 },
  savedDivider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.15)', marginVertical: 24 },
  savedBottomRow: { flexDirection: 'row', justifyContent: 'space-between' },
  savedLabel: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 11, fontWeight: '600', marginBottom: 4, letterSpacing: 1 },
  savedValue: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  editButton: { backgroundColor: '#F3E8FF', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  editButtonText: { color: '#5B0E8B', fontSize: 14, fontWeight: '700' },
  infoText: { textAlign: 'center', color: TEXT_MUTED, fontSize: 13, lineHeight: 20, paddingHorizontal: 20 },
  
  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(42, 18, 64, 0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: TEXT_PLUM },
  modalOptions: { flexDirection: 'row', justifyContent: 'space-around' },
  modalOptionBtn: { alignItems: 'center', gap: 12 },
  modalIconWrap: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  modalOptionText: { fontSize: 14, fontWeight: '600', color: TEXT_PLUM }
});

export default BankDetailsScreen;
