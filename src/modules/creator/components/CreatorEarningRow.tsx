import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Phone, Video, Gift } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

export interface EarningRecord {
  id: string;
  name: string;
  type: 'voice' | 'video' | 'gift';
  duration: string;
  coins: number;
  earned: number;
  time: string;
  avatar_url?: string;
  status?: string;
}

const CreatorEarningRow: React.FC<{ item: EarningRecord }> = ({ item }) => {
  const isVideo = item.type === 'video';
  const isGift = item.type === 'gift';
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.6)']}
        style={styles.cardInner}
      >
        <View style={styles.leftRow}>
          <View style={styles.avatarWrapper}>
            <LinearGradient
              colors={isGift ? ['#F5C542', '#F91970'] : isVideo ? ['#4F46E5', '#06B6D4'] : ['#EC1372', '#F97316']}
              style={styles.avatarRing}
            >
              {item.avatar_url ? (
                <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarFallback} />
              )}
            </LinearGradient>
            
            <View style={[styles.typeBadge, { backgroundColor: isGift ? '#F5C542' : isVideo ? '#4F46E5' : '#EC1372' }]}>
              {isGift ? <Gift size={10} color="#FFF" /> : isVideo ? <Video size={10} color="#FFF" /> : <Phone size={10} color="#FFF" />}
            </View>
          </View>

          <View style={styles.infoCol}>
            <Text style={styles.name}>{item.name}</Text>
            
            {isGift ? (
              <Text style={styles.statusText}>{item.status || 'Sent a Gift'}</Text>
            ) : (
              <Text style={styles.durationText}>
                <Text style={{ fontWeight: '600', color: isVideo ? '#4F46E5' : '#EC1372' }}>{isVideo ? 'Video Call' : 'Audio Call'}</Text> • {item.duration}
              </Text>
            )}
            <Text style={styles.time}>{item.time}</Text>
          </View>
        </View>

        <View style={styles.right}>
          <View style={styles.coinBadge}>
            <Text style={styles.coins}>+{item.coins}</Text>
            <Text style={styles.coinLabel}> COINS</Text>
          </View>
          <Text style={styles.earned}>₹{item.earned.toFixed(2)}</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#3A0F63',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 20,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  avatarRing: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  avatarFallback: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E5E7EB',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  typeBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  infoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 17,
    fontWeight: '800',
    color: '#2A1240',
    marginBottom: 2,
  },
  durationText: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F5C542',
    marginBottom: 2,
  },
  time: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'rgba(245, 197, 66, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
  },
  coins: {
    fontSize: 16,
    fontWeight: '800',
    color: '#D97706',
  },
  coinLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
    marginLeft: 2,
  },
  earned: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10B981',
  },
});

export default CreatorEarningRow;
