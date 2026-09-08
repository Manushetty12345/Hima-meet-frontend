import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, ChevronRight, Link2, Trash2 } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

type Props = NativeStackScreenProps<AuthStackParamList, 'AccountPrivacy'>;

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

const DANGER = '#D14343';

const AccountPrivacyScreen: React.FC<Props> = ({ navigation }) => {
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
          <Text style={styles.headerTitle}>Account Privacy</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('PrivacyPolicy')}
        >
          <View style={[styles.iconWrap, { backgroundColor: 'rgba(91, 14, 139, 0.10)' }]}>
            <Link2 size={20} color={PLUM_ROYAL} />
          </View>
          <Text style={styles.menuText}>Privacy Policy</Text>
          <ChevronRight size={20} color={TEXT_MUTED} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('DeleteAccount')}
        >
          <View style={[styles.iconWrap, { backgroundColor: 'rgba(209, 67, 67, 0.10)' }]}>
            <Trash2 size={20} color={DANGER} />
          </View>
          <Text style={styles.menuText}>Delete Account</Text>
          <ChevronRight size={20} color={TEXT_MUTED} />
        </TouchableOpacity>
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
    padding: 20,
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_PLUM,
  },
});

export default AccountPrivacyScreen;