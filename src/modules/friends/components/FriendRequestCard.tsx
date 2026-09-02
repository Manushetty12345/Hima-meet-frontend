import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export type FriendRequestItem = {
  id: string;
  name: string;
  avatarUri: string;
  type: 'sent' | 'received' | 'favourite' | 'friend';
};

interface FriendRequestCardProps {
  item: FriendRequestItem;
}

const FriendRequestCard: React.FC<FriendRequestCardProps> = ({ item }) => {
  const getSubtext = () => {
    switch (item.type) {
      case 'sent':
        return 'Request sent';
      case 'received':
        return 'Wants to be friends';
      case 'favourite':
        return 'Favourite friend';
      case 'friend':
        return 'Friend';
      default:
        return '';
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.avatarWrap}>
        <Image source={{ uri: item.avatarUri }} style={styles.avatar} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.subtext}>{getSubtext()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#F1EAF6',
    padding: 12,
    marginBottom: 12,
  },
  avatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#EC1372',
    padding: 2,
    marginRight: 12,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1B0E22',
    marginBottom: 2,
  },
  subtext: {
    fontSize: 12.5,
    color: '#8A7A9C',
  },
});

export default FriendRequestCard;
