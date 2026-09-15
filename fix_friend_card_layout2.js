const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/components/FriendCard.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove the bell from nameRow
content = content.replace(/<TouchableOpacity onPress=\{toggleMute\} style=\{styles\.iconBtn\} hitSlop=\{\{ top: 8, bottom: 8, left: 8, right: 8 \}\}>[\s\S]*?<\/TouchableOpacity>/, '');

// 2. Remove the verticalDivider
content = content.replace(/<View style=\{styles\.verticalDivider\} \/>/, '');

// 3. Replace the entire render return block
const startIdx = content.indexOf('return (');
const endIdx = content.indexOf('};', startIdx);

const newRender = `return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
      {/* Avatar with purple ring */}
      <LinearGradient
        colors={['#9C27B0', '#5B0E8B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.avatarRing}
      >
        <View style={styles.avatarInner}>
          <Image source={{ uri: item.avatarUri }} style={styles.avatar} />
        </View>
      </LinearGradient>

      {/* Name + Message */}
      <View style={styles.textContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        </View>
        <Text style={styles.lastMessageText} numberOfLines={1}>
          {item.lastMessage || 'No messages yet'}
        </Text>
      </View>

      {/* Right Column: Top Icons + Actions */}
      <View style={styles.rightColumn}>
        {/* Top Icons */}
        <View style={styles.topIconsRow}>
          <TouchableOpacity style={styles.topIconBtn}>
            <Pin size={18} color="#FF1493" fill="#FF1493" />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleMute} style={styles.topIconBtn}>
            {isMuted ? (
              <BellOff size={18} color="#6B7280" />
            ) : (
              <Bell size={18} color="#6B7280" />
            )}
          </TouchableOpacity>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <View style={styles.callAction}>
            <TouchableOpacity onPress={handleAudioCall} style={[styles.callBtn, item.isOnline && styles.callBtnOnline]}>
              <Phone size={18} color={item.isOnline ? '#FF1493' : '#9CA3AF'} fill={item.isOnline ? '#FF1493' : '#9CA3AF'} />
            </TouchableOpacity>
            {item.isOnline ? (
              <View style={styles.rateContainer}>
                <View style={styles.coinBadge}>
                  <Text style={styles.coinBadgeText}>H</Text>
                </View>
                <Text style={styles.rateText}>{item.callRate || 20}/min</Text>
              </View>
            ) : (
              <Text style={styles.offlineText}>Offline</Text>
            )}
          </View>

          <View style={styles.callAction}>
            <TouchableOpacity onPress={handleVideoCall} style={[styles.callBtn, item.isOnline && styles.callBtnOnline]}>
              <Video size={18} color={item.isOnline ? '#FF1493' : '#9CA3AF'} fill={item.isOnline ? '#FF1493' : '#9CA3AF'} />
            </TouchableOpacity>
            {item.isOnline ? (
              <View style={styles.rateContainer}>
                <View style={styles.coinBadge}>
                  <Text style={styles.coinBadgeText}>H</Text>
                </View>
                <Text style={styles.rateText}>{item.videoRate || 40}/min</Text>
              </View>
            ) : (
              <Text style={styles.offlineText}>Offline</Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );`;

content = content.substring(0, startIdx) + newRender + '\n' + content.substring(endIdx);

const styleInjection = `
  rightColumn: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  topIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 8,
    paddingRight: 8,
  },
  topIconBtn: {
    padding: 2,
  },`;

content = content.replace(/actionsContainer: \{/, styleInjection + '\n  actionsContainer: {');
content = content.replace(/actionsContainer: \{\s*flexDirection: 'row',\s*alignItems: 'center',\s*justifyContent: 'center',/, "actionsContainer: {\n    flexDirection: 'row',\n    alignItems: 'center',\n    justifyContent: 'flex-end',\n    gap: 16,");

fs.writeFileSync(file, content);
console.log("SUCCESS");
