import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Check } from 'lucide-react-native';

// ---- Palette pulled from the Himameet mark ----
const PLUM_ROYAL = '#5B0E8B';
const GOLD = '#F5C542';
const GOLD_DEEP = '#D4AF37';
const IVORY_LINE = '#EBDFC4';
const TEXT_PLUM = '#2A1240';
const TEXT_MUTED = '#8B7F98';

export type LanguageItem = {
  id: string;
  glyph: string;
  nameEnglish: string;
  nameNative: string;
};

interface LanguageCardProps {
  language: LanguageItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const LanguageCard: React.FC<LanguageCardProps> = ({
  language,
  isSelected,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onSelect(language.id)}
      style={[styles.row, isSelected && styles.rowActive]}
    >
      {/* Glyph circle */}
      <LinearGradient
        colors={isSelected ? [GOLD, GOLD_DEEP] : ['#F6EFDD', '#F6EFDD']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.glyphCircle, isSelected && styles.glyphCircleActive]}
      >
        <Text
          style={[styles.glyphText, isSelected && styles.glyphTextActive]}
          numberOfLines={1}
        >
          {language.glyph}
        </Text>
      </LinearGradient>

      {/* Text block */}
      <View style={styles.textBlock}>
        <Text style={styles.nameEnglish}>{language.nameEnglish}</Text>
        <Text style={styles.nameNative}>{language.nameNative}</Text>
      </View>

      {/* Check indicator */}
      {isSelected ? (
        <View style={styles.checkActive}>
          <Check size={14} color="#2A1240" />
        </View>
      ) : (
        <View style={styles.checkInactive} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  rowActive: {
    borderColor: GOLD_DEEP,
    borderWidth: 1.75,
    backgroundColor: 'rgba(245, 197, 66, 0.06)',
  },
  glyphCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  glyphCircleActive: {},
  glyphText: {
    fontSize: 17,
    fontWeight: '700',
    color: PLUM_ROYAL,
  },
  glyphTextActive: {
    color: '#2A1240',
  },
  textBlock: {
    flex: 1,
  },
  nameEnglish: {
    fontSize: 15.5,
    fontWeight: '700',
    color: TEXT_PLUM,
    marginBottom: 2,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  nameNative: {
    fontSize: 13,
    color: TEXT_MUTED,
  },
  checkActive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: GOLD_DEEP,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkInactive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
  },
});

export default LanguageCard;