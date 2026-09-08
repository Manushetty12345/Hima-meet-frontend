import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, Phone, Video, MoreVertical, UserPlus, User, Coins, Send, Image as ImageIcon, Smile, Camera, Mic, Ban, Eraser, Trash2, Lock } from 'lucide-react-native';

const PLUM_ROYAL = '#5B0E8B';
const GOLD = '#F5C542';
const GOLD_DEEP = '#D4AF37';
const IVORY = '#FBF6EC';
const TEXT_PLUM = '#2A1240';
const TEXT_MUTED = '#8B7F98';
const PINK = '#EC1372';

export type CreatorPreview = {
  id: string;
  name: string;
  avatarUri: string;
  isOnline: boolean;
  callAvailable: boolean;
  callRate?: number;
  videoAvailable: boolean;
  videoRate?: number;
};

interface CreatorProfileModalProps {
  creator: CreatorPreview | null;
  visible: boolean;
  onClose: () => void;
  onSendFriendRequest: (creator: CreatorPreview) => void;
  onViewProfile: (creator: CreatorPreview) => void;
  onCall?: (creator: CreatorPreview) => void;
  onVideoCall?: (creator: CreatorPreview) => void;
}

const CreatorProfileModal: React.FC<CreatorProfileModalProps> = ({
  creator,
  visible,
  onClose,
  onSendFriendRequest,
  onViewProfile,
  onCall,
  onVideoCall,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [message, setMessage] = useState('');

  if (!creator) return null;

  const handleClose = () => {
    setIsFriend(false);
    setMessage('');
    setMenuVisible(false);
    onClose();
  };

  const handleSendFriendRequest = () => {
    // Simulate auto-accepting for dummy view
    setIsFriend(true);
    onSendFriendRequest(creator);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={handleClose} activeOpacity={0.8}>
            <ArrowLeft size={20} color={PINK} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerCenter} onPress={() => onViewProfile(creator)} activeOpacity={0.8}>
            <View style={styles.avatarWrap}>
              <Image source={{ uri: creator.avatarUri }} style={styles.avatar} />
              {creator.isOnline && <View style={styles.onlineDot} />}
            </View>
            <Text style={styles.headerName}>{creator.name}</Text>
          </TouchableOpacity>

          <View style={styles.headerActions}>
            {/* Phone Button */}
            <View style={styles.actionBtn}>
              <TouchableOpacity
                style={[styles.actionCircle, creator.callAvailable ? styles.actionCircleActive : styles.actionCircleDisabled]}
                activeOpacity={0.8}
                disabled={!creator.callAvailable}
                onPress={() => onCall?.(creator)}
              >
                <Phone size={20} color={creator.callAvailable ? PINK : '#B9AFC4'} fill={creator.callAvailable ? PINK : 'transparent'} />
              </TouchableOpacity>
              {creator.callAvailable ? (
                <View style={styles.rateRow}>
                  <Coins size={10} color={GOLD_DEEP} />
                  <Text style={styles.rateText}>{creator.callRate}/min</Text>
                </View>
              ) : (
                <Text style={styles.offlineText}>Offline</Text>
              )}
            </View>

            {/* Video Button */}
            <View style={styles.actionBtn}>
              <TouchableOpacity
                style={[styles.actionCircle, creator.videoAvailable ? styles.actionCircleActive : styles.actionCircleDisabled]}
                activeOpacity={0.8}
                disabled={!creator.videoAvailable}
                onPress={() => onVideoCall?.(creator)}
              >
                <Video size={20} color={creator.videoAvailable ? PLUM_ROYAL : '#B9AFC4'} fill={creator.videoAvailable ? PLUM_ROYAL : '#B9AFC4'} />
              </TouchableOpacity>
              {creator.videoAvailable ? (
                <View style={styles.rateRow}>
                  <Coins size={10} color={GOLD_DEEP} />
                  <Text style={styles.rateText}>{creator.videoRate}/min</Text>
                </View>
              ) : (
                <Text style={styles.offlineText}>Offline</Text>
              )}
            </View>

            <TouchableOpacity 
              style={styles.moreBtn} 
              activeOpacity={0.8}
              onPress={() => setMenuVisible(true)}
            >
              <MoreVertical size={24} color={TEXT_MUTED} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Dropdown Overlay */}
        {menuVisible && (
          <TouchableOpacity 
            style={[StyleSheet.absoluteFill, { zIndex: 999 }]} 
            activeOpacity={1} 
            onPress={() => setMenuVisible(false)} 
          />
        )}

        {/* Dropdown Menu */}
        {menuVisible && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity style={styles.dropdownItemRow} activeOpacity={0.7} onPress={() => setMenuVisible(false)}>
              <Ban size={18} color="#2A1240" />
              <Text style={styles.dropdownText}>Block user</Text>
            </TouchableOpacity>
            
            <View style={styles.dropdownDivider} />
            
            <TouchableOpacity style={styles.dropdownItemRow} activeOpacity={0.7} onPress={() => setMenuVisible(false)}>
              <Eraser size={18} color="#2A1240" />
              <Text style={styles.dropdownText}>Clear chat</Text>
            </TouchableOpacity>
            
            <View style={styles.dropdownDivider} />
            
            <TouchableOpacity style={styles.dropdownItemRow} activeOpacity={0.7} onPress={() => setMenuVisible(false)}>
              <Trash2 size={18} color="#E74C3C" />
              <Text style={styles.dropdownTextDestructive}>Delete chat</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Body — Chat area with subtle Whatsapp-like background */}
        <ImageBackground 
          source={{ uri: 'https://www.transparenttextures.com/patterns/cubes.png' }} 
          style={styles.body}
          imageStyle={{ opacity: 0.05 }}
        >
          {isFriend ? (
            <View style={styles.chatContainer}>
              <View style={styles.dummyMessageLeft}>
                <Text style={styles.dummyMessageText}>Hi there! 👋</Text>
                <Text style={styles.dummyMessageTime}>10:00 AM</Text>
              </View>
              <View style={styles.dummyMessageRight}>
                <Text style={styles.dummyMessageTextRight}>Hey {creator.name}! How are you?</Text>
                <Text style={styles.dummyMessageTimeRight}>10:01 AM</Text>
              </View>
            </View>
          ) : (
            <View style={styles.emptyAreaContainer}>
              <View style={styles.encryptionBanner}>
                <Lock size={12} color="#D4AF37" />
                <Text style={styles.encryptionText}>
                  Messages are end-to-end encrypted. No one outside of this chat can read or listen to them.
                </Text>
              </View>
              
              <View style={styles.welcomeChatContainer}>
                <Image source={{ uri: creator.avatarUri }} style={styles.welcomeAvatar} />
                <Text style={styles.welcomeTitle}>Start a conversation</Text>
                <Text style={styles.welcomeSubtitle}>Send a friend request to chat with {creator.name}.</Text>
              </View>
            </View>
          )}
        </ImageBackground>

        {/* Bottom CTA / Input */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ backgroundColor: isFriend ? '#F5F0FA' : '#FFFFFF' }}
        >
          {!isFriend ? (
            <View style={styles.footer}>
              <Text style={styles.footerTitle}>Want to chat with {creator.name}?</Text>
              <Text style={styles.footerSubtitle}>Send a friend request to start chatting.</Text>

              <TouchableOpacity
                style={styles.friendRequestBtnWrap}
                activeOpacity={0.85}
                onPress={handleSendFriendRequest}
              >
                <LinearGradient
                  colors={[PINK, '#C90E62']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.friendRequestBtn}
                >
                  <UserPlus size={18} color="#FFFFFF" />
                  <Text style={styles.friendRequestText}>Send friend request</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.viewProfileBtn}
                activeOpacity={0.8}
                onPress={() => {
                  handleClose();
                  onViewProfile(creator);
                }}
              >
                <Text style={styles.viewProfileText}>View profile</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.chatFooterContainer}>
              <View style={styles.chatInputWrapper}>
                <TouchableOpacity style={styles.iconBtnLeft}>
                  <Smile size={30} color="#8B7F98" />
                </TouchableOpacity>
                <TextInput
                  style={styles.chatInput}
                  placeholder="Type a message..."
                  placeholderTextColor="#A499B0"
                  value={message}
                  onChangeText={setMessage}
                  multiline
                />
                <View style={styles.chatInputActions}>
                  <TouchableOpacity style={styles.iconBtnRight}>
                    <ImageIcon size={28} color="#8B7F98" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconBtnRight}>
                    <Camera size={28} color="#8B7F98" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <TouchableOpacity style={styles.sendBtnGradientWrap} activeOpacity={0.8}>
                <LinearGradient
                  colors={[PINK, '#C90E62']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.sendBtnInner}
                >
                  <Send size={20} color="#FFFFFF" style={{ marginLeft: 2 }} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 45 : 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EAF6',
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F9EBF2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    gap: 10,
  },
  avatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'visible',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#9C27B0',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2ECC71',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  headerName: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_PLUM,
    marginBottom: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    zIndex: 10,
  },
  actionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  actionCircleActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionCircleDisabled: {
    backgroundColor: '#F5F0FA',
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rateText: {
    fontSize: 9.5,
    color: GOLD_DEEP,
    fontWeight: '600',
  },
  offlineText: {
    fontSize: 9.5,
    color: '#B4A6BE',
    fontWeight: '500',
  },
  moreBtn: {
    paddingLeft: 4,
  },
  dropdownMenu: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 85 : 75,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 8,
    width: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: '#F0EAF6',
  },
  dropdownItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: '#F5F0FA',
    marginHorizontal: 12,
  },
  dropdownText: {
    fontSize: 15,
    color: '#2A1240',
    fontWeight: '600',
  },
  dropdownTextDestructive: {
    fontSize: 15,
    color: '#E74C3C',
    fontWeight: '600',
  },
  body: {
    flex: 1,
    backgroundColor: '#E5DDD5', // Whatsapp-like default color
  },
  emptyAreaContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  encryptionBanner: {
    flexDirection: 'row',
    backgroundColor: '#FEF9E7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  encryptionText: {
    color: '#D4AF37',
    fontSize: 11,
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  welcomeChatContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 24,
    borderRadius: 20,
    width: '85%',
  },
  welcomeAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2A1240',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#8B7F98',
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0EAF6',
  },
  footerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: TEXT_PLUM,
    marginBottom: 6,
    textAlign: 'center',
  },
  footerSubtitle: {
    fontSize: 13,
    color: TEXT_MUTED,
    textAlign: 'center',
    marginBottom: 20,
  },
  friendRequestBtnWrap: {
    width: '100%',
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 12,
  },
  friendRequestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 28,
  },
  friendRequestText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  viewProfileBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#F0EAF6',
    backgroundColor: '#FFFFFF',
  },
  viewProfileText: {
    fontSize: 15,
    fontWeight: '600',
    color: PINK,
  },
  chatContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
    gap: 12,
  },
  dummyMessageLeft: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  dummyMessageText: {
    fontSize: 15,
    color: TEXT_PLUM,
    marginBottom: 4,
  },
  dummyMessageTime: {
    fontSize: 10,
    color: TEXT_MUTED,
    alignSelf: 'flex-end',
  },
  dummyMessageRight: {
    alignSelf: 'flex-end',
    backgroundColor: '#E1FEC6', // Whatsapp-like light green
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  dummyMessageTextRight: {
    fontSize: 15,
    color: TEXT_PLUM,
    marginBottom: 4,
  },
  dummyMessageTimeRight: {
    fontSize: 10,
    color: '#607D8B',
    alignSelf: 'flex-end',
  },
  chatFooterContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F5F0FA',
    paddingHorizontal: 10,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 44 : 24,
    borderTopWidth: 1,
    borderTopColor: '#EBE5F2',
  },
  chatInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    minHeight: 64,
    maxHeight: 120,
    marginRight: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  iconBtnLeft: {
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    height: 64,
  },
  chatInput: {
    flex: 1,
    minHeight: 64,
    paddingTop: Platform.OS === 'ios' ? 22 : 20,
    paddingBottom: Platform.OS === 'ios' ? 22 : 20,
    fontSize: 18,
    color: '#2A1240',
  },
  chatInputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    paddingRight: 8,
  },
  iconBtnRight: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnGradientWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: PINK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  sendBtnInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1EBEA5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1EBEA5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
});

export default CreatorProfileModal;
