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
  ShieldCheck,
  Users,
  AlertCircle,
  Info,
  Link,
  CheckCircle2,
} from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;
type Props = NativeStackScreenProps<AuthStackParamList, 'PrivacyPolicy'>;

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

const PLUM_TINT_BG = 'rgba(91, 14, 139, 0.10)';
const GOLD_TINT_BG = 'rgba(245, 197, 66, 0.16)';

type Section = {
  id: number;
  icon: any;
  iconColor: string;
  iconBg: string;
  title: string;
  content: string;
  isContact?: boolean;
};

const SECTIONS: Section[] = [
  {
    id: 1,
    icon: ShieldCheck,
    iconColor: PLUM_ROYAL,
    iconBg: PLUM_TINT_BG,
    title: 'Information Collection & Use',
    content: `While using our services, we may ask you to provide certain personally identifiable information that can be used to contact or identify you — such as your name and email address ("Personal Information"). We also collect non-identifiable information, your profile info and other account-associated details for marketing and analytical purposes.\n\nThis includes cookies and other technologies to improve our users' experience and the overall performance of our services. We may share information with our third-party partners in certain cases.\n\nWe use the information collected:\n• To communicate with you;\n• To improve our services and see the number of users;\n• To customize the services, advertisements and/or products we provide to you;\n• To assist with our product and service development;\n• To perform marketing analysis; and\n• For other purposes related to our business.\n\nWhen you create a Himameet account, you may sign in using your email address or a Facebook, LinkedIn, Google or other account. This authorizes us to access your public information from those accounts, consistent with your privacy settings.`
  },
  {
    id: 2,
    icon: Users,
    iconColor: GOLD_DEEP,
    iconBg: GOLD_TINT_BG,
    title: 'With Whom We May Share Information',
    content: `To run our business and provide seamless customer service, we use third-party vendors such as payment processors, cloud/server providers, analytics providers, technology partners and marketing companies. These vendors are not permitted to share or use the information for any other purpose.\n\nHimameet also reserves the right to share information under the following circumstances:\n• In response to subpoenas, court orders or legal proceedings; to establish or defend our legal rights, or as otherwise required by law;\n• To investigate or take action against illegal activity or suspected prohibited practices, or to protect the safety of our customers and the company;\n• Under corporate events such as divestiture, merger, acquisition, asset sale or bankruptcy.\n\nOther than the circumstances above, you will be notified before we share your personal information with any third party, and you may opt out. We may share anonymous, non-personal information with advertisers and investors to improve service quality.`
  },
  {
    id: 3,
    icon: AlertCircle,
    iconColor: PLUM_ROYAL,
    iconBg: PLUM_TINT_BG,
    title: 'Visiting From Outside the United States',
    content: `Regardless of your place of residence, Himameet stores your information in the United States, where our central server and database are located. Although privacy laws in the U.S. may differ from those where you are visiting, protecting your privacy remains our priority.`
  },
  {
    id: 4,
    icon: Info,
    iconColor: GOLD_DEEP,
    iconBg: GOLD_TINT_BG,
    title: 'Log Data',
    content: `Like many service providers, we collect information that your browser sends whenever you use our services ("Log Data"). This may include your device's IP address, browser type and version, the pages you visit, and the date, time and duration of your visit.\n\nWe may use third-party services such as Google Analytics to collect, monitor and analyze this data.`
  },
  {
    id: 5,
    icon: AlertCircle,
    iconColor: PLUM_ROYAL,
    iconBg: PLUM_TINT_BG,
    title: 'Do Not Track Disclosure ("DNT")',
    content: `We do not respond to DNT signals, as the definitions and common approaches for this policy are not yet fully defined. However, you can adjust your privacy preferences within your search engine and the accounts you use to create a Himameet account.`
  },
  {
    id: 6,
    icon: Info,
    iconColor: GOLD_DEEP,
    iconBg: GOLD_TINT_BG,
    title: 'Communications',
    content: `We may use your Personal Information to contact you with newsletters, marketing or promotional materials and other important information. You may opt out of this service. Your continued use of the service after we post any changes to the Privacy Policy or Terms constitutes your acceptance of those changes.`
  },
  {
    id: 7,
    icon: AlertCircle,
    iconColor: PLUM_ROYAL,
    iconBg: PLUM_TINT_BG,
    title: 'Cookies',
    content: `Cookies are small files with data, which may include an anonymous unique identifier, sent to your browser and stored on your device. We use cookies to improve our services and follow which links you click; we or third parties may use this data to show you advertisements.\n\nYou can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. If you do not accept cookies, some portions of our services may not work properly. We will not retain your information after you delete your Himameet account, though it may take some time to be completely removed.`
  },
  {
    id: 8,
    icon: ShieldCheck,
    iconColor: GOLD_DEEP,
    iconBg: GOLD_TINT_BG,
    title: 'Security',
    content: `The security of your Personal Information is important to us, but no method of transmission over the Internet or electronic storage is 100% secure. While we use commercially acceptable means to protect your information, we cannot guarantee its absolute security.\n\nPhotographs, details and comments you post — along with your profile picture and username — can be seen by other users. Please keep in mind what you choose to share publicly.`
  },
  {
    id: 9,
    icon: Users,
    iconColor: PLUM_ROYAL,
    iconBg: PLUM_TINT_BG,
    title: 'Third-Party Accounts',
    content: `You may create a Himameet account through email or an existing Facebook, LinkedIn or Google account. Himameet does not store those account passwords, and you are free to cancel any social-network connection at any time. We do not access your third-party pictures, locations or statuses unless they are made public. We do not control and are not responsible for content in third-party accounts.`
  },
  {
    id: 10,
    icon: Link,
    iconColor: GOLD_DEEP,
    iconBg: GOLD_TINT_BG,
    title: 'Third-Party Websites',
    content: `Our services may contain links to other websites for information or advertising. These websites do not operate under this Privacy Policy and we do not control them or the information they collect. You should review each third-party website's own Privacy Policy and Terms. Access those websites at your own risk.`
  },
  {
    id: 11,
    icon: Info,
    iconColor: PLUM_ROYAL,
    iconBg: PLUM_TINT_BG,
    title: 'Changes To This Privacy Policy',
    content: `This Privacy Policy is effective as of October 6, 2020 and remains in effect except for future changes, which take effect immediately after being posted on this page.\n\nWe reserve the right to update this Privacy Policy at any time, so please review it periodically. Your continued use of the service after changes are posted constitutes your acceptance of the modified policy. If you do not consent to the changes, you should stop using the services.`
  },
  {
    id: 12,
    icon: ShieldCheck,
    iconColor: GOLD_DEEP,
    iconBg: GOLD_TINT_BG,
    title: "Children's Privacy",
    content: `Anyone below the age of 18 should not use the services. We do not knowingly collect, maintain or use personal information from children under the age of 18.`
  },
  {
    id: 13,
    icon: CheckCircle2,
    iconColor: PLUM_ROYAL,
    iconBg: PLUM_TINT_BG,
    title: "Enforcement",
    content: `We regularly review our own compliance with this Privacy Policy. If you submit a formal written complaint with your contact information, we will do our best to resolve the issue.`
  },
  {
    id: 14,
    icon: Info,
    iconColor: GOLD_DEEP,
    iconBg: GOLD_TINT_BG,
    title: "Contact Us",
    content: `If you have any questions about this Privacy Policy, or notice any activity against it, please reach out to us:`,
    isContact: true
  }
];

