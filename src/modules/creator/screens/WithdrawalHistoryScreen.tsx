import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { ArrowLeft, Clock, CheckCircle2, XCircle } from 'lucide-react-native';

const dummyHistory = [
  { id: '1', amount: '₹10,500', date: 'Sep 09, 2026', time: '10:30 AM', status: 'pending', account: 'HDFC ****4582' },
  { id: '2', amount: '₹25,000', date: 'Sep 01, 2026', time: '02:15 PM', status: 'completed', account: 'HDFC ****4582' },
  { id: '3', amount: '₹5,000', date: 'Aug 15, 2026', time: '11:45 AM', status: 'completed', account: 'HDFC ****4582' },
  { id: '4', amount: '₹8,200', date: 'Aug 02, 2026', time: '04:20 PM', status: 'failed', account: 'SBI ****1120' },
];

const WithdrawalHistoryScreen = ({ navigation }: any) => {
  const renderStatus = (status: string) => {
    switch (status) {
      case 'pending': return <View style={[styles.statusBadge, { backgroundColor: 'rgba(245, 197, 66, 0.15)' }]}><Clock size={14} color="#D4AF37" /><Text style={[styles.statusText, { color: '#D4AF37' }]}>Pending</Text></View>;
      case 'completed': return <View style={[styles.statusBadge, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}><CheckCircle2 size={14} color="#10B981" /><Text style={[styles.statusText, { color: '#10B981' }]}>Completed</Text></View>;
      case 'failed': return <View style={[styles.statusBadge, { backgroundColor: 'rgba(236, 19, 114, 0.15)' }]}><XCircle size={14} color="#EC1372" /><Text style={[styles.statusText, { color: '#EC1372' }]}>Failed</Text></View>;
      default: return null;
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.amount}>{item.amount}</Text>
        {renderStatus(item.status)}
      </View>
      <View style={styles.divider} />
      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.label}>Date & Time</Text>
          <Text style={styles.value}>{item.date}, {item.time}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.label}>Transfer To</Text>
          <Text style={styles.value}>{item.account}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#2A1240" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Withdrawal History</Text>
      </View>

      <FlatList
        data={dummyHistory}
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
  listContent: { padding: 20 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#EBDFC4', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  amount: { fontSize: 20, fontWeight: '800', color: '#2A1240' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '600', marginLeft: 4, textTransform: 'capitalize' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 12, color: '#8B7F98', marginBottom: 2 },
  value: { fontSize: 13, fontWeight: '600', color: '#2A1240' },
});

export default WithdrawalHistoryScreen;
