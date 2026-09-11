import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Animated,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Clock, Mic, MicOff, PhoneOff, Volume2, VolumeX, Gift } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AuthStackParamList } from '../../../navigation/AuthNavigator';
import EndCallModal from '../components/EndCallModal';
import LowBalanceWarning from '../components/LowBalanceWarning';
import apiClient from '../../../api/apiClient';
import createAgoraRtcEngine, { ChannelProfileType, ClientRoleType, IRtcEngine } from 'react-native-agora';
import { request, PERMISSIONS } from 'react-native-permissions';

type Props = NativeStackScreenProps<AuthStackParamList, 'AudioCallScreen'>;

const { width, height } = Dimensions.get('window');

const AGORA_APP_ID = '0d5ce553174a45f0a1b25684e02f8164';
const AudioCallScreen: React.FC<Props> = ({ navigation, route }) => {
  const {  
    callerName = 'You',
    calleeName = 'User', 
    callerAvatar = 'https://ui-avatars.com/api/?name=You&background=random',
    calleeAvatar = 'https://ui-avatars.com/api/?name=User&background=random',
    callId,
    targetId
  } = route.params || {};

  // Coin & Timer State
  const [coins, setCoins] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showLowBalance, setShowLowBalance] = useState(false);
  
  // Fetched Caller Profile State (Fallback)
  const [fetchedCallerName, setFetchedCallerName] = useState<string | null>(null);
  const [fetchedCallerAvatar, setFetchedCallerAvatar] = useState<string | null>(null);

  // Dynamic Configs State
  const [callCostPerMinute, setCallCostPerMinute] = useState<number>(0);
  const [gifts, setGifts] = useState<{ id: string; name: string; price: number; icon: string; color: string }[]>([]);

  // Call Control State
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [showEndCallModal, setShowEndCallModal] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  const engine = useRef<IRtcEngine>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const channelName = 'test-audio-channel'; // We can make this dynamic if needed

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastAnim = useRef(new Animated.Value(0)).current;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(toastAnim, { toValue: 0, duration: 300, useNativeDriver: true })
    ]).start(() => setToastMessage(null));
  };

  useEffect(() => {
    // Start pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Fetch configs & coins
    fetchInitialData();
    
    // Setup Agora
    setupAgoraEngine();

    return () => {
      // Cleanup
      engine.current?.leaveChannel();
      engine.current?.release();
    };
  }, []);

  const fetchInitialData = async () => {
    try {
      // Fetch gifts and call cost config
      const [giftsRes, configRes, userRes, walletRes] = await Promise.all([
        apiClient.get('/api/gifts').catch(() => null),
        apiClient.get('/api/config/call-rates').catch(() => null),
        apiClient.get('/api/user/me').catch(() => null),
        apiClient.get('/api/wallet/balance').catch(() => null)
      ]);

      if (giftsRes?.data?.data) setGifts(giftsRes.data.data);
      
      const cost = configRes?.data?.data?.audioCallCost ?? 10; // Fallback only if missing in API
      setCallCostPerMinute(cost);

      const user = userRes?.data?.data;
      if (user) {
        setFetchedCallerName(user.name);
        if (user.avatar_url) setFetchedCallerAvatar(user.avatar_url);
      }
      
      const fetchedCoins = walletRes?.data?.data?.coin_balance ?? 0;
      setCoins(fetchedCoins);
      
      const maxSeconds = Math.floor((fetchedCoins / cost) * 60);
      setTimeLeft(maxSeconds);
    } catch (err) {
      console.log('Error fetching initial data:', err);
      setCoins(0);
      setTimeLeft(0);
    }
  };

  const setupAgoraEngine = async () => {
    try {
      if (Platform.OS === 'android') {
        await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
      } else {
        await request(PERMISSIONS.IOS.MICROPHONE);
      }

      engine.current = createAgoraRtcEngine();
      engine.current.initialize({ appId: AGORA_APP_ID });
      engine.current.enableAudio();
      engine.current.setChannelProfile(ChannelProfileType.ChannelProfileCommunication);

      // Join channel immediately
      // In production, you would fetch a token here. For testing with App ID, pass '' as token.
      engine.current.joinChannel('', channelName, 0, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      });

      engine.current.addListener('onJoinChannelSuccess', () => {
        console.log('Joined Agora channel successfully');
        setIsJoined(true);
      });

      engine.current.addListener('onUserJoined', (uid) => {
        console.log('Remote user joined', uid);
      });

      engine.current.addListener('onUserOffline', (uid) => {
        console.log('Remote user left', uid);
        handleEndCall(); // End call if other user leaves
      });

    } catch (e) {
      console.log('Error setting up Agora', e);
    }
  };

  // Countdown timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (timeLeft !== null) {
      if (timeLeft <= 0) {
        handleEndCall();
        return;
      }
      if (timeLeft === 60) {
        setShowLowBalance(true);
      }
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Heartbeat timer (Per-minute coin deduction)
  useEffect(() => {
    // Only run heartbeat if we have time left
    if (timeLeft === null || timeLeft <= 0) return;

    const heartbeatTimer = setInterval(() => {
      setCoins(prevCoins => {
        const newCoins = prevCoins - callCostPerMinute;
        return newCoins > 0 ? newCoins : 0;
      });
      if (callId) {
        apiClient.post('/api/call/heartbeat', { callId }).catch(e => console.log('Heartbeat failed:', e));
      }
    }, 60000);

    return () => clearInterval(heartbeatTimer);
  }, [callCostPerMinute, callId, timeLeft === null || timeLeft <= 0]);

  const handleMute = () => {
    const nextMuteState = !isMuted;
    engine.current?.muteLocalAudioStream(nextMuteState);
    setIsMuted(nextMuteState);
  };

  const handleSpeaker = () => {
    const nextSpeakerState = !isSpeakerOn;
    engine.current?.setEnableSpeakerphone(nextSpeakerState);
    setIsSpeakerOn(nextSpeakerState);
  };

  const handleEndCall = () => {
    setShowEndCallModal(false);
    engine.current?.leaveChannel();
    navigation.replace('CallFeedbackScreen', { creatorName: calleeName, creatorId: targetId, callId: callId });
  };

  const handleSendGift = async (gift: { id: string; name: string; price: number; icon: string; color: string }) => {
    if (coins < gift.price) {
      showToast('Not enough coins to send this gift.');
      return;
    }

    try {
      // Optimistic update
      const newCoins = coins - gift.price;
      setCoins(newCoins);
      
      // Update timer dynamically based on new coin balance
      const newMaxSeconds = Math.floor((newCoins / callCostPerMinute) * 60);
      
      if (timeLeft && newMaxSeconds < timeLeft) {
        setTimeLeft(newMaxSeconds);
      }

      if (newMaxSeconds <= 60 && newMaxSeconds > 0) {
        setShowLowBalance(true);
      } else if (newMaxSeconds <= 0) {
         handleEndCall();
      }
      await apiClient.post('/api/call/gift', { giftId: gift.id });
      showToast(`Sent ${gift.name} ${gift.icon}`);
    } catch (err) {
      console.log('Error sending gift', err);
      // Revert if API fails
      setCoins(coins);
      showToast('Failed to send gift');
    }
  };

  const formatTime = (totalSeconds: number) => {
    if (totalSeconds < 0) return '00:00';
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs > 0 ? hrs.toString().padStart(2, '0') + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* @ts-ignore */}
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Base Blurred Image */}
      <Image 
        source={{ uri: calleeAvatar }} 
        style={[StyleSheet.absoluteFill, { opacity: 0.5 }]} 
        blurRadius={40} 
      />

      <LinearGradient 
        colors={['rgba(18, 10, 30, 0.6)', 'rgba(10, 5, 20, 0.9)', '#000000']} 
        style={styles.container} 
      >
        <View style={styles.safeArea}>
          {/* Top Header - Floating Timer */}
          <View style={styles.header}>
            <View style={styles.timerGlassPill}>
              <Clock size={16} color={timeLeft !== null && timeLeft <= 60 ? "#FF4D4D" : "#00DFD8"} />
              <Text style={[styles.timerText, timeLeft !== null && timeLeft <= 60 && { color: '#FF4D4D' }]}>
                {timeLeft !== null ? formatTime(timeLeft) : 'Connecting...'}
              </Text>
            </View>
            <View style={styles.coinPill}>
               <Text style={styles.coinText}>{coins} Coins</Text>
            </View>
          </View>

          {/* Dynamic Interlocking Avatars */}
          <View style={styles.avatarsContainer}>
            {/* Caller Avatar */}
            <Animated.View style={[styles.avatarWrapper, { zIndex: 2 }]}>
              <Animated.View style={[styles.glowRingContainer, { transform: [{ scale: pulseAnim }] }]}>
                <LinearGradient colors={['#FF007A', '#7928CA']} style={styles.avatarGlowRing} />
              </Animated.View>
              <View style={styles.avatarInner}>
                <Image source={{ uri: fetchedCallerAvatar || callerAvatar }} style={styles.avatarImage} />
              </View>
              <View style={styles.nameBadge}>
                <Text style={styles.avatarName}>{fetchedCallerName || callerName}</Text>
              </View>
            </Animated.View>

            {/* Callee Avatar */}
            <Animated.View style={[styles.avatarWrapper, { zIndex: 1 }]}>
              <Animated.View style={[styles.glowRingContainer, { transform: [{ scale: pulseAnim }] }]}>
                <LinearGradient colors={['#00DFD8', '#007CF0']} style={styles.avatarGlowRing} />
              </Animated.View>
              <View style={styles.avatarInner}>
                <Image source={{ uri: calleeAvatar }} style={styles.avatarImage} />
              </View>
              <View style={[styles.nameBadge, { backgroundColor: 'rgba(0, 124, 240, 0.3)' }]}>
                <Text style={[styles.avatarName, { color: '#E0F7FA' }]}>{calleeName}</Text>
              </View>
            </Animated.View>
          </View>

          <View style={{ flex: 1 }} />

          {/* Premium Gift Dock */}
          <View style={styles.giftDockWrapper}>
            <View style={styles.giftsHeader}>
              <Gift size={16} color="#FFD700" />
              <Text style={styles.giftsTitle}>Send a Gift</Text>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.giftsScroll}
            >
              {gifts.map((gift) => (
                <TouchableOpacity key={gift.id} activeOpacity={0.8} onPress={() => handleSendGift(gift)}>
                  <LinearGradient 
                    colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.03)']} 
                    style={styles.giftCard}
                  >
                    <Text style={styles.giftIconText}>{gift.icon}</Text>
                    <View style={styles.giftPriceRow}>
                      <View style={styles.coinDot} />
                      <Text style={styles.giftPriceText}>{gift.price}</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Floating Controls Dock */}
          <View style={styles.controlsDock}>
            <LinearGradient 
              colors={['rgba(40, 30, 60, 0.6)', 'rgba(20, 15, 30, 0.8)']} 
              style={styles.controlsPill}
            >
              <TouchableOpacity 
                style={[styles.controlBtn, isMuted && styles.controlBtnActive]} 
                onPress={handleMute}
              >
                {isMuted ? (
                  <MicOff size={24} color="#FFFFFF" />
                ) : (
                  <Mic size={24} color="#B9AFC4" />
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.endCallBtnWrapper} 
                onPress={() => setShowEndCallModal(true)}
                activeOpacity={0.85}
              >
                <LinearGradient colors={['#FF4D4D', '#CC0000']} style={styles.endCallBtn}>
                  <PhoneOff size={28} color="#FFFFFF" fill="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.controlBtn, isSpeakerOn && styles.controlBtnActive]}
                onPress={handleSpeaker}
              >
                {isSpeakerOn ? (
                  <Volume2 size={24} color="#FFFFFF" />
                ) : (
                  <VolumeX size={24} color="#B9AFC4" />
                )}
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </LinearGradient>

      <EndCallModal 
        visible={showEndCallModal} 
        onCancel={() => setShowEndCallModal(false)}
        onEndCall={handleEndCall}
      />

      <LowBalanceWarning 
        visible={showLowBalance}
        onClose={() => setShowLowBalance(false)}
        onRecharge={() => {
          setShowLowBalance(false);
          navigation.navigate('Wallet');
        }}
      />

      {/* Animated Toast */}
      {toastMessage && (
        <Animated.View 
          style={[
            styles.toastContainer, 
            { 
              opacity: toastAnim,
              transform: [
                {
                  translateY: toastAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0]
                  })
                }
              ]
            }
          ]}
          pointerEvents="none"
        >
          <View style={styles.toastContent}>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight! + 20 : 20,
    paddingHorizontal: 20,
    gap: 12,
  },
  timerGlassPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    gap: 8,
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1,
  },
  coinPill: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  coinText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '700',
  },
  avatarsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.12,
    gap: 30,
  },
  avatarWrapper: {
    alignItems: 'center',
  },
  glowRingContainer: {
    position: 'absolute',
    top: -6,
    bottom: -6,
    left: -6,
    right: -6,
    borderRadius: 100,
  },
  avatarGlowRing: {
    flex: 1,
    borderRadius: 100,
    opacity: 0.85,
  },
  avatarInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#1A1025',
    overflow: 'hidden',
    backgroundColor: '#333',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  nameBadge: {
    marginTop: 16,
    backgroundColor: 'rgba(255, 0, 122, 0.25)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatarName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  giftDockWrapper: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  giftsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  giftsTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  giftsScroll: {
    gap: 16,
    paddingRight: 20,
  },
  giftCard: {
    width: 86,
    height: 100,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  giftIconText: {
    fontSize: 34,
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 6,
  },
  giftPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  coinDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFD700',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  giftPriceText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  controlsDock: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
  },
  controlsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  controlBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlBtnActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  endCallBtnWrapper: {
    shadowColor: '#FF4D4D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  endCallBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  toastContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  toastContent: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  toastText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default AudioCallScreen;
