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
import {
  Clock,
  Mic,
  MicOff,
  PhoneOff,
  VideoOff,
  Video as VideoIcon,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AuthStackParamList } from '../../../navigation/AuthNavigator';
import EndCallModal from '../components/EndCallModal';
import createAgoraRtcEngine, {
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
  RtcSurfaceView,
  VideoSourceType,
} from 'react-native-agora';
import { request, PERMISSIONS } from 'react-native-permissions';
import FaceDetector from '@react-native-ml-kit/face-detection';
import { getSocket } from '../../../api/socketClient';

type Props = NativeStackScreenProps<AuthStackParamList, 'CreatorVideoCallScreen'>;

const { width, height } = Dimensions.get('window');
const AGORA_APP_ID = '0d5ce553174a45f0a1b25684e02f8164';

const CreatorVideoCallScreen: React.FC<Props> = ({ navigation, route }) => {
  const {
    callerName = 'User',
    callerAvatar = 'https://ui-avatars.com/api/?name=User&background=random',
    callId,
    rate = 0,
    agoraToken = '',
  } = route.params || {};

  // Coin & Timer State
  const [coinsEarned, setCoinsEarned] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  // Call Control State
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showEndCallModal, setShowEndCallModal] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [isPreviewReady, setIsPreviewReady] = useState(false);
  const [remoteUid, setRemoteUid] = useState<number | null>(null);
  
  const remoteUidRef = useRef<number | null>(null);

  // Face detection
  const localNoFaceCount = useRef(0);
  const remoteNoFaceCount = useRef(0);
  const [faceWarning, setFaceWarning] = useState<'local' | 'remote' | null>(null);
  const [faceWarningCountdown, setFaceWarningCountdown] = useState(5);
  const faceWarningTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const snapshotInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const engine = useRef<IRtcEngine>(null);
  const channelName = callId ? `call_${callId}` : 'test-video-channel';

  useEffect(() => {
    setupAgoraEngine();
    setupSocketListeners();
    return () => {
      engine.current?.leaveChannel();
      engine.current?.release();
      if (snapshotInterval.current) clearInterval(snapshotInterval.current);
      if (faceWarningTimer.current) clearInterval(faceWarningTimer.current);
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
      if (Platform.OS === 'android') {
        await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
        await request(PERMISSIONS.ANDROID.CAMERA);
      } else {
        await request(PERMISSIONS.IOS.MICROPHONE);
        await request(PERMISSIONS.IOS.CAMERA);
      }

      engine.current = createAgoraRtcEngine();
      engine.current.initialize({ appId: AGORA_APP_ID });
      engine.current.enableVideo();
      engine.current.enableAudio();
      engine.current.setChannelProfile(ChannelProfileType.ChannelProfileCommunication);
      engine.current.setDefaultAudioRouteToSpeakerphone(true);
      engine.current.startPreview();
      setIsPreviewReady(true);

      engine.current.registerEventHandler({
        onJoinChannelSuccess: (connection, elapsed) => {
          setIsJoined(true);
          startFaceDetectionLoop();
        },
        onUserJoined: (connection, uid, elapsed) => {
          remoteUidRef.current = uid;
          setRemoteUid(uid);
        },
        onUserOffline: (connection, uid, reason) => {
          remoteUidRef.current = null;
          setRemoteUid(null);
          handleCallCleanup();
        },
        onSnapshotTaken: async (connection, uid, filePath, width, height, errCode) => {
          if (errCode !== 0 || !filePath) {
            if (uid === 0) {
              localNoFaceCount.current += 1;
              if (localNoFaceCount.current >= 3) triggerFaceWarning('local');
            } else {
              remoteNoFaceCount.current += 1;
              if (remoteNoFaceCount.current >= 3) triggerFaceWarning('remote');
            }
            return;
          }

          try {
            const imageUri = `file://${filePath}`;
            const faces = await FaceDetector.detect(imageUri);
            const hasFace = faces.length > 0;

            if (uid === 0) {
              if (hasFace) {
                localNoFaceCount.current = 0;
                setFaceWarning(prev => (prev === 'local' ? null : prev));
              } else {
                localNoFaceCount.current += 1;
                if (localNoFaceCount.current >= 3) triggerFaceWarning('local');
              }
            } else {
              if (hasFace) {
                remoteNoFaceCount.current = 0;
                setFaceWarning(prev => (prev === 'remote' ? null : prev));
              } else {
                remoteNoFaceCount.current += 1;
                if (remoteNoFaceCount.current >= 3) triggerFaceWarning('remote');
              }
            }
          } catch (err) {
            console.log('ML Kit detection error:', err);
          }
        }
      });


      engine.current.joinChannel(agoraToken, channelName, 0, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      });

    } catch (e) {
      console.log('Error setting up Agora video', e);
    }
  };

  const startFaceDetectionLoop = () => {
    if (snapshotInterval.current) clearInterval(snapshotInterval.current);
    snapshotInterval.current = setInterval(() => {
      try {
        const cacheDir = '/data/data/com.himameet.app/cache';
        const ts = Date.now();
        
        const localRes = engine.current?.takeSnapshot(0, `${cacheDir}/face_local_${ts}.jpg`);
        if (localRes !== undefined && localRes < 0) {
          localNoFaceCount.current += 1;
          if (localNoFaceCount.current >= 3) triggerFaceWarning('local');
        }

        if (remoteUidRef.current !== null) {
          const remoteRes = engine.current?.takeSnapshot(
            remoteUidRef.current,
            `${cacheDir}/face_remote_${ts}.jpg`
          );
          if (remoteRes !== undefined && remoteRes < 0) {
            remoteNoFaceCount.current += 1;
            if (remoteNoFaceCount.current >= 3) triggerFaceWarning('remote');
          }
        }
      } catch (e) {}
    }, 3000);
  };

  const triggerFaceWarning = (who: 'local' | 'remote') => {
    if (faceWarningTimer.current) return;
    setFaceWarning(who);
    setFaceWarningCountdown(5);
    let count = 5;
    faceWarningTimer.current = setInterval(() => {
      count -= 1;
      setFaceWarningCountdown(count);
      if (count <= 0) {
        clearInterval(faceWarningTimer.current!);
        faceWarningTimer.current = null;
        emitLeaveCall();
      }
    }, 1000);
  };

  useEffect(() => {
    if (faceWarning === null && faceWarningTimer.current) {
      clearInterval(faceWarningTimer.current);
      faceWarningTimer.current = null;
    }
  }, [faceWarning]);

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

  // Coin earning calculation
  useEffect(() => {
    if (elapsedTime > 0 && elapsedTime % 60 === 0) {
      setCoinsEarned(prev => prev + Number(rate));
    }
  }, [elapsedTime, rate]);

  const handleMute = () => {
    const next = !isMuted;
    engine.current?.muteLocalAudioStream(next);
    setIsMuted(next);
  };

  const handleVideoToggle = () => {
    const next = !isVideoOff;
    engine.current?.muteLocalVideoStream(next);
    setIsVideoOff(next);
  };

  const handleCallCleanup = () => {
    setShowEndCallModal(false);
    engine.current?.leaveChannel();
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

  const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 0;

  return (
    <View style={styles.container}>
      {/* @ts-ignore */}
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Remote full-screen video */}
      {remoteUid !== null ? (
        <RtcSurfaceView
          style={StyleSheet.absoluteFill}
          canvas={{ uid: remoteUid, sourceType: VideoSourceType.VideoSourceRemote }}
        />
      ) : (
        <Image
          source={{ uri: callerAvatar }}
          style={[StyleSheet.absoluteFill, { opacity: 0.55 }]}
          blurRadius={30}
        />
      )}

      {/* Gradient overlays */}
      <LinearGradient
        colors={['rgba(0,0,0,0.65)', 'transparent']}
        style={[styles.topGradient, { height: statusBarHeight + 130 }]}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)']}
        style={styles.bottomGradient}
      />

      {/* Header: timer + coins */}
      <View style={[styles.header, { top: statusBarHeight + 14 }]}>
        <View style={styles.timerGlassPill}>
          <Clock size={16} color="#00DFD8" />
          <Text style={styles.timerText}>
            {isJoined ? formatTime(elapsedTime) : 'Connecting...'}
          </Text>
        </View>
        <View style={styles.coinPill}>
          <Text style={styles.coinText}>+{coinsEarned} Coins Earned</Text>
        </View>
      </View>

      {/* Caller name badge */}
      <View style={[styles.calleeBadge, { top: statusBarHeight + 82 }]}>
        <View style={styles.liveDotWrapper}>
          <View style={styles.liveDot} />
        </View>
        <Text style={styles.calleeName}>{callerName}</Text>
      </View>

      {/* Local PiP (self-view) */}
      <View style={[styles.pipContainer, { top: statusBarHeight + 82 }]}>
        {isPreviewReady && !isVideoOff ? (
          <RtcSurfaceView
            style={styles.pipVideo}
            canvas={{ uid: 0, sourceType: VideoSourceType.VideoSourceCamera }}
          />
        ) : (
          <View style={styles.pipVideoOff}>
            <VideoOff size={28} color="#FFF" />
          </View>
        )}
        <View style={styles.pipNameBadge}>
          <Text style={styles.pipName}>You</Text>
        </View>
      </View>

      {/* Bottom: controls */}
      <View style={styles.bottomSection}>
        <View style={styles.controlsDock}>
          <LinearGradient
            colors={['rgba(40, 30, 60, 0.65)', 'rgba(20, 15, 30, 0.85)']}
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
              style={[styles.controlBtn, isVideoOff && styles.controlBtnActive]}
              onPress={handleVideoToggle}
            >
              {isVideoOff ? <VideoOff size={24} color="#FFFFFF" /> : <VideoIcon size={24} color="#B9AFC4" />}
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>

      <EndCallModal
        visible={showEndCallModal}
        onCancel={() => setShowEndCallModal(false)}
        onEndCall={emitLeaveCall}
      />

      {/* Face Detection Warning Overlay */}
      {faceWarning !== null && (
        <View style={styles.faceWarningOverlay} pointerEvents="none">
          <LinearGradient
            colors={['rgba(200,0,0,0.93)', 'rgba(100,0,0,0.97)']}
            style={styles.faceWarningCard}
          >
            <Text style={styles.faceWarningEmoji}>⚠️</Text>
            <Text style={styles.faceWarningTitle}>
              {faceWarning === 'local' ? 'Show your face!' : `${callerName} not showing face`}
            </Text>
            <Text style={styles.faceWarningSubtitle}>
              {faceWarning === 'local'
                ? 'Your face must be visible to continue'
                : 'Call will end if face is not shown'}
            </Text>
            <View style={styles.faceWarningCircle}>
              <Text style={styles.faceWarningCountdownNum}>{faceWarningCountdown}</Text>
            </View>
            <Text style={styles.faceWarningEndText}>Call ends in {faceWarningCountdown}s</Text>
          </LinearGradient>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  topGradient: { position: 'absolute', top: 0, width: '100%', zIndex: 1 },
  bottomGradient: { position: 'absolute', bottom: 0, width: '100%', height: 320, zIndex: 1 },
  header: {
    position: 'absolute', left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    gap: 12, paddingHorizontal: 20, zIndex: 10,
  },
  timerGlassPill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 18, paddingVertical: 9,
    borderRadius: 30, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)', gap: 8,
  },
  timerText: { color: '#FFF', fontSize: 15, fontWeight: '700', letterSpacing: 1 },
  coinPill: {
    backgroundColor: 'rgba(0, 223, 216, 0.15)',
    paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: 30, borderWidth: 1,
    borderColor: 'rgba(0, 223, 216, 0.3)',
  },
  coinText: { color: '#00DFD8', fontSize: 14, fontWeight: '700' },
  calleeBadge: {
    position: 'absolute', left: 18,
    flexDirection: 'row', alignItems: 'center', gap: 8, zIndex: 10,
  },
  liveDotWrapper: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: 'rgba(255,59,48,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF3B30' },
  calleeName: {
    color: '#FFF', fontSize: 20, fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4, letterSpacing: 0.3,
  },
  pipContainer: {
    position: 'absolute', right: 16,
    width: 112, height: 162, borderRadius: 18,
    overflow: 'hidden', borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: '#1A1025', elevation: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5, shadowRadius: 8, zIndex: 10,
  },
  pipVideo: { width: '100%', height: '100%', resizeMode: 'cover' },
  pipVideoOff: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2A1D3A' },
  pipNameBadge: {
    position: 'absolute', bottom: 6, left: 6,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8,
  },
  pipName: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  bottomSection: { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10 },
  controlsDock: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 42 : 28,
  },
  controlsPill: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: 40, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  controlBtn: {
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center', justifyContent: 'center',
  },
  controlBtnActive: { backgroundColor: 'rgba(255,255,255,0.22)' },
  endCallBtnWrapper: {
    shadowColor: '#FF4D4D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45, shadowRadius: 14, elevation: 10,
  },
  endCallBtn: {
    width: 70, height: 70, borderRadius: 35,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)',
  },
  faceWarningOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
    elevation: 9999,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  faceWarningCard: {
    width: width * 0.78,
    borderRadius: 28,
    paddingVertical: 36,
    paddingHorizontal: 28,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,80,80,0.5)',
  },
  faceWarningEmoji: { fontSize: 48, marginBottom: 12 },
  faceWarningTitle: {
    color: '#FFF', fontSize: 22, fontWeight: '800', textAlign: 'center',
    letterSpacing: 0.3, marginBottom: 8,
  },
  faceWarningSubtitle: {
    color: 'rgba(255,255,255,0.75)', fontSize: 14, textAlign: 'center',
    marginBottom: 28, lineHeight: 20,
  },
  faceWarningCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)', alignItems: 'center',
    justifyContent: 'center', marginBottom: 16,
  },
  faceWarningCountdownNum: { color: '#FFF', fontSize: 38, fontWeight: '900' },
  faceWarningEndText: {
    color: 'rgba(255,220,220,0.9)', fontSize: 14, fontWeight: '600', letterSpacing: 0.5,
  },
});

export default CreatorVideoCallScreen;
