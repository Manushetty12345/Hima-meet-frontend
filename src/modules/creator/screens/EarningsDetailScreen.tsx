import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { ArrowLeft, Phone, Video, MessageCircle } from 'lucide-react-native';

const dummySessions = [
  { id: '1', type: 'video', user: 'Rahul K.', duration: '15 mins', amount: '₹150', date: 'Today, 2:30 PM' },
  { id: '2', type: 'audio', user: 'Amit S.', duration: '5 mins', amount: '₹50', date: 'Today, 1:15 PM' },
  { id: '3', type: 'chat', user: 'Priya M.', duration: '20 messages', amount: '₹40', date: 'Yesterday, 8:45 PM' },
  { id: '4', type: 'video', user: 'Sneha R.', duration: '30 mins', amount: '₹300', date: 'Yesterday, 5:20 PM' },
  { id: '5', type: 'audio', user: 'Vikram B.', duration: '10 mins', amount: '₹100', date: 'Sep 08, 11:00 AM' },
];

const EarningsDetailScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState('Today');

  const renderIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video size={20} color="#EC1372" />;
      case 'audio': return <Phone size={20} color="#5B0E8B" />;
      case 'chat': return <MessageCircle size={20} color="#F5C542" />;
      default: return <Phone size={20} color="#5B0E8B" />;
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.sessionCard}>
      <View style={styles.iconContainer}>{renderIcon(item.type)}</View>
      <View style={styles.sessionInfo}>
        <Text style={styles.sessionUser}>{item.user}</Text>
        <Text style={styles.sessionMeta}>{item.duration} • {item.date}</Text>
      </View>
      <Text style={styles.sessionAmount}>+{item.amount}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#2A1240" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Session Earnings</Text>
      </View>

      <View style={styles.tabsContainer}>
        {['Today', 'This Week', 'This Month'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={dummySessions}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBF6EC' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#2A1240', marginLeft: 16 },
  tabsContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 10 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#5B0E8B' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#8B7F98' },
  activeTabText: { color: '#5B0E8B' },
  listContent: { padding: 20, paddingTop: 10 },
  sessionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, elevation: 2, borderWidth: 1, borderColor: '#EBDFC4' },
  iconContainer: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FBF6EC', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  sessionInfo: { flex: 1 },
  sessionUser: { fontSize: 16, fontWeight: '600', color: '#2A1240', marginBottom: 4 },
  sessionMeta: { fontSize: 13, color: '#8B7F98' },
  sessionAmount: { fontSize: 16, fontWeight: '700', color: '#10B981' },
});

export default EarningsDetailScreen;
