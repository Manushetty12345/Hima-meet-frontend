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
    iconColor: '#3880FF',
    iconBg: '#EBF4FF',
    title: 'Information Collection & Use',
    content: `While using our services, we may ask you to provide certain personally identifiable information that can be used to contact or identify you — such as your name and email address ("Personal Information"). We also collect non-identifiable information, your profile info and other account-associated details for marketing and analytical purposes.\n\nThis includes cookies and other technologies to improve our users' experience and the overall performance of our services. We may share information with our third-party partners in certain cases.\n\nWe use the information collected:\n• To communicate with you;\n• To improve our services and see the number of users;\n• To customize the services, advertisements and/or products we provide to you;\n• To assist with our product and service development;\n• To perform marketing analysis; and\n• For other purposes related to our business.\n\nWhen you create a Himameet account, you may sign in using your email address or a Facebook, LinkedIn, Google or other account. This authorizes us to access your public information from those accounts, consistent with your privacy settings.`
  },
  {
    id: 2,
    icon: Users,
    iconColor: '#EC1372',
    iconBg: '#FDE8F1',
    title: 'With Whom We May Share Information',
    content: `To run our business and provide seamless customer service, we use third-party vendors such as payment processors, cloud/server providers, analytics providers, technology partners and marketing companies. These vendors are not permitted to share or use the information for any other purpose.\n\nHimameet also reserves the right to share information under the following circumstances:\n• In response to subpoenas, court orders or legal proceedings; to establish or defend our legal rights, or as otherwise required by law;\n• To investigate or take action against illegal activity or suspected prohibited practices, or to protect the safety of our customers and the company;\n• Under corporate events such as divestiture, merger, acquisition, asset sale or bankruptcy.\n\nOther than the circumstances above, you will be notified before we share your personal information with any third party, and you may opt out. We may share anonymous, non-personal information with advertisers and investors to improve service quality.`
  },
  {
    id: 3,
    icon: AlertCircle,
    iconColor: '#8C31FF',
    iconBg: '#F3EBFF',
    title: 'Visiting From Outside the United States',
    content: `Regardless of your place of residence, Himameet stores your information in the United States, where our central server and database are located. Although privacy laws in the U.S. may differ from those where you are visiting, protecting your privacy remains our priority.`
  },
  {
    id: 4,
    icon: Info,
    iconColor: '#2DD36F',
    iconBg: '#E8FBF0',
    title: 'Log Data',
    content: `Like many service providers, we collect information that your browser sends whenever you use our services ("Log Data"). This may include your device's IP address, browser type and version, the pages you visit, and the date, time and duration of your visit.\n\nWe may use third-party services such as Google Analytics to collect, monitor and analyze this data.`
  },
  {
    id: 5,
    icon: AlertCircle,
    iconColor: '#F5A623',
    iconBg: '#FFF6E5',
    title: 'Do Not Track Disclosure ("DNT")',
    content: `We do not respond to DNT signals, as the definitions and common approaches for this policy are not yet fully defined. However, you can adjust your privacy preferences within your search engine and the accounts you use to create a Himameet account.`
  },
  {
    id: 6,
    icon: Info,
    iconColor: '#00BFA5',
    iconBg: '#E0F2F1',
    title: 'Communications',
    content: `We may use your Personal Information to contact you with newsletters, marketing or promotional materials and other important information. You may opt out of this service. Your continued use of the service after we post any changes to the Privacy Policy or Terms constitutes your acceptance of those changes.`
  },
  {
    id: 7,
    icon: AlertCircle,
    iconColor: '#3880FF',
    iconBg: '#EBF4FF',
    title: 'Cookies',
    content: `Cookies are small files with data, which may include an anonymous unique identifier, sent to your browser and stored on your device. We use cookies to improve our services and follow which links you click; we or third parties may use this data to show you advertisements.\n\nYou can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. If you do not accept cookies, some portions of our services may not work properly. We will not retain your information after you delete your Himameet account, though it may take some time to be completely removed.`
  },
  {
    id: 8,
    icon: ShieldCheck,
    iconColor: '#EC1372',
    iconBg: '#FDE8F1',
    title: 'Security',
    content: `The security of your Personal Information is important to us, but no method of transmission over the Internet or electronic storage is 100% secure. While we use commercially acceptable means to protect your information, we cannot guarantee its absolute security.\n\nPhotographs, details and comments you post — along with your profile picture and username — can be seen by other users. Please keep in mind what you choose to share publicly.`
  },
  {
    id: 9,
    icon: Users,
    iconColor: '#8C31FF',
    iconBg: '#F3EBFF',
    title: 'Third-Party Accounts',
    content: `You may create a Himameet account through email or an existing Facebook, LinkedIn or Google account. Himameet does not store those account passwords, and you are free to cancel any social-network connection at any time. We do not access your third-party pictures, locations or statuses unless they are made public. We do not control and are not responsible for content in third-party accounts.`
  },
  {
    id: 10,
    icon: Link,
    iconColor: '#2DD36F',
    iconBg: '#E8FBF0',
    title: 'Third-Party Websites',
    content: `Our services may contain links to other websites for information or advertising. These websites do not operate under this Privacy Policy and we do not control them or the information they collect. You should review each third-party website's own Privacy Policy and Terms. Access those websites at your own risk.`
  },
  {
    id: 11,
    icon: Info,
    iconColor: '#F5A623',
    iconBg: '#FFF6E5',
    title: 'Changes To This Privacy Policy',
    content: `This Privacy Policy is effective as of October 6, 2020 and remains in effect except for future changes, which take effect immediately after being posted on this page.\n\nWe reserve the right to update this Privacy Policy at any time, so please review it periodically. Your continued use of the service after changes are posted constitutes your acceptance of the modified policy. If you do not consent to the changes, you should stop using the services.`
  },
  {
    id: 12,
    icon: ShieldCheck,
    iconColor: '#00BFA5',
    iconBg: '#E0F2F1',
    title: "Children's Privacy",
    content: `Anyone below the age of 18 should not use the services. We do not knowingly collect, maintain or use personal information from children under the age of 18.`
  },
  {
    id: 13,
    icon: CheckCircle2,
    iconColor: '#3880FF',
    iconBg: '#EBF4FF',
    title: "Enforcement",
    content: `We regularly review our own compliance with this Privacy Policy. If you submit a formal written complaint with your contact information, we will do our best to resolve the issue.`
  },
  {
    id: 14,
    icon: Info,
    iconColor: '#EC1372',
    iconBg: '#FDE8F1',
    title: "Contact Us",
    content: `If you have any questions about this Privacy Policy, or notice any activity against it, please reach out to us:`,
    isContact: true
  }
];

const PrivacyPolicyScreen: React.FC<Props> = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <LinearGradient
          colors={['#8A2BE2', '#FF1493']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.banner}
        >
          <View style={styles.bannerIconWrap}>
            <ShieldCheck size={24} color="#FFFFFF" strokeWidth={2.5} />
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
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  banner: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  bannerIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  bannerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
    marginBottom: 16,
  },
  datePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  contentList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#4A0F6E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#4A4A4A',
  },
  sectionContent: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 20,
  },
  contactWrap: {
    marginTop: 16,
  },
  emailPill: {
    backgroundColor: '#FDE8F1',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 16,
  },
  emailText: {
    color: '#EC1372',
    fontWeight: '700',
    fontSize: 13,
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A4A4A',
    marginBottom: 6,
  },
  addressText: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0EBF5',
    marginTop: 20,
  }
});

export default PrivacyPolicyScreen;
