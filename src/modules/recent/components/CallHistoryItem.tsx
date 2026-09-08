import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Phone, PhoneMissed, Video } from 'lucide-react-native';

// ---- Palette pulled from the Himameet mark ----
const PLUM_ROYAL = '#5B0E8B';
const GOLD_DEEP = '#D4AF37';
const IVORY_LINE = '#EBDFC4';
const RUST_MISSED = '#B23A2E';
const TEXT_PLUM = '#2A1240';
const TEXT_MUTED = '#8B7F98';

export type CallType = 'incoming' | 'outgoing' | 'missed';
export type CallMediaType = 'audio' | 'video';

export interface CallHistoryRecord {
  id: string;
  name: string;
  avatarUri: string;
  type: CallType;
  media: CallMediaType;
  time: string;
  duration?: string; // e.g., '5 mins', undefined if missed
}

interface CallHistoryItemProps {
  item: CallHistoryRecord;
  onPress?: () => void;
}

const CallHistoryItem: React.FC<CallHistoryItemProps> = ({ item, onPress }) => {
  const isMissed = item.type === 'missed';

  const getCallIcon = () => {
    if (isMissed) {
      return <PhoneMissed size={14} color={RUST_MISSED} strokeWidth={2.25} />;
    }
    if (item.media === 'video') {
      return <Video size={14} color={GOLD_DEEP} strokeWidth={2.25} />;
    }
    return <Phone size={14} color={GOLD_DEEP} strokeWidth={2.25} />;
  };

  const getSubtext = () => {
    if (isMissed) {
      return 'Missed call';
    }
    const typeLabel = item.type === 'incoming' ? 'Incoming' : 'Outgoing';
    return `${typeLabel} · ${item.duration}`;
  };

  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.container} onPress={onPress}>
      <View style={styles.avatarWrap}>
        <Image source={{ uri: item.avatarUri }} style={styles.avatar} />
      </View>

      <View style={styles.details}>
        <Text style={[styles.name, isMissed && styles.nameMissed]} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.subtextRow}>
          {getCallIcon()}
          <Text style={[styles.subtext, isMissed && styles.subtextMissed]}>
            {getSubtext()}
          </Text>
        </View>
      </View>

      <Text style={styles.time}>{item.time}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: IVORY_LINE,
  },
  avatarWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 14,
    backgroundColor: '#F6EFDD',
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 15.5,
    fontWeight: '700',
    color: TEXT_PLUM,
    marginBottom: 4,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  nameMissed: {
    color: RUST_MISSED,
  },
  subtextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subtext: {
    fontSize: 12.5,
    color: TEXT_MUTED,
    fontWeight: '500',
  },
  subtextMissed: {
    color: RUST_MISSED,
  },
  time: {
    fontSize: 12,
    color: TEXT_MUTED,
    fontWeight: '600',
  },
});

export default CallHistoryItem;