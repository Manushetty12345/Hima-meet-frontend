import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { ArrowLeft, ChevronRight, Info } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'HelpSupport'>;

const HelpSupportScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color="#EC1372" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help and Support</Text>
      </View>

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
              <View style={styles.iconContainer}>
                <Info size={16} color="#FFFFFF" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>Raised Ticket</Text>
                <Text style={styles.cardSubtitle}>No ticket raised</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#666666" />
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
              <View style={styles.iconContainer}>
                <Info size={16} color="#FFFFFF" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>Raise new ticket</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#666666" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
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
    paddingHorizontal: 20,
    paddingTop: 20,
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
    backgroundColor: '#EC1372',
    marginRight: 8,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF8BB4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#999999',
  },
});

export default HelpSupportScreen;
