import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Phone, Video } from 'lucide-react-native';

export interface EarningRecord {
  id: string;
  name: string;
  type: 'voice' | 'video';
  duration: string;
  coins: number;
  earned: number;
  time: string;
}

const CreatorEarningRow: React.FC<{ item: EarningRecord }> = ({ item }) => {
  const isVideo = item.type === 'video';
  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        <View style={[styles.iconBox, { backgroundColor: isVideo ? '#E0E7FF' : '#FFE4E6' }]}>
          {isVideo
            ? <Video size={18} color="#4F46E5" />
            : <Phone size={18} color="#EC1372" />}
        </View>
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={[styles.type, { color: isVideo ? '#4F46E5' : '#EC1372' }]}>
            {isVideo ? 'Video' : 'Voice'} • {item.duration}
          </Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.coins}>+{item.coins} Coins</Text>
        <Text style={styles.earned}>₹{item.earned} Earned</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  type: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  time: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  right: {
    alignItems: 'flex-end',
  },
  coins: {
    fontSize: 15,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 4,
  },
  earned: {
    fontSize: 12,
    color: '#6B7280',
  },
});

export default CreatorEarningRow;
