import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Clock, Mic, MicOff, VideoOff, Video as VideoIcon, PhoneOff, Gift, MoreVertical } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AuthStackParamList } from '../../../navigation/AuthNavigator';
import EndCallModal from '../components/EndCallModal';

const { width, height } = Dimensions.get('window');

type Props = NativeStackScreenProps<AuthStackParamList, 'VideoCallScreen'>;

// Mock data
const CALLEE_MOCK_VIDEO = 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=2787&auto=format&fit=crop';
const CALLER_MOCK_VIDEO = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=2662&auto=format&fit=crop';

const VideoCallScreen: React.FC<Props> = ({ navigation, route }) => {
  const { callerName = 'You', calleeName = 'Creator' } = route.params || {};

  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showEndCallModal, setShowEndCallModal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleEndCall = () => {
    setShowEndCallModal(false);
    navigation.replace('CallFeedbackScreen', { creatorName: calleeName });
  };

  return (
    <View style={styles.container}>
      {/* @ts-expect-error - translucent is an Android only prop that is sometimes missing from types */}
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Main Video Background (Callee) */}
      <Image source={{ uri: CALLEE_MOCK_VIDEO }} style={styles.mainVideo} />

      {/* Top Gradient for text readability */}
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'transparent']}
        style={styles.topGradient}
      />

      {/* Bottom Gradient for controls readability */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.bottomGradient}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfoContainer}>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
            <Text style={styles.calleeName}>{calleeName}</Text>
            <View style={styles.durationContainer}>
              <Clock size={14} color="#FFF" />
              <Text style={styles.durationText}>{formatTime(secondsElapsed)}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <MoreVertical color="#FFF" size={24} />
          </TouchableOpacity>
        </View>

        {/* Floating PIP (Self View) - Always front face */}
        {!isVideoOff ? (
          <View style={styles.pipContainer}>
            <Image source={{ uri: CALLER_MOCK_VIDEO }} style={styles.pipVideo} />
            <Text style={styles.pipName}>{callerName}</Text>
          </View>
        ) : (
          <View style={[styles.pipContainer, styles.pipVideoOff]}>
            <VideoOff color="#FFF" size={32} />
          </View>
        )}

        {/* Bottom Dock */}
        <View style={styles.bottomDockContainer}>
          {/* Gifting Button */}
          <TouchableOpacity style={styles.giftButton}>
            <Gift color="#FFF" size={24} />
            <Text style={styles.giftText}>Gift</Text>
          </TouchableOpacity>

          {/* Controls Dock */}
          <View style={styles.controlsDock}>
            <TouchableOpacity
              style={[styles.controlButton, isMuted && styles.controlButtonActive]}
              onPress={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff color="#FFF" size={24} /> : <Mic color="#FFF" size={24} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, isVideoOff && styles.controlButtonActive]}
              onPress={() => setIsVideoOff(!isVideoOff)}
            >
              {isVideoOff ? <VideoOff color="#FFF" size={24} /> : <VideoIcon color="#FFF" size={24} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.endCallButton}
              onPress={() => setShowEndCallModal(true)}
            >
              <PhoneOff color="#FFF" size={28} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <EndCallModal
        visible={showEndCallModal}
        onCancel={() => setShowEndCallModal(false)}
        onEndCall={handleEndCall}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  mainVideo: {
    ...StyleSheet.absoluteFill as object,
    width: '100%',
    height: '100%',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 150,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 250,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
  },
  userInfoContainer: {
    alignItems: 'flex-start',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.5)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF3B30',
    marginRight: 6,
  },
  liveText: {
    color: '#FF3B30',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  calleeName: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  durationText: {
    color: '#E0E0E0',
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  moreButton: {
    padding: 8,
  },
  pipContainer: {
    position: 'absolute',
    top: 120,
    right: 20,
    width: 110,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    borderColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1.5,
    backgroundColor: '#1A1D24',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  pipVideo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  pipVideoOff: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2A2D34',
  },
  pipName: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bottomDockContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'flex-end',
  },
  giftButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 45, 85, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#FF2D55',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  giftText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  controlsDock: {
    flexDirection: 'row',
    backgroundColor: 'rgba(30, 30, 30, 0.65)',
    borderRadius: 40,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  endCallButton: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
});

export default VideoCallScreen;
