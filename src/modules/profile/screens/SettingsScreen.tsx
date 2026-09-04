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
import { ArrowLeft } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';
import apiClient from '../../../api/apiClient';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

type Props = NativeStackScreenProps<AuthStackParamList, 'Settings'>;

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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.statusBarSpacer} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={20} color="#EC1372" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

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
            <ActivityIndicator size="small" color="#EC1372" style={{ marginTop: 4 }} />
          ) : (
            <Text style={styles.cardSubtitle}>{displayLanguage}</Text>
          )}
        </View>

        <Text style={styles.versionText}>Version 1.1.30</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F7FB',
  },
  statusBarSpacer: {
    height: STATUSBAR_HEIGHT,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBF5',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0EBF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B0E22',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  verticalLine: {
    width: 3,
    height: 14,
    backgroundColor: '#EC1372',
    marginRight: 8,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1B0E22',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    shadowColor: '#4A0F6E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B0E22',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#8A7A9C',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    color: '#8A7A9C',
  },
});

export default SettingsScreen;
