import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  ArrowLeft,
  BadgeCheck,
  XCircle,
  ShieldCheck,
  MessageCircle,
  Mail,
  MapPin,
  AlertTriangle,
  Heart,
} from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;
type Props = NativeStackScreenProps<AuthStackParamList, 'CommunityGuidelines'>;

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

const SECTIONS = [
  {
    id: 1,
    icon: XCircle,
    iconBg: [PLUM_ROYAL, '#8E2DE2'] as string[],
    title: 'Strictly Not Allowed',
    bullets: [
      'Abusive, threatening, or hateful language.',
      'Nudity, sexually explicit content, or inappropriate gestures.',
      'Promotion of self-harm, suicide, or violence.',
      'Spam, scams, impersonation, or misleading content.',
      'Any content violating laws or platform guidelines.',
    ],
  },
  {
    id: 2,
    icon: ShieldCheck,
    iconBg: [GOLD, GOLD_DEEP] as string[],
    title: 'How We Moderate',
    bullets: [
      'Our AI moderation tools monitor video/audio content in real time (e.g., face detection, voice filters).',
      'Users can report any violations directly in the app.',
      'Our moderation team reviews all reports within 24 hours.',
      'Offenders face actions like warnings, temporary or permanent bans.',
    ],
  },
  {
    id: 3,
    icon: Heart,
    iconBg: [PLUM_ROYAL, '#8E2DE2'] as string[],
    title: 'Respectful Interactions',
    bullets: [
      'Always treat other users with respect and dignity.',
      'Do not engage in personal attacks or harassment.',
      'Disagreements should be handled calmly and professionally.',
      'Use the block/report feature if someone makes you uncomfortable.',
    ],
  },
  {
    id: 4,
    icon: MessageCircle,
    iconBg: [GOLD, GOLD_DEEP] as string[],
    title: 'Content Standards',
    bullets: [
      'Keep conversations relevant and constructive.',
      'Do not share private information of other users without consent.',
      'Promotional content requires prior approval from Himameet.',
      'All content must comply with Indian laws and regulations.',
    ],
  },
  {
    id: 5,
    icon: AlertTriangle,
    iconBg: [PLUM_ROYAL, '#8E2DE2'] as string[],
    title: 'Consequences of Violations',
    bullets: [
      'First offense: Warning issued with explanation.',
      'Repeated offenses: Temporary suspension from the platform.',
      'Severe violations: Permanent ban without prior notice.',
      'Legal action may be taken for criminal offenses.',
    ],
  },
  {
    id: 6,
    icon: BadgeCheck,
    iconBg: [GOLD, GOLD_DEEP] as string[],
    title: 'Creator Responsibilities',
    bullets: [
      'Creators must maintain a professional and respectful demeanor.',
      'Do not make false claims or misrepresent services offered.',
      'Creators are responsible for content shared during sessions.',
      'Violating creator guidelines may result in creator status removal.',
    ],
  },
];

