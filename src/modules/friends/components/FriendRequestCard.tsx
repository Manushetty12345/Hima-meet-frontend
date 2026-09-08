import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Heart, Star, Clock, Users } from 'lucide-react-native';

// ---- Palette pulled from the Himameet mark ----
const PLUM_ROYAL = '#5B0E8B';
const GOLD = '#F5C542';
const GOLD_DEEP = '#D4AF37';
const IVORY = '#FBF6EC';
const IVORY_LINE = '#EBDFC4';
const TEXT_PLUM = '#2A1240';
const TEXT_MUTED = '#8B7F98';

export type FriendRequestItem = {
  id: string;
  name: string;
  avatarUri: string;
  type: 'sent' | 'received' | 'favourite' | 'friend';
};

interface FriendRequestCardProps {
  item: FriendRequestItem;
}

// Each relationship state gets its own quiet badge — the color and
// icon carry the meaning, so the label itself can stay short and calm.
const STATUS_CONFIG: Record<
  FriendRequestItem['type'],
  { label: string; icon: typeof Heart; tint: string; tintSoft: string }
> = {
  received: { label: 'Wants to connect', icon: Heart, tint: PLUM_ROYAL, tintSoft: 'rgba(91, 14, 139, 0.09)' },
  sent: { label: 'Pending', icon: Clock, tint: TEXT_MUTED, tintSoft: 'rgba(139, 127, 152, 0.10)' },
  favourite: { label: 'Favourite', icon: Star, tint: GOLD_DEEP, tintSoft: 'rgba(212, 175, 55, 0.12)' },
  friend: { label: 'Friend', icon: Users, tint: PLUM_ROYAL, tintSoft: 'rgba(91, 14, 139, 0.07)' },
};

const FriendRequestCard: React.FC<FriendRequestCardProps> = ({ item }) => {
  const status = STATUS_CONFIG[item.type];
  const StatusIcon = status.icon;

  return (
    <View style={styles.card}>
      <LinearGradient
        colors={[GOLD, GOLD_DEEP]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.avatarRing}
      >
        <View style={styles.avatarInner}>
          <Image source={{ uri: item.avatarUri }} style={styles.avatar} />
        </View>
      </LinearGradient>

      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={[styles.statusPill, { backgroundColor: status.tintSoft }]}>
          <StatusIcon size={11} color={status.tint} strokeWidth={2.25} />
          <Text style={[styles.statusText, { color: status.tint }]}>{status.label}</Text>
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
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#3A0F63',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarInner: {
    width: 46,
    height: 46,
    borderRadius: 23,
    padding: 2,
    backgroundColor: IVORY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 15.5,
    fontWeight: '700',
    color: TEXT_PLUM,
    marginBottom: 6,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
});

export default FriendRequestCard;