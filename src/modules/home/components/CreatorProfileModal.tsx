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
import { ArrowLeft, Phone, Video, MoreVertical, UserPlus, User, Coins, Send, Image as ImageIcon, Smile, Camera, Mic } from 'lucide-react-native';

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
                <Phone size={16} color={creator.callAvailable ? PINK : '#B9AFC4'} fill={creator.callAvailable ? PINK : 'transparent'} />
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
                <Video size={16} color={creator.videoAvailable ? PLUM_ROYAL : '#B9AFC4'} fill={creator.videoAvailable ? PLUM_ROYAL : '#B9AFC4'} />
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
              onPress={() => setMenuVisible(!menuVisible)}
            >
              <MoreVertical size={20} color={TEXT_MUTED} />
            </TouchableOpacity>

            {/* Dropdown Menu */}
            {menuVisible && (
              <View style={styles.dropdownMenu}>
                <TouchableOpacity style={styles.dropdownItem} activeOpacity={0.7} onPress={() => setMenuVisible(false)}>
                  <Text style={styles.dropdownText}>Block User</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dropdownItem} activeOpacity={0.7} onPress={() => setMenuVisible(false)}>
                  <Text style={styles.dropdownText}>Clear chat</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dropdownItem} activeOpacity={0.7} onPress={() => setMenuVisible(false)}>
                  <Text style={styles.dropdownTextDestructive}>Delete chat</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

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
            <View style={styles.emptyArea} />
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
                  <Smile size={24} color="#8B7F98" />
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
                    <ImageIcon size={22} color="#8B7F98" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconBtnRight}>
                    <Camera size={22} color="#8B7F98" />
                  </TouchableOpacity>
                </View>
              </View>
              
              {message.trim().length > 0 ? (
                <TouchableOpacity style={styles.sendBtnGradientWrap} activeOpacity={0.8}>
                  <LinearGradient
                    colors={[PINK, '#C90E62']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.sendBtnInner}
                  >
                    <Send size={18} color="#FFFFFF" style={{ marginLeft: 2 }} />
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.micBtn} activeOpacity={0.8}>
                  <Mic size={22} color="#FFFFFF" />
                </TouchableOpacity>
              )}
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
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'visible',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    width: 34,
    height: 34,
    borderRadius: 17,
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
    top: 45,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 8,
    width: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownText: {
    fontSize: 14,
    color: '#2A1240',
    fontWeight: '500',
  },
  dropdownTextDestructive: {
    fontSize: 14,
    color: '#E74C3C',
    fontWeight: '500',
  },
  body: {
    flex: 1,
    backgroundColor: '#E5DDD5', // Whatsapp-like default color
  },
  emptyArea: {
    flex: 1,
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
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 34 : 14,
    borderTopWidth: 1,
    borderTopColor: '#EBE5F2',
  },
  chatInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    minHeight: 48,
    maxHeight: 120,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  iconBtnLeft: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
  },
  chatInput: {
    flex: 1,
    minHeight: 48,
    paddingTop: Platform.OS === 'ios' ? 14 : 12,
    paddingBottom: Platform.OS === 'ios' ? 14 : 12,
    fontSize: 16,
    color: '#2A1240',
  },
  chatInputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingRight: 6,
  },
  iconBtnRight: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnGradientWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    shadowColor: PINK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  sendBtnInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
