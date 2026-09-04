import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  ArrowLeft,
  CircleDollarSign,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Mail,
  MapPin,
  ShieldCheck,
} from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;
type Props = NativeStackScreenProps<AuthStackParamList, 'RefundPolicy'>;

const GOLD = '#F5C542';

const SECTIONS = [
  {
    id: 1,
    icon: CheckCircle2,
    iconBg: ['#11998e', '#38ef7d'] as string[],
    title: 'Eligibility for Refund',
    bullets: [
      'Refunds are applicable only for payments made towards premium features or subscriptions.',
      'Requests for refunds must be made within 7 days of the transaction date.',
      'Users must provide valid reasons for requesting a refund.',
    ],
  },
  {
    id: 2,
    icon: XCircle,
    iconBg: ['#FF416C', '#FF4B2B'] as string[],
    title: 'Non-Refundable Items',
    bullets: [
      'One-time service fees and administrative charges.',
      'Payments made for promotional or discounted offers.',
      'Services that have already been utilized.',
    ],
  },
  {
    id: 3,
    icon: RefreshCw,
    iconBg: ['#8E2DE2', '#EC1372'] as string[],
    title: 'Refund Process',
    bullets: [
      'To request a refund, users must contact customer support at himaapp000@gmail.com.',
      'Refunds, if approved, will be credited within 10 business days.',
      'Refunds will be credited to the original payment method.',
    ],
  },
  {
    id: 4,
    icon: CircleDollarSign,
    iconBg: ['#f7971e', '#ffd200'] as string[],
    title: 'Changes to Refund Policy',
    body: 'We reserve the right to modify this refund policy at any time. Any changes will be updated on this page.',
  },
];

const RefundPolicyScreen: React.FC<Props> = ({ navigation }) => {
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.statusBarSpacer} />

      <Animated.View style={[styles.scrollHeader, { opacity: headerOpacity }]} />

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={19} color="#EC1372" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Refund &amp; Cancellation</Text>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Banner */}
        <LinearGradient
          colors={['#8E2DE2', '#EC1372']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroBanner}
        >
          <View style={styles.heroCircle1} />
          <View style={styles.heroCircle2} />
          <View style={styles.heroIconWrap}>
            <CircleDollarSign size={38} color="#FFFFFF" strokeWidth={1.5} />
          </View>
          <Text style={styles.heroTitle}>Refund &amp; Cancellation</Text>
          <Text style={styles.heroSubtitle}>
            How refunds and cancellations work on Himameet — eligibility, timelines and what is non-refundable.
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
                {section.body ? (
                  <Text style={styles.bodyText}>{section.body}</Text>
                ) : (
                  <View style={styles.bulletList}>
                    {section.bullets!.map((bullet, bIdx) => (
                      <View key={bIdx} style={styles.bulletRow}>
                        <LinearGradient colors={section.iconBg} style={styles.bulletDot} />
                        <Text style={styles.bulletText}>{bullet}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}

          {/* Acknowledgement */}
          <LinearGradient
            colors={['#5B0E8B', '#8E2DE2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.acknowledgementCard}
          >
            <ShieldCheck size={28} color={GOLD} strokeWidth={1.5} style={{ marginBottom: 12 }} />
            <Text style={styles.ackTitle}>Our Promise</Text>
            <Text style={styles.ackBody}>
              At Himameet, we are committed to a fair and transparent refund process. If you face any issues, our support team is always here to help.
            </Text>
          </LinearGradient>

          {/* Contact */}
          <View style={styles.contactCard}>
            <Text style={styles.contactHeading}>Contact Us</Text>
            <Text style={styles.contactSubtitle}>For further assistance, please reach out to:</Text>
            <View style={styles.contactRow}>
              <LinearGradient colors={['#EC1372', '#FF6B6B']} style={styles.contactIcon}>
                <Mail size={15} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.contactEmailBadge}>
                <Text style={styles.contactEmail}>himaapp000@gmail.com</Text>
              </View>
            </View>
            <Text style={styles.contactAddressLabel}>Address</Text>
            <View style={styles.contactRow}>
              <LinearGradient colors={['#8E2DE2', '#4A00E0']} style={styles.contactIcon}>
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
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F0FA' },
  statusBarSpacer: { height: STATUSBAR_HEIGHT, backgroundColor: '#8E2DE2' },
  scrollHeader: {
    position: 'absolute', top: STATUSBAR_HEIGHT + 52,
    left: 0, right: 0, height: 8,
    backgroundColor: 'rgba(142,45,226,0.08)', zIndex: 10,
  },
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F0EBF5',
  },
  backButton: {
    width: 36, height: 36, borderRadius: 10, borderWidth: 1,
    borderColor: '#F0EBF5', alignItems: 'center', justifyContent: 'center',
    marginRight: 14, backgroundColor: '#FFF0F5',
  },
  topBarTitle: { fontSize: 17, fontWeight: '700', color: '#1B0E22' },
  scrollContent: { paddingBottom: 24 },
  heroBanner: {
    margin: 16, borderRadius: 24, padding: 28, overflow: 'hidden',
  },
  heroCircle1: {
    position: 'absolute', width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.07)', top: -30, right: -30,
  },
  heroCircle2: {
    position: 'absolute', width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.06)', bottom: -20, left: -20,
  },
  heroIconWrap: {
    width: 68, height: 68, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center',
    justifyContent: 'center', marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
  },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', marginBottom: 10, letterSpacing: 0.3 },
  heroSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 20, marginBottom: 16 },
  lastUpdatedBadge: {
    alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  lastUpdatedText: { fontSize: 11, color: '#FFFFFF', fontWeight: '600' },
  sectionsContainer: { paddingHorizontal: 16 },
  sectionCard: {
    backgroundColor: '#FFFFFF', borderRadius: 18, padding: 18, marginBottom: 14,
    shadowColor: '#5B0E8B', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionIconBox: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  sectionTitleWrap: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 6 },
  sectionNumber: { fontSize: 15, fontWeight: '800', color: '#EC1372' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1B0E22', flex: 1 },
  sectionDivider: { height: 1, backgroundColor: '#F3EDF9', marginBottom: 14 },
  bodyText: { fontSize: 13.5, color: '#4A3860', lineHeight: 21 },
  bulletList: { gap: 10 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  bulletDot: { width: 7, height: 7, borderRadius: 4, marginTop: 6 },
  bulletText: { fontSize: 13.5, color: '#4A3860', lineHeight: 20, flex: 1 },
  acknowledgementCard: {
    borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 14,
    shadowColor: '#5B0E8B', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2, shadowRadius: 14, elevation: 6,
  },
  ackTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', marginBottom: 10 },
  ackBody: { fontSize: 13.5, color: 'rgba(255,255,255,0.88)', lineHeight: 21, textAlign: 'center' },
  contactCard: {
    backgroundColor: '#FFFFFF', borderRadius: 18, padding: 20,
    shadowColor: '#5B0E8B', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
  },
  contactHeading: { fontSize: 16, fontWeight: '800', color: '#1B0E22', marginBottom: 6 },
  contactSubtitle: { fontSize: 13, color: '#8A7A9C', marginBottom: 16 },
  contactRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 14 },
  contactIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  contactEmailBadge: { backgroundColor: '#FDE8F1', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, flex: 1 },
  contactEmail: { fontSize: 13, fontWeight: '600', color: '#EC1372' },
  contactAddressLabel: { fontSize: 13, fontWeight: '700', color: '#1B0E22', marginBottom: 10 },
  contactAddressText: { fontSize: 12.5, color: '#4A3860', lineHeight: 20, flex: 1 },
});

export default RefundPolicyScreen;
