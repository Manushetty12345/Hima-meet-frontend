import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Mic, Lightbulb, Play, RotateCcw } from 'lucide-react-native';

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
            <Lightbulb size={20} color="#FDB813" />
            <Text style={styles.tipText}>
              Find a quiet place and speak clearly for better recognition
            </Text>
          </View>

          <View style={styles.buttonWrapper}>
            {/* Ripple effect background (static for now) */}
            <View style={styles.rippleOuter} />
            <TouchableOpacity
              style={styles.startRecordingButton}
              activeOpacity={0.8}
              onPressIn={handleStartRecording}
            >
              <Mic size={20} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Start Recording</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* RECORDING STATE */}
      {recordingState === 'RECORDING' && (
        <View style={styles.recordingContainer}>
          <Pressable
            style={styles.recordingCircle}
            onPressOut={handleStopRecording}
          >
            <Mic size={32} color="#FFFFFF" strokeWidth={2} />
          </Pressable>
        </View>
      )}

      {/* PLAYBACK STATE */}
      {recordingState === 'PLAYBACK' && (
        <View style={styles.playbackContainer}>
          <Text style={styles.playbackTitle}>Play to Listen</Text>

          {/* Audio Slider */}
          <View style={styles.sliderRow}>
            <TouchableOpacity style={styles.playButton}>
              <Play size={16} color="#EC1372" fill="#EC1372" />
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
            <RotateCcw size={18} color="#4A4A4A" style={styles.buttonIcon} />
            <Text style={styles.secondaryButtonText}>Record Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.8}
            onPress={onSubmit}
          >
            <Text style={styles.primaryButtonText}>Submit</Text>
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
    backgroundColor: '#F3EBF4', // Light pink/purple tint
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  sentenceLabel: {
    fontSize: 13,
    color: '#D83872', // Pinkish text
    fontWeight: '600',
    marginBottom: 12,
  },
  sentenceText: {
    fontSize: 24,
    color: '#D83872',
    fontWeight: '700',
  },
  instructionText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
    marginBottom: 24,
  },
  idleContainer: {
    width: '100%',
    alignItems: 'center',
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#FDF7E7', // Light yellow tint
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F2E8D3',
    alignItems: 'center',
    marginBottom: 40,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#8A7A60',
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
    backgroundColor: 'rgba(236, 19, 114, 0.15)',
    borderRadius: 35,
    transform: [{ scale: 1.15 }],
  },
  startRecordingButton: {
    flexDirection: 'row',
    backgroundColor: '#D13271', // Magenta
    width: '100%',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#EC1372',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
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
    backgroundColor: '#FF1493', // Bright pink/magenta
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#FF1493',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  playbackContainer: {
    width: '100%',
    alignItems: 'center',
  },
  playbackTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2A2A2A',
    marginBottom: 24,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: 24,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8E9F1', // Very light magenta background
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sliderTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
  },
  sliderProgress: {
    width: '100%', // Full for now, can be dynamic later
    height: '100%',
    backgroundColor: '#EC1372',
    borderRadius: 2,
  },
  secondaryButton: {
    flexDirection: 'row',
    width: '100%',
    height: 56,
    backgroundColor: '#F3F4F6',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  secondaryButtonText: {
    color: '#4A4A4A',
    fontSize: 16,
    fontWeight: '700',
  },
  primaryButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#EC1372',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default VoiceReader;
