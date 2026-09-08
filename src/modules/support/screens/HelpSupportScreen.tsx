import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, ChevronRight, Info } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'HelpSupport'>;

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

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

const HelpSupportScreen: React.FC<Props> = ({ navigation }) => {
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
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ArrowLeft size={20} color={PLUM_ROYAL} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help and Support</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Your tickets section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.verticalLine} />
            <Text style={styles.sectionTitle}>Your tickets</Text>
          </View>

          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('MyTickets')}
          >
            <View style={styles.cardContent}>
              <LinearGradient colors={[GOLD, GOLD_DEEP]} style={styles.iconContainer}>
                <Info size={16} color={TEXT_PLUM} />
              </LinearGradient>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>Raised Ticket</Text>
                <Text style={styles.cardSubtitle}>No ticket raised</Text>
              </View>
            </View>
            <ChevronRight size={20} color={TEXT_MUTED} />
          </TouchableOpacity>
        </View>

        {/* Create a new ticket section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.verticalLine} />
            <Text style={styles.sectionTitle}>Create a new ticket</Text>
          </View>

          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('RaiseTicket')}
          >
            <View style={styles.cardContent}>
              <LinearGradient colors={[PLUM_ROYAL, '#8E2DE2']} style={styles.iconContainer}>
                <Info size={16} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>Raise new ticket</Text>
              </View>
            </View>
            <ChevronRight size={20} color={TEXT_MUTED} />
          </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  verticalLine: {
    width: 3,
    height: 16,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_PLUM,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    color: TEXT_MUTED,
  },
});

export default HelpSupportScreen;