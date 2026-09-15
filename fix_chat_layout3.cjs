const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/components/CreatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix the chatInputWrapper properly
content = content.replace(
  /<View style=\{styles\.chatInputWrapper\}>\s*<TouchableOpacity style=\{styles\.iconBtnLeft\} onPress=\{\(\) => setShowEmojiPicker\(!showEmojiPicker\)\}>\s*<Smile size=\{30\} color=\{showEmojiPicker \? PINK : "#8B7F98"\} \/>\s*<\/TouchableOpacity>\s*<TextInput/s,
  `<TouchableOpacity style={styles.emojiBtnGradientWrap} activeOpacity={0.8} onPress={() => setShowEmojiPicker(!showEmojiPicker)}>
                  <LinearGradient colors={['#FFB6C1', '#FF69B4']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.emojiBtnInner}>
                    <Smile size={24} color="#FFFFFF" />
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.chatInputWrapper}>
                  <TextInput`
);

// 2. Fix the extra </LinearGradient> before KeyboardAvoidingView
content = content.replace(
  /<\/LinearGradient>\s*\{\/\* Bottom CTA \/ Input \*\/\}/s,
  `</View>\n        {/* Bottom CTA / Input */}`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
