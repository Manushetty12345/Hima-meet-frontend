import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Image,
  Platform,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Coins, Phone, Video, Radio, Check, X, BellRing } from 'lucide-react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallOverlay } from '../../../context/CallOverlayContext';
import apiClient from '../../../api/apiClient';
import { getSocket, initSocket } from '../../../api/socketClient';
import messaging from '@react-native-firebase/messaging';

const STATUSBAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

const DEFAULT_AVATAR = 'https://hima-bucket.s3.amazonaws.com/default-avatar.png';

const CreatorHomeScreen = () => {
  const navigation = useNavigation<any>();
  const { currentCall, timeLeft, declineCall: overlayDeclineCall } = useCallOverlay();
  // ── Profile ──────────────────────────────────────────────
  const [username, setUsername] = useState('Creator');
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR);

  // ── Dashboard data (from API) ────────────────────────────
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [todayEarningsInr, setTodayEarningsInr] = useState(0);
  const [todayEarningsCoins, setTodayEarningsCoins] = useState(0);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  // Track the currently ringing call ID so we can remove it when timer expires
  const ringingCallIdRef = React.useRef<number | null>(null);

  const fetchAll = async () => {
    try {
      // Force sync FCM token when Creator Home loads to guarantee backend has it
      let token = null;
      try {
        token = await messaging().getToken();
      } catch (fcmErr: any) {
        console.log('FCM Sync error on creator home:', fcmErr);
        Alert.alert("Firebase Native Error", "messaging().getToken() failed: " + (fcmErr?.message || String(fcmErr)));
      }

      if (token) {
        try {
          await apiClient.post('/api/user/fcm-token', { fcm_token: token });
          console.log('[FCM] Token saved successfully');
        } catch (apiErr: any) {
          Alert.alert("API Error", "apiClient.post failed: " + (apiErr?.message || String(apiErr)));
        }
      }

      // Profile
      const profileRes = await apiClient.get('/api/user/me');
      if (profileRes.data?.data) {
        const p = profileRes.data.data;
        setUsername(p.username || p.full_name || 'Creator');
        setAvatarUrl(p.avatar_url || DEFAULT_AVATAR);
      }

      // Dashboard home — availability + earnings + requests
      const dashRes = await apiClient.get('/api/creator/dashboard/home');
      if (dashRes.data?.data) {
        const d = dashRes.data.data;
        setVoiceEnabled(!!d.status?.is_voice_online);
        setVideoEnabled(!!d.status?.is_video_online);
        setTodayEarningsInr(d.todays_earnings_inr ?? 0);
        setTodayEarningsCoins(d.todays_earnings_coins ?? 0);
        setPendingRequests(d.pending_requests || []);
      }
    } catch (error) {
      console.log('CreatorHomeScreen fetch error:', error);
    }
  };

  // ── Listen for real-time incoming calls to update pending list ──
  React.useEffect(() => {
    let socket = getSocket();
    
    const handleIncoming = (data: any) => {
      // Because the backend on Render hasn't been updated yet, we instantly add the call data
      // from the socket event to the pending requests array directly!
      setPendingRequests((prev) => {
        if (prev.find((r) => r.request_id === data.callId)) return prev;
        return [
          {
            request_id: data.callId,
            user_id: data.callerId,
            name: data.name || 'User',
            avatar_url: data.avatar_url || 'https://hima-bucket.s3.amazonaws.com/default-avatar.png',
            call_type: data.call_type || data.type || 'video',
            sent_at: new Date().toISOString()
          },
          ...prev
        ];
      });
    };

    const setupSocketListener = async () => {
      if (!socket) {
        socket = await initSocket();
      }
      if (socket) {
        socket.on('incoming_call', handleIncoming);
      }
    };

    setupSocketListener();

    return () => {
      if (socket) {
        socket.off('incoming_call', handleIncoming);
      }
    };
  }, []);

  // ── Auto-remove request when timer expires (currentCall becomes null) ──
  React.useEffect(() => {
    if (!currentCall) {
      // Timer expired, call declined, or accepted — remove that specific call from pending list
      if (ringingCallIdRef.current !== null) {
        const expiredId = ringingCallIdRef.current;
        setPendingRequests((prev) => prev.filter((r) => r.request_id !== expiredId));
        ringingCallIdRef.current = null;
      }
    } else {
      // Track which call is currently ringing
      ringingCallIdRef.current = currentCall.request_id;
    }
  }, [currentCall]);

  // ── Fetch dashboard on focus ─────────────────────────────
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchAll().finally(() => setLoading(false));
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAll().finally(() => setRefreshing(false));
  }, []);

  // ── Toggle availability (updates backend + local state) ──
  const handleVoiceToggle = async (value: boolean) => {
    setVoiceEnabled(value); // optimistic update
    try {
      await apiClient.post('/api/creator/dashboard/status', {
        call_type: 'voice',
        is_online: value,
      });
    } catch (error) {
      console.error('Failed to update voice status:', error);
      setVoiceEnabled(!value); // rollback on failure
    }
  };

  const handleVideoToggle = async (value: boolean) => {
    setVideoEnabled(value); // optimistic update
    try {
      await apiClient.post('/api/creator/dashboard/status', {
        call_type: 'video',
        is_online: value,
      });
    } catch (error) {
      console.error('Failed to update video status:', error);
      setVideoEnabled(!value); // rollback on failure
    }
  };

  const isLive = voiceEnabled || videoEnabled;

  const handleAcceptPending = (req: any) => {
    const socket = getSocket();
    if (socket) {
      socket.emit('accept_call', { callId: req.request_id, callerId: req.user_id });
    }
    setPendingRequests((prev) => prev.filter(r => r.request_id !== req.request_id));
    const screenName = req.call_type === 'video' ? 'VideoCallScreen' : 'AudioCallScreen';
    navigation.navigate(screenName, {
      callId: req.request_id,
      targetId: req.user_id,
      calleeName: req.name,
      calleeAvatar: req.avatar_url,
    });
  };

  const handleDeclinePending = (req: any) => {
    if (currentCall && currentCall.request_id === req.request_id) {
      overlayDeclineCall();
    } else {
      const socket = getSocket();
      if (socket) {
        socket.emit('decline_call', { callId: req.request_id, callerId: req.user_id });
      }
    }
    setPendingRequests((prev) => prev.filter(r => r.request_id !== req.request_id));
  };

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.statusBarSpacer} />

      {/* ── Header ── */}
      <View style={styles.headerRow}>
        <Image
          source={require('../../../assets/images/logo1.png')}
          style={styles.brandIcon}
          resizeMode="contain"
        />
        <View style={styles.brandTextBlock}>
          <Text style={styles.brandTitle}>Himameet</Text>
          <Text style={styles.brandSubtitle}>Creator Dashboard</Text>
        </View>
        <View style={styles.greetingBlock}>
          <LinearGradient
            colors={['#F91970', '#9C27B0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.namePill}
          >
            <Text style={styles.greetingText}>{username}</Text>
          </LinearGradient>
          <Image source={{ uri: avatarUrl }} style={styles.userAvatar} />
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F91970" />
        </View>
      ) : (
        <ScrollView 
        contentContainerStyle={styles.container} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF1493']} tintColor="#FF1493" />
        }
      >

          {/* ── 1. Live Status Banner ── */}
          <LinearGradient
            colors={isLive ? ['#10B981', '#059669'] : ['#94A3B8', '#64748B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.liveBanner}
          >
            <View style={[styles.liveDotWrap, { backgroundColor: isLive ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)' }]}>
              <View style={[styles.liveDot, { backgroundColor: isLive ? '#FFFFFF' : 'rgba(255,255,255,0.5)' }]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.liveBannerTitle}>
                {isLive ? '🟢  You are Live!' : '⚫  You are Offline'}
              </Text>
              <Text style={styles.liveBannerSub}>
                {isLive
                  ? 'Male users can see & call you right now'
                  : 'Toggle on below to start receiving calls'}
              </Text>
            </View>
            <Radio size={22} color="rgba(255,255,255,0.8)" />
          </LinearGradient>

          {/* ── 2. Pending Requests ── */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Pending Requests</Text>
            <Text style={styles.cardSubHeader}>
              Users waiting for you to answer right now
            </Text>
            {pendingRequests.length === 0 ? (
              <Text style={styles.emptyText}>No pending requests right now.</Text>
            ) : (
              pendingRequests.map((req, index) => {
                const isActivelyRinging = currentCall?.request_id === req.request_id;
                
                return (
                  <View key={req.request_id || index} style={styles.requestRow}>
                    <Image source={{ uri: req.avatar_url }} style={styles.requestAvatar} />
                    <View style={styles.requestInfo}>
                      <Text style={styles.requestName}>{req.name}</Text>
                      {isActivelyRinging ? (
                        <Text style={[styles.requestTime, { color: '#EC1372', fontWeight: 'bold' }]}>
                          Ringing... 00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}s
                        </Text>
                      ) : (
                        <Text style={styles.requestTime}>
                          {new Date(req.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      )}
                    </View>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <TouchableOpacity style={styles.declineBtn} onPress={() => handleDeclinePending(req)}>
                        <Phone size={16} color="#FFFFFF" />
                        <Text style={styles.callBackText}>Decline</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.callBackBtn} onPress={() => handleAcceptPending(req)}>
                        {req.call_type === 'video' ? (
                          <Video size={16} color="#FFFFFF" />
                        ) : (
                          <Phone size={16} color="#FFFFFF" />
                        )}
                        <Text style={styles.callBackText}>Accept</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            )}
          </View>

          {/* ── 3. My Availability Toggles ── */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>My Availability</Text>
            <Text style={styles.cardSubHeader}>
              When ON, users see you as available and can call you
            </Text>

            <View style={styles.toggleRow}>
              <View style={styles.toggleLeft}>
                <View style={[styles.toggleIconBox, { backgroundColor: voiceEnabled ? 'rgba(236,19,114,0.12)' : '#F1F5F9' }]}>
                  <Phone size={20} color={voiceEnabled ? '#EC1372' : '#94A3B8'} fill={voiceEnabled ? '#EC1372' : 'transparent'} />
                </View>
                <View>
                  <Text style={styles.toggleLabelText}>Voice Calls</Text>
                  <Text style={styles.toggleSubText}>{voiceEnabled ? 'You are available' : 'You are unavailable'}</Text>
                </View>
              </View>
              <Switch
                value={voiceEnabled}
                onValueChange={handleVoiceToggle}
                trackColor={{ false: '#E2E8F0', true: '#EC1372' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.dividerThin} />

            <View style={styles.toggleRow}>
              <View style={styles.toggleLeft}>
                <View style={[styles.toggleIconBox, { backgroundColor: videoEnabled ? 'rgba(79,70,229,0.12)' : '#F1F5F9' }]}>
                  <Video size={20} color={videoEnabled ? '#4F46E5' : '#94A3B8'} fill={videoEnabled ? '#4F46E5' : 'transparent'} />
                </View>
                <View>
                  <Text style={styles.toggleLabelText}>Video Calls</Text>
                  <Text style={styles.toggleSubText}>{videoEnabled ? 'You are available' : 'You are unavailable'}</Text>
                </View>
              </View>
              <Switch
                value={videoEnabled}
                onValueChange={handleVideoToggle}
                trackColor={{ false: '#E2E8F0', true: '#4F46E5' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* ── 4. Today's Earnings ── */}
          <LinearGradient colors={['#F91970', '#FF4D8D']} style={[styles.card, styles.earningsCard]}>
            <Text style={styles.earningsLabel}>Today's Earnings</Text>
            <Text style={styles.earningsAmount}>₹{todayEarningsInr.toFixed(2)}</Text>
            <View style={styles.earningsCoinRow}>
              <Coins size={14} color="rgba(255,255,255,0.9)" />
              <Text style={styles.earningsCoins}>  {todayEarningsCoins} Coins Earned</Text>
            </View>
          </LinearGradient>

        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#F6F3FA',
  },
  statusBarSpacer: {
    height: STATUSBAR_HEIGHT,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Header ─────────────────────────────────────────────
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  brandIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    marginRight: 10,
  },
  brandTextBlock: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333333',
  },
  brandSubtitle: {
    fontSize: 12,
    color: '#8A7A9C',
    marginTop: 2,
  },
  greetingBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  namePill: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  greetingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  userAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2.5,
    borderColor: '#F91970',
  },

  // ── Body ───────────────────────────────────────────────
  container: {
    padding: 16,
    paddingTop: 16,
    flexGrow: 1,
    gap: 14,
  },

  // Live banner
  liveBanner: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  liveDotWrap: {
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  liveBannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  liveBannerSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },

  // Cards
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    fontSize: 17,
    fontWeight: '800',
    color: '#2A1240',
    marginBottom: 4,
  },
  cardSubHeader: {
    fontSize: 12,
    color: '#8B7F98',
    marginBottom: 16,
  },

  // Toggles
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  toggleIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleLabelText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2A1240',
  },
  toggleSubText: {
    fontSize: 11,
    color: '#8B7F98',
    marginTop: 2,
  },
  dividerThin: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 4,
  },

  // Earnings
  earningsCard: {
    paddingVertical: 24,
  },
  earningsLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  earningsAmount: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 12,
  },
  earningsCoinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  earningsCoins: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  
  // Pending Requests
  requestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  requestAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  requestInfo: {
    flex: 1,
  },
  requestName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2A1240',
  },
  requestTime: {
    fontSize: 12,
    color: '#8B7F98',
    marginTop: 2,
  },
  callBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  declineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  callBackText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  emptyText: {
    color: '#8B7F98',
    textAlign: 'center',
    paddingVertical: 16,
    fontSize: 14,
  },
});

export default CreatorHomeScreen;
