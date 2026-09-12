import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ImageBackground,
    Alert
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ArrowLeft, Smile, Send, Check, CheckCheck, MoreVertical, Ban, Eraser, Trash2 } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import EmojiSelector, { Categories } from 'react-native-emoji-selector';
import apiClient from '../../../api/apiClient';
import { getSocket } from '../../../api/socketClient';
import { AuthStackParamList } from '../../../navigation/AuthNavigator';

const PINK = '#FF1493';
const TEXT_DARK = '#1A1A2E';
const TEXT_MUTED = '#9B9BAD';

type ChatScreenRouteProp = RouteProp<AuthStackParamList, 'ChatScreen'>;

const ChatScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<ChatScreenRouteProp>();
    const { targetId, targetName, targetAvatar } = route.params;

    const [messages, setMessages] = useState<any[]>([]);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(false);
    const [lastSeen, setLastSeen] = useState<string | null>(null);
    const [menuVisible, setMenuVisible] = useState(false);

    const scrollViewRef = useRef<any>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        let mounted = true;
        const socket = getSocket();

        const initChat = async () => {
            try {
                const convRes = await apiClient.get(`/api/chat/conversation/${targetId}`);
                const cId = convRes.data.data.conversation_id;

                if (mounted) {
                    setConversationId(cId);
                    setIsOnline(convRes.data.data.is_online);
                    setLastSeen(convRes.data.data.last_seen_at);

                    const msgRes = await apiClient.get(`/api/chat/${cId}/messages?page=1&limit=50`);
                    setMessages(msgRes.data.data.reverse()); // Reverse because API sends newest first

                    if (socket) {
                        socket.emit('join_chat', { conversationId: cId });

                        // Mark any unread messages from them as read
                        const unreadIds = msgRes.data.data
                            .filter((m: any) => m.sender_id.toString() === targetId.toString() && m.status !== 'read')
                            .map((m: any) => m.message_id);

                        unreadIds.forEach((id: string) => {
                            socket.emit('message_read', { conversationId: cId, messageId: id });
                        });
                    }
                }
            } catch (err) {
                console.error('Failed to init chat', err);
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        initChat();

        if (socket) {
            const handleReceiveMessage = (data: any) => {
                if (mounted) {
                    setMessages(prev => [...prev, { ...data, timestamp: new Date() }]);
                    if (data.sender_id.toString() === targetId.toString()) {
                        socket.emit('message_read', { conversationId: data.conversationId || conversationId, messageId: data.message_id });
                    }
                }
            };

            const handleStatusUpdate = (data: any) => {
                if (mounted) {
                    setMessages(prev => prev.map(m =>
                        m.message_id === data.message_id ? { ...m, status: data.status } : m
                    ));
                }
            };

            const handleUserOnline = (data: any) => {
                if (mounted && data.userId.toString() === targetId.toString()) {
                    setIsOnline(true);
                }
            };

            const handleUserOffline = (data: any) => {
                if (mounted && data.userId.toString() === targetId.toString()) {
                    setIsOnline(false);
                    setLastSeen(new Date().toISOString());
                }
            };

            socket.on('receive_message', handleReceiveMessage);
            socket.on('message_status_update', handleStatusUpdate);
            socket.on('user_online', handleUserOnline);
            socket.on('user_offline', handleUserOffline);

            return () => {
                mounted = false;
                socket.off('receive_message', handleReceiveMessage);
                socket.off('message_status_update', handleStatusUpdate);
                socket.off('user_online', handleUserOnline);
                socket.off('user_offline', handleUserOffline);
                if (conversationId) {
                    socket.emit('leave_chat', { conversationId });
                }
            };
        }

        return () => { mounted = false; };
    }, [targetId, conversationId]);

    const handleTextChange = (text: string) => {
        setMessage(text);
        const socket = getSocket();
        if (socket) {
            socket.emit('typing_started', { targetId });
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                socket.emit('typing_stopped', { targetId });
            }, 1500);
        }
    };

    const handleSendMessage = () => {
        if (!message.trim() || !conversationId) return;

        const socket = getSocket();
        if (socket) {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            socket.emit('typing_stopped', { targetId });
            socket.emit('send_message', {
                conversationId,
                messageText: message.trim(),
                messageType: 'text'
            });
            setMessage('');
            setShowEmojiPicker(false);
        }
    };

    const formatTime = (dateString: string) => {
        const d = new Date(dateString);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatLastSeen = (dateString: string | null) => {
        if (!dateString) return 'last seen recently';
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        // Less than 24 hours ago
        if (diff < 86400000 && now.getDate() === date.getDate()) {
            return `last seen today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }

        // Yesterday
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        if (yesterday.getDate() === date.getDate() && diff < 172800000) {
            return `last seen yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }

        return `last seen ${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
    };

    const handleClearChat = async () => {
        setMenuVisible(false);
        if (!conversationId) return;
        try {
            await apiClient.post(`/api/chat/${conversationId}/clear`);
            setMessages([]);
            Alert.alert('Success', 'Chat history cleared');
        } catch (e) {
            console.error('Failed to clear chat', e);
            Alert.alert('Error', 'Failed to clear chat');
        }
    };

    const handleDeleteChat = async () => {
        setMenuVisible(false);
        try {
            await apiClient.post(`/api/friends/remove`, { target_user_id: targetId });
            if (conversationId) {
                await apiClient.post(`/api/chat/${conversationId}/clear`);
            }
            setMessages([]);
            Alert.alert('Success', 'Chat deleted and user removed', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (e) {
            console.error('Failed to delete chat', e);
            Alert.alert('Error', 'Failed to delete chat');
        }
    };

    const handleBlockUser = async () => {
        setMenuVisible(false);
        try {
            await apiClient.post(`/api/friends/block`, { target_user_id: targetId });
            Alert.alert('Success', 'User blocked', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (e) {
            console.error('Failed to block user', e);
            Alert.alert('Error', 'Failed to block user');
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color={TEXT_DARK} />
                </TouchableOpacity>

                <Image source={{ uri: targetAvatar }} style={styles.headerAvatar} />

                <View style={styles.headerInfo}>
                    <Text style={styles.headerName}>{targetName}</Text>
                    <Text style={[styles.headerStatus, !isOnline && { color: '#8B7F98' }]}>
                        {isOnline ? 'Online' : formatLastSeen(lastSeen)}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.moreBtn}
                    activeOpacity={0.8}
                    onPress={() => setMenuVisible(true)}
                >
                    <MoreVertical size={24} color={TEXT_DARK} />
                </TouchableOpacity>
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
                    <TouchableOpacity style={styles.dropdownItemRow} activeOpacity={0.7} onPress={handleBlockUser}>
                        <Ban size={18} color="#2A1240" />
                        <Text style={styles.dropdownText}>Block user</Text>
                    </TouchableOpacity>

                    <View style={styles.dropdownDivider} />

                    <TouchableOpacity style={styles.dropdownItemRow} activeOpacity={0.7} onPress={handleClearChat}>
                        <Eraser size={18} color="#2A1240" />
                        <Text style={styles.dropdownText}>Clear chat</Text>
                    </TouchableOpacity>

                    <View style={styles.dropdownDivider} />

                    <TouchableOpacity style={styles.dropdownItemRow} activeOpacity={0.7} onPress={handleDeleteChat}>
                        <Trash2 size={18} color="#E74C3C" />
                        <Text style={styles.dropdownTextDestructive}>Delete chat</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Chat Area */}
            <ImageBackground
                source={{ uri: 'https://www.transparenttextures.com/patterns/cubes.png' }}
                style={styles.chatBackground}
                imageStyle={{ opacity: 0.05 }}
            >
                <ScrollView
                    style={styles.chatScrollView}
                    contentContainerStyle={styles.chatContentContainer}
                    ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                >
                    {messages.map((msg, index) => {
                        const isMe = msg.sender_id.toString() !== targetId.toString();

                        return (
                            <View
                                key={msg.message_id || index}
                                style={[styles.messageBubble, isMe ? styles.messageRight : styles.messageLeft]}
                            >
                                <Text style={[styles.messageText, isMe ? styles.messageTextRight : styles.messageTextLeft]}>
                                    {msg.content}
                                </Text>

                                <View style={styles.messageFooter}>
                                    <Text style={[styles.messageTime, isMe ? styles.messageTimeRight : styles.messageTimeLeft]}>
                                        {formatTime(msg.timestamp)}
                                    </Text>

                                    {isMe && (
                                        <View style={styles.tickContainer}>
                                            {msg.status === 'read' ? (
                                                <CheckCheck size={14} color="#34B7F1" /> // WhatsApp Blue
                                            ) : msg.status === 'delivered' ? (
                                                <CheckCheck size={14} color="#9CA3AF" />
                                            ) : (
                                                <Check size={14} color="#9CA3AF" />
                                            )}
                                        </View>
                                    )}
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>
            </ImageBackground>

            {/* Input Area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardView}
            >
                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <TouchableOpacity style={styles.emojiBtn} onPress={() => setShowEmojiPicker(!showEmojiPicker)}>
                            <Smile size={28} color={showEmojiPicker ? PINK : "#8B7F98"} />
                        </TouchableOpacity>

                        <TextInput
                            style={styles.input}
                            placeholder="Type a message..."
                            placeholderTextColor="#A499B0"
                            value={message}
                            onChangeText={handleTextChange}
                            multiline
                            onFocus={() => setShowEmojiPicker(false)}
                        />
                    </View>

                    <TouchableOpacity style={styles.sendBtnWrap} activeOpacity={0.8} onPress={handleSendMessage}>
                        <LinearGradient
                            colors={[PINK, '#C90E62']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.sendBtn}
                        >
                            <Send size={18} color="#FFFFFF" style={{ marginLeft: 2 }} />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {showEmojiPicker && (
                    <View style={styles.emojiPickerContainer}>
                        <EmojiSelector
                            onEmojiSelected={(emoji) => setMessage(prev => prev + emoji)}
                            showSearchBar={false}
                            category={Categories.emotion}
                        />
                    </View>
                )}
            </KeyboardAvoidingView>
        </View>
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
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        paddingBottom: 15,
        paddingHorizontal: 15,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0EAF6',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    backBtn: {
        padding: 5,
        marginRight: 10,
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    headerInfo: {
        flex: 1,
    },
    headerName: {
        fontSize: 18,
        fontWeight: '700',
        color: TEXT_DARK,
    },
    headerStatus: {
        fontSize: 12,
        color: '#34B7F1', // Active blue, can also be TEXT_MUTED for last seen
        marginTop: 1,
    },
    moreBtn: {
        padding: 8,
        borderRadius: 20,
    },
    dropdownMenu: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 90 : 70,
        right: 15,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 8,
        width: 200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 8,
        zIndex: 1000,
    },
    dropdownItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        gap: 12,
    },
    dropdownText: {
        fontSize: 15,
        color: '#2A1240',
        fontWeight: '500',
    },
    dropdownTextDestructive: {
        fontSize: 15,
        color: '#E74C3C',
        fontWeight: '500',
    },
    dropdownDivider: {
        height: 1,
        backgroundColor: '#F0EAF6',
        marginHorizontal: 16,
    },
    chatBackground: {
        flex: 1,
        backgroundColor: '#F5F0FA',
    },
    chatScrollView: {
        flex: 1,
    },
    chatContentContainer: {
        padding: 15,
        paddingBottom: 20,
    },
    messageBubble: {
        maxWidth: '80%',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        marginBottom: 8,
    },
    messageLeft: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    messageRight: {
        alignSelf: 'flex-end',
        backgroundColor: '#FF1493',
        borderBottomRightRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
    },
    messageTextLeft: {
        color: TEXT_DARK,
    },
    messageTextRight: {
        color: '#FFFFFF',
    },
    messageFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 4,
        minWidth: 60,
    },
    messageTime: {
        fontSize: 11,
    },
    messageTimeLeft: {
        color: TEXT_MUTED,
    },
    messageTimeRight: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    tickContainer: {
        marginLeft: 4,
    },
    keyboardView: {
        backgroundColor: '#FFFFFF',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 12,
        paddingBottom: Platform.OS === 'ios' ? 24 : 12,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F0EAF6',
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#F7F3FA',
        borderRadius: 24,
        paddingHorizontal: 12,
        marginRight: 10,
        minHeight: 48,
    },
    emojiBtn: {
        paddingBottom: 10,
        paddingRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: TEXT_DARK,
        maxHeight: 100,
        paddingTop: 14,
        paddingBottom: 14,
    },
    sendBtnWrap: {
        width: 48,
        height: 48,
        borderRadius: 24,
        overflow: 'hidden',
    },
    sendBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emojiPickerContainer: {
        height: 250,
        backgroundColor: '#FFFFFF',
    },
});

export default ChatScreen;
