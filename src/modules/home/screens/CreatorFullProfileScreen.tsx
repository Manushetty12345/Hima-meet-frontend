import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
  Switch,
  Image,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Heart, Globe, Music, Film, Plane, Info, UserPlus, AlertCircle, X, Phone, Video, MoreVertical, Coins, Star, UserCheck } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import ReportUserModal from '../components/ReportUserModal';
import BlockUserModal from '../components/BlockUserModal';
import { Alert } from 'react-native';
import apiClient from '../../../api/apiClient';

// We'll type this fully when we update the navigator
type Props = any;

const { width } = Dimensions.get('window');
const HEADER_HEIGHT_MAX = 240;
const HEADER_HEIGHT_MIN = Platform.OS === 'ios' ? 100 : 80;
const SCROLL_DISTANCE = HEADER_HEIGHT_MAX - HEADER_HEIGHT_MIN;

const PINK = '#E0116F';
const BG_COLOR = '#F5F2F8';
const TEXT_PLUM = '#2A1240';
const TEXT_MUTED = '#8B7F98';

const CreatorFullProfileScreen: React.FC<Props> = ({ navigation, route }) => {
  const { creator } = route.params || {};
  const creatorId = creator?.id || route.params?.creatorId;

  const [profileData, setProfileData] = useState<any>(null);
  const [debugApiRes, setDebugApiRes] = useState<string>('Loading...');
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [notifyOnline, setNotifyOnline] = useState(false);
  const [friendStatus, setFriendStatus] = useState<'none' | 'pending' | 'accepted' | 'sent'>('none');
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [isBlockModalVisible, setIsBlockModalVisible] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const toastAnim = useRef(new Animated.Value(0)).current;

  const showToast = (message: string) => {
    setToastMessage(message);
    Animated.sequence([
      Animated.timing(toastAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(toastAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setToastMessage(''));
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!creatorId) {
        setDebugApiRes('Error: creatorId is undefined!');
        setLoading(false);
        return;
      }
      try {
        const res = await apiClient.get(`/api/creator/${creatorId}/profile`);
        console.log('Creator profile response:', res.data); // Debugging API response
        setDebugApiRes(JSON.stringify(res.data, null, 2));
        if (res.data?.status === 'success') {
          setProfileData(res.data.data);
          setIsFavorite(res.data.data.friendshipStatus === 'favourite');
          setFriendStatus(res.data.data.friendshipStatus || 'none');
          setNotifyOnline(!!res.data.data.is_notify_online_enabled);
          setIsBlocked(!!res.data.data.is_blocked);
        }
      } catch (error) {
        console.error('Failed to fetch creator profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [creatorId]);

  const toggleFavorite = async () => {
    if (!creatorId) return;
    try {
      const newStatus = !isFavorite;
      setIsFavorite(newStatus); // optimistic update
      await apiClient.post(`/api/friends/${creatorId}/favourite`, { is_favourite: newStatus });
    } catch (error) {
      console.error('Failed to toggle favourite', error);
      setIsFavorite(isFavorite); // revert
    }
  };

  // Dynamic data handling
  const profileName = profileData?.name || creator?.name || 'User';
  const apiAge = profileData?.age || profileData?.profile?.age || profileData?.dob || profileData?.date_of_birth;
  const profileAge = apiAge ? `${apiAge} years old` : (creator?.age ? `${creator.age} years old` : 'Unknown age');
  const avatarImage = profileData?.avatar_url || creator?.avatarUri || 'https://i.pravatar.cc/500?img=31';
  const languages = profileData?.languages || creator?.languages || ['English'];
  const interests = profileData?.interests || creator?.interests || ['Chatting'];
  const aboutMe = profileData?.bio || creator?.about || 'No bio provided.';

  const handleNotifyOnlineChange = async (val: boolean) => {
    if (!creatorId) return;
    setNotifyOnline(val); // Optimistic UI update
    try {
      await apiClient.post(`/api/creator/${creatorId}/notify-online`, { enabled: val });
      if (val) {
        showToast('Online notifications enabled');
      } else {
        showToast('Online notifications disabled');
      }
    } catch (error) {
      console.error('Failed to update notify online', error);
      setNotifyOnline(!val); // Revert UI update
      showToast('Failed to update notification settings');
    }
  };

  const handleAddFriend = () => {
    setFriendStatus('sent');
    showToast('Friend request sent successfully');
  };

  const handleCancelFriend = () => {
    setFriendStatus('none');
    showToast('Friend request cancelled successfully');
  };

  const handleReportSubmit = async (reason: string, details: string) => {
    setIsReportModalVisible(false);
    if (!creatorId) return;
    
    try {
      await apiClient.post(`/api/creator/${creatorId}/report`, { 
        reason: reason, 
        description: details 
      });
      showToast('User reported successfully');
    } catch (error) {
      console.error('Failed to report user', error);
      showToast('Failed to report user');
    }
  };

  const handleBlockSubmit = async (deleteChat: boolean) => {
    setIsBlockModalVisible(false);
    if (!creatorId) return;

    try {
      await apiClient.post(`/api/creator/${creatorId}/block`, { deleteChat });
      setIsBlocked(true);
      showToast('User blocked successfully');
    } catch (error) {
      console.error('Failed to block user', error);
      showToast('Failed to block user');
    }
  };

  const handleUnblock = async () => {
    if (!creatorId) return;
    try {
      await apiClient.post(`/api/creator/${creatorId}/unblock`);
      setIsBlocked(false);
      showToast('User unblocked successfully');
    } catch (error) {
      console.error('Failed to unblock user', error);
      showToast('Failed to unblock user');
    }
  };

  const scrollY = useRef(new Animated.Value(0)).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [SCROLL_DISTANCE / 2, SCROLL_DISTANCE],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const coverTranslateY = scrollY.interpolate({
    inputRange: [-HEADER_HEIGHT_MAX, 0, SCROLL_DISTANCE],
    outputRange: [HEADER_HEIGHT_MAX / 2, 0, -SCROLL_DISTANCE * 0.5],
    extrapolate: 'clamp',
  });

  const coverScale = scrollY.interpolate({
    inputRange: [-HEADER_HEIGHT_MAX, 0],
    outputRange: [2, 1],
    extrapolateLeft: 'extend',
    extrapolateRight: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" {...({ translucent: true, backgroundColor: 'transparent' } as any)} />

      {/* Animated Cover Background */}
      <Animated.View
        style={[
          styles.coverContainer,
          {
            transform: [{ translateY: coverTranslateY }, { scale: coverScale }],
          },
        ]}
      >
        <Image
          source={{ uri: avatarImage }}
          style={styles.coverImage}
          blurRadius={10}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.1)', BG_COLOR]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Main Scrollable Content */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 10, paddingTop: HEADER_HEIGHT_MAX }}>
          <ActivityIndicator size="large" color={PINK} />
        </View>
      ) : (
        <Animated.ScrollView
          contentContainerStyle={{ paddingTop: HEADER_HEIGHT_MAX, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        >
          <View style={styles.profileHeaderContent}>
            {/* Circular Avatar Overlapping */}
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: avatarImage }} style={styles.avatarImage} />
            </View>

            <Text style={styles.profileName}>{profileName}</Text>
            <Text style={styles.profileAge}>{profileAge}</Text>
          </View>

          <View style={styles.contentContainer}>
            {/* Languages Card */}
            {languages.length > 0 && (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
                    <Globe size={18} color="#3498DB" />
                  </View>
                  <Text style={styles.cardTitle}>Languages</Text>
                </View>
                <View style={styles.tagsRow}>
                  {languages.map((lang: string, idx: number) => (
                    <View key={idx} style={styles.outlineTag}>
                      <Text style={styles.outlineTagText}>{lang}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Interests Card */}
            {interests.length > 0 && (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconCircle, { backgroundColor: '#FFF9C4' }]}>
                    <Star size={18} color="#F39C12" fill="#F39C12" />
                  </View>
                  <Text style={styles.cardTitle}>Interests</Text>
                </View>
                <View style={styles.tagsRow}>
                  {interests.map((interest: string, idx: number) => (
                    <View key={idx} style={styles.solidTag}>
                      <Text style={styles.solidTagText}>{interest}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* About Me Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconCircle, { backgroundColor: '#FCE4EC' }]}>
                  <Info size={18} color={PINK} />
                </View>
                <Text style={styles.cardTitle}>About Me</Text>
              </View>
              <Text style={styles.aboutText}>{aboutMe}</Text>
            </View>

            {/* Add Friend Button */}
            {friendStatus === 'none' ? (
              <TouchableOpacity activeOpacity={0.8} style={styles.addFriendBtnContainer} onPress={handleAddFriend}>
                <LinearGradient
                  colors={['#FF1493', '#9C27B0']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.addFriendBtn}
                >
                  <UserPlus size={20} color="#FFFFFF" strokeWidth={2.5} />
                  <Text style={styles.addFriendText}>Add Friend</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <View style={{ marginBottom: 24, gap: 12 }}>
                <View style={[styles.addFriendBtn, { backgroundColor: '#DF7B93', opacity: 0.9, borderRadius: 24 }]}>
                  <UserCheck size={20} color="#FFFFFF" strokeWidth={2.5} />
                  <Text style={styles.addFriendText}>Request Sent</Text>
                </View>
                <TouchableOpacity activeOpacity={0.8} onPress={handleCancelFriend} style={[styles.addFriendBtn, { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#FF1493', borderRadius: 24 }]}>
                  <Text style={[styles.addFriendText, { color: '#FF1493' }]}>Cancel Request</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Notify Settings Card */}
            <View style={styles.card}>
              <View style={styles.toggleRow}>
                <View style={styles.toggleTextCol}>
                  <Text style={styles.notifyTitle}>Notify me when online</Text>
                  <Text style={styles.notifySubtitle}>Get an alert when this user comes online.</Text>
                </View>
                <Switch
                  value={notifyOnline}
                  onValueChange={handleNotifyOnlineChange}
                  trackColor={{ false: '#E0E0E0', true: '#2ECC71' }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#E0E0E0"
                />
              </View>
            </View>

            <View style={styles.actionCardsRow}>
              {/* Report User Card */}
              <TouchableOpacity style={[styles.actionCard, { flex: 1, marginRight: 6 }]} activeOpacity={0.7} onPress={() => setIsReportModalVisible(true)}>
                <AlertCircle size={18} color="#F39C12" />
                <Text style={styles.actionCardText}>Report user</Text>
              </TouchableOpacity>

              {/* Block / Unblock User Card */}
              {isBlocked ? (
                <TouchableOpacity style={[styles.actionCard, { flex: 1, marginLeft: 6 }]} activeOpacity={0.7} onPress={handleUnblock}>
                  <X size={18} color="#E74C3C" />
                  <Text style={[styles.actionCardText, { color: '#E74C3C' }]}>Unblock user</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={[styles.actionCard, { flex: 1, marginLeft: 6 }]} activeOpacity={0.7} onPress={() => setIsBlockModalVisible(true)}>
                  <X size={18} color="#E74C3C" />
                  <Text style={[styles.actionCardText, { color: '#E74C3C' }]}>Block user</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Animated.ScrollView>
      )}

      {/* Modals */}
      <ReportUserModal
        visible={isReportModalVisible}
        onClose={() => setIsReportModalVisible(false)}
        onSubmit={handleReportSubmit}
      />

      <BlockUserModal
        visible={isBlockModalVisible}
        onClose={() => setIsBlockModalVisible(false)}
        onBlock={handleBlockSubmit}
      />

      {/* Sticky Header Top Bar */}
      <View style={styles.stickyHeaderContainer}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { opacity: headerOpacity },
          ]}
        >
          <LinearGradient
            colors={['#FF1493', '#9C27B0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        <View style={styles.headerContentRow}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <Animated.Text style={[styles.headerTitle, { opacity: headerOpacity }]}>
            {profileName}
          </Animated.Text>

          <TouchableOpacity style={styles.headerIconBtn} activeOpacity={0.8} onPress={toggleFavorite}>
            <Heart size={24} color={isFavorite ? PINK : "#FFFFFF"} fill={isFavorite ? PINK : "transparent"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Custom Toast */}
      {toastMessage !== '' && (
        <Animated.View style={[
          styles.toastContainer, 
          { 
            opacity: toastAnim,
            transform: [{ 
              translateY: toastAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
              }) 
            }]
          }
        ]}>
          <Image source={require('../../../assets/images/logo1.png')} style={styles.toastIcon} />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  coverContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT_MAX,
    backgroundColor: '#333',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileHeaderContent: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  toastContainer: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 999,
  },
  toastIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    resizeMode: 'contain',
  },
  toastText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  avatarWrapper: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginTop: -65, // overlap cover
    backgroundColor: '#FFFFFF',
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2ECC71',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileName: {
    fontSize: 26,
    fontWeight: '800',
    color: TEXT_PLUM,
    marginTop: 12,
  },
  profileAge: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_MUTED,
    marginTop: 4,
  },
  ratesContainer: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  ratePill: {
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
  rateText: {
    fontSize: 13,
    fontWeight: '700',
    color: TEXT_PLUM,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  addFriendBtnContainer: {
    marginBottom: 24,
    borderRadius: 16,
    shadowColor: '#FF1493',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  addFriendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    gap: 8,
  },
  addFriendText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#4A0F6E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: TEXT_PLUM,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  outlineTag: {
    borderWidth: 1.5,
    borderColor: '#EFEFEF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  outlineTagText: {
    fontSize: 14,
    color: TEXT_MUTED,
    fontWeight: '600',
  },
  solidTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF2F6',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  solidTagText: {
    fontSize: 13,
    color: TEXT_PLUM,
    fontWeight: '700',
  },
  aboutText: {
    fontSize: 15,
    color: TEXT_MUTED,
    lineHeight: 22,
    fontWeight: '500',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleTextCol: {
    flex: 1,
    paddingRight: 16,
  },
  notifyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: TEXT_PLUM,
    marginBottom: 4,
  },
  notifySubtitle: {
    fontSize: 13,
    color: TEXT_MUTED,
  },
  actionCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#4A0F6E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    gap: 8,
  },
  actionCardText: {
    fontSize: 15,
    color: TEXT_PLUM,
    fontWeight: '700',
  },
  stickyHeaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT_MIN,
  },
  headerContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 36 : 46,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

export default CreatorFullProfileScreen;
