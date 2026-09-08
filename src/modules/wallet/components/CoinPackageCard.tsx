import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Star } from 'lucide-react-native';

// ---- Palette pulled from the Himameet mark ----
const PLUM_ROYAL = '#5B0E8B';
const PLUM_DEEP = '#3D0A63';
const GOLD = '#F5C542';
const GOLD_DEEP = '#D4AF37';
const IVORY_LINE = '#EBDFC4';
const TEXT_PLUM = '#2A1240';
const TEXT_MUTED = '#8B7F98';

export type CoinPackage = {
  id: string;
  coins: number;
  price: number;
  savePercent?: number;
  popular?: boolean;
};

interface CoinPackageCardProps {
  pkg: CoinPackage;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const formatCoins = (value: number) => value.toLocaleString('en-IN');

const CoinPackageCard: React.FC<CoinPackageCardProps> = ({ pkg, isSelected, onSelect }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => onSelect(pkg.id)}
      style={[styles.card, isSelected && styles.cardSelected]}
    >
      {pkg.popular && (
        <LinearGradient colors={[GOLD, GOLD_DEEP]} style={styles.popularBadge}>
          <Star size={9} color="#2A1240" fill="#2A1240" />
          <Text style={styles.popularBadgeText}>Popular</Text>
        </LinearGradient>
      )}

      <Text style={styles.coinGlyph}>🪙</Text>
      <Text style={styles.coinAmount}>{formatCoins(pkg.coins)}</Text>
      <Text style={styles.coinLabel}>Coins</Text>

      <View style={styles.cardBottom}>
        {pkg.savePercent ? (
          <LinearGradient
            colors={[GOLD, GOLD_DEEP]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveBadge}
          >
            <Text style={styles.saveBadgeText}>Save {pkg.savePercent}%</Text>
          </LinearGradient>
        ) : (
          <View style={styles.saveBadgeSpacer} />
        )}

        <LinearGradient
          colors={[PLUM_ROYAL, PLUM_DEEP]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.pricePill}
        >
          <Text style={styles.priceText}>₹{pkg.price}</Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '31.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 10,
    paddingHorizontal: 6,
    marginBottom: 14,
    shadowColor: '#3A0F63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardSelected: {
    borderColor: GOLD_DEEP,
    borderWidth: 1.75,
    backgroundColor: 'rgba(245, 197, 66, 0.06)',
    shadowOpacity: 0.14,
    shadowColor: GOLD_DEEP,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  popularBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#2A1240',
  },
  coinGlyph: {
    fontSize: 26,
    marginBottom: 6,
  },
  coinAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT_PLUM,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  coinLabel: {
    fontSize: 11,
    color: TEXT_MUTED,
    marginBottom: 10,
  },
  cardBottom: {
    width: '100%',
    alignItems: 'center',
  },
  saveBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: -8,
    zIndex: 2,
  },
  saveBadgeSpacer: {
    height: 15,
  },
  saveBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#2A1240',
  },
  pricePill: {
    width: '100%',
    borderRadius: 12,
    paddingTop: 14,
    paddingBottom: 8,
    alignItems: 'center',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

export default CoinPackageCard;