import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform, 
  StatusBar,
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, Info, FileText } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';
import { getTickets, Ticket } from '../../../api/supportApi';

type Props = NativeStackScreenProps<AuthStackParamList, 'MyTickets'>;

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

const SUCCESS_GREEN = '#2DD36F';
const SUCCESS_GREEN_BG = '#E8FBF0';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

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
        <Text style={styles.ticketId}>Ticket ID: {item.id}</Text>
        <View style={[styles.statusBadge, item.status === 'ACTIVE' ? styles.statusActive : styles.statusResolved]}>
          <Text style={[styles.statusText, item.status === 'ACTIVE' ? styles.statusTextActive : styles.statusTextResolved]}>
            {item.status}
          </Text>
        </View>
      </View>
      <Text style={styles.ticketTitle}>{item.title}</Text>
      <View style={styles.ticketFooter}>
        <FileText size={14} color={TEXT_MUTED} style={styles.dateIcon} />
        <Text style={styles.ticketDate}>{item.date}</Text>
      </View>
    </View>
  );

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
          <Text style={styles.headerTitle}>My Tickets</Text>
        </View>
      </LinearGradient>

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
            <ActivityIndicator size="large" color={GOLD_DEEP} />
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
            <LinearGradient colors={[GOLD, GOLD_DEEP]} style={styles.emptyIconCircle}>
              <Info size={38} color={TEXT_PLUM} />
            </LinearGradient>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1.5,
    borderBottomColor: IVORY_LINE,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: GOLD_DEEP,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: TEXT_MUTED,
    letterSpacing: 0.5,
  },
  activeTabText: {
    color: GOLD_DEEP,
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
    padding: 20,
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
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
    color: TEXT_MUTED,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusActive: {
    backgroundColor: SUCCESS_GREEN_BG,
  },
  statusResolved: {
    backgroundColor: IVORY,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextActive: {
    color: SUCCESS_GREEN,
  },
  statusTextResolved: {
    color: TEXT_MUTED,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_PLUM,
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
    color: TEXT_MUTED,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: TEXT_PLUM,
    marginBottom: 8,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: TEXT_MUTED,
    textAlign: 'center',
  },
});

export default MyTicketsScreen;