import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Phone, Video, Pin, Bell, BellOff } from 'lucide-react-native';
import apiClient from '../../../api/apiClient';

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
  callAvailable?: boolean;
    videoAvailable?: boolean;
    isPinned?: boolean;
  };

interface FriendCardProps {
  item: FriendItem;
  onPress: () => void;
  onCall: () => void;
  onVideoCall: () => void;
  onShowToast: (message: string, type?: 'error' | 'info', showLogo?: boolean) => void;
}

const FriendCard: React.FC<FriendCardProps> = ({ item, onPress, onCall, onVideoCall, onShowToast }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isPinned, setIsPinned] = useState(item.isPinned || false);

  const isAudioAvailable = item.isOnline && item.callAvailable !== false;
  const isVideoAvailable = item.isOnline && item.videoAvailable !== false;

  const toggleMute = async () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    // isMuted means notifications are OFF. So if newMutedState is false, enabled is true.
    const enableNotifications = !newMutedState;

    try {
      await apiClient.post(`/api/creator/${item.id}/notify-online`, { enabled: enableNotifications });
    } catch (err) {
      console.error('Failed to toggle notification', err);
    }

    if (newMutedState) {
      onShowToast(`Notifications off for ${item.name}`, 'info', true);
    } else {
      onShowToast(`You will be notified when ${item.name} comes online`, 'info', true);
    }
  };

  
    const togglePin = async () => {
      const newPinnedState = !isPinned;
      setIsPinned(newPinnedState);
      
      try {
        await apiClient.post(`/api/friends/${item.id}/pin`);
      } catch (err) {
        console.error('Failed to toggle pin', err);
      }

      if (newPinnedState) {
        onShowToast('Chat pinned', 'info', true);
      } else {
        onShowToast('Chat unpinned', 'info', true);
      }
    };

  const handleAudioCall = () => {
    if (!item.isOnline) {
      onShowToast('This user is not available for audio calls right now.', 'error');
    } else if (item.callAvailable === false) {
      onShowToast('This user has turned off audio calls.', 'error');
    } else {
      onCall();
    }
  };

  const handleVideoCall = () => {
    if (!item.isOnline) {
      onShowToast('This user is not available for video calls right now.', 'error');
    } else if (item.videoAvailable === false) {
      onShowToast('This user has turned off video calls.', 'error');
    } else {
      onVideoCall();
    }
  };

  return (
    <View style={styles.card}>
      {/* Avatar with purple ring */}
      <LinearGradient
        colors={['#EC4899', '#A855F7']}
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
        </View>
        <TouchableOpacity style={styles.chatNowBtn} onPress={onPress} activeOpacity={0.7}>
          <Text style={styles.chatNowText}>Chat Now</Text>
        </TouchableOpacity>
      </View>

      {/* Right Column: Top Icons + Actions */}
      <View style={styles.rightColumn}>
        
        {/* Top Icons */}
        <View style={styles.topIconsRow}>
          <TouchableOpacity onPress={togglePin} style={styles.topIconBtn}>
              <Pin size={17} color={isPinned ? "#9C27B0" : "#6B7280"} fill={isPinned ? "#9C27B0" : "transparent"} />
            </TouchableOpacity>
          <TouchableOpacity onPress={toggleMute} style={styles.topIconBtn}>
            {isMuted ? (
              <BellOff size={17} color="#6B7280" />
            ) : (
              <Bell size={17} color="#6B7280" />
            )}
          </TouchableOpacity>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <View style={styles.callAction}>
            <TouchableOpacity onPress={handleAudioCall} style={[styles.callBtn, isAudioAvailable && styles.callBtnOnline]}>
              <Phone size={14} color={isAudioAvailable ? '#9C27B0' : '#D1D5DB'} fill={isAudioAvailable ? '#9C27B0' : '#D1D5DB'} />
            </TouchableOpacity>
            {isAudioAvailable ? (
              <View style={styles.rateContainer}>
                <View style={styles.coinBadge}>
                  <Text style={styles.coinBadgeText}>H</Text>
                </View>
                <Text style={styles.rateText}>{Math.round(Number(item.callRate)) || 20}/min</Text>
              </View>
            ) : (
              <Text style={styles.offlineText}>Offline</Text>
            )}
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.callAction}>
            <TouchableOpacity onPress={handleVideoCall} style={[styles.callBtn, isVideoAvailable && styles.callBtnOnline]}>
              <Video size={14} color={isVideoAvailable ? '#9C27B0' : '#D1D5DB'} fill={isVideoAvailable ? '#9C27B0' : '#D1D5DB'} />
            </TouchableOpacity>
            {isVideoAvailable ? (
              <View style={styles.rateContainer}>
                <View style={styles.coinBadge}>
                  <Text style={styles.coinBadgeText}>H</Text>
                </View>
                <Text style={styles.rateText}>{Math.round(Number(item.videoRate)) || 40}/min</Text>
              </View>
            ) : (
              <Text style={styles.offlineText}>Offline</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
    marginBottom: 6,
    shadowColor: '#4A0F6E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarRing: {
      width: 52,
      height: 52,
      borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarInner: {
      width: 48,
      height: 48,
      borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  avatar: {
      width: 46,
      height: 46,
      borderRadius: 23,
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
  chatNowBtn: {
    borderWidth: 1.5,
    borderColor: '#EC4899',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  chatNowText: {
    color: '#EC4899',
    fontSize: 12,
    fontWeight: '600',
  },
  
  rightColumn: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  topIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    paddingRight: 8,
  },
  topIconBtn: {
    padding: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  callAction: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
  },
  verticalDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 6,
  },
  callBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
    borderColor: '#F3E5F5',
  },
  offlineText: {
    fontSize: 9,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  coinBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FBC02D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinBadgeText: {
    fontSize: 7,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  rateText: {
    fontSize: 9,
    color: TEXT_DARK,
    fontWeight: '600',
  },
});

export default FriendCard;
