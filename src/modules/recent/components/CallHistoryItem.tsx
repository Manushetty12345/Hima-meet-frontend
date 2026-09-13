import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Phone, Video, Clock, Coins } from 'lucide-react-native';

const TEXT_DARK = '#1A1A2E';
const TEXT_MUTED = '#9B9BAD';

export type CallType = 'incoming' | 'outgoing' | 'missed';
export type CallMediaType = 'audio' | 'video';

export interface CallHistoryRecord {
  id: string;
  name: string;
  avatarUri: string;
  type: CallType;
  media: CallMediaType;
  time: string;
  duration?: string;
  isOnline?: boolean;
  coinsEarned?: number;
}

interface CallHistoryItemProps {
  item: CallHistoryRecord;
  onPress?: () => void;
  onCall?: () => void;
  onVideoCall?: () => void;
}

const CallHistoryItem: React.FC<CallHistoryItemProps> = ({ item, onPress, onCall, onVideoCall }) => {
  return (
    <View style={styles.cardWrapper}>
      <LinearGradient colors={['#1E132D', '#120B1C']} style={styles.card}>
        {/* Left Column: Avatar */}
        <View style={styles.leftContainer}>
          <LinearGradient
            colors={item.type === 'missed' ? ['#EF4444', '#B91C1C'] : ['#D4AF37', '#FFDF00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarRing}
          >
            <View style={styles.avatarInner}>
              <Image source={{ uri: item.avatarUri }} style={styles.avatar} />
            </View>
          </LinearGradient>
        </View>

        {/* Middle Column: Name + Time + Type */}
        <View style={styles.textContainer}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <View style={styles.detailsRow}>
            {item.media === 'video' ? (
              <Video size={12} color="#9CA3AF" />
            ) : (
              <Phone size={12} color="#9CA3AF" />
            )}
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
          <View style={styles.durationRow}>
            <Clock size={12} color={item.type === 'missed' ? '#EF4444' : '#10B981'} />
            <Text style={[styles.durationText, item.type === 'missed' && { color: '#EF4444' }]}>
              {item.type === 'missed' ? 'Missed Call' : item.duration}
            </Text>
          </View>
        </View>

        {/* Right Column: Earnings */}
        <View style={styles.earningsContainer}>
          <Text style={styles.earningsLabel}>Earned</Text>
          <View style={styles.coinsRow}>
            <Coins size={14} color="#D4AF37" style={{ marginRight: 4 }} />
            <Text style={styles.coinsAmount}>+{item.coinsEarned}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  leftContainer: {
    marginRight: 16,
  },
  avatarRing: {
    width: 54,
    height: 54,
    borderRadius: 27,
    padding: 2,
  },
  avatarInner: {
    flex: 1,
    backgroundColor: '#1E132D',
    borderRadius: 25,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginLeft: 4,
  },
  earningsContainer: {
    alignItems: 'flex-end',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  earningsLabel: {
    fontSize: 10,
    color: '#D4AF37',
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  coinsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinsAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFF',
  },
});

export default CallHistoryItem;