import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Mic, Lightbulb, Play, RotateCcw } from 'lucide-react-native';

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
  onSubmit: () => void;
}

const VoiceReader: React.FC<VoiceReaderProps> = ({ onSubmit }) => {
  const [recordingState, setRecordingState] = useState<RecordingState>('IDLE');

  // Dummy functions to cycle through states for UI demonstration
  const handleStartRecording = () => {
    setRecordingState('RECORDING');
  };

  const handleStopRecording = () => {
    setRecordingState('PLAYBACK');
  };

  const handleRecordAgain = () => {
    setRecordingState('IDLE');
  };

  return (
    <View style={styles.container}>
      {/* Sentence Card */}
      {recordingState !== 'PLAYBACK' && (
        <>
          <View style={styles.sentenceCard}>
            <Text style={styles.sentenceLabel}>Please say this sentence</Text>
            <Text style={styles.sentenceText}>तू माझं आयुष्य आहेस</Text>
          </View>
          <Text style={styles.instructionText}>Tap and hold to speak</Text>
        </>
      )}

      {/* IDLE STATE */}
      {recordingState === 'IDLE' && (
        <View style={styles.idleContainer}>
          <View style={styles.tipCard}>
            <Lightbulb size={20} color={GOLD_DEEP} />
            <Text style={styles.tipText}>
              Find a quiet place and speak clearly for better recognition
            </Text>
          </View>

          <View style={styles.buttonWrapper}>
            {/* Ripple effect background (static for now) */}
            <View style={styles.rippleOuter} />
            <TouchableOpacity
              style={styles.startRecordingWrapper}
              activeOpacity={0.85}
              onPressIn={handleStartRecording}
            >
              <LinearGradient
                colors={[GOLD, GOLD_DEEP]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.startRecordingButton}
              >
                <Mic size={20} color="#2A1240" style={styles.buttonIcon} />
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
              <Mic size={32} color="#FFFFFF" strokeWidth={2} />
            </LinearGradient>
          </Pressable>
        </View>
      )}

      {/* PLAYBACK STATE */}
      {recordingState === 'PLAYBACK' && (
        <View style={styles.playbackContainer}>
          <Text style={styles.playbackTitle}>Play to listen</Text>

          {/* Audio Slider */}
          <View style={styles.sliderRow}>
            <TouchableOpacity style={styles.playButton}>
              <Play size={16} color={PLUM_ROYAL} fill={PLUM_ROYAL} />
            </TouchableOpacity>
            <View style={styles.sliderTrack}>
              <View style={styles.sliderProgress} />
            </View>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.8}
            onPress={handleRecordAgain}
          >
            <RotateCcw size={18} color={TEXT_PLUM} style={styles.buttonIcon} />
            <Text style={styles.secondaryButtonText}>Record Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButtonWrapper}
            activeOpacity={0.85}
            onPress={onSubmit}
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
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  sentenceLabel: {
    fontSize: 13,
    color: PLUM_ROYAL,
    fontWeight: '600',
    marginBottom: 12,
  },
  sentenceText: {
    fontSize: 24,
    color: TEXT_PLUM,
    fontWeight: '700',
    fontFamily: 'PlayfairDisplay-Bold',
  },
  instructionText: {
    fontSize: 14,
    color: TEXT_MUTED,
    fontWeight: '500',
    marginBottom: 24,
  },
  idleContainer: {
    width: '100%',
    alignItems: 'center',
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#F6EFDD',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: IVORY_LINE,
    alignItems: 'center',
    marginBottom: 40,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: TEXT_MUTED,
    marginLeft: 12,
    lineHeight: 20,
  },
  buttonWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  rippleOuter: {
    position: 'absolute',
    width: '100%',
    height: 70,
    backgroundColor: 'rgba(212, 175, 55, 0.16)',
    borderRadius: 35,
    transform: [{ scale: 1.15 }],
  },
  startRecordingWrapper: {
    width: '100%',
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: GOLD_DEEP,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  startRecordingButton: {
    flexDirection: 'row',
    width: '100%',
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  recordingCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: PLUM_ROYAL,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  playbackContainer: {
    width: '100%',
    alignItems: 'center',
  },
  playbackTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: TEXT_PLUM,
    marginBottom: 24,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    marginBottom: 24,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: LILAC_PALE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sliderTrack: {
    flex: 1,
    height: 4,
    backgroundColor: IVORY_LINE,
    borderRadius: 2,
  },
  sliderProgress: {
    width: '100%', // Full for now, can be dynamic later
    height: '100%',
    backgroundColor: GOLD_DEEP,
    borderRadius: 2,
  },
  secondaryButton: {
    flexDirection: 'row',
    width: '100%',
    height: 56,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  secondaryButtonText: {
    color: TEXT_PLUM,
    fontSize: 16,
    fontWeight: '700',
  },
  primaryButtonWrapper: {
    width: '100%',
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: GOLD_DEEP,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
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