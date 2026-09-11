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
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Clock,
  Mic,
  MicOff,
  PhoneOff,
  VideoOff,
  Video as VideoIcon,
  Gift,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AuthStackParamList } from '../../../navigation/AuthNavigator';
import EndCallModal from '../components/EndCallModal';
import LowBalanceWarning from '../components/LowBalanceWarning';
import apiClient from '../../../api/apiClient';
import createAgoraRtcEngine, {
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
  RtcSurfaceView,
  VideoSourceType,
} from 'react-native-agora';
import { request, PERMISSIONS } from 'react-native-permissions';
import FaceDetector from '@react-native-ml-kit/face-detection';

type Props = NativeStackScreenProps<AuthStackParamList, 'VideoCallScreen'>;

const { width, height } = Dimensions.get('window');
const AGORA_APP_ID = '0d5ce553174a45f0a1b25684e02f8164';

const VideoCallScreen: React.FC<Props> = ({ navigation, route }) => {
  const {
    callerName = 'You',
    calleeName = 'User',
    callerAvatar = 'https://ui-avatars.com/api/?name=You&background=random',
    calleeAvatar = 'https://ui-avatars.com/api/?name=User&background=random',
    callId,
    targetId,
  } = route.params || {};

  // Coin & Timer
  const [coins, setCoins] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showLowBalance, setShowLowBalance] = useState(false);
  const [callCostPerMinute, setCallCostPerMinute] = useState<number>(0);

  // Gifts
  const [gifts, setGifts] = useState<
    { id: string; name: string; price: number; icon: string; color: string }[]
  >([]);

  // Fetched caller info
  const [fetchedCallerName, setFetchedCallerName] = useState<string | null>(null);
  const [fetchedCallerAvatar, setFetchedCallerAvatar] = useState<string | null>(null);

  // Call controls
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showEndCallModal, setShowEndCallModal] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [isPreviewReady, setIsPreviewReady] = useState(false);
  const [remoteUid, setRemoteUid] = useState<number | null>(null);
  // Ref version of remoteUid so the snapshot interval (closure) always reads the latest value
  const remoteUidRef = useRef<number | null>(null);

  // Face detection
  // How many consecutive 3-second checks have had NO face
  const localNoFaceCount = useRef(0);
  const remoteNoFaceCount = useRef(0);
  // Warning overlay state
  const [faceWarning, setFaceWarning] = useState<'local' | 'remote' | null>(null);
  const [faceWarningCountdown, setFaceWarningCountdown] = useState(5);
  const faceWarningTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  // Snapshot pending tracking to avoid overlapping calls
  const snapshotInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const engine = useRef<IRtcEngine>(null);
  const channelName = 'test-video-channel';

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastAnim = useRef(new Animated.Value(0)).current;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(toastAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setToastMessage(null));
  };

  useEffect(() => {
    fetchInitialData();
    setupAgoraEngine();
    return () => {
      engine.current?.leaveChannel();
      engine.current?.release();
      if (snapshotInterval.current) clearInterval(snapshotInterval.current);
      if (faceWarningTimer.current) clearInterval(faceWarningTimer.current);
    };
  }, []);

  const fetchInitialData = async () => {
    try {
      const [giftsRes, configRes, userRes, walletRes] = await Promise.all([
        apiClient.get('/api/gifts').catch(() => null),
        apiClient.get('/api/config/call-rates').catch(() => null),
        apiClient.get('/api/user/me').catch(() => null),
        apiClient.get('/api/wallet/balance').catch(() => null),
      ]);

      if (giftsRes?.data?.data) setGifts(giftsRes.data.data);

      const cost =
        configRes?.data?.data?.videoCallCost ??
        configRes?.data?.data?.audioCallCost ??
        10;
      setCallCostPerMinute(cost);

      const user = userRes?.data?.data;
      if (user) {
        setFetchedCallerName(user.name);
        if (user.avatar_url) setFetchedCallerAvatar(user.avatar_url);
      }

      const fetchedCoins = walletRes?.data?.data?.coin_balance ?? 0;
      setCoins(fetchedCoins);
      setTimeLeft(Math.floor((fetchedCoins / cost) * 60));
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
        await request(PERMISSIONS.ANDROID.CAMERA);
      } else {
        await request(PERMISSIONS.IOS.MICROPHONE);
        await request(PERMISSIONS.IOS.CAMERA);
      }

      engine.current = createAgoraRtcEngine();
      engine.current.initialize({ appId: AGORA_APP_ID });
      engine.current.enableAudio();
      engine.current.enableVideo();
      engine.current.setChannelProfile(ChannelProfileType.ChannelProfileCommunication);
      engine.current.startPreview();
      setIsPreviewReady(true); // local camera feed is live immediately after startPreview

      engine.current.addListener('onJoinChannelSuccess', () => {
        console.log('Joined Agora video channel');
        setIsJoined(true);
        // Start taking snapshots for face detection once in channel
        startFaceDetectionLoop();
      });

      engine.current.addListener('onUserJoined', (connection, uid) => {
        console.log('Remote user joined', uid);
        remoteUidRef.current = uid;
        setRemoteUid(uid);
      });

      engine.current.addListener('onUserOffline', (connection, uid) => {
        console.log('Remote user left', uid);
        remoteUidRef.current = null;
        setRemoteUid(null);
        handleEndCall();
      });

      // Handle snapshot result — run ML Kit face detection on the saved image
      engine.current.addListener(
        'onSnapshotTaken',
        async (connection, uid, filePath, width, height, errCode) => {
          console.log('onSnapshotTaken fired:', { uid, filePath, errCode });

          // If snapshot fails (e.g., errCode -2: camera covered / no frames), treat as no face
          if (errCode !== 0 || !filePath) {
            console.log(`Snapshot failed for uid ${uid}. Treating as no face.`);
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
            console.log(`Face detection result for uid ${uid}:`, { hasFace, facesCount: faces.length });

            if (uid === 0) {
              // Local user (male)
              if (hasFace) {
                localNoFaceCount.current = 0;
                // If local warning was active, dismiss it
                setFaceWarning(prev => (prev === 'local' ? null : prev));
              } else {
                localNoFaceCount.current += 1;
                // Each check = 3 seconds. 10s = ~3 checks before warning
                if (localNoFaceCount.current >= 3) {
                  triggerFaceWarning('local');
                }
              }
            } else {
              // Remote user (female)
              if (hasFace) {
                remoteNoFaceCount.current = 0;
                setFaceWarning(prev => (prev === 'remote' ? null : prev));
              } else {
                remoteNoFaceCount.current += 1;
                if (remoteNoFaceCount.current >= 3) {
                  triggerFaceWarning('remote');
                }
              }
            }
          } catch (e) {
            console.log('Face detection error:', e);
          }
        }
      );

      // IMPORTANT: Always join the channel AFTER registering all event listeners
      engine.current.joinChannel('', channelName, 0, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      });

    } catch (e) {
      console.log('Error setting up Agora video', e);
    }
  };

  // Take snapshots every 3 seconds for face detection
  const startFaceDetectionLoop = () => {
    console.log('Starting face detection loop...');
    if (snapshotInterval.current) clearInterval(snapshotInterval.current);
    snapshotInterval.current = setInterval(() => {
      try {
        const cacheDir = '/data/data/com.himameet.app/cache';
        const ts = Date.now();
        
        console.log('Taking local snapshot...');
        const localRes = engine.current?.takeSnapshot(0, `${cacheDir}/face_local_${ts}.jpg`);
        console.log('Local snapshot trigger result:', localRes);
        
        // If it fails synchronously (e.g. camera off/covered), treat as no face
        if (localRes !== undefined && localRes < 0) {
          localNoFaceCount.current += 1;
          if (localNoFaceCount.current >= 3) triggerFaceWarning('local');
        }

        if (remoteUidRef.current !== null) {
          console.log('Taking remote snapshot for uid:', remoteUidRef.current);
          const remoteRes = engine.current?.takeSnapshot(
            remoteUidRef.current,
            `${cacheDir}/face_remote_${ts}.jpg`
          );
          console.log('Remote snapshot trigger result:', remoteRes);
          
          if (remoteRes !== undefined && remoteRes < 0) {
            remoteNoFaceCount.current += 1;
            if (remoteNoFaceCount.current >= 3) triggerFaceWarning('remote');
          }
        }
      } catch (e) {
        console.log('Snapshot interval error:', e);
      }
    }, 3000);
  };

  const triggerFaceWarning = (who: 'local' | 'remote') => {
    // Don't re-trigger if already showing a warning
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
        handleEndCall();
      }
    }, 1000);
  };

  // When warning is dismissed (face came back), clear the countdown timer
  useEffect(() => {
    if (faceWarning === null && faceWarningTimer.current) {
      clearInterval(faceWarningTimer.current);
      faceWarningTimer.current = null;
    }
  }, [faceWarning]);

  // Countdown timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (timeLeft !== null) {
      if (timeLeft <= 0) {
        handleEndCall();
        return;
      }
      if (timeLeft === 60) setShowLowBalance(true);
      timer = setInterval(() => {
        setTimeLeft(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Heartbeat
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const heartbeatTimer = setInterval(() => {
      setCoins(prevCoins => {
        const newCoins = prevCoins - callCostPerMinute;
        return newCoins > 0 ? newCoins : 0;
      });
      if (callId) {
        apiClient
          .post('/api/call/heartbeat', { callId })
          .catch(e => console.log('Heartbeat failed:', e));
      }
    }, 60000);
    return () => clearInterval(heartbeatTimer);
  }, [callCostPerMinute, callId, timeLeft === null || timeLeft <= 0]);

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

  const handleEndCall = () => {
    setShowEndCallModal(false);
    engine.current?.leaveChannel();
    navigation.replace('CallFeedbackScreen', {
      creatorName: calleeName,
      creatorId: targetId,
      callId: callId,
    });
  };

  const handleSendGift = async (gift: {
    id: string;
    name: string;
    price: number;
    icon: string;
    color: string;
  }) => {
    if (coins < gift.price) {
      showToast('Not enough coins to send this gift.');
      return;
    }
    try {
      const newCoins = coins - gift.price;
      setCoins(newCoins);
      const newMaxSeconds = Math.floor((newCoins / callCostPerMinute) * 60);
      if (timeLeft && newMaxSeconds < timeLeft) setTimeLeft(newMaxSeconds);
      if (newMaxSeconds <= 60 && newMaxSeconds > 0) setShowLowBalance(true);
      else if (newMaxSeconds <= 0) handleEndCall();
      await apiClient.post('/api/call/gift', { giftId: gift.id });
      showToast(`Sent ${gift.name} ${gift.icon}`);
    } catch (err) {
      console.log('Error sending gift', err);
      setCoins(coins);
      showToast('Failed to send gift');
    }
  };

  const formatTime = (totalSeconds: number) => {
    if (totalSeconds < 0) return '00:00';
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs > 0 ? hrs.toString().padStart(2, '0') + ':' : ''}${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
          source={{ uri: calleeAvatar }}
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
          <Clock
            size={16}
            color={timeLeft !== null && timeLeft <= 60 ? '#FF4D4D' : '#00DFD8'}
          />
          <Text
            style={[
              styles.timerText,
              timeLeft !== null && timeLeft <= 60 && { color: '#FF4D4D' },
            ]}
          >
            {timeLeft !== null ? formatTime(timeLeft) : 'Connecting...'}
          </Text>
        </View>
        <View style={styles.coinPill}>
          <Text style={styles.coinText}>{coins} Coins</Text>
        </View>
      </View>

      {/* Callee name badge */}
      <View style={[styles.calleeBadge, { top: statusBarHeight + 82 }]}>
        <View style={styles.liveDotWrapper}>
          <View style={styles.liveDot} />
        </View>
        <Text style={styles.calleeName}>{calleeName}</Text>
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
            {isVideoOff ? (
              <VideoOff size={28} color="#FFF" />
            ) : (
              <Image
                source={{ uri: fetchedCallerAvatar || callerAvatar }}
                style={styles.pipVideo}
              />
            )}
          </View>
        )}
        <View style={styles.pipNameBadge}>
          <Text style={styles.pipName}>{fetchedCallerName || callerName}</Text>
        </View>
      </View>

      {/* Bottom: gifts + controls */}
      <View style={styles.bottomSection}>

        {/* Gift Dock */}
        <View style={styles.giftDockWrapper}>
          <View style={styles.giftsHeader}>
            <Gift size={15} color="#FFD700" />
            <Text style={styles.giftsTitle}>Send a Gift</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.giftsScroll}
          >
            {gifts.map(gift => (
              <TouchableOpacity
                key={gift.id}
                activeOpacity={0.8}
                onPress={() => handleSendGift(gift)}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.04)']}
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

        {/* Controls Pill */}
        <View style={styles.controlsDock}>
          <LinearGradient
            colors={['rgba(40, 30, 60, 0.65)', 'rgba(20, 15, 30, 0.85)']}
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
              style={[styles.controlBtn, isVideoOff && styles.controlBtnActive]}
              onPress={handleVideoToggle}
            >
              {isVideoOff ? (
                <VideoOff size={24} color="#FFFFFF" />
              ) : (
                <VideoIcon size={24} color="#B9AFC4" />
              )}
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>

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
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
          pointerEvents="none"
        >
          <View style={styles.toastContent}>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        </Animated.View>
      )}

      {/* Face Detection Warning Overlay */}
      {faceWarning !== null && (
        <View style={styles.faceWarningOverlay} pointerEvents="none">
          <LinearGradient
            colors={['rgba(200,0,0,0.93)', 'rgba(100,0,0,0.97)']}
            style={styles.faceWarningCard}
          >
            <Text style={styles.faceWarningEmoji}>⚠️</Text>
            <Text style={styles.faceWarningTitle}>
              {faceWarning === 'local' ? 'Show your face!' : `${calleeName} not showing face`}
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
  topGradient: {
    position: 'absolute', top: 0, width: '100%', zIndex: 1,
  },
  bottomGradient: {
    position: 'absolute', bottom: 0, width: '100%', height: 320, zIndex: 1,
  },
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
    backgroundColor: 'rgba(255,215,0,0.18)',
    paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: 30, borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.35)',
  },
  coinText: { color: '#FFD700', fontSize: 14, fontWeight: '700' },
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
  giftDockWrapper: { marginBottom: 16, paddingHorizontal: 20 },
  giftsHeader: {
    flexDirection: 'row', alignItems: 'center',
    gap: 8, marginBottom: 12, paddingHorizontal: 4,
  },
  giftsTitle: { color: '#FFF', fontSize: 15, fontWeight: '700', letterSpacing: 0.5 },
  giftsScroll: { gap: 14, paddingRight: 20 },
  giftCard: {
    width: 80, height: 92, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', overflow: 'hidden',
  },
  giftIconText: {
    fontSize: 30, marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 5,
  },
  giftPriceRow: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 7, paddingVertical: 3, borderRadius: 10,
  },
  coinDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#FFD700', borderWidth: 1, borderColor: '#FFF',
  },
  giftPriceText: { color: '#FFF', fontSize: 11, fontWeight: '800' },
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
  toastContainer: {
    position: 'absolute', bottom: 130, left: 0, right: 0,
    alignItems: 'center', zIndex: 9999,
  },
  toastContent: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingHorizontal: 24, paddingVertical: 12,
    borderRadius: 30, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  toastText: { color: '#FFF', fontSize: 14, fontWeight: '600', textAlign: 'center' },
  // Face warning overlay
  faceWarningOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
    elevation: 9999, // IMPORTANT: Needed on Android to render over RtcSurfaceView
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
  faceWarningEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  faceWarningTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  faceWarningSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 20,
  },
  faceWarningCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  faceWarningCountdownNum: {
    color: '#FFF',
    fontSize: 38,
    fontWeight: '900',
  },
  faceWarningEndText: {
    color: 'rgba(255,220,220,0.9)',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default VideoCallScreen;
