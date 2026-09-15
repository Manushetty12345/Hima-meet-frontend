const fs = require('fs');
const file = 'd:/App6/hima-meet-frontend/src/modules/friends/components/FriendCard.tsx';
let content = fs.readFileSync(file, 'utf8');

// Root element
content = content.replace(
  /<TouchableOpacity style=\{styles\.card\} activeOpacity=\{0\.8\} onPress=\{onPress\}>/,
  `<View style={styles.card}>`
);

// End tag
content = content.replace(
  /<\/TouchableOpacity>\n  \);\n\};/,
  `</View>\n  );\n};`
);

// Gradient Colors
content = content.replace(
  /colors=\{\['#9C27B0', '#5B0E8B'\]\}/,
  `colors={['#EC4899', '#A855F7']}`
);

// Add Chat Now and remove lastMessage
content = content.replace(
  /<View style=\{styles\.nameRow\}>\n\s*<Text style=\{styles\.name\} numberOfLines=\{1\}>\{item\.name\}<\/Text>\n\s*<\/View>\n\s*<Text style=\{styles\.lastMessageText\} numberOfLines=\{1\}>\n\s*\{item\.lastMessage \|\| 'No messages yet'\}\n\s*<\/Text>/,
  `<View style={styles.nameRow}>\n          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>\n        </View>\n        <TouchableOpacity style={styles.chatNowBtn} onPress={onPress} activeOpacity={0.7}>\n          <Text style={styles.chatNowText}>Chat Now</Text>\n        </TouchableOpacity>`
);

// Remove top icons row
content = content.replace(
  /\{?\/\*\s*Top Icons\s*\*\/\}?\s*<View style=\{styles\.topIconsRow\}>[\s\S]*?<\/View>\s*\{?\/\*\s*Actions\s*\*\/\}?/,
  `{/* Actions */}`
);

// Add vertical divider between call actions
content = content.replace(
  /<\/View>\n\n\s*<View style=\{styles\.callAction\}>\n\s*<TouchableOpacity onPress=\{handleVideoCall\}/,
  `</View>\n          <View style={styles.verticalDivider} />\n          <View style={styles.callAction}>\n            <TouchableOpacity onPress={handleVideoCall}`
);

// Update styles
content = content.replace(
  /name: \{\n\s*fontSize: 16,\n\s*fontWeight: '700',\n\s*color: TEXT_DARK,\n\s*flex: 1,\n\s*\},\n\s*iconBtn: \{\n\s*padding: 2,\n\s*\},\n\s*lastMessageText: \{\n\s*fontSize: 11,\n\s*color: TEXT_MUTED,\n\s*marginTop: 4,\n\s*\},\n\s*rightColumn: \{\n\s*alignItems: 'flex-end',\n\s*justifyContent: 'space-between',\n\s*paddingVertical: 4,\n\s*\},\n\s*topIconsRow: \{\n\s*flexDirection: 'row',\n\s*alignItems: 'center',\n\s*gap: 8,\n\s*marginBottom: 8,\n\s*paddingRight: 8,\n\s*\},\n\s*topIconBtn: \{\n\s*padding: 2,\n\s*\},\n\s*actionsContainer: \{\n\s*flexDirection: 'row',\n\s*alignItems: 'center',\n\s*justifyContent: 'flex-end',\n\s*gap: 16,\n\s*\},\n\s*callAction: \{\n\s*alignItems: 'center',\n\s*justifyContent: 'center',\n\s*width: 40,\n\s*\}/,
  `name: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
    flex: 1,
  },
  chatNowBtn: {
    borderWidth: 1.5,
    borderColor: '#EC4899',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  chatNowText: {
    color: '#EC4899',
    fontSize: 12,
    fontWeight: '600',
  },
  rightColumn: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  callAction: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
  }`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
