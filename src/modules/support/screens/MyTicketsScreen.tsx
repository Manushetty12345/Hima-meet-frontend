import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  Platform, 
  StatusBar,
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native';
import { ArrowLeft, Info, FileText } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';
import { getTickets, Ticket } from '../../../api/supportApi';

type Props = NativeStackScreenProps<AuthStackParamList, 'MyTickets'>;

const MyTicketsScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'RESOLVED'>('ACTIVE');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const data = await getTickets();
      setTickets(data);
    } catch (error) {
      Alert.alert('Error', 'Could not load your tickets. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchTickets();
    }, [])
  );

  const filteredTickets = tickets.filter(t => t.status === activeTab);

  const renderTicketItem = ({ item }: { item: Ticket }) => (
    <View style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketId}>{item.id}</Text>
        <View style={[styles.statusBadge, item.status === 'ACTIVE' ? styles.statusActive : styles.statusResolved]}>
          <Text style={[styles.statusText, item.status === 'ACTIVE' ? styles.statusTextActive : styles.statusTextResolved]}>
            {item.status}
          </Text>
        </View>
      </View>
      <Text style={styles.ticketTitle}>{item.title}</Text>
      <View style={styles.ticketFooter}>
        <FileText size={14} color="#999" style={styles.dateIcon} />
        <Text style={styles.ticketDate}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color="#EC1372" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Tickets</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'ACTIVE' && styles.activeTabButton]} 
          onPress={() => setActiveTab('ACTIVE')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'ACTIVE' && styles.activeTabText]}>ACTIVE</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'RESOLVED' && styles.activeTabButton]} 
          onPress={() => setActiveTab('RESOLVED')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'RESOLVED' && styles.activeTabText]}>RESOLVED</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#EC1372" />
          </View>
        ) : filteredTickets.length > 0 ? (
          <FlatList
            data={filteredTickets}
            keyExtractor={item => item.id}
            renderItem={renderTicketItem}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyIconCircle}>
              <Info size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.emptyStateTitle}>
              {activeTab === 'ACTIVE' ? 'No Active Tickets' : 'No Resolved Tickets'}
            </Text>
            <Text style={styles.emptyStateSubtitle}>
              {activeTab === 'ACTIVE' 
                ? "You don't have any active tickets" 
                : "You don't have any resolved tickets"}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: '#FF8BB4',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999999',
    letterSpacing: 0.5,
  },
  activeTabText: {
    color: '#FF8BB4',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 16,
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  ticketId: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusActive: {
    backgroundColor: '#E8F5E9',
  },
  statusResolved: {
    backgroundColor: '#F5F5F5',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextActive: {
    color: '#4CAF50',
  },
  statusTextResolved: {
    color: '#9E9E9E',
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  ticketFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 6,
  },
  ticketDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#C4C4C4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F1F1F',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
});

export default MyTicketsScreen;
