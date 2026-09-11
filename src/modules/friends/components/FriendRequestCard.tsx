import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Check, X } from 'lucide-react-native';
import apiClient from '../../../api/apiClient';

const TEXT_DARK = '#1A1A2E';
const TEXT_MUTED = '#9B9BAD';

export type FriendRequestItem = {
  id: string;
  name: string;
  avatarUri: string;
  type: 'sent' | 'received' | 'favourite' | 'friend' | 'accepted_by_receiver';
};

interface FriendRequestCardProps {
  item: FriendRequestItem;
  onRemove?: (id: string) => void;
  onAccepted?: () => void; // called after accept to switch tab
}

const STATUS_SUBTITLE: Record<FriendRequestItem['type'], string> = {
  sent: 'Request sent',
  received: 'Wants to connect',
  favourite: 'Favourite',
  friend: 'Friend',
  accepted_by_receiver: 'Accepted your request! Confirm now ✓',
};

const FriendRequestCard: React.FC<FriendRequestCardProps> = ({ item, onRemove, onAccepted }) => {
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
    <View style={styles.card}>
      {/* Avatar with purple/pink gradient ring */}
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

      {/* Name + Status */}
      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
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
    </View>
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
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: TEXT_MUTED,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 10,
  },
  rejectBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFF0EF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFCDD2',
  },
  acceptBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#2ECC71',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FriendRequestCard;