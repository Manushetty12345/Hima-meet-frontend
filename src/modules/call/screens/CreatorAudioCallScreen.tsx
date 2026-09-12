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
    agoraToken = ''
  } = route.params || {};

  // Coin & Timer State
  const [coinsEarned, setCoinsEarned] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isJoined, setIsJoined] = useState(false);
  
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
          handleCallCleanup();
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
    // Return back to Dashboard
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.replace('MainTabs');
    }
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
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <Image 
        source={{ uri: callerAvatar }} 
        style={[StyleSheet.absoluteFill, { opacity: 0.5 }]} 
        blurRadius={40} 
      />

      <LinearGradient 
        colors={['rgba(18, 10, 30, 0.6)', 'rgba(10, 5, 20, 0.9)', '#000000']} 
        style={styles.container} 
      >
        <View style={styles.safeArea}>
          <View style={styles.header}>
            <View style={styles.timerGlassPill}>
              <Clock size={16} color="#00DFD8" />
              <Text style={styles.timerText}>
                {isJoined ? formatTime(elapsedTime) : 'Connecting...'}
              </Text>
            </View>
            <View style={styles.coinPill}>
               <Text style={styles.coinText}>+{coinsEarned} Coins</Text>
            </View>
          </View>
          <Text style={{ color: 'red', textAlign: 'center', marginTop: 10, fontSize: 12 }}>DEBUG CHANNEL: {channelName}</Text>
          {debugError ? <Text style={{ color: 'yellow', textAlign: 'center', fontSize: 10 }}>ERR: {debugError}</Text> : null}

          <View style={styles.avatarsContainer}>
            {/* Caller Avatar (Male) */}
            <Animated.View style={[styles.avatarWrapper, { zIndex: 2 }]}>
              <Animated.View style={[styles.glowRingContainer, { transform: [{ scale: pulseAnim }] }]}>
                <LinearGradient colors={['#00DFD8', '#007CF0']} style={styles.avatarGlowRing} />
              </Animated.View>
              <View style={styles.avatarInner}>
                <Image source={{ uri: callerAvatar }} style={styles.avatarImage} />
              </View>
              <View style={[styles.nameBadge, { backgroundColor: 'rgba(0, 124, 240, 0.3)' }]}>
                <Text style={[styles.avatarName, { color: '#E0F7FA' }]}>{callerName}</Text>
              </View>
            </Animated.View>
            
            {/* Creator Avatar (Female) */}
            <Animated.View style={[styles.avatarWrapper, { marginLeft: -25, transform: [{ scale: 0.95 }], zIndex: 1 }]}>
              <Animated.View style={[styles.glowRingContainer, { transform: [{ scale: pulseAnim }] }]}>
                <LinearGradient colors={['#FF007A', '#7928CA']} style={styles.avatarGlowRing} />
              </Animated.View>
              <View style={styles.avatarInner}>
                <Image source={{ uri: fetchedMyAvatar }} style={styles.avatarImage} />
              </View>
              <View style={styles.nameBadge}>
                <Text style={styles.avatarName}>{fetchedMyName}</Text>
              </View>
            </Animated.View>
          </View>

          <View style={{ flex: 1 }} />

          <View style={styles.controlsDock}>
            <LinearGradient 
              colors={['rgba(40, 30, 60, 0.6)', 'rgba(20, 15, 30, 0.8)']} 
              style={styles.controlsPill}
            >
              <TouchableOpacity 
                style={[styles.controlBtn, isMuted && styles.controlBtnActive]} 
                onPress={handleMute}
              >
                {isMuted ? <MicOff size={24} color="#FFFFFF" /> : <Mic size={24} color="#B9AFC4" />}
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
                {isSpeakerOn ? <Volume2 size={24} color="#FFFFFF" /> : <VolumeX size={24} color="#B9AFC4" />}
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
  container: { flex: 1, backgroundColor: '#000000' },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight! + 20 : 50,
    paddingHorizontal: 20, gap: 12,
  },
  timerGlassPill: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 20, paddingVertical: 10, borderRadius: 30, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)', gap: 8,
  },
  timerText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', letterSpacing: 1 },
  coinPill: {
    backgroundColor: 'rgba(0, 223, 216, 0.15)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 30, borderWidth: 1, borderColor: 'rgba(0, 223, 216, 0.3)',
  },
  coinText: { color: '#00DFD8', fontSize: 14, fontWeight: '700' },
  avatarsContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: height * 0.15, gap: 30 },
  avatarWrapper: { alignItems: 'center' },
  glowRingContainer: { position: 'absolute', top: -6, bottom: -6, left: -6, right: -6, borderRadius: 100 },
  avatarGlowRing: { flex: 1, borderRadius: 100, opacity: 0.85 },
  avatarInner: { width: 140, height: 140, borderRadius: 70, borderWidth: 4, borderColor: '#1A1025', overflow: 'hidden', backgroundColor: '#333' },
  avatarImage: { width: '100%', height: '100%' },
  nameBadge: { marginTop: 16, backgroundColor: 'rgba(255, 0, 122, 0.25)', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  avatarName: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  controlsDock: { paddingHorizontal: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 30 },
  controlsPill: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 40, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)' },
  controlBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255, 255, 255, 0.05)', alignItems: 'center', justifyContent: 'center' },
  controlBtnActive: { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
  endCallBtnWrapper: { shadowColor: '#FF4D4D', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 10 },
  endCallBtn: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255, 255, 255, 0.2)' },
});

export default CreatorAudioCallScreen;
