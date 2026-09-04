import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Mars, Venus } from 'lucide-react-native';

type Gender = 'male' | 'female';

interface GenderCardProps {
  gender: Gender;
  selectedGender: Gender | null;
  onSelect: (gender: Gender) => void;
}

// ---- Palette pulled from the Himameet mark ----
const PLUM_ROYAL = '#5B0E8B';
const GOLD = '#F5C542';
const GOLD_DEEP = '#D4AF37';
const IVORY = '#FBF6EC';
const IVORY_LINE = '#EBDFC4';
const TEXT_PLUM = '#2A1240';
const TEXT_MUTED = '#8B7F98';

const GenderCard: React.FC<GenderCardProps> = ({ gender, selectedGender, onSelect }) => {
  const isSelected = selectedGender === gender;
  const isMale = gender === 'male';
  const Icon = isMale ? Mars : Venus;
  const label = isMale ? 'Male' : 'Female';
  const subLabel = isMale ? 'Connect with creators' : 'Become a creator';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onSelect(gender)}
      style={[styles.card, isSelected && styles.cardActive]}
    >


      <LinearGradient
        colors={isSelected ? [GOLD, GOLD_DEEP] : ['#F1E9D8', '#F1E9D8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.iconCircle, isSelected && styles.iconCircleActive]}
      >
        <Icon size={26} color={isSelected ? '#2A1240' : '#B8A9C9'} />
      </LinearGradient>
      <Text style={[styles.label, isSelected && styles.labelActive]}>{label}</Text>
      <Text style={styles.subLabel}>{subLabel}</Text>


    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    borderRadius: 20,
    paddingVertical: 22,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  cardActive: {
    borderColor: GOLD_DEEP,
    borderWidth: 1.75,
    backgroundColor: 'rgba(245, 197, 66, 0.06)',
    shadowColor: GOLD_DEEP,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 5,
  },
  cardGlow: {
    position: 'absolute',
    top: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(245, 197, 66, 0.16)',
  },
  cornerFlourish: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.55)',
    borderTopRightRadius: 8,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconCircleActive: {
    shadowColor: GOLD_DEEP,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_PLUM,
    marginBottom: 4,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  labelActive: {
    color: PLUM_ROYAL,
  },
  subLabel: {
    fontSize: 12,
    color: TEXT_MUTED,
    textAlign: 'center',
  },
});

export default GenderCard;