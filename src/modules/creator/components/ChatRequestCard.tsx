import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Check, X } from 'lucide-react-native';

export interface ChatRequest {
  id: string;
  name: string;
  avatarUri: string;
  timeAgo: string;
}

interface ChatRequestCardProps {
  item: ChatRequest;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

const ChatRequestCard: React.FC<ChatRequestCardProps> = ({ item, onAccept, onReject }) => {
  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Image source={{ uri: item.avatarUri }} style={styles.avatar} />
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.timeAgo}>{item.timeAgo}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.acceptBtn} onPress={() => onAccept(item.id)} activeOpacity={0.8}>
          <Check size={16} color="#EC1372" strokeWidth={2.5} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.rejectBtn} onPress={() => onReject(item.id)} activeOpacity={0.8}>
          <X size={16} color="#9A8FA8" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#F7F5FA',
    marginRight: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  timeAgo: {
    fontSize: 13,
    color: '#6B7280',
  },
  actions: {
    flexDirection: 'row',
  },
  acceptBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFEBF2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  rejectBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChatRequestCard;
