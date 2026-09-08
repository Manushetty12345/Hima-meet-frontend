import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform, 
  StatusBar,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, ChevronDown, ChevronRight, FileText } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';
import { createTicket } from '../../../api/supportApi';

type Props = NativeStackScreenProps<AuthStackParamList, 'RaiseTicket'>;

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

const SUPPORT_TOPICS = [
  {
    id: 'calls',
    title: 'Calls & Connection',
    issues: [
      'Call keeps disconnecting',
      'Cannot hear the other person',
      'Video is lagging or freezing',
      'Call not connecting',
      'Other call issue'
    ]
  },
  {
    id: 'coins',
    title: 'Coins & Recharge',
    issues: [
      'Coins deducted but call not connected',
      'Recharged but coins not received',
      'Where did my coins go?',
      'Charged twice',
      'I need a refund',
      'Other coin issue'
    ]
  },
  {
    id: 'account',
    title: 'Account & Profile',
    issues: [
      'Unable to update profile picture',
      'Want to change my name',
      'How to delete my account?',
      'Account suspended or blocked',
      'Other account issue'
    ]
  },
  {
    id: 'other',
    title: 'Other Issues',
    issues: [
      'Report a user',
      'App is crashing',
      'Something else'
    ]
  }
];

const RaiseTicketScreen: React.FC<Props> = ({ navigation }) => {
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [customIssue, setCustomIssue] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const toggleTopic = (id: string) => {
    setExpandedTopic(expandedTopic === id ? null : id);
  };

  const handleIssueSelect = (issue: string) => {
    Alert.alert(
      "Raise Ticket",
      `Do you want to raise a support ticket for:\n\n"${issue}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Submit", 
          onPress: async () => {
            setIsSubmitting(true);
            try {
              await createTicket(issue);
              Alert.alert(
                "Success", 
                "Your ticket has been raised successfully. Our team will look into it.",
                [
                  {
                    text: "OK",
                    onPress: () => navigation.replace('MyTickets')
                  }
                ]
              );
            } catch (error) {
              Alert.alert("Error", "Failed to raise ticket. Please try again later.");
            } finally {
              setIsSubmitting(false);
            }
          }
        }
      ]
    );
  };

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
          <Text style={styles.headerTitle}>Help & Support</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>How can we help you today?</Text>
          <Text style={styles.introSubtitle}>Select a topic below to report your issue and raise a ticket.</Text>
        </View>

        {SUPPORT_TOPICS.map((topic) => (
          <View key={topic.id} style={styles.topicCard}>
            <TouchableOpacity 
              style={styles.topicHeader} 
              onPress={() => toggleTopic(topic.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.topicTitle}>{topic.title}</Text>
              {expandedTopic === topic.id ? (
                <ChevronDown size={20} color={TEXT_MUTED} />
              ) : (
                <ChevronRight size={20} color={TEXT_MUTED} />
              )}
            </TouchableOpacity>

            {expandedTopic === topic.id && (
              <View style={styles.issuesList}>
                {topic.issues.map((issue, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.issueItem}
                    onPress={() => handleIssueSelect(issue)}
                  >
                    <FileText size={16} color={GOLD_DEEP} style={styles.issueIcon} />
                    <Text style={styles.issueText}>{issue}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* Custom Issue Input */}
        <View style={styles.customIssueContainer}>
          <Text style={styles.customIssueTitle}>Don't see your issue?</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Describe your problem here..."
            placeholderTextColor={TEXT_MUTED}
            value={customIssue}
            onChangeText={setCustomIssue}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={!customIssue.trim() || isSubmitting}
            onPress={() => {
              handleIssueSelect(customIssue.trim());
              setCustomIssue('');
            }}
            style={styles.submitButtonWrapper}
          >
            {!customIssue.trim() || isSubmitting ? (
              <View style={[styles.submitButton, styles.submitButtonDisabled]}>
                {isSubmitting ? (
                  <ActivityIndicator color={TEXT_MUTED} size="small" />
                ) : (
                  <Text style={styles.submitButtonTextDisabled}>Submit Custom Issue</Text>
                )}
              </View>
            ) : (
              <LinearGradient
                colors={[GOLD, GOLD_DEEP]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>Submit Custom Issue</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  introSection: {
    padding: 24,
    paddingBottom: 10,
  },
  introTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: TEXT_PLUM,
    marginBottom: 8,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  introSubtitle: {
    fontSize: 14,
    color: TEXT_MUTED,
    lineHeight: 20,
  },
  topicCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_PLUM,
  },
  issuesList: {
    backgroundColor: IVORY,
    borderTopWidth: 1.5,
    borderTopColor: IVORY_LINE,
  },
  issueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: IVORY_LINE,
  },
  issueIcon: {
    marginRight: 12,
  },
  issueText: {
    fontSize: 14,
    color: TEXT_MUTED,
    flex: 1,
  },
  customIssueContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 40,
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
  },
  customIssueTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_PLUM,
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: IVORY,
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: TEXT_PLUM,
    minHeight: 100,
    marginBottom: 16,
  },
  submitButtonWrapper: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  submitButton: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: IVORY_LINE,
  },
  submitButtonText: {
    color: '#1A0733',
    fontSize: 15,
    fontWeight: '700',
  },
  submitButtonTextDisabled: {
    color: TEXT_MUTED,
    fontSize: 15,
    fontWeight: '700',
  }
});

export default RaiseTicketScreen;