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

const getGiftIcon = (status?: string) => {
  const s = (status || '').toLowerCase();
  if (s.includes('rose')) return '🌹';
  if (s.includes('coffee')) return '☕';
  if (s.includes('heart')) return '💖';
  if (s.includes('diamond')) return '💎';
  if (s.includes('crown')) return '👑';
  return '🎁';
};

const CreatorEarningRow: React.FC<{ item: EarningRecord }> = ({ item }) => {
  const isVideo = item.type === 'video';
  const isGift = item.type === 'gift';
  
  return (
    <View style={styles.card}>
      <View style={styles.cardInner}>
        <View style={styles.leftRow}>
          <View style={styles.avatarWrapper}>
            <LinearGradient
              colors={['#9C27B0', '#5B0E8B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarRing}
            >
              <View style={styles.avatarInner}>
              {item.avatar_url ? (
                <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarFallback} />
              )}
              </View>
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
          {!isGift && (
            <Text style={{ fontSize: 10, color: '#8B7F98', marginBottom: 2, textAlign: 'right', fontWeight: '500' }}>
              Earned Coins
            </Text>
          )}
          <View style={styles.coinBadge}>
            {isGift && (
              <Text style={{ fontSize: 14, marginRight: 4 }}>
                {getGiftIcon(item.status)}
              </Text>
            )}
            <Text style={styles.coins}>+{item.coins}</Text>
            <Text style={styles.coinLabel}> COINS</Text>
          </View>
          <Text style={styles.earned}>₹{item.earned.toFixed(2)}</Text>
        </View>
      </View>

      {/* Extraordinary Breakdown */}
      {!isGift && item.attachedGifts && item.attachedGifts.length > 0 && (
        <View style={styles.breakdownContainer}>
          <View style={styles.breakdownDivider} />
          <Text style={styles.breakdownTitle}>Earnings Breakdown</Text>
          
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLeft}>
              {isVideo ? <Video size={14} color="#8B7F98" /> : <Phone size={14} color="#8B7F98" />}
              <Text style={styles.breakdownText}>{isVideo ? 'Video Call' : 'Audio Call'}</Text>
            </View>
            <Text style={styles.breakdownCoins}>+{item.originalCallCoins} Coins</Text>
          </View>

          {item.attachedGifts.map((g: any, i: number) => {
             const shortName = (g.status || '').replace('Gifted ', '').trim();
             return (
               <View key={i} style={styles.breakdownRow}>
                 <View style={styles.breakdownLeft}>
                   <Text style={{ fontSize: 14, marginRight: 6 }}>{getGiftIcon(g.status)}</Text>
                   <Text style={styles.breakdownText}>{shortName}</Text>
                 </View>
                 <Text style={styles.breakdownGiftCoins}>+{g.earnings_coins} Coins</Text>
               </View>
             );
          })}

          <View style={styles.breakdownTotalRow}>
            <Text style={styles.breakdownTotalText}>Total Earned</Text>
            <View style={styles.breakdownTotalBadge}>
              <Text style={styles.breakdownTotalCoins}>+{item.coins} COINS</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#4A0F6E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    flex: 1,
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
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
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
    width: 44,
    height: 44,
    borderRadius: 22,
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
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  durationText: {
    fontSize: 13,
    color: '#9B9BAD',
    marginBottom: 2,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F5C542',
    marginBottom: 2,
  },
  time: {
    fontSize: 12,
    color: '#9B9BAD',
    fontWeight: '500',
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
  breakdownContainer: {
    backgroundColor: '#FBF8FE',
    borderTopWidth: 1,
    borderTopColor: '#F0E6FA',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  breakdownDivider: {
    height: 4,
    width: 32,
    backgroundColor: '#E5D5F5',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  breakdownTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8B7F98',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F5EDFC',
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D2D3F',
    marginLeft: 6,
  },
  breakdownCoins: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4F46E5',
  },
  breakdownGiftCoins: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D97706',
  },
  breakdownTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0E6FA',
  },
  breakdownTotalText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A1A2E',
  },
  breakdownTotalBadge: {
    backgroundColor: '#4A0F6E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  breakdownTotalCoins: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

export default CreatorEarningRow;
