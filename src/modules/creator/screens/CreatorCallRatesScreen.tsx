import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, Phone, Video } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

const STATUSBAR_HEIGHT = 0; // Using React Native's StatusBar
const PLUM_ROYAL = '#5B0E8B';
const GOLD = '#F5C542';
const GOLD_DEEP = '#D4AF37';
const IVORY = '#FBF6EC';
const TEXT_PLUM = '#2A1240';
const TEXT_MUTED = '#8B7F98';
const LILAC_WHITE = '#FBF7FF';
const LILAC_PALE = '#EFDFFB';

type Props = NativeStackScreenProps<any, 'CreatorCallRates'>;

const CreatorCallRatesScreen = ({ navigation }: Props) => {
  const [voiceRate, setVoiceRate] = useState('10');
  const [videoRate, setVideoRate] = useState('25');

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" />

      <LinearGradient colors={[LILAC_WHITE, LILAC_PALE]} start={{ x: 0.15, y: 0 }} end={{ x: 0.85, y: 1 }} style={styles.headerGradient}>
        <View style={styles.statusBarSpacer} />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} activeOpacity={0.8} onPress={() => navigation.goBack()}>
            <ArrowLeft size={20} color={PLUM_ROYAL} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Call Rates</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.rateRow}>
            <View style={styles.rateInfo}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(236, 19, 114, 0.1)' }]}>
                <Phone size={20} color="#EC1372" />
              </View>
              <View>
                <Text style={styles.rateTitle}>Voice Call Rate</Text>
                <Text style={styles.rateSubtitle}>Coins per minute</Text>
              </View>
            </View>
            <View style={styles.inputWrap}>
              <TextInput 
                style={styles.input} 
                value={voiceRate} 
                onChangeText={setVoiceRate} 
                keyboardType="numeric" 
                maxLength={4}
              />
            </View>
          </View>
          
          <View style={styles.divider} />

          <View style={styles.rateRow}>
            <View style={styles.rateInfo}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(79, 70, 229, 0.1)' }]}>
                <Video size={20} color="#4F46E5" />
              </View>
              <View>
                <Text style={styles.rateTitle}>Video Call Rate</Text>
                <Text style={styles.rateSubtitle}>Coins per minute</Text>
              </View>
            </View>
            <View style={styles.inputWrap}>
              <TextInput 
                style={styles.input} 
                value={videoRate} 
                onChangeText={setVideoRate} 
                keyboardType="numeric" 
                maxLength={4}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.85} style={styles.updateButtonWrapper} onPress={() => navigation.goBack()}>
          <LinearGradient colors={[GOLD, GOLD_DEEP]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.updateButton}>
            <Text style={styles.updateButtonText}>Save Rates</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: IVORY },
  headerGradient: { overflow: 'hidden' },
  statusBarSpacer: { height: 40 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(91, 14, 139, 0.10)', borderWidth: 1.5, borderColor: 'rgba(91, 14, 139, 0.25)', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: TEXT_PLUM, fontFamily: 'PlayfairDisplay-Bold' },
  content: { padding: 20, flex: 1 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  rateRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rateInfo: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  rateTitle: { fontSize: 16, fontWeight: '700', color: TEXT_PLUM, marginBottom: 4 },
  rateSubtitle: { fontSize: 13, color: TEXT_MUTED },
  inputWrap: { width: 80, backgroundColor: '#F9FAFB', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 12, paddingVertical: 8 },
  input: { fontSize: 18, fontWeight: '700', color: TEXT_PLUM, textAlign: 'center', padding: 0 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 20 },
  updateButtonWrapper: { borderRadius: 999, overflow: 'hidden', marginTop: 'auto' },
  updateButton: { paddingVertical: 18, alignItems: 'center' },
  updateButtonText: { fontSize: 16, fontWeight: '700', color: '#1A0733' },
});

export default CreatorCallRatesScreen;
