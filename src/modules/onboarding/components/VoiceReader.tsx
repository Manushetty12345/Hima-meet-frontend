import React, { useState, useEffect, useRef } from 'react';
import { getVoiceSentence } from '../api/onboardingApi';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Mic, Lightbulb, Play, RotateCcw, Quote } from 'lucide-react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { PermissionsAndroid, Platform } from 'react-native';

const audioRecorderPlayer = new AudioRecorderPlayer();

// ---- Palette pulled from the Himameet mark ----
const PLUM_ROYAL = '#5B0E8B';
const PLUM_DEEP = '#3D0A63';
const GOLD = '#F5C542';
const GOLD_DEEP = '#D4AF37';
const IVORY = '#FBF6EC';
const IVORY_LINE = '#EBDFC4';
const TEXT_PLUM = '#2A1240';
const TEXT_MUTED = '#8B7F98';

// Light lavender wash — matches the header treatment used across the app
const LILAC_PALE = '#EFDFFB';

type RecordingState = 'IDLE' | 'RECORDING' | 'PLAYBACK';

interface VoiceReaderProps {
  onSubmit: (audioUri: string) => void;
}

const VoiceReader: React.FC<VoiceReaderProps> = ({ onSubmit }) => {
  const [recordingState, setRecordingState] = useState<RecordingState>('IDLE');
  const [sentence, setSentence] = useState('Loading...');
  const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const [audioUri, setAudioUri] = useState('');
  const [playTime, setPlayTime] = useState('00:00:00');
  const [duration, setDuration] = useState('00:00:00');
  const [playProgress, setPlayProgress] = useState(0);

  // ---- Purely visual animation refs (no business logic here) ----
  const ripple1 = useRef(new Animated.Value(0)).current;
  const ripple2 = useRef(new Animated.Value(0)).current;
  const recordPulse = useRef(new Animated.Value(1)).current;
  const bar1 = useRef(new Animated.Value(0.3)).current;
  const bar2 = useRef(new Animated.Value(0.6)).current;
  const bar3 = useRef(new Animated.Value(0.4)).current;
  const bar4 = useRef(new Animated.Value(0.8)).current;
  const bar5 = useRef(new Animated.Value(0.35)).current;
  const startBtnScale = useRef(new Animated.Value(1)).current;
  const submitBtnScale = useRef(new Animated.Value(1)).current;
  const againBtnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    getVoiceSentence().then(res => {
      if (res.data?.data) {
        setSentence(res.data.data);
      }
    }).catch(err => {
      setSentence('Hello! I am excited to join Himameet and meet new people.');
    });

    return () => {
      audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removeRecordBackListener();
      audioRecorderPlayer.removePlayBackListener();
    };
  }, []);

  // Idle ripple loop
  useEffect(() => {
    if (recordingState === 'IDLE') {
      const makeLoop = (val: Animated.Value, delay: number) =>
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(val, {
              toValue: 1,
              duration: 1800,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(val, { toValue: 0, duration: 0, useNativeDriver: true }),
          ]),
        );
      const l1 = makeLoop(ripple1, 0);
      const l2 = makeLoop(ripple2, 900);
      l1.start();
      l2.start();
      return () => {
        l1.stop();
        l2.stop();
      };
    }
  }, [recordingState]);

  // Recording pulse + equalizer bars loop
  useEffect(() => {
    if (recordingState === 'RECORDING') {
      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(recordPulse, {
            toValue: 1.12,
            duration: 650,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(recordPulse, {
            toValue: 1,
            duration: 650,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      );
      const barLoop = (val: Animated.Value, min: number, max: number, dur: number) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(val, { toValue: max, duration: dur, useNativeDriver: false }),
            Animated.timing(val, { toValue: min, duration: dur, useNativeDriver: false }),
          ]),
        );
      const b1 = barLoop(bar1, 0.25, 0.9, 420);
      const b2 = barLoop(bar2, 0.4, 1, 360);
      const b3 = barLoop(bar3, 0.3, 0.75, 500);
      const b4 = barLoop(bar4, 0.5, 1, 300);
      const b5 = barLoop(bar5, 0.2, 0.65, 460);
      pulseLoop.start();
      b1.start(); b2.start(); b3.start(); b4.start(); b5.start();
      return () => {
        pulseLoop.stop();
        b1.stop(); b2.stop(); b3.stop(); b4.stop(); b5.stop();
        recordPulse.setValue(1);
      };
    }
  }, [recordingState]);

  const pressScale = (val: Animated.Value, to: number) => {
    Animated.spring(val, { toValue: to, friction: 6, tension: 80, useNativeDriver: true }).start();
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        if (grants['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          console.warn('Audio permission not granted');
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleStartRecording = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setRecordingState('RECORDING');
    try {
      const uri = await audioRecorderPlayer.startRecorder();
      audioRecorderPlayer.addRecordBackListener((e: any) => {
        setRecordSecs(e.currentPosition);
        setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
      });
      setAudioUri(uri);
    } catch (err) {
      console.log('startRecord error', err);
    }
  };

  const handleStopRecording = async () => {
    setRecordingState('PLAYBACK');
    try {
      const uri = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setAudioUri(uri);
    } catch (err) {
      console.log('stopRecord error', err);
    }
  };

  const handlePlay = async () => {
    try {
      await audioRecorderPlayer.startPlayer(audioUri);
      audioRecorderPlayer.addPlayBackListener((e: any) => {
        setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
        setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));
        setPlayProgress(e.currentPosition / e.duration);
        if (e.currentPosition === e.duration) {
          audioRecorderPlayer.stopPlayer();
          audioRecorderPlayer.removePlayBackListener();
        }
      });
    } catch (err) {
      console.log('startPlay error', err);
    }
  };

  const handleRecordAgain = async () => {
    await audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
    setRecordingState('IDLE');
    setAudioUri('');
    setRecordSecs(0);
    setRecordTime('00:00:00');
    setPlayTime('00:00:00');
    setDuration('00:00:00');
    setPlayProgress(0);
  };

  const rippleStyle = (val: Animated.Value) => ({
    opacity: val.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0] }),
    transform: [{ scale: val.interpolate({ inputRange: [0, 1], outputRange: [1, 1.9] }) }],
  });

  return (
    <View style={styles.container}>
      {recordingState !== 'PLAYBACK' && (
        <>
          <View style={styles.sentenceCard}>
            <View style={styles.sentenceAccent} />
            <View style={styles.quoteBadge}>
              <Quote size={14} color={GOLD_DEEP} fill={GOLD_DEEP} />
            </View>
            <Text style={styles.sentenceLabel}>Please say this sentence</Text>
            <Text style={styles.sentenceText}>{sentence}</Text>
          </View>
          <Text style={styles.instructionText}>Tap and hold to speak</Text>
        </>
      )}

      {recordingState === 'IDLE' && (
        <View style={styles.idleContainer}>
          <View style={styles.tipCard}>
            <View style={styles.tipAccent} />
            <View style={styles.tipIconBadge}>
              <Lightbulb size={18} color={GOLD_DEEP} />
            </View>
            <Text style={styles.tipText}>
              Find a quiet place and speak clearly for better recognition
            </Text>
          </View>

          <View style={styles.buttonWrapper}>
<TouchableOpacity
                style={styles.startRecordingWrapper}
                activeOpacity={0.85}
                onPress={handleStartRecording}
              >
                <LinearGradient
                  colors={[GOLD, GOLD_DEEP]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.startRecordingButton}
                >
                  <View style={styles.micIconBadge}>
                    <Mic size={18} color="#2A1240" />
                  </View>
                  <Text style={styles.buttonText}>Start Recording</Text>
                </LinearGradient>
              </TouchableOpacity>
          </View>
        </View>
      )}

      {/* RECORDING STATE */}
      {recordingState === 'RECORDING' && (
        <View style={styles.recordingContainer}>
          <Pressable onPressOut={handleStopRecording}>
            <LinearGradient
              colors={[PLUM_ROYAL, PLUM_DEEP]}
              style={styles.recordingCircle}
            >
              <Mic size={30} color="#FFFFFF" strokeWidth={2} />
            </LinearGradient>
          </Pressable>
        </View>
      )}

      {/* PLAYBACK STATE */}
      {recordingState === 'PLAYBACK' && (
        <View style={styles.playbackContainer}>
          <Text style={styles.playbackTitle}>Play to listen</Text>

          {/* Audio Slider */}
          <View style={styles.sliderCard}>
            <View style={styles.sliderRow}>
              <TouchableOpacity style={styles.playButton} activeOpacity={0.85} onPress={handlePlay}>
                <LinearGradient
                  colors={[GOLD, GOLD_DEEP]}
                  style={styles.playButtonGradient}
                >
                  <Play size={15} color="#2A1240" fill="#2A1240" />
                </LinearGradient>
              </TouchableOpacity>
              <View style={styles.sliderTrack}>
                <LinearGradient
                  colors={[GOLD, GOLD_DEEP]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.sliderProgress, { width: (`${playProgress * 100}%` as any) }]}
                />
                <View
                  style={[
                    styles.sliderThumb,
                    { left: (`${playProgress * 100}%` as any) },
                  ]}
                />
              </View>
            </View>
            
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.85}
              onPress={handleRecordAgain}
            >
              <RotateCcw size={18} color={TEXT_PLUM} style={styles.buttonIcon} />
              <Text style={styles.secondaryButtonText}>Record Again</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButtonWrapper}
              activeOpacity={0.9}
              onPress={() => onSubmit(audioUri)}
            >
              <LinearGradient
                colors={[GOLD, GOLD_DEEP]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryButton}
              >
                <Text style={styles.primaryButtonText}>Submit</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  sentenceCard: {
    width: '100%',
    backgroundColor: LILAC_PALE,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(91, 14, 139, 0.10)',
  },
  sentenceAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: GOLD_DEEP,
  },
  quoteBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: GOLD_DEEP,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  sentenceLabel: {
    fontSize: 13,
    color: PLUM_ROYAL,
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  sentenceText: {
    fontSize: 24,
    color: TEXT_PLUM,
    fontWeight: '700',
    fontFamily: 'PlayfairDisplay-Bold',
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: TEXT_MUTED,
    fontWeight: '500',
    marginBottom: 12,
  },
  idleContainer: {
    width: '100%',
    alignItems: 'center',
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#F6EFDD',
    borderRadius: 14,
    padding: 12,
    paddingLeft: 16,
    borderWidth: 1,
    borderColor: IVORY_LINE,
    alignItems: 'center',
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  tipAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: GOLD_DEEP,
  },
  tipIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: TEXT_MUTED,
    lineHeight: 20,
  },
  buttonWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 40,
  },

  startRecordingWrapper: {
    width: '100%',
    borderRadius: 0,
    overflow: 'hidden',
    shadowColor: GOLD_DEEP,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 5,
  },
  startRecordingButton: {
    flexDirection: 'row',
    width: '100%',
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micIconBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(42, 18, 64, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#2A1240',
    fontSize: 16,
    fontWeight: '700',
  },
  recordingContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
    position: 'relative',
    marginBottom: 60,
  },
  recordGlowOuter: {
    position: 'absolute',
    top: 10,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(91, 14, 139, 0.10)',
  },
  recordingCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: PLUM_ROYAL,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
  },
  recordDot: {
    position: 'absolute',
    top: 12,
    right: 20,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F5657A',
  },
  recordTimeText: {
    marginTop: 18,
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_PLUM,
    fontFamily: 'PlayfairDisplay-Bold',
    letterSpacing: 0.5,
  },
  equalizerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 5,
    height: 30,
    marginTop: 16,
  },
  equalizerBar: {
    width: 4,
    borderRadius: 2,
    backgroundColor: GOLD_DEEP,
  },
  releaseHint: {
    marginTop: 14,
    fontSize: 13,
    color: TEXT_MUTED,
    fontWeight: '500',
  },
  playbackContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  playbackTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: TEXT_PLUM,
    marginBottom: 24,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  sliderCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    marginBottom: 16,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  playButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 14,
    shadowColor: GOLD_DEEP,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  playButtonGradient: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderTrack: {
    flex: 1,
    height: 4,
    backgroundColor: IVORY_LINE,
    borderRadius: 2,
    position: 'relative',
  },
  sliderProgress: {
    height: '100%',
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    top: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: GOLD_DEEP,
    marginLeft: -6,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 2,
  },
  timeText: {
    fontSize: 11.5,
    color: TEXT_MUTED,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    width: '100%',
    height: 56,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: TEXT_PLUM,
    fontSize: 16,
    fontWeight: '700',
  },
  primaryButtonWrapper: {
    width: '100%',
    borderRadius: 0,
    overflow: 'hidden',
    shadowColor: GOLD_DEEP,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.32,
    shadowRadius: 14,
    elevation: 5,
  },
  primaryButton: {
    width: '100%',
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#1A0733',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default VoiceReader;