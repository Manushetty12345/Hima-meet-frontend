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
        colors={isSelected ? ['#FF3B8D', '#E0116F'] : ['#E9E4EF', '#E9E4EF']}
        style={styles.iconCircle}
      >
        <Icon size={26} color={isSelected ? '#FFFFFF' : '#9A8FA8'} />
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
    borderColor: '#EFE7F3',
    borderRadius: 20,
    paddingVertical: 22,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  cardActive: {
    borderColor: '#EC1372',
    backgroundColor: '#FFF6FA',
    shadowColor: '#EC1372',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B0E22',
    marginBottom: 4,
  },
  labelActive: {
    color: '#EC1372',
  },
  subLabel: {
    fontSize: 12,
    color: '#8A7A9C',
    textAlign: 'center',
  },
});

export default GenderCard;
