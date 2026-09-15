const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/components/FriendCard.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove the bell from nameRow
content = content.replace(/<TouchableOpacity onPress=\{toggleMute\} style=\{styles\.iconBtn\} hitSlop=\{\{ top: 8, bottom: 8, left: 8, right: 8 \}\}>[\s\S]*?<\/TouchableOpacity>/, '');

// 2. Remove the verticalDivider
content = content.replace(/<View style=\{styles\.verticalDivider\} \/>/, '');

// 3. Wrap actionsContainer and add top icons
const actionsContainerRegex = /<View style=\{styles\.actionsContainer\}>([\s\S]*?)<\/TouchableOpacity>\s*<\/View>\s*<\/View>\s*<\/TouchableOpacity>/;

const replacement = `<View style={styles.rightColumn}>
        <View style={styles.topIconsRow}>
          <TouchableOpacity style={styles.topIconBtn}>
            <Pin size={16} color="#FF1493" fill="#FF1493" />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleMute} style={styles.topIconBtn}>
            {isMuted ? (
              <BellOff size={16} color="#9CA3AF" />
            ) : (
              <Bell size={16} color="#9CA3AF" />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.actionsContainer}>
$1</TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>`;

if (actionsContainerRegex.test(content)) {
  content = content.replace(actionsContainerRegex, replacement);
  
  // Add styles
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
    padding: 4,
  },`;
  
  content = content.replace(/actionsContainer: \{/, styleInjection + '\n  actionsContainer: {');
  
  // Also adjust gap for actionsContainer
  content = content.replace(/actionsContainer: \{\s*flexDirection: 'row',\s*alignItems: 'center',\s*justifyContent: 'center',/, "actionsContainer: {\n    flexDirection: 'row',\n    alignItems: 'center',\n    justifyContent: 'flex-end',\n    gap: 12,");

  fs.writeFileSync(file, content);
  console.log("SUCCESS");
} else {
  console.log("FAILED to find actionsContainer block");
}
