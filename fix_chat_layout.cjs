const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/components/CreatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace ImageBackground with LinearGradient
content = content.replace(
  /<ImageBackground\s*source=\{\{ uri: 'https:\/\/www\.transparenttextures\.com\/patterns\/cubes\.png' \}\}\s*style=\{styles\.body\}\s*imageStyle=\{\{ opacity: 0\.05 \}\}\s*>/s,
  `<LinearGradient colors={['#F4EDFB', '#FFFFFF']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.body}>`
);
content = content.replace(/<\/ImageBackground>/g, `</LinearGradient>`);

// Replace the chat footer JSX
const oldChatFooter = `<View style={styles.chatFooterContainer}>
                <View style={styles.chatInputWrapper}>
                  <TouchableOpacity style={styles.iconBtnLeft} onPress={() => setShowEmojiPicker(!showEmojiPicker)}>
                    <Smile size={30} color={showEmojiPicker ? PINK : "#8B7F98"} />
                  </TouchableOpacity>
                  <TextInput
                    style={styles.chatInput}
                    placeholder="Type a message..."
                    placeholderTextColor="#A499B0"
                    value={message}
                    onChangeText={handleTextChange}
                    multiline
                    onFocus={() => setShowEmojiPicker(false)}
                  />
                </View>`;

const newChatFooter = `<View style={styles.chatFooterContainer}>
                <TouchableOpacity style={styles.emojiBtnGradientWrap} activeOpacity={0.8} onPress={() => setShowEmojiPicker(!showEmojiPicker)}>
                  <LinearGradient
                    colors={[PINK, '#C90E62']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.emojiBtnInner}
                  >
                    <Smile size={24} color="#FFFFFF" />
                  </LinearGradient>
                </TouchableOpacity>
                <View style={styles.chatInputWrapper}>
                  <TextInput
                    style={styles.chatInput}
                    placeholder="Type a message..."
                    placeholderTextColor="#A499B0"
                    value={message}
                    onChangeText={handleTextChange}
                    multiline
                    onFocus={() => setShowEmojiPicker(false)}
                  />
                </View>`;

content = content.replace(oldChatFooter, newChatFooter);

// Update styles
content = content.replace(
  /chatFooterContainer: \{([\s\S]*?)borderTopColor: '#EBE5F2',\s*\}/,
  `chatFooterContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F5F0FA',
      paddingHorizontal: 12,
      paddingTop: 12,
      paddingBottom: Platform.OS === 'ios' ? 44 : 24,
      borderTopWidth: 1,
      borderTopColor: '#EBE5F2',
      gap: 10,
    }`
);

content = content.replace(
  /chatInputWrapper: \{([\s\S]*?)elevation: 2,\s*\}/,
  `chatInputWrapper: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 24,
      minHeight: 48,
      maxHeight: 120,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 2,
    }`
);

content = content.replace(
  /chatInput: \{([\s\S]*?)color: '#2A1240',\s*\}/,
  `chatInput: {
      flex: 1,
      minHeight: 48,
      paddingHorizontal: 16,
      paddingTop: Platform.OS === 'ios' ? 14 : 12,
      paddingBottom: Platform.OS === 'ios' ? 14 : 12,
      fontSize: 16,
      color: '#2A1240',
    }`
);

content = content.replace(
  /sendBtnGradientWrap: \{/,
  `emojiBtnGradientWrap: {
      width: 44,
      height: 44,
      borderRadius: 22,
      shadowColor: '#C90E62',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 4,
    },
    emojiBtnInner: {
      flex: 1,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendBtnGradientWrap: {`
);

content = content.replace(
  /sendBtnGradientWrap: \{([\s\S]*?)elevation: 4,\s*\}/,
  `sendBtnGradientWrap: {
      width: 44,
      height: 44,
      borderRadius: 22,
      shadowColor: '#C90E62',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 4,
    }`
);

content = content.replace(
  /sendBtnInner: \{([\s\S]*?)justifyContent: 'center',\s*\}/,
  `sendBtnInner: {
      flex: 1,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
    }`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
