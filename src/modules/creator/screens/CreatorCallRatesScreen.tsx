import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, Phone, Video, Coins } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import apiClient from '../../../api/apiClient';

const STATUSBAR_HEIGHT = 0;
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
  const [coinsToRupeeRatio, setCoinsToRupeeRatio] = useState('100');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await apiClient.get('/api/config/call-rates');
        if (res.data?.data) {
          setVoiceRate(String(res.data.data.audioCallCost || 10));
          setVideoRate(String(res.data.data.videoCallCost || 25));
          setCoinsToRupeeRatio(String(res.data.data.coinsToRupeeRatio || 100));
        }
      } catch (err) {
        console.error('Error fetching global rates:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, []);

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

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={GOLD_DEEP} />
        </View>
      ) : (
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
              <View style={styles.valueWrap}>
                <Text style={styles.valueText}>{voiceRate}</Text>
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
              <View style={styles.valueWrap}>
                <Text style={styles.valueText}>{videoRate}</Text>
              </View>
            </View>
          </View>

          {/* Earnings Info Card */}
          <LinearGradient
            colors={['#FFFFFF', '#FDFBF7']}
            style={styles.earningsCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <View style={styles.earningsIconWrap}>
              <Coins size={24} color={GOLD_DEEP} />
            </View>
            <View style={styles.earningsTextWrap}>
              <Text style={styles.earningsTitle}>Earning Rate</Text>
              <Text style={styles.earningsDesc}>
                For every <Text style={styles.earningsHighlight}>{coinsToRupeeRatio} coins</Text> you earn, you will receive <Text style={styles.earningsHighlight}>₹1</Text>.
              </Text>
            </View>
          </LinearGradient>

          <View style={styles.bottomSpacer} />
        </View>
      )}
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
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: IVORY_LINE },
  rateRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rateInfo: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  rateTitle: { fontSize: 16, fontWeight: '700', color: TEXT_PLUM, marginBottom: 4 },
  rateSubtitle: { fontSize: 13, color: TEXT_MUTED },
  valueWrap: { width: 70, backgroundColor: 'rgba(235, 223, 196, 0.3)', borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  valueText: { fontSize: 18, fontWeight: '800', color: GOLD_DEEP },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 20 },
  earningsCard: { flexDirection: 'row', padding: 20, borderRadius: 20, borderWidth: 1.5, borderColor: GOLD, shadowColor: GOLD_DEEP, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 5, alignItems: 'center' },
  earningsIconWrap: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(245, 197, 66, 0.15)', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  earningsTextWrap: { flex: 1 },
  earningsTitle: { fontSize: 16, fontWeight: '800', color: TEXT_PLUM, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  earningsDesc: { fontSize: 14, color: TEXT_MUTED, lineHeight: 22 },
  earningsHighlight: { fontWeight: '800', color: PLUM_ROYAL },
  bottomSpacer: { height: 40 },
});

// To fix IVORY_LINE undefined from previous file:
const IVORY_LINE = '#EBDFC4';

export default CreatorCallRatesScreen;
