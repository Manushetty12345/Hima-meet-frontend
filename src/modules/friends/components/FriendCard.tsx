import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Phone, Video, Pin, Bell, BellOff } from 'lucide-react-native';

const TEXT_DARK = '#1A1A2E';
const TEXT_MUTED = '#9B9BAD';

export type FriendItem = {
  id: string;
  name: string;
  avatarUri: string;
  lastMessage?: string;
  isOnline?: boolean;
  callRate?: number;
  videoRate?: number;
};

interface FriendCardProps {
  item: FriendItem;
  onPress: () => void;
  onCall: () => void;
  onVideoCall: () => void;
  onShowToast: (message: string, type?: 'error' | 'info', icon?: React.ReactNode) => void;
}

const FriendCard: React.FC<FriendCardProps> = ({ item, onPress, onCall, onVideoCall, onShowToast }) => {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      onShowToast(`Notifications turned off for ${item.name}`);
    } else {
      onShowToast(`You'll be notified when ${item.name} comes online`, 'info', <Bell size={16} color="#FF1493" />);
    }
  };

  const handleAudioCall = () => {
    if (!item.isOnline) {
      onShowToast('This user is not available for audio calls right now.', 'error');
    } else {
      onCall();
    }
  };

  const handleVideoCall = () => {
    if (!item.isOnline) {
      onShowToast('This user is not available for video calls right now.', 'error');
    } else {
      onVideoCall();
    }
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
      {/* Avatar with purple ring */}
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

      {/* Name + Message */}
      <View style={styles.textContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <TouchableOpacity onPress={toggleMute} style={styles.iconBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            {isMuted ? (
              <BellOff size={14} color="#9CA3AF" />
            ) : (
              <Bell size={14} color="#FF1493" />
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.lastMessageText} numberOfLines={1}>
          {item.lastMessage || 'No messages yet'}
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <View style={styles.callAction}>
          <TouchableOpacity onPress={handleAudioCall} style={[styles.callBtn, item.isOnline && styles.callBtnOnline]}>
            <Phone size={18} color={item.isOnline ? '#FF1493' : '#9CA3AF'} fill={item.isOnline ? '#FF1493' : '#9CA3AF'} />
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
          <TouchableOpacity onPress={handleVideoCall} style={[styles.callBtn, item.isOnline && styles.callBtnOnline]}>
            <Video size={18} color={item.isOnline ? '#FF1493' : '#9CA3AF'} fill={item.isOnline ? '#FF1493' : '#9CA3AF'} />
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
  avatarRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
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
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
    flex: 1,
  },
  iconBtn: {
    padding: 2,
  },
  lastMessageText: {
    fontSize: 13,
    color: TEXT_MUTED,
    marginTop: 4,
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

export default FriendCard;
