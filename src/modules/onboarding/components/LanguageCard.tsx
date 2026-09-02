import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';

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
      <View style={[styles.glyphCircle, isSelected && styles.glyphCircleActive]}>
        <Text
          style={[styles.glyphText, isSelected && styles.glyphTextActive]}
          numberOfLines={1}
        >
          {language.glyph}
        </Text>
      </View>

      {/* Text block */}
      <View style={styles.textBlock}>
        <Text style={styles.nameEnglish}>{language.nameEnglish}</Text>
        <Text style={styles.nameNative}>{language.nameNative}</Text>
      </View>

      {/* Check indicator */}
      {isSelected ? (
        <View style={styles.checkActive}>
          <Check size={14} color="#FFFFFF" />
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
    backgroundColor: '#FBFAFD',
    borderWidth: 1.5,
    borderColor: '#F1EAF6',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  rowActive: {
    borderColor: '#EC1372',
    backgroundColor: '#FFF6FA',
    shadowColor: '#EC1372',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  glyphCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FDE6EF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  glyphCircleActive: {
    backgroundColor: '#EC1372',
  },
  glyphText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#EC1372',
  },
  glyphTextActive: {
    color: '#FFFFFF',
  },
  textBlock: {
    flex: 1,
  },
  nameEnglish: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#1B0E22',
    marginBottom: 2,
  },
  nameNative: {
    fontSize: 13,
    color: '#8A7A9C',
  },
  checkActive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EC1372',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkInactive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5DEEF',
  },
});

export default LanguageCard;
