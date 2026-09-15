import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Phone, Video, PhoneOff } from 'lucide-react-native';
import { useCallOverlay } from '../../../context/CallOverlayContext';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

// Palette from FriendsScreen
const PLUM_ROYAL = '#5B0E8B';
const GOLD = '#F5C542';
const GOLD_DEEP = '#D4AF37';
const IVORY = '#FBF6EC';
const TEXT_PLUM = '#2A1240';
const LILAC_WHITE = '#FBF7FF';
const LILAC_PALE = '#EFDFFB';
const DEFAULT_AVATAR = 'https://hima-bucket.s3.amazonaws.com/default-avatar.png';

const IncomingCallScreen: React.FC = () => {
  const { currentCall, timeLeft, acceptCall, declineCall } = useCallOverlay();
  const navigation = useNavigation();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (currentCall) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [currentCall]);

  if (!currentCall) return null;

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
      <LinearGradient colors={[LILAC_WHITE, LILAC_PALE, IVORY]} style={styles.gradient}>
        {/* @ts-ignore */}
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Incoming Call</Text>
          <View style={styles.timerBadge}>
            <Text style={styles.timerText}>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</Text>
          </View>
        </View>

        <View style={styles.callerInfo}>
          <Animated.View style={[styles.avatarRing, { transform: [{ scale: pulseAnim }] }]} />
          <Image
            source={{ uri: currentCall.avatar_url || DEFAULT_AVATAR }}
            style={styles.avatar}
          />
          <Text style={styles.callerName}>{currentCall.name}</Text>
          <View style={styles.callTypeContainer}>
            {currentCall.call_type === 'video' ? (
              <Video size={18} color={TEXT_PLUM} style={styles.callTypeIcon} />
            ) : (
              <Phone size={18} color={TEXT_PLUM} style={styles.callTypeIcon} />
            )}
            <Text style={styles.callTypeText}>
              HimaMeet {currentCall.call_type === 'video' ? 'Video' : 'Audio'} Call
            </Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionBtnContainer} onPress={declineCall} activeOpacity={0.8}>
            <View style={[styles.actionBtn, styles.declineBtn]}>
              <PhoneOff size={28} color="#FFFFFF" />
            </View>
            <Text style={styles.actionText}>Decline</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtnContainer} onPress={acceptCall} activeOpacity={0.8}>
            <View style={[styles.actionBtn, styles.acceptBtn]}>
              {currentCall.call_type === 'video' ? (
                <Video size={28} color="#FFFFFF" />
              ) : (
                <Phone size={28} color="#FFFFFF" />
              )}
            </View>
            <Text style={styles.actionText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 99999,
  },
  gradient: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight ?? 40,
    justifyContent: 'space-between',
    paddingBottom: 60,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: TEXT_PLUM,
    fontFamily: 'PlayfairDisplay-Bold',
    marginBottom: 8,
  },
  timerBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '700',
    color: PLUM_ROYAL,
  },
  callerInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  avatarRing: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 2,
    borderColor: GOLD,
    backgroundColor: 'rgba(245, 197, 66, 0.15)',
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  callerName: {
    fontSize: 32,
    fontWeight: '800',
    color: TEXT_PLUM,
    fontFamily: 'PlayfairDisplay-Bold',
    marginTop: 24,
    marginBottom: 8,
  },
  callTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  callTypeIcon: {
    marginRight: 6,
  },
  callTypeText: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT_PLUM,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  actionBtnContainer: {
    alignItems: 'center',
  },
  actionBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 12,
  },
  declineBtn: {
    backgroundColor: '#EC1372',
  },
  acceptBtn: {
    backgroundColor: '#10B981',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_PLUM,
  },
});

export default IncomingCallScreen;
