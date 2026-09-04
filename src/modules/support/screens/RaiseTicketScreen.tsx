import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  Platform, 
  StatusBar,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { ArrowLeft, ChevronDown, ChevronRight, FileText } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';
import { createTicket } from '../../../api/supportApi';

type Props = NativeStackScreenProps<AuthStackParamList, 'RaiseTicket'>;

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
              Alert.alert("Success", "Your ticket has been raised successfully. Our team will look into it.");
              navigation.replace('MyTickets');
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color="#EC1372" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
      </View>

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
                <ChevronDown size={20} color="#666" />
              ) : (
                <ChevronRight size={20} color="#666" />
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
                    <FileText size={16} color="#EC1372" style={styles.issueIcon} />
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
            placeholderTextColor="#999"
            value={customIssue}
            onChangeText={setCustomIssue}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <TouchableOpacity 
            style={[styles.submitButton, (!customIssue.trim() || isSubmitting) && styles.submitButtonDisabled]}
            disabled={!customIssue.trim() || isSubmitting}
            onPress={() => {
              handleIssueSelect(customIssue.trim());
              setCustomIssue('');
            }}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Custom Issue</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F1F1F',
  },
  content: {
    flex: 1,
  },
  introSection: {
    padding: 20,
    paddingBottom: 10,
  },
  introTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F1F1F',
    marginBottom: 8,
  },
  introSubtitle: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  topicCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EAEAEA',
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
    fontWeight: '600',
    color: '#333333',
  },
  issuesList: {
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  issueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  issueIcon: {
    marginRight: 12,
  },
  issueText: {
    fontSize: 14,
    color: '#444444',
    flex: 1,
  },
  customIssueContainer: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 40,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  customIssueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    minHeight: 100,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#EC1372',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#FFB8D2',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  }
});

export default RaiseTicketScreen;
