import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Phone, PhoneMissed, Video } from 'lucide-react-native';

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
  const getCallIcon = () => {
    if (item.type === 'missed') {
      return <PhoneMissed size={16} color="#EC1372" />;
    }
    if (item.media === 'video') {
      return <Video size={16} color="#8A7A9C" />;
    }
    return <Phone size={16} color="#8A7A9C" />;
  };

  const getSubtext = () => {
    if (item.type === 'missed') {
      return 'Missed Call';
    }
    const typeLabel = item.type === 'incoming' ? 'Incoming' : 'Outgoing';
    return `${typeLabel} • ${item.duration}`;
  };

  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.container} onPress={onPress}>
      <View style={styles.avatarWrap}>
        <Image source={{ uri: item.avatarUri }} style={styles.avatar} />
      </View>
      <View style={styles.details}>
        <Text style={[styles.name, item.type === 'missed' && styles.nameMissed]}>
          {item.name}
        </Text>
        <View style={styles.subtextRow}>
          {getCallIcon()}
          <Text style={styles.subtext}>{getSubtext()}</Text>
        </View>
      </View>
      <View style={styles.rightSide}>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1EAF6',
  },
  avatarWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 14,
    backgroundColor: '#F7F5FA',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B0E22',
    marginBottom: 4,
  },
  nameMissed: {
    color: '#EC1372',
  },
  subtextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtext: {
    fontSize: 13,
    color: '#8A7A9C',
    marginLeft: 6,
  },
  rightSide: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  time: {
    fontSize: 12,
    color: '#8A7A9C',
    fontWeight: '500',
  },
});

export default CallHistoryItem;
