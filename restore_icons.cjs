const fs = require('fs');

const currentFile = 'd:/App6/hima-meet-frontend/src/modules/friends/components/FriendCard.tsx';
let currentContent = fs.readFileSync(currentFile, 'utf8');

// 1. Re-add topIconsRow above actionsContainer
const topIconsStr = `
        {/* Top Icons */}
        <View style={styles.topIconsRow}>
          <TouchableOpacity onPress={togglePin} style={styles.topIconBtn}>
              <Pin size={17} color={isPinned ? "#9C27B0" : "#6B7280"} fill={isPinned ? "#9C27B0" : "transparent"} />
            </TouchableOpacity>
          <TouchableOpacity onPress={toggleMute} style={styles.topIconBtn}>
            {isMuted ? (
              <BellOff size={17} color="#6B7280" />
            ) : (
              <Bell size={17} color="#6B7280" />
            )}
          </TouchableOpacity>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>`;

currentContent = currentContent.replace(
  /\{?\/\*\s*Actions\s*\*\/\}?\s*<View style=\{styles\.actionsContainer\}>/,
  topIconsStr
);

// 2. Re-add styles for topIconsRow and topIconBtn
const stylesStr = `
  rightColumn: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  topIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    paddingRight: 8,
  },
  topIconBtn: {
    padding: 2,
  },
  actionsContainer: {`;

currentContent = currentContent.replace(
  /rightColumn: \{\n\s*alignItems: 'flex-end',\n\s*justifyContent: 'center',\n\s*paddingVertical: 4,\n\s*\},\n\s*actionsContainer: \{/,
  stylesStr
);

fs.writeFileSync(currentFile, currentContent);
console.log("SUCCESS");
