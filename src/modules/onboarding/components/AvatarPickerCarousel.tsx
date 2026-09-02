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

const AVATAR_SIZE_ACTIVE = 84;
const AVATAR_SIZE_INACTIVE = 60;

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
                <Check size={12} color="#FFFFFF" />
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
    gap: 18,
  },
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
    height: AVATAR_SIZE_ACTIVE,
    width: AVATAR_SIZE_ACTIVE,
  },
  avatarWrapper: {
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#F1EAF6',
  },
  avatarWrapperActive: {
    width: AVATAR_SIZE_ACTIVE,
    height: AVATAR_SIZE_ACTIVE,
    borderWidth: 3,
    borderColor: '#EC1372',
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
    backgroundColor: '#EC1372',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});

export default AvatarPickerCarousel;
