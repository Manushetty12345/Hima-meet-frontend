import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Phone, Video, Clock } from 'lucide-react-native';

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
  callRate?: number;
  videoRate?: number;
}

interface CallHistoryItemProps {
  item: CallHistoryRecord;
  onPress?: () => void;
  onCall?: () => void;
  onVideoCall?: () => void;
}

const CallHistoryItem: React.FC<CallHistoryItemProps> = ({ item, onPress, onCall, onVideoCall }) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
      {/* Left Column: Avatar + Duration */}
      <View style={styles.leftContainer}>
        <LinearGradient
          colors={['#C850C0', '#FF1493']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatarRing}
        >
          <View style={styles.avatarInner}>
            <Image source={{ uri: item.avatarUri }} style={styles.avatar} />
          </View>
        </LinearGradient>
        <View style={styles.durationRow}>
          <Clock size={12} color="#FF1493" strokeWidth={2.5} />
          <Text style={styles.durationText}>{item.duration}</Text>
        </View>
      </View>

      {/* Middle Column: Name + Time */}
      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <View style={styles.timePill}>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
      </View>

      {/* Right Column: Actions */}
      <View style={styles.actionsContainer}>
        <View style={styles.callAction}>
          <TouchableOpacity onPress={onCall} style={[styles.callBtn, item.isOnline && styles.callBtnOnline]}>
            <Phone size={18} color={item.isOnline ? '#9CA3AF' : '#9CA3AF'} fill={item.isOnline ? '#9CA3AF' : '#9CA3AF'} />
          </TouchableOpacity>
          {item.isOnline ? (
            <View style={styles.rateContainer}>
              <View style={styles.coinBadge}>
                <Text style={styles.coinBadgeText}>H</Text>
              </View>
              <Text style={styles.rateText}>{item.callRate || 20}/min</Text>
            </View>
          ) : (
            <Text style={styles.offlineText}>Offline</Text>
          )}
        </View>

        <View style={styles.verticalDivider} />

        <View style={styles.callAction}>
          <TouchableOpacity onPress={onVideoCall} style={[styles.callBtn, item.isOnline && styles.videoBtnOnline]}>
            <Video size={18} color={item.isOnline ? '#A822D1' : '#9CA3AF'} fill={item.isOnline ? '#A822D1' : '#9CA3AF'} />
          </TouchableOpacity>
          {item.isOnline ? (
            <View style={styles.rateContainer}>
              <View style={styles.coinBadge}>
                <Text style={styles.coinBadgeText}>H</Text>
              </View>
              <Text style={styles.rateText}>{item.videoRate || 40}/min</Text>
            </View>
          ) : (
            <Text style={styles.offlineText}>Offline</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#4A0F6E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  leftContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  avatarRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    color: '#FF1493',
    fontWeight: '700',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 10,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 8,
  },
  timePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timeText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callAction: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
  },
  verticalDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  callBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  callBtnOnline: {
    borderColor: '#FCE7F3',
  },
  videoBtnOnline: {
    borderColor: '#F3E8FF',
  },
  offlineText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  coinBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FBC02D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinBadgeText: {
    fontSize: 8,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  rateText: {
    fontSize: 11,
    color: TEXT_DARK,
    fontWeight: '600',
  },
});

export default CallHistoryItem;