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
import { getSocket } from '../../../api/socketClient';

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
    targetId,
    agoraToken = '',
    callRate
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
  const channelName = callId ? `call_${callId}` : 'test-audio-channel';

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
    
    const socket = getSocket();
    if (socket) {
      socket.emit('join_call', { callId });
      socket.on('call_ended', () => {
        handleEndCall();
      });
      socket.on('insufficient_coins', () => {
        handleEndCall();
      });
    }

    const unsubscribeFocus = navigation.addListener('focus', () => {
      fetchInitialData();
    });

    return () => {
      // Cleanup
      engine.current?.leaveChannel();
      engine.current?.release();
      if (socket) {
        socket.off('call_ended');
        socket.off('insufficient_coins');
      }
      unsubscribeFocus();
    };
  }, [navigation]);

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
      
      const cost = callRate || configRes?.data?.data?.audioCallCost || 10;
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
      engine.current.setDefaultAudioRouteToSpeakerphone(true);

      engine.current.registerEventHandler({
        onJoinChannelSuccess: (connection, elapsed) => {
          console.log('Joined Agora channel successfully', connection);
          setIsJoined(true);
        },
        onUserJoined: (connection, uid, elapsed) => {
          console.log('Remote user joined', uid);
        },
        onUserOffline: (connection, uid, reason) => {
          console.log('Remote user left', uid);
          // handleEndCall(); // Temporarily disabled: do not aggressively end call if user drops due to payment app
        }
      });

      // Join channel immediately
      // In production, you would fetch a token here. For testing with App ID, pass '' as token.
      engine.current.joinChannel(agoraToken, channelName, 0, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
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
        // Do not handleEndCall() here. Let backend emit 'insufficient_coins' when actually out of balance.
        return;
      }
      if (timeLeft === 60) {
        setShowLowBalance(true);
      }
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
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
    const socket = getSocket();
    if (socket && callId) {
      socket.emit('leave_call', { callId });
    }
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
      await apiClient.post('/api/call/gift', { giftId: gift.id, receiverId: targetId });
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
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Main Layout Gradient */}
      <LinearGradient 
        colors={['#FBF7FF', '#EFDFFB', '#FBF6EC']} 
        style={styles.container}
      >
        <View style={styles.safeArea}>
          
          {/* Top Bar: Coin Balance & Timer */}
          <View style={styles.topBar}>
            <View style={styles.coinPill}>
              <View style={styles.coinDotSmall} />
              <Text style={styles.coinText}>{coins.toLocaleString()} Coins</Text>
            </View>
            <View style={styles.timerPill}>
              <Clock size={14} color="#5B0E8B" />
              <Text style={[styles.timerText, timeLeft !== null && timeLeft <= 60 && { color: '#FF4D4D' }]}>
                {timeLeft !== null ? formatTime(timeLeft) : 'Connecting...'}
              </Text>
            </View>
          </View>

          {/* Center Avatar & Ripples */}
          <View style={styles.centerContent}>
            <View style={styles.avatarContainer}>
              <Animated.View style={[styles.rippleOuter, { transform: [{ scale: pulseAnim }] }]} />
              <Animated.View style={[styles.rippleInner, { transform: [{ scale: pulseAnim }] }]} />
              
              <View style={styles.avatarCore}>
                <Image source={{ uri: calleeAvatar }} style={styles.avatarImg} />
              </View>
            </View>

            <View style={styles.nameBadge}>
              <Text style={styles.avatarName}>{calleeName}</Text>
            </View>
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
              colors={['#FFFFFF', '#FBF7FF']} 
              style={styles.controlsPill}
            >
              <TouchableOpacity 
                style={[styles.controlBtn, isMuted && styles.controlBtnActive]} 
                onPress={handleMute}
              >
                {isMuted ? (
                  <MicOff size={24} color="#5B0E8B" />
                ) : (
                  <Mic size={24} color="#8B7F98" />
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
                  <Volume2 size={24} color="#5B0E8B" />
                ) : (
                  <VolumeX size={24} color="#8B7F98" />
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
          const socket = getSocket();
          if (socket) socket.emit('recharging_call', { callId: route.params?.callId });
          import('@react-native-async-storage/async-storage').then(({ default: AsyncStorage }) => {
            AsyncStorage.setItem('hima_returnToScreen', 'AudioCallScreen');
            AsyncStorage.setItem('hima_call_params', JSON.stringify(route.params || {}));
            navigation.navigate('Wallet' as any);
          });
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
    backgroundColor: '#FBF6EC',
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 40 : StatusBar.currentHeight ?? 24,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 16,
  },
  coinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EBDFC4',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  coinDotSmall: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#F5C542',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  coinText: {
    color: '#2A1240',
    fontSize: 14,
    fontWeight: '700',
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EBDFC4',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  timerText: {
    color: '#5B0E8B',
    fontSize: 14,
    fontWeight: '700',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  avatarContainer: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rippleOuter: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: '#F5C542',
    backgroundColor: 'rgba(245, 197, 66, 0.1)',
  },
  rippleInner: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 2,
    borderColor: '#5B0E8B',
    backgroundColor: 'rgba(91, 14, 139, 0.1)',
  },
  avatarCore: {
    width: 130,
    height: 130,
    borderRadius: 65,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#5B0E8B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  nameBadge: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EBDFC4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarName: {
    color: '#2A1240',
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'PlayfairDisplay-Bold',
  },
  giftDockWrapper: {
    marginBottom: 30,
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
    color: '#2A1240',
    fontSize: 16,
    fontWeight: '700',
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
    borderColor: '#EBDFC4',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  giftIconText: {
    fontSize: 34,
    marginBottom: 10,
  },
  giftPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EFDFFB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  coinDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F5C542',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  giftPriceText: {
    color: '#5B0E8B',
    fontSize: 12,
    fontWeight: '800',
  },
  controlsDock: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 60 : 50,
  },
  controlsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#EBDFC4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  controlBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FBF6EC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EBDFC4',
  },
  controlBtnActive: {
    backgroundColor: 'rgba(91, 14, 139, 0.1)',
    borderColor: '#5B0E8B',
  },
  endCallBtnWrapper: {
    shadowColor: '#EC1372',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  endCallBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
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