const PrivacyPolicyScreen: React.FC<Props> = ({ navigation }) => {
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
          <Text style={styles.headerTitle}>Privacy Policy</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollFlex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <LinearGradient
          colors={[PLUM_ROYAL, '#8E2DE2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.banner}
        >
          <View style={styles.bannerIconWrap}>
            <ShieldCheck size={24} color={GOLD} strokeWidth={2.2} />
          </View>
          <Text style={styles.bannerTitle}>Your Privacy Matters</Text>
          <Text style={styles.bannerText}>
            We use your personal information only to provide and improve our services. By using Himameet, you agree to this policy.
          </Text>
          <View style={styles.datePill}>
            <Text style={styles.dateText}>Effective October 6, 2020</Text>
          </View>
        </LinearGradient>

        {/* Content List */}
        <View style={styles.contentList}>
          {SECTIONS.map((section, index) => {
            const Icon = section.icon;
            const isLast = index === SECTIONS.length - 1;
            return (
              <View key={section.id} style={[styles.sectionItem, isLast && styles.lastSectionItem]}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIconWrap, { backgroundColor: section.iconBg }]}>
                    <Icon size={18} color={section.iconColor} />
                  </View>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                </View>
                <Text style={styles.sectionContent}>{section.content}</Text>
                {section.isContact && (
                  <View style={styles.contactWrap}>
                    <TouchableOpacity style={styles.emailPill} activeOpacity={0.8}>
                      <Text style={styles.emailText}>Himaapp000@gmail.com</Text>
                    </TouchableOpacity>
                    <Text style={styles.addressTitle}>Address</Text>
                    <Text style={styles.addressText}>
                      Innovfix Private Limited,{"\n"}
                      Indiqube Ascent, Municipal No. 420, PID68-6-420,{"\n"}
                      IV Block, Koramangala, Bangalore South,{"\n"}
                      Bangalore - 560034, Karnataka, India.
                    </Text>
                  </View>
                )}
                {!isLast && <View style={styles.divider} />}
              </View>
            );
          })}
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
  scrollFlex: {
    flex: 1,
    backgroundColor: IVORY,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  banner: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  bannerIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(245, 197, 66, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 66, 0.35)',
  },
  bannerTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  bannerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.88)',
    lineHeight: 22,
    marginBottom: 16,
  },
  datePill: {
    backgroundColor: 'rgba(245, 197, 66, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 66, 0.35)',
  },
  dateText: {
    color: GOLD,
    fontSize: 12,
    fontWeight: '700',
  },
  contentList: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    borderRadius: 18,
    padding: 20,
  },
  sectionItem: {
    marginBottom: 20,
  },
  lastSectionItem: {
    marginBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_PLUM,
  },
  sectionContent: {
    fontSize: 13,
    color: TEXT_MUTED,
    lineHeight: 20,
  },
  contactWrap: {
    marginTop: 16,
  },
  emailPill: {
    backgroundColor: 'rgba(245, 197, 66, 0.14)',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 16,
  },
  emailText: {
    color: GOLD_DEEP,
    fontWeight: '700',
    fontSize: 13,
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_PLUM,
    marginBottom: 6,
  },
  addressText: {
    fontSize: 13,
    color: TEXT_MUTED,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: IVORY_LINE,
    marginTop: 20,
  }
});

export default PrivacyPolicyScreen;