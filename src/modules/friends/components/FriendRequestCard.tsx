import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Check, CheckCheck, X } from 'lucide-react-native';
import apiClient from '../../../api/apiClient';

const TEXT_DARK = '#1A1A2E';
const TEXT_MUTED = '#9B9BAD';

export type FriendRequestItem = {
  id: string;
  name: string;
  avatarUri: string;
  type: 'sent' | 'received' | 'favourite' | 'friend' | 'accepted_by_receiver';
  lastMessage?: string;
  lastMessageStatus?: 'sent' | 'delivered' | 'read';
  lastMessageSenderId?: string | number;
  lastMessageTime?: string | Date;
  unreadCount?: number;
  conversationId?: string | number;
  isOnline?: boolean;
};

interface FriendRequestCardProps {
  item: FriendRequestItem;
  onRemove?: (id: string) => void;
  onAccepted?: () => void; // called after accept to switch tab
  onPress?: () => void;
  currentUserId?: string | number; // To know if we should show ticks
  isTyping?: boolean; // New prop for typing indicator
}

const STATUS_SUBTITLE: Record<FriendRequestItem['type'], string> = {
  sent: 'Request sent',
  received: 'Wants to be friends',
  favourite: 'Favourite',
  friend: 'Friend',
  accepted_by_receiver: 'Accepted your request! Confirm now ✓',
};

const formatMessageDate = (dateVal?: string | Date) => {
  if (!dateVal) return '';
  const date = new Date(dateVal);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (now.toDateString() === date.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (yesterday.toDateString() === date.toDateString()) {
    return 'Yesterday';
  }

  if (diffDays < 7) {
    return date.toLocaleDateString(undefined, { weekday: 'long' }); // e.g., Monday
  }
  
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); // e.g., Oct 12
};

const FriendRequestCard: React.FC<FriendRequestCardProps> = ({ item, onRemove, onAccepted, onPress, currentUserId, isTyping }) => {
  const subtitle = STATUS_SUBTITLE[item.type];
  const [accepting, setAccepting] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const handleAccept = async () => {
    setAccepting(true);
    try {
      if (item.type === 'accepted_by_receiver') {
        // Male confirming: creates actual friendship
        await apiClient.post('/api/friends/confirm', { target_user_id: item.id });
      } else {
        // Female accepting: sets status to accepted_by_receiver
        await apiClient.post('/api/friends/accept', { target_user_id: item.id });
      }
      onRemove?.(item.id);
      onAccepted?.();
    } catch (e) {
      console.log('Accept friend request error:', e);
    } finally {
      setAccepting(false);
    }
  };

  const handleReject = async () => {
    setRejecting(true);
    try {
      await apiClient.post('/api/friends/cancel', { target_user_id: item.id });
      onRemove?.(item.id);
    } catch (e) {
      console.log('Reject friend request error:', e);
    } finally {
      setRejecting(false);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={onPress ? 0.8 : 1}
      onPress={onPress}
      disabled={!onPress}
    >
      {/* Avatar with purple/pink gradient ring */}
      <LinearGradient
        colors={['#C850C0', '#FF1493']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.avatarRing}
      >
        <View style={styles.avatarInner}>
          <Image source={{ uri: item.avatarUri }} style={styles.avatar} />
          {item.isOnline && <View style={styles.onlineDot} />}
        </View>
      </LinearGradient>

      {/* Name + Status/Message */}
      <View style={styles.textContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <View style={styles.rightStatsContainer}>
            {item.type === 'friend' && item.lastMessageTime && (
              <Text style={[styles.timeText, item.unreadCount ? { color: '#FF1493', fontWeight: '700' } : {}]}>
                {formatMessageDate(item.lastMessageTime)}
              </Text>
            )}
          </View>
        </View>
        {item.type === 'friend' ? (
          <View style={styles.lastMessageRow}>
            {isTyping ? (
              <Text style={styles.typingText} numberOfLines={1}>Typing...</Text>
            ) : (
              <>
                <Text style={[styles.subtitle, item.unreadCount ? { color: TEXT_DARK, fontWeight: '600' } : {}]} numberOfLines={1}>
                  {item.lastMessage || subtitle}
                </Text>
              </>
            )}
            <View style={styles.flexSpacer} />
            {!!item.unreadCount && item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        ) : (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
      </View>

      {/* Accept / Reject buttons — for received OR accepted_by_receiver */}
      {(item.type === 'received' || item.type === 'accepted_by_receiver') && (
        <View style={styles.actionsRow}>
          {/* Reject Button */}
          <TouchableOpacity
            style={styles.rejectBtn}
            onPress={handleReject}
            disabled={rejecting || accepting}
            activeOpacity={0.8}
          >
            {rejecting ? (
              <ActivityIndicator size="small" color="#FF3B30" />
            ) : (
              <X size={20} color="#FF3B30" strokeWidth={2.5} />
            )}
          </TouchableOpacity>

          {/* Accept Button */}
          <TouchableOpacity
            style={styles.acceptBtn}
            onPress={handleAccept}
            disabled={accepting || rejecting}
            activeOpacity={0.8}
          >
            {accepting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Check size={20} color="#FFFFFF" strokeWidth={2.5} />
            )}
          </TouchableOpacity>
        </View>
      )}
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
    gap: 4,
  },
  lastMessageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tickContainer: {
    marginRight: 2,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: TEXT_DARK,
    flex: 1,
    marginRight: 8,
  },
  timeText: {
    fontSize: 12,
    color: TEXT_MUTED,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 13,
    color: TEXT_MUTED,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 8,
  },
  rejectBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFE5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#00D15C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CD964', // bright green
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 10,
  },
  rightStatsContainer: {
    alignItems: 'flex-end',
  },
  typingText: {
    fontSize: 13,
    color: '#FF1493', // pink
    fontWeight: '500',
    fontStyle: 'italic',
  },
  flexSpacer: {
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#FF1493',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  }
});

export default FriendRequestCard;