const CommunityGuidelinesScreen: React.FC<Props> = ({ navigation }) => {
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

        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={20} color={PLUM_ROYAL} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Community Guidelines</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollFlex}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Banner */}
        <LinearGradient
          colors={[PLUM_ROYAL, '#8E2DE2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroBanner}
        >
          <View style={styles.heroCircle1} />
          <View style={styles.heroCircle2} />
          <View style={styles.heroIconWrap}>
            <BadgeCheck size={36} color={GOLD} strokeWidth={1.5} />
          </View>
          <Text style={styles.heroTitle}>Community Guidelines</Text>
          <Text style={styles.heroSubtitle}>
            To maintain a respectful, safe and trustworthy space on Himameet, we follow strict content moderation practices. All users are expected to follow these rules.
          </Text>
          <View style={styles.lastUpdatedBadge}>
            <Text style={styles.lastUpdatedText}>Last updated: September 2026</Text>
          </View>
        </LinearGradient>

        {/* Sections */}
        <View style={styles.sectionsContainer}>
          {SECTIONS.map((section, idx) => {
            const Icon = section.icon;
            return (
              <View key={section.id} style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <LinearGradient
                    colors={section.iconBg}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.sectionIconBox}
                  >
                    <Icon size={18} color="#FFFFFF" strokeWidth={2} />
                  </LinearGradient>
                  <View style={styles.sectionTitleWrap}>
                    <Text style={styles.sectionNumber}>{idx + 1}.</Text>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                  </View>
                </View>
                <View style={styles.sectionDivider} />
                <View style={styles.bulletList}>
                  {section.bullets.map((bullet, bIdx) => (
                    <View key={bIdx} style={styles.bulletRow}>
                      <LinearGradient colors={section.iconBg} style={styles.bulletDot} />
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}

          {/* Acknowledgement */}
          <LinearGradient
            colors={[PLUM_ROYAL, '#8E2DE2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.acknowledgementCard}
          >
            <BadgeCheck size={28} color={GOLD} strokeWidth={1.5} style={{ marginBottom: 12 }} />
            <Text style={styles.ackTitle}>Our Commitment</Text>
            <Text style={styles.ackBody}>
              Himameet is committed to building a safe, inclusive and respectful community. By using our platform, you agree to uphold these guidelines and help us maintain a positive environment for everyone.
            </Text>
          </LinearGradient>

          {/* Contact */}
          <View style={styles.contactCard}>
            <Text style={styles.contactHeading}>Contact Us</Text>
            <Text style={styles.contactSubtitle}>For any concerns, contact our support team:</Text>
            <View style={styles.contactRow}>
              <LinearGradient colors={[GOLD, GOLD_DEEP]} style={styles.contactIcon}>
                <Mail size={15} color={TEXT_PLUM} />
              </LinearGradient>
              <View style={styles.contactEmailBadge}>
                <Text style={styles.contactEmail}>himaapp000@gmail.com</Text>
              </View>
            </View>
            <Text style={styles.contactAddressLabel}>Address</Text>
            <View style={styles.contactRow}>
              <LinearGradient colors={[PLUM_ROYAL, '#8E2DE2']} style={styles.contactIcon}>
                <MapPin size={15} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.contactAddressText}>
                Innovfix Private Limited,{'\n'}
                Indiique Ascent, Municipal No. 420, PID68-6-420,{'\n'}
                IV Block, Koramangala, Bangalore South,{'\n'}
                Bangalore – 560034 Karnataka, India.
              </Text>
            </View>
          </View>
          <View style={{ height: 32 }} />
        </View>
      </ScrollView>
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
  topBar: {
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
  topBarTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: TEXT_PLUM,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  scrollFlex: {
    flex: 1,
    backgroundColor: IVORY,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  heroBanner: {
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 22,
    padding: 26,
    overflow: 'hidden',
  },
  heroCircle1: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(245, 197, 66, 0.08)',
    top: -30,
    right: -30,
  },
  heroCircle2: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(245, 197, 66, 0.06)',
    bottom: -20,
    left: -20,
  },
  heroIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: 'rgba(245, 197, 66, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 66, 0.35)',
  },
  heroTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 10,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
    marginBottom: 16,
  },
  lastUpdatedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(245, 197, 66, 0.18)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 66, 0.35)',
  },
  lastUpdatedText: {
    fontSize: 11,
    color: GOLD,
    fontWeight: '700',
  },
  sectionsContainer: {
    paddingHorizontal: 24,
    paddingTop: 22,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  sectionNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: GOLD_DEEP,
  },
  sectionTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: TEXT_PLUM,
    flex: 1,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: IVORY_LINE,
    marginBottom: 14,
  },
  bulletList: {
    gap: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bulletDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginTop: 6,
  },
  bulletText: {
    fontSize: 13.5,
    color: TEXT_MUTED,
    lineHeight: 20,
    flex: 1,
  },
  acknowledgementCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 14,
  },
  ackTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 10,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  ackBody: {
    fontSize: 13.5,
    color: 'rgba(255,255,255,0.88)',
    lineHeight: 21,
    textAlign: 'center',
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    borderRadius: 18,
    padding: 20,
  },
  contactHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: TEXT_PLUM,
    marginBottom: 6,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  contactSubtitle: {
    fontSize: 13,
    color: TEXT_MUTED,
    marginBottom: 16,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  contactIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactEmailBadge: {
    backgroundColor: 'rgba(245, 197, 66, 0.12)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flex: 1,
  },
  contactEmail: {
    fontSize: 13,
    fontWeight: '700',
    color: GOLD_DEEP,
  },
  contactAddressLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: TEXT_PLUM,
    marginBottom: 10,
  },
  contactAddressText: {
    fontSize: 12.5,
    color: TEXT_MUTED,
    lineHeight: 20,
    flex: 1,
  },
});

export default CommunityGuidelinesScreen;