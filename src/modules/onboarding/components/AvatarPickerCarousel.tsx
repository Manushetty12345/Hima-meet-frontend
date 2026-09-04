import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Check } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const AVATAR_SIZE_ACTIVE = 100;
const AVATAR_SIZE_INACTIVE = 76;
const HALO_SIZE = AVATAR_SIZE_ACTIVE + 24;

// ---- Palette pulled from the Himameet mark ----
const GOLD_DEEP = '#D4AF37';
const GOLD_SOFT = 'rgba(245, 197, 66, 0.5)';
const PLUM_TINT = 'rgba(91, 14, 139, 0.08)';

export interface AvatarItem {
  id: string;
  uri: string;
}

interface AvatarPickerCarouselProps {
  avatars: AvatarItem[];
  selectedAvatarId: string;
  onSelect: (id: string) => void;
}

const AvatarPickerCarousel: React.FC<AvatarPickerCarouselProps> = ({
  avatars,
  selectedAvatarId,
  onSelect,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      decelerationRate="fast"
    >
      {avatars.map(avatar => {
        const isSelected = avatar.id === selectedAvatarId;
        return (
          <TouchableOpacity
            key={avatar.id}
            activeOpacity={0.85}
            onPress={() => onSelect(avatar.id)}
            style={styles.touchable}
          >
            {isSelected && <View style={styles.haloRing} />}

            <View
              style={[
                styles.avatarWrapper,
                isSelected ? styles.avatarWrapperActive : styles.avatarWrapperInactive,
              ]}
            >
              <Image source={{ uri: avatar.uri }} style={styles.avatarImage} />
            </View>
            {isSelected && (
              <View style={styles.checkBadge}>
                <Check size={12} color="#2A1240" />
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: (width - AVATAR_SIZE_ACTIVE) / 2 - 24,
    gap: 32,
  },
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
    height: HALO_SIZE,
    width: HALO_SIZE,
  },
  haloRing: {
    position: 'absolute',
    width: HALO_SIZE,
    height: HALO_SIZE,
    borderRadius: HALO_SIZE / 2,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: GOLD_SOFT,
  },
  avatarWrapper: {
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: PLUM_TINT,
  },
  avatarWrapperActive: {
    width: AVATAR_SIZE_ACTIVE,
    height: AVATAR_SIZE_ACTIVE,
    borderWidth: 3,
    borderColor: GOLD_DEEP,
    shadowColor: GOLD_DEEP,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarWrapperInactive: {
    width: AVATAR_SIZE_INACTIVE,
    height: AVATAR_SIZE_INACTIVE,
    opacity: 0.55,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  checkBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: GOLD_DEEP,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});

export default AvatarPickerCarousel;