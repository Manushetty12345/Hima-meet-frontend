const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/components/CreatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix the chat input layout JSX
const oldChatInputWrapper = `<View style={styles.chatInputWrapper}>
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

const newChatInputWrapper = `<TouchableOpacity style={styles.emojiBtnGradientWrap} activeOpacity={0.8} onPress={() => setShowEmojiPicker(!showEmojiPicker)}>
                  <LinearGradient colors={['#FFB6C1', '#FF69B4']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.emojiBtnInner}>
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

content = content.replace(oldChatInputWrapper, newChatInputWrapper);

// 2. Make the background extraordinary by wrapping the whole chat in a beautiful ImageBackground + Gradient
// We will replace the <LinearGradient style={styles.body}> with a wrapper that covers the rest of the modal
content = content.replace(
  /<LinearGradient colors=\{\['#F4EDFB', '#FFFFFF'\]\} start=\{\{ x: 0, y: 0 \}\} end=\{\{ x: 0, y: 1 \}\} style=\{styles\.body\}>/,
  `<ImageBackground source={require('../../../assets/images/chat_bg.jpg')} style={{ flex: 1 }} imageStyle={{ opacity: 0.15 }}>
          <LinearGradient colors={['rgba(251,247,255,0.7)', 'rgba(239,223,251,0.9)']} style={styles.body}>`
);
content = content.replace(
  /<\/LinearGradient>\s*\{\/\* Bottom CTA \/ Input \*\/\}/s,
  `</LinearGradient>
        {/* Bottom CTA / Input */}`
);
// Make KeyboardAvoidingView and chatFooterContainer transparent so the background shows through
content = content.replace(
  /style=\{\{ backgroundColor: friendStatus === 'friends' \? '#F5F0FA' : '#FFFFFF' \}\}/,
  `style={{ backgroundColor: 'transparent' }}`
);
content = content.replace(
  /chatFooterContainer: \{([\s\S]*?)backgroundColor: '#F5F0FA',/s,
  `chatFooterContainer: {$1backgroundColor: 'transparent',`
);
content = content.replace(
  /borderTopColor: '#EBE5F2',/,
  `borderTopColor: 'rgba(235, 229, 242, 0.4)',` // make the border less harsh
);

// Close the ImageBackground at the very end of KeyboardAvoidingView
content = content.replace(
  /<\/KeyboardAvoidingView>/,
  `</KeyboardAvoidingView>\n        </ImageBackground>`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
