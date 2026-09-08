import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  ActivityIndicator,
  } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';
import apiClient from '../../../api/apiClient';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

type Props = NativeStackScreenProps<AuthStackParamList, 'Settings'>;

// ---- Palette pulled from the Himameet mark ----
const PLUM_ROYAL = '#5B0E8B';
const GOLD = '#F5C542';
const GOLD_DEEP = '#D4AF37';
const IVORY = '#FBF6EC';
const IVORY_LINE = '#EBDFC4';
const TEXT_PLUM = '#2A1240';
const TEXT_MUTED = '#8B7F98';

// Light lavender header wash — matches the rest of the flow
const LILAC_WHITE = '#FBF7FF';
const LILAC_PALE = '#EFDFFB';

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const [languageName, setLanguageName] = useState<string | null>(null);
  const [languageNative, setLanguageNative] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get('/api/user/me');
        const data = res.data?.data;
        if (data?.language_name) {
          setLanguageName(data.language_name);
          setLanguageNative(data.language_native);
        }
      } catch (e) {
        console.log('Failed to fetch profile for settings:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const displayLanguage = languageNative
    ? `${languageName} (${languageNative})`
    : languageName ?? 'Not set';

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" />

      <LinearGradient
        colors={[LILAC_WHITE, LILAC_PALE]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.statusBarSpacer} />

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={20} color={PLUM_ROYAL} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Language Section */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.verticalLine} />
          <Text style={styles.sectionTitle}>Language</Text>
        </View>

        {/* Current Language Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current language</Text>
          {loading ? (
            <ActivityIndicator size="small" color={GOLD_DEEP} style={{ marginTop: 6 }} />
          ) : (
            <Text style={styles.cardSubtitle}>{displayLanguage}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: IVORY,
  },
  headerGradient: {
    overflow: 'hidden',
  },
  statusBarSpacer: {
    height: STATUSBAR_HEIGHT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(91, 14, 139, 0.10)',
    borderWidth: 1.5,
    borderColor: 'rgba(91, 14, 139, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: TEXT_PLUM,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  verticalLine: {
    width: 3,
    height: 14,
    backgroundColor: GOLD_DEEP,
    marginRight: 8,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_PLUM,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    borderRadius: 18,
    padding: 18,
    marginBottom: 32,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_PLUM,
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 13,
    color: TEXT_MUTED,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    color: TEXT_MUTED,
  },
});

export default SettingsScreen;