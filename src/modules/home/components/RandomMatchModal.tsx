import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Animated,
  SafeAreaView,
  StatusBar,
  Easing,
} from 'react-native';
import { ChevronsUp } from 'lucide-react-native';

interface RandomMatchModalProps {
  visible: boolean;
  onClose: () => void;
  mode?: 'audio' | 'video';
}

const RandomMatchModal: React.FC<RandomMatchModalProps> = ({
  visible,
  onClose,
  mode = 'audio',
}) => {
  const [dots, setDots] = useState('');
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Dots animation
      const interval = setInterval(() => {
        setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
      }, 500);

      // Pulse animation for avatars
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Chevrons slide up animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(slideAnim, {
            toValue: -15,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();

      return () => clearInterval(interval);
    } else {
      setDots('');
      pulseAnim.setValue(1);
      slideAnim.setValue(0);
    }
  }, [visible, pulseAnim, slideAnim]);

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.container}>
        {/* @ts-ignore - backgroundColor is an Android-only prop that causes type errors in some TS configurations */}
        <StatusBar barStyle="light-content" backgroundColor="#1A1D24" />
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {mode === 'audio' ? 'Audio Session' : 'Video Session'}
            </Text>
            <View style={styles.connectingRow}>
              <Text style={styles.connectingText}>Connecting</Text>
              <Text style={styles.dotsText}>{dots}</Text>
            </View>
          </View>

          {/* Middle Content */}
          <View style={styles.content}>
            {/* Target Avatar */}
            <Animated.View style={[styles.avatarRing, { transform: [{ scale: pulseAnim }] }]}>
              <View style={styles.avatarInnerRing}>
                <Image
                  source={{ uri: 'https://i.pravatar.cc/300?img=47' }}
                  style={styles.avatarImage}
                />
              </View>
            </Animated.View>

            {/* Animated Chevrons */}
            <Animated.View style={[styles.chevronsContainer, { transform: [{ translateY: slideAnim }] }]}>
              <ChevronsUp size={36} color="#D1D1DB" strokeWidth={1.5} />
            </Animated.View>

            {/* User Avatar */}
            <View style={styles.userAvatarContainer}>
              <Animated.View style={[styles.avatarRing, { transform: [{ scale: pulseAnim }] }]}>
                <View style={styles.avatarInnerRing}>
                  <Image
                    source={{ uri: 'https://i.pravatar.cc/300?img=11' }} // Using dummy user avatar
                    style={styles.avatarImage}
                  />
                </View>
              </Animated.View>
              <View style={styles.youBadge}>
                <Text style={styles.youText}>You</Text>
              </View>
            </View>

            {/* Status Texts */}
            <Text style={styles.findingText}>Finding your perfect match...</Text>
            <Text style={styles.searchingText}>Searching...</Text>
          </View>

          {/* Footer */}
          <TouchableOpacity style={styles.cancelButton} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1D24', // Dark background matching the screenshot
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  connectingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
    justifyContent: 'center',
  },
  connectingText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  dotsText: {
    fontSize: 15,
    color: '#EC1372',
    fontWeight: '800',
    width: 24, // Fixed width so text doesn't jump
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  avatarRing: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#EC1372',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInnerRing: {
    width: 134,
    height: 134,
    borderRadius: 67,
    borderWidth: 2,
    borderColor: '#1A1D24', // Spacing color
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  chevronsContainer: {
    marginVertical: 40,
  },
  userAvatarContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  youBadge: {
    position: 'absolute',
    bottom: -10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  youText: {
    fontSize: 14,
    color: '#1A1D24',
    fontWeight: '700',
  },
  findingText: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  searchingText: {
    fontSize: 14,
    color: '#A1A1AA',
    fontWeight: '500',
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginBottom: 20,
  },
  cancelText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default RandomMatchModal;
