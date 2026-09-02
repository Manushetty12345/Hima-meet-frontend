import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Star } from 'lucide-react-native';

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
        <View style={styles.popularBadge}>
          <Star size={9} color="#FFFFFF" fill="#FFFFFF" />
          <Text style={styles.popularBadgeText}>Popular</Text>
        </View>
      )}

      <Text style={styles.coinGlyph}>🪙</Text>
      <Text style={styles.coinAmount}>{formatCoins(pkg.coins)}</Text>
      <Text style={styles.coinLabel}>Coins</Text>

      <View style={styles.cardBottom}>
        {pkg.savePercent ? (
          <LinearGradient
            colors={['#FF7A45', '#E0116F']}
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
          colors={['#33C6F0', '#0F9DC7']}
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
    borderColor: '#EFE7F3',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 10,
    paddingHorizontal: 6,
    marginBottom: 14,
    shadowColor: '#4A0F6E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardSelected: {
    borderColor: '#EC1372',
    shadowOpacity: 0.14,
    shadowColor: '#EC1372',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#3B6FE0',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  popularBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  coinGlyph: {
    fontSize: 26,
    marginBottom: 6,
  },
  coinAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1B0E22',
  },
  coinLabel: {
    fontSize: 11,
    color: '#9A8FA8',
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
    color: '#FFFFFF',
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
