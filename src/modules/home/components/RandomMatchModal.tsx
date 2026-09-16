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
  Dimensions,
} from 'react-native';
import { ChevronsUp, BellOff, Zap, Search } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import apiClient from '../../../api/apiClient';
import { getSocket } from '../../../api/socketClient';

const { width, height } = Dimensions.get('window');

// Brand Colors
const PLUM_ROYAL = '#5B0E8B';
const PLUM_DEEP = '#3D0A63';
const GOLD = '#F5C542';
const GOLD_DEEP = '#D4AF37';
const NEON_PINK = '#FF3B5C';
const NEON_CYAN = '#00F0FF';

interface RandomMatchModalProps {
  visible: boolean;
  onClose: () => void;
  mode?: 'audio' | 'video';
  targetUser?: { id: string; name: string; avatarUri: string };
  onMatchFound?: (creator: { id: string; name: string; avatarUri: string; callRate?: number; videoRate?: number }) => void;
  onProceedWithDirectCall?: () => void;
}

const RandomMatchModal: React.FC<RandomMatchModalProps> = ({
  visible,
  onClose,
  mode = 'audio',
  targetUser,
  onMatchFound,
  onProceedWithDirectCall,
}) => {
  const [dots, setDots] = useState('');
  const [userAvatar, setUserAvatar] = useState('https://hima-bucket.s3.amazonaws.com/default-avatar.png');
  const [displayAvatar, setDisplayAvatar] = useState('https://i.pravatar.cc/300?img=47');
  const [statusText, setStatusText] = useState('Connecting');
  const [showDndBlock, setShowDndBlock] = useState(false);
  
  const [toastMessage, setToastMessage] = useState('');
  
  // UI Animation Refs
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const ripple1 = useRef(new Animated.Value(0)).current;
  const ripple2 = useRef(new Animated.Value(0)).current;
  const ripple3 = useRef(new Animated.Value(0)).current;
  const toastAnim = useRef(new Animated.Value(0)).current;
  
  const roamingInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (visible) {
      setStatusText('Connecting');
      
      const dotInterval = setInterval(() => {
        setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
      }, 500);

      // Core pulse
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.05, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      ).start();

      // Chevrons slide up
      Animated.loop(
        Animated.sequence([
          Animated.timing(slideAnim, { toValue: -30, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(slideAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      ).start();

      // Background rotation for glowing effect
      Animated.loop(
        Animated.timing(rotateAnim, { toValue: 1, duration: 8000, easing: Easing.linear, useNativeDriver: true })
      ).start();

      // Sonar ripples
      const createRipple = (anim: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(anim, { toValue: 1, duration: 2500, easing: Easing.out(Easing.quad), useNativeDriver: true }),
            Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true })
          ])
        );
      };
      
      createRipple(ripple1, 0).start();
      createRipple(ripple2, 800).start();
      createRipple(ripple3, 1600).start();

      // Business logic
      apiClient.get('/api/user/me').then(res => {
        if (res.data?.data?.dnd_enabled) {
          setShowDndBlock(true);
          return;
        }
        proceedWithCall();
      }).catch(() => {
        proceedWithCall();
      });

      apiClient.get('/api/user/me').then(res => {
        if (res.data?.data?.avatar_url) setUserAvatar(res.data.data.avatar_url);
      }).catch(err => console.log('Error fetching user avatar for modal:', err));

      return () => {
        clearInterval(dotInterval);
        if (roamingInterval.current) clearInterval(roamingInterval.current);
      };
    } else {
      setDots('');
      pulseAnim.setValue(1);
      slideAnim.stopAnimation();
      rotateAnim.stopAnimation();
      ripple1.setValue(0);
      ripple2.setValue(0);
      ripple3.setValue(0);
      toastAnim.setValue(0);
      if (roamingInterval.current) clearInterval(roamingInterval.current);
    }
  }, [visible]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(toastAnim, { toValue: 0, duration: 300, useNativeDriver: true })
    ]).start();
  };

  const handleCancel = () => {
    if (targetUser) {
      const socket = getSocket();
      if (socket) {
        socket.emit('cancel_call', { targetId: targetUser.id });
      }
    }
    onClose();
  };

  const proceedWithCall = () => {
    if (targetUser) {
      setDisplayAvatar(targetUser.avatarUri);
      setStatusText('Request Sent');
      if (onProceedWithDirectCall) onProceedWithDirectCall();
    } else {
      runRandomMatchLogic();
    }
  };

  const runRandomMatchLogic = async () => {
    try {
      const creatorsRes = await apiClient.get('/api/feed/creators');
      const creatorsList = creatorsRes.data?.data || [];
      const avatars = creatorsList.length > 0 
        ? creatorsList.map((c: any) => c.avatar_url || 'https://i.pravatar.cc/300')
        : ['https://i.pravatar.cc/300?img=1', 'https://i.pravatar.cc/300?img=5', 'https://i.pravatar.cc/300?img=9'];

      let currentIndex = 0;
      roamingInterval.current = setInterval(() => {
        setDisplayAvatar(avatars[currentIndex % avatars.length]);
        currentIndex++;
      }, 120); // slightly faster for a more rapid scan effect

      await new Promise<void>(resolve => setTimeout(resolve, 2500));

      const matchRes = await apiClient.post('/api/feed/random-match', { call_type: mode });
      const matchedData = matchRes.data?.data;

      if (matchedData) {
        if (roamingInterval.current) clearInterval(roamingInterval.current);
        const finalAvatar = matchedData.avatarUri || 'https://i.pravatar.cc/300';
        setDisplayAvatar(finalAvatar);
        setStatusText('Waiting for response');

        if (onMatchFound) {
          onMatchFound({
              id: String(matchedData.matched_creator_id),
              name: matchedData.name || 'Random Match',
              avatarUri: finalAvatar,
              callRate: matchedData.call_rate,
              videoRate: matchedData.video_rate
            });
        }
      } else {
        throw new Error('No match found');
      }
    } catch (e) {
      console.log('Random match error:', e);
      if (roamingInterval.current) clearInterval(roamingInterval.current);
      setStatusText('');
      showToast('User is not available right now');
      setTimeout(onClose, 2500);
    }
  };

  const spin = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  
  const getRippleStyle = (anim: Animated.Value) => ({
    opacity: anim.interpolate({ inputRange: [0, 0.8, 1], outputRange: [0.6, 0.1, 0] }),
    transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 3.5] }) }],
  });

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.container}>
        {/* Background Gradients */}
        <LinearGradient colors={['#0F0817', '#1A0B2E', '#0B0514']} style={StyleSheet.absoluteFill} />
        
        {/* Rotating ambient glow */}
        <Animated.View style={[styles.ambientGlow, { transform: [{ rotate: spin }] }]}>
          <LinearGradient colors={['rgba(255, 59, 92, 0.15)', 'transparent', 'rgba(0, 240, 255, 0.15)']} style={StyleSheet.absoluteFill} start={{x: 0, y: 0}} end={{x: 1, y: 1}} />
        </Animated.View>

        {/* @ts-ignore */}
        <StatusBar barStyle="light-content" backgroundColor="#0F0817" translucent />
        
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.modeBadge}>
              <Zap size={14} color={GOLD} fill={GOLD} style={{marginRight: 6}} />
              <Text style={styles.modeText}>
                {mode === 'audio' ? 'AUDIO SESSION' : 'VIDEO SESSION'}
              </Text>
            </View>
            <Text style={styles.title}>Matching</Text>
            <View style={styles.connectingRow}>
              <Text style={styles.connectingText}>{statusText}</Text>
              {(statusText === 'Connecting' || statusText === 'Waiting for response') && (
                <Text style={styles.dotsText}>{dots}</Text>
              )}
            </View>
          </View>

          {/* Central Animation Area */}
          <View style={styles.content}>
            
            {/* Target Avatar (Top) */}
            <View style={styles.targetAvatarContainer}>
              <LinearGradient colors={[NEON_CYAN, '#0088FF']} style={styles.targetAvatarBorder}>
                <Image source={{ uri: displayAvatar }} style={styles.avatarImage} />
              </LinearGradient>
              {statusText === 'Connecting' && (
                <View style={styles.scanningOverlay}>
                  <Animated.View style={[styles.scanLine, { transform: [{ translateY: slideAnim }] }]} />
                </View>
              )}
              <View style={styles.targetLabel}>
                <Search size={12} color="#FFF" style={{marginRight: 4}} />
                <Text style={styles.targetLabelText}>
                  {statusText === 'Connecting' ? 'Searching...' : 'Found Match'}
                </Text>
              </View>
            </View>

            {/* Connection stream / Chevrons */}
            <View style={styles.connectionStream}>
              <Animated.View style={[{ transform: [{ translateY: slideAnim }] }]}>
                <ChevronsUp size={32} color={NEON_PINK} opacity={0.8} />
                <ChevronsUp size={32} color={GOLD} opacity={0.4} style={{ marginTop: -15 }} />
                <ChevronsUp size={32} color={NEON_CYAN} opacity={0.2} style={{ marginTop: -15 }} />
              </Animated.View>
            </View>

            {/* User Avatar (Bottom) with Sonar Ripples */}
            <View style={styles.userAvatarContainer}>
              <Animated.View style={[styles.sonarRipple, getRippleStyle(ripple1), { borderColor: NEON_PINK }]} />
              <Animated.View style={[styles.sonarRipple, getRippleStyle(ripple2), { borderColor: GOLD }]} />
              <Animated.View style={[styles.sonarRipple, getRippleStyle(ripple3), { borderColor: NEON_CYAN }]} />
              
              <Animated.View style={[styles.userAvatarBorder, { transform: [{ scale: pulseAnim }] }]}>
                <Image source={{ uri: userAvatar }} style={styles.avatarImage} />
              </Animated.View>
              
              <View style={styles.youBadge}>
                <LinearGradient colors={[NEON_PINK, '#FF1493']} style={styles.youBadgeGradient}>
                  <Text style={styles.youText}>YOU</Text>
                </LinearGradient>
              </View>
            </View>

          </View>

          {/* DND Block Overlay */}
          {showDndBlock && (
            <View style={styles.dndOverlay}>
              <View style={styles.dndCard}>
                <View style={styles.dndIconWrapper}>
                  <BellOff size={32} color={NEON_PINK} />
                </View>
                <Text style={styles.dndTitle}>Do Not Disturb is on</Text>
                <Text style={styles.dndDesc}>Turn off DND to place this call.</Text>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.dndBtnPrimary}
                  onPress={() => {
                    apiClient.post('/api/user/dnd', { enabled: false }).then(() => {
                      setShowDndBlock(false);
                      proceedWithCall();
                    });
                  }}
                >
                  <LinearGradient colors={[NEON_PINK, '#FF1493']} style={styles.dndBtnGradient}>
                    <Text style={styles.dndBtnPrimaryText}>Turn off & call</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.dndBtnSecondary} onPress={handleCancel}>
                  <Text style={styles.dndBtnSecondaryText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Footer Cancel Button */}
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel} activeOpacity={0.7}>
            <Text style={styles.cancelText}>CANCEL MATCHMAKING</Text>
          </TouchableOpacity>
          
          {/* Animated Toast */}
          {toastMessage !== '' && (
            <Animated.View
              style={[
                styles.toastContainer,
                {
                  transform: [
                    {
                      translateY: toastAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [100, 0]
                      })
                    }
                  ],
                  opacity: toastAnim
                }
              ]}
            >
              <Image source={require('../../../assets/images/logo1.png')} style={styles.toastIcon} />
              <Text style={styles.toastText}>{toastMessage}</Text>
            </Animated.View>
          )}
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0817',
  },
  ambientGlow: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    top: -width * 0.25,
    left: -width * 0.25,
    opacity: 0.8,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 30,
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    marginBottom: 16,
  },
  modeText: {
    fontSize: 11,
    color: GOLD,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 32,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 1,
  },
  connectingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
  },
  connectingText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  dotsText: {
    fontSize: 16,
    color: NEON_CYAN,
    fontWeight: '800',
    width: 24,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 40,
  },
  
  // Target Avatar
  targetAvatarContainer: {
    alignItems: 'center',
    zIndex: 2,
    marginTop: -70,
  },
  targetAvatarBorder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    padding: 3,
    shadowColor: NEON_CYAN,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  scanningOverlay: {
    position: 'absolute',
    top: 3, left: 3, right: 3, bottom: 3,
    borderRadius: 70,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
  },
  scanLine: {
    width: '100%',
    height: 4,
    backgroundColor: NEON_CYAN,
    shadowColor: NEON_CYAN,
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  targetLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: -14,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.4)',
  },
  targetLabelText: {
    fontSize: 11,
    color: '#FFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  
  // Connection Stream
  connectionStream: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    zIndex: 1,
  },
  
  // User Avatar
  userAvatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    zIndex: 2,
    width: 140,
    height: 140,
  },
  sonarRipple: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  userAvatarBorder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: NEON_PINK,
    padding: 2,
    backgroundColor: '#0F0817',
    shadowColor: NEON_PINK,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  youBadge: {
    position: 'absolute',
    bottom: -10,
  },
  youBadgeGradient: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  youText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 1,
  },
  
  // Footer
  cancelButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 50,
  },
  cancelText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 1.5,
    opacity: 0.8,
  },
  
  // DND Overlay
  dndOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  dndCard: {
    backgroundColor: '#1A0B2E',
    borderRadius: 28,
    padding: 32,
    width: '85%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 92, 0.3)',
    shadowColor: NEON_PINK,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 15,
  },
  dndIconWrapper: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(255,59,92,0.1)',
    borderWidth: 1, borderColor: 'rgba(255,59,92,0.3)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
  },
  dndTitle: {
    fontFamily: 'PlayfairDisplay-Bold', fontSize: 24, color: '#FFF',
    marginBottom: 10, textAlign: 'center',
  },
  dndDesc: {
    fontSize: 15, color: 'rgba(255,255,255,0.7)',
    textAlign: 'center', marginBottom: 28, lineHeight: 22,
  },
  dndBtnPrimary: {
    width: '100%', marginBottom: 12, borderRadius: 14, overflow: 'hidden',
  },
  dndBtnGradient: {
    width: '100%', paddingVertical: 16, alignItems: 'center',
  },
  dndBtnPrimaryText: {
    fontSize: 15, color: '#FFFFFF', fontWeight: '800', letterSpacing: 0.5,
  },
  dndBtnSecondary: {
    width: '100%', paddingVertical: 14, alignItems: 'center',
  },
  dndBtnSecondaryText: {
    fontSize: 15, color: 'rgba(255,255,255,0.5)', fontWeight: '600', letterSpacing: 0.5,
  },
  
  // Toast
  toastContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 90,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 9999,
  },
  toastIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
    resizeMode: 'contain',
  },
  toastText: {
    color: '#2A1240',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default RandomMatchModal;
