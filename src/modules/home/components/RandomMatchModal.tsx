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
  Platform,
} from 'react-native';
import { ChevronsUp } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import apiClient from '../../../api/apiClient';

interface RandomMatchModalProps {
  visible: boolean;
  onClose: () => void;
  mode?: 'audio' | 'video';
  targetUser?: { id: string; name: string; avatarUri: string };
  onMatchFound?: (creator: { id: string; name: string; avatarUri: string }) => void;
}

const RandomMatchModal: React.FC<RandomMatchModalProps> = ({
  visible,
  onClose,
  mode = 'audio',
  targetUser,
  onMatchFound,
}) => {
  const [dots, setDots] = useState('');
  const [userAvatar, setUserAvatar] = useState('https://hima-bucket.s3.amazonaws.com/default-avatar.png');
  const [displayAvatar, setDisplayAvatar] = useState('https://i.pravatar.cc/300?img=47');
  const [statusText, setStatusText] = useState('Connecting');
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const roamingInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (visible) {
      setStatusText('Connecting');
      // Dots animation
      const dotInterval = setInterval(() => {
        setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
      }, 500);

      // Pulse animation for avatars
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Chevrons slide up animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(slideAnim, {
            toValue: -20,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();

      if (targetUser) {
        // Direct call, no roaming
        setDisplayAvatar(targetUser.avatarUri);
        setStatusText('Request Sent');
      } else {
        // Random Match Mode - Roaming Animation & API Call
        runRandomMatchLogic();
      }

      // Fetch user's own avatar
      apiClient.get('/api/user/me').then(res => {
        if (res.data?.data?.avatar_url) {
          setUserAvatar(res.data.data.avatar_url);
        }
      }).catch(err => console.log('Error fetching user avatar for modal:', err));

      return () => {
        clearInterval(dotInterval);
        if (roamingInterval.current) clearInterval(roamingInterval.current);
      };
    } else {
      setDots('');
      pulseAnim.setValue(1);
      slideAnim.stopAnimation();
      if (roamingInterval.current) clearInterval(roamingInterval.current);
    }
  }, [visible, pulseAnim, slideAnim]);

  const runRandomMatchLogic = async () => {
    try {
      // 1. Fetch online creators for the roaming animation
      const creatorsRes = await apiClient.get('/api/feed/creators');
      const creatorsList = creatorsRes.data?.data || [];
      const avatars = creatorsList.length > 0 
        ? creatorsList.map((c: any) => c.avatar_url || 'https://i.pravatar.cc/300')
        : ['https://i.pravatar.cc/300?img=1', 'https://i.pravatar.cc/300?img=5', 'https://i.pravatar.cc/300?img=9'];

      // Start rapid roaming interval (every 150ms)
      let currentIndex = 0;
      roamingInterval.current = setInterval(() => {
        setDisplayAvatar(avatars[currentIndex % avatars.length]);
        currentIndex++;
      }, 150);

      // 2. Artificial delay so the user sees the cool animation searching
      await new Promise<void>(resolve => setTimeout(resolve, 2000));

      // 3. Request actual match from API
      const matchRes = await apiClient.post('/api/feed/random-match', { call_type: mode });
      const matchedData = matchRes.data?.data;

      if (matchedData) {
        // Stop roaming and set the exact matched avatar
        if (roamingInterval.current) clearInterval(roamingInterval.current);
        const finalAvatar = matchedData.avatarUri || 'https://i.pravatar.cc/300';
        setDisplayAvatar(finalAvatar);
        setStatusText('Waiting for response');

        // Pass back to HomeScreen to initiate socket call
        if (onMatchFound) {
          onMatchFound({
            id: String(matchedData.matched_creator_id),
            name: matchedData.name || 'Random Match',
            avatarUri: finalAvatar
          });
        }
      } else {
        throw new Error('No match found');
      }

    } catch (e) {
      console.log('Random match error:', e);
      if (roamingInterval.current) clearInterval(roamingInterval.current);
      setStatusText('No creators available');
      setTimeout(onClose, 2500);
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <LinearGradient 
        colors={['#1A1025', '#161421', '#11101A']} 
        style={styles.container}
      >
        {/* @ts-ignore: backgroundColor is a valid Android prop but missing from types */}
        <StatusBar barStyle="light-content" backgroundColor="#1A1025" />
        <SafeAreaView style={styles.safeArea}>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {mode === 'audio' ? 'Audio Session' : 'Video Session'}
            </Text>
            <View style={styles.connectingRow}>
              <Text style={styles.connectingText}>{statusText}</Text>
              {(statusText === 'Connecting' || statusText === 'Waiting for response') && (
                <Text style={styles.dotsText}> {dots}</Text>
              )}
            </View>
          </View>

          {/* Middle Content */}
          <View style={styles.content}>
            {/* Target Avatar */}
            <Animated.View style={[styles.avatarRing, { transform: [{ scale: pulseAnim }] }]}>
              <View style={styles.avatarInnerRing}>
                <Image
                  source={{ uri: displayAvatar }}
                  style={styles.avatarImage}
                />
              </View>
            </Animated.View>

            {/* Animated Chevrons */}
            <Animated.View style={[styles.chevronsContainer, { transform: [{ translateY: slideAnim }] }]}>
              <ChevronsUp size={36} color="#FFFFFF" strokeWidth={1.5} opacity={0.6} />
            </Animated.View>

            <View style={styles.userAvatarContainer}>
              <Animated.View style={[styles.avatarRing, { transform: [{ scale: pulseAnim }] }]}>
                <View style={styles.avatarInnerRing}>
                  <Image
                    source={{ uri: userAvatar }}
                    style={styles.avatarImage}
                  />
                </View>
              </Animated.View>
              <View style={styles.youBadge}>
                <Text style={styles.youText}>You</Text>
              </View>
            </View>

            {/* Status Texts */}
            <Text style={styles.findingText}>
              Finding your perfect match...
            </Text>
            <Text style={styles.searchingText}>
              Searching...
            </Text>
          </View>

          {/* Footer */}
          <TouchableOpacity style={styles.cancelButton} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  connectingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectingText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  dotsText: {
    fontSize: 15,
    color: '#EC1372',
    fontWeight: '800',
    width: 24,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: -40, // Adjust upward slightly
  },
  avatarRing: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#EC1372',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  avatarInnerRing: {
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: '#E5E0FF', // Match the light background of avatars in screenshot
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
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
    bottom: -12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  youText: {
    fontSize: 12,
    color: '#EC1372',
    fontWeight: '700',
  },
  findingText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 24,
  },
  searchingText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  cancelButton: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  cancelText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default RandomMatchModal;
