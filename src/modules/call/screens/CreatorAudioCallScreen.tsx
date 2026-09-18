import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Clock, Mic, MicOff, PhoneOff, Volume2, VolumeX } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AuthStackParamList } from '../../../navigation/AuthNavigator';
import EndCallModal from '../components/EndCallModal';
import createAgoraRtcEngine, { ChannelProfileType, ClientRoleType, IRtcEngine } from 'react-native-agora';
import { request, PERMISSIONS } from 'react-native-permissions';
import { getSocket } from '../../../api/socketClient';
import apiClient from '../../../api/apiClient';

type Props = NativeStackScreenProps<AuthStackParamList, 'CreatorAudioCallScreen'>;

const { width, height } = Dimensions.get('window');
const AGORA_APP_ID = '0d5ce553174a45f0a1b25684e02f8164';

const CreatorAudioCallScreen: React.FC<Props> = ({ navigation, route }) => {
  const {  
    callerName = 'User',
    callerAvatar = 'https://ui-avatars.com/api/?name=User&background=random',
    callId,
    rate = 0,
    agoraToken = '',
    targetId,
  } = route.params || {};

  // Coin & Timer State
  const [coinsEarned, setCoinsEarned] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isJoined, setIsJoined] = useState(false);

  const elapsedTimeRef = useRef(0);
  const coinsEarnedRef = useRef(0);

  useEffect(() => { elapsedTimeRef.current = elapsedTime; }, [elapsedTime]);
  useEffect(() => { coinsEarnedRef.current = coinsEarned; }, [coinsEarned]);
  
  const engine = useRef<IRtcEngine>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [showEndCallModal, setShowEndCallModal] = useState(false);

  const [debugError, setDebugError] = useState<string>('');
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const channelName = callId ? `call_${callId}` : 'test-audio-channel'; 

  const [fetchedMyName, setFetchedMyName] = useState('Creator');
  const [fetchedMyAvatar, setFetchedMyAvatar] = useState('https://hima-bucket.s3.amazonaws.com/default-avatar.png');

  useEffect(() => {
    // Fetch own profile for the second avatar
    apiClient.get('/api/user/me')
      .then(res => {
        if (res.data?.data) {
          const user = res.data.data;
          setFetchedMyName(user.username || user.full_name || 'Creator');
          if (user.avatar_url) {
            setFetchedMyAvatar(user.avatar_url);
          }
        }
      })
      .catch(err => console.log('Error fetching creator profile', err));

    // Start pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();

    setupAgoraEngine();
    setupSocketListeners();

    return () => {
      engine.current?.leaveChannel();
      engine.current?.release();
      const socket = getSocket();
      if (socket) {
        socket.off('call_ended');
        socket.off('insufficient_coins');
      }
    };
  }, []);

  const setupSocketListeners = () => {
    const socket = getSocket();
    if (!socket) return;
    
    // Join socket room
    socket.emit('join_call', { callId });

    socket.on('call_ended', () => {
      handleCallCleanup();
    });

    socket.on('insufficient_coins', () => {
      handleCallCleanup();
    });
  };

  const setupAgoraEngine = async () => {
    try {
      setDebugError('Req Perms...');
      if (Platform.OS === 'android') {
        await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
      } else {
        await request(PERMISSIONS.IOS.MICROPHONE);
      }

      setDebugError('Init Agora...');
      engine.current = createAgoraRtcEngine();
      engine.current.initialize({ appId: AGORA_APP_ID });
      engine.current.enableAudio();
      engine.current.setChannelProfile(ChannelProfileType.ChannelProfileCommunication);
      engine.current.setDefaultAudioRouteToSpeakerphone(true);

      engine.current.registerEventHandler({
        onJoinChannelSuccess: (connection, elapsed) => {
          setDebugError(''); // Clear any previous errors
          console.log('Joined Agora channel successfully', connection);
          setIsJoined(true);
        },
        onUserJoined: (connection, uid, elapsed) => {
          console.log('Remote user joined', uid);
        },
        onUserOffline: (connection, uid, reason) => {
          console.log('Remote user left', uid);
          // handleCallCleanup(); // Temporarily disabled: do not aggressively end call if user drops due to payment app
        },
        onError: (err, msg) => {
          console.log('Agora Error:', err, msg);
          setDebugError(`Agora Err: ${err} ${msg}`);
        }
      });

      engine.current.joinChannel(agoraToken, channelName, 0, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      });

    } catch (e: any) {
      console.log('Error setting up Agora', e);
      setDebugError('Catch: ' + (e.message || String(e)));
    }
  };

  // Up-counter timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isJoined) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isJoined]);

  useEffect(() => {
    if (isJoined) {
      setCoinsEarned(Number(rate)); // First minute is charged immediately
    }
  }, [isJoined, rate]);

  // Coin earning calculation (client-side visual sync, actual is handled in backend)
  useEffect(() => {
    if (elapsedTime > 0 && elapsedTime % 60 === 0) {
      setCoinsEarned(prev => prev + Number(rate));
    }
  }, [elapsedTime, rate]);

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

  const handleCallCleanup = () => {
    setShowEndCallModal(false);
    engine.current?.leaveChannel();
    // Navigate to Summary Screen
    navigation.replace('CreatorCallSummaryScreen', {
      callerId: targetId,
      callerName,
      callerAvatar,
      coinsEarned: coinsEarnedRef.current,
      callDurationSeconds: elapsedTimeRef.current,
    });
  };

  const emitLeaveCall = () => {
    const socket = getSocket();
    if (socket) {
      socket.emit('leave_call', { callId });
    }
    handleCallCleanup();
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
              <Text style={styles.coinText}>+{coinsEarned} Coins</Text>
            </View>
            <View style={styles.timerPill}>
              <Clock size={14} color="#5B0E8B" />
              <Text style={styles.timerText}>
                {isJoined ? formatTime(elapsedTime) : 'Connecting...'}
              </Text>
            </View>
          </View>
          
          {/* Center Avatar & Ripples */}
          <View style={styles.centerContent}>
            <View style={styles.avatarContainer}>
              <Animated.View style={[styles.rippleOuter, { transform: [{ scale: pulseAnim }] }]} />
              <Animated.View style={[styles.rippleInner, { transform: [{ scale: pulseAnim }] }]} />
              
              <View style={styles.avatarCore}>
                <Image source={{ uri: callerAvatar }} style={styles.avatarImg} />
              </View>
            </View>

            <View style={styles.nameBadge}>
              <Text style={styles.avatarName}>{callerName}</Text>
            </View>
          </View>

          <View style={{ flex: 1 }} />

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
        onEndCall={emitLeaveCall}
      />
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
  controlsDock: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 80 : 70,
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
});

export default CreatorAudioCallScreen;
