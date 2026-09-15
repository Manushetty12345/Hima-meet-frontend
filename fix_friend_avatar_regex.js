const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/components/FriendRequestCard.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /<LinearGradient[\s\S]*?<\/LinearGradient>/;

const newStr = `{item.type === 'friend' || item.type === 'favourite' ? (
          <View style={{ marginRight: 16, position: 'relative' }}>
            <Image source={{ uri: item.avatarUri }} style={styles.avatar} />
            {item.isOnline && <View style={styles.onlineDot} />}
          </View>
        ) : (
          <LinearGradient
            colors={['#9C27B0', '#5B0E8B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarRing}
          >
            <View style={styles.avatarInner}>
              <Image source={{ uri: item.avatarUri }} style={styles.avatar} />
              {item.isOnline && <View style={styles.onlineDot} />}
            </View>
          </LinearGradient>
        )}`;

if (regex.test(content)) {
  content = content.replace(regex, newStr);
  fs.writeFileSync(file, content);
  console.log("SUCCESS");
} else {
  console.log("FAILED regex");
}
