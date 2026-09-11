import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Phone, Video } from 'lucide-react-native';
import { useCallOverlay } from '../context/CallOverlayContext';

const { width } = Dimensions.get('window');
const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 44;

const DEFAULT_AVATAR = 'https://hima-bucket.s3.amazonaws.com/default-avatar.png';

const GlobalCallOverlay = () => {
  const { currentCall, timeLeft, acceptCall, declineCall } = useCallOverlay();

  if (!currentCall) return null;

  return (
    <View style={styles.overlayContainer}>
      <View style={styles.card}>
        <View style={styles.avatarWrap}>
          <Image
            source={{ uri: currentCall.avatar_url || DEFAULT_AVATAR }}
            style={styles.avatar}
          />
          <View style={styles.timerBadge}>
            <Text style={styles.timerText}>{timeLeft}s</Text>
          </View>
        </View>

        <View style={styles.infoWrap}>
          <Text style={styles.nameText} numberOfLines={1}>
            {currentCall.name}
          </Text>
          <View style={styles.typeRow}>
            {currentCall.call_type === 'video' ? (
              <Video size={14} color="#64748B" />
            ) : (
              <Phone size={14} color="#64748B" />
            )}
            <Text style={styles.typeText}>
              {currentCall.call_type === 'video' ? ' Incoming Video Call' : ' Incoming Voice Call'}
            </Text>
          </View>
        </View>

        <View style={styles.actionsWrap}>
          <TouchableOpacity style={styles.declineBtn} activeOpacity={0.8} onPress={declineCall}>
            <Phone size={15} color="#FFFFFF" />
            <Text style={styles.btnText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptBtn} activeOpacity={0.8} onPress={acceptCall}>
            {currentCall.call_type === 'video' ? (
              <Video size={15} color="#FFFFFF" />
            ) : (
              <Phone size={15} color="#FFFFFF" />
            )}
            <Text style={styles.btnText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: STATUSBAR_HEIGHT + 10,
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: 'center',
    paddingHorizontal: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  card: {
    width: width - 32,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  avatarWrap: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  timerBadge: {
    position: 'absolute',
    bottom: -6,
    alignSelf: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  timerText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  infoWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  actionsWrap: {
    flexDirection: 'row',
    gap: 6,
  },
  declineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 4,
  },
  acceptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 4,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default GlobalCallOverlay;
