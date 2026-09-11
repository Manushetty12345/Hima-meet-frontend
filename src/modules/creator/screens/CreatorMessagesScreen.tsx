import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import CreatorEarningRow, { EarningRecord } from '../components/CreatorEarningRow';

const DUMMY_EARNINGS: EarningRecord[] = [
  { id: 'e1', name: 'Rahul Verma', type: 'voice', duration: '15 mins', coins: 150, earned: 75, time: 'Today, 10:30 AM' },
  { id: 'e2', name: 'Karan S.', type: 'video', duration: '5 mins', coins: 300, earned: 150, time: 'Yesterday, 8:15 PM' },
];

const CreatorMessagesScreen = () => {
  const [activeTab, setActiveTab] = useState<'chats' | 'calls'>('chats');

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Messages</Text>

      {/* Top Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'chats' && styles.activeTab]}
          onPress={() => setActiveTab('chats')}
        >
          <Text style={[styles.tabText, activeTab === 'chats' && styles.activeTabText]}>Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'calls' && styles.activeTab]}
          onPress={() => setActiveTab('calls')}
        >
          <Text style={[styles.tabText, activeTab === 'calls' && styles.activeTabText]}>Calls</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'chats' ? (
          <View style={styles.card}>
            <Text style={styles.emptyText}>No active chats yet.</Text>
          </View>
        ) : (
          <View style={styles.card}>
            {DUMMY_EARNINGS.map(item => (
              <CreatorEarningRow key={item.id} item={item} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 60,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2A1240',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
  },
  activeTab: {
    borderBottomColor: '#5B0E8B',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  activeTabText: {
    color: '#5B0E8B',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyText: {
    color: '#8B7F98',
    textAlign: 'center',
    paddingVertical: 40,
  },
});

export default CreatorMessagesScreen;
