import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Clock, Video, Mic, MicOff, PhoneOff, Volume2, VolumeX, Gift } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AuthStackParamList } from '../../../navigation/AuthNavigator';
import EndCallModal from '../components/EndCallModal';

type Props = NativeStackScreenProps<AuthStackParamList, 'AudioCallScreen'>;

const GIFTS = [
  { id: '1', name: 'Rose', price: 40, icon: '🌹' },
  { id: '2', name: 'Chocolate', price: 60, icon: '🍫' },
  { id: '3', name: 'Ring', price: 80, icon: '💍' },
  { id: '4', name: 'Bear', price: 120, icon: '🧸' },
];

const AudioCallScreen: React.FC<Props> = ({ navigation, route }) => {
  const { callerName = 'SwQpK', calleeName = 'Chandana' } = route.params || {};

  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
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
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setShowEndCallModal(false);
    navigation.replace('CallFeedbackScreen', { creatorName: calleeName });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      {/* Top Timer */}
      <View style={styles.header}>
        <View style={styles.timerPill}>
          <Clock size={14} color="#8A7A9C" />
          <Text style={styles.timerText}>{formatTime(secondsElapsed)}</Text>
        </View>
      </View>

      {/* Avatars Section */}
      <View style={styles.avatarsContainer}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarRing}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?img=11' }}
              style={styles.avatarImage}
            />
          </View>
          <Text style={styles.avatarName}>{callerName}</Text>
        </View>

        <View style={styles.avatarWrapper}>
          <View style={styles.avatarRing}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?img=47' }}
              style={styles.avatarImage}
            />
          </View>
          <Text style={styles.avatarName}>{calleeName}</Text>
        </View>
      </View>

      {/* Spacer */}
      <View style={{ flex: 1 }} />

      {/* Gifts Section */}
      <View style={styles.giftsSection}>
        <View style={styles.giftsHeader}>
          <View style={styles.giftsTitleRow}>
            <Gift size={16} color="#EC1372" fill="#EC1372" />
            <Text style={styles.giftsTitle}>Tap to send</Text>
          </View>
          <Text style={styles.giftsSubtitle}>One tap - sends instantly</Text>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.giftsScroll}>
          {GIFTS.map((gift) => (
            <TouchableOpacity key={gift.id} style={styles.giftCard}>
              <Text style={styles.giftIconText}>{gift.icon}</Text>
              <View style={styles.giftPriceRow}>
                <View style={styles.coinDot} />
                <Text style={styles.giftPriceText}>{gift.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Controls Action Bar */}
      <View style={styles.controlsBar}>
        <TouchableOpacity style={styles.controlBtnVideo}>
          <Video size={20} color="#FFFFFF" fill="#FFFFFF" />
          <Text style={styles.controlLabel}>Video</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.controlBtnMic} 
          onPress={() => setIsMuted(!isMuted)}
        >
          {isMuted ? (
            <MicOff size={24} color="#EC1372" />
          ) : (
            <Mic size={24} color="#EC1372" fill="#EC1372" />
          )}
          <Text style={styles.controlLabel}>Mic</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.controlBtnEnd} 
          onPress={() => setShowEndCallModal(true)}
        >
          <PhoneOff size={28} color="#FFFFFF" fill="#FFFFFF" />
          <Text style={[styles.controlLabel, { color: '#EC1372', marginTop: 8 }]}>End</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.controlBtnSpeaker}
          onPress={() => setIsSpeakerOn(!isSpeakerOn)}
        >
          {isSpeakerOn ? (
            <Volume2 size={24} color="#333333" fill="#333333" />
          ) : (
            <VolumeX size={24} color="#333333" />
          )}
          <Text style={styles.controlLabel}>Speaker</Text>
        </TouchableOpacity>
      </View>

      <EndCallModal 
        visible={showEndCallModal} 
        onCancel={() => setShowEndCallModal(false)}
        onEndCall={handleEndCall}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Very dark background
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    flexDirection: 'row',
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBE5F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  timerText: {
    color: '#8A7A9C',
    fontSize: 13,
    fontWeight: '600',
  },
  avatarsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginTop: 100,
  },
  avatarWrapper: {
    alignItems: 'center',
  },
  avatarRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#EC1372',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  giftsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  giftsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  giftsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  giftsTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  giftsSubtitle: {
    color: '#8A7A9C',
    fontSize: 11,
  },
  giftsScroll: {
    gap: 12,
  },
  giftCard: {
    backgroundColor: '#1F1B2A',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    minWidth: 80,
  },
  giftIconText: {
    fontSize: 32,
    marginBottom: 8,
  },
  giftPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  coinDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F4C430',
  },
  giftPriceText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  controlsBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    paddingBottom: 40,
  },
  controlBtnVideo: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#8E2DE2',
    marginTop: 10,
  },
  controlBtnMic: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2A2436',
    marginTop: 10,
  },
  controlBtnEnd: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#EC1372',
  },
  controlBtnSpeaker: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EBE5F0',
    marginTop: 10,
  },
  controlLabel: {
    position: 'absolute',
    bottom: -24,
    color: '#B9AFC4',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default AudioCallScreen;
