const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/components/CreatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Move footer slightly up
content = content.replace(
  /paddingBottom: Platform\.OS === 'ios' \? 44 : 24,/,
  `paddingBottom: Platform.OS === 'ios' ? 56 : 36,`
);

// 2. Change Emoji Button to small white circle with purple icon
content = content.replace(
  /<LinearGradient colors=\{\['#FFB6C1', '#FF69B4'\]\} start=\{\{ x: 0, y: 0 \}\} end=\{\{ x: 1, y: 1 \}\} style=\{styles\.emojiBtnInner\}>\s*<Smile size=\{24\} color="#FFFFFF" \/>\s*<\/LinearGradient>/s,
  `<View style={styles.emojiBtnInner}>\n                    <Smile size={18} color="#9C27B0" />\n                  </View>`
);

// 3. Change Send Button to small white circle with purple icon
content = content.replace(
  /<LinearGradient\s*colors=\{\[PINK, '#C90E62'\]\}\s*start=\{\{ x: 0, y: 0 \}\}\s*end=\{\{ x: 1, y: 1 \}\}\s*style=\{styles\.sendBtnInner\}\s*>\s*<Send size=\{20\} color="#FFFFFF" style=\{\{ marginLeft: 2 \}\} \/>\s*<\/LinearGradient>/s,
  `<View style={styles.sendBtnInner}>\n                    <Send size={16} color="#9C27B0" style={{ marginLeft: 2 }} />\n                  </View>`
);

// 4. Update Styles for the smaller size and white background
content = content.replace(
  /emojiBtnGradientWrap: \{([\s\S]*?)width: 44,\s*height: 44,\s*borderRadius: 22,\s*shadowColor: '#C90E62',([\s\S]*?)elevation: 4,\s*\}/,
  `emojiBtnGradientWrap: {$1width: 36,\n      height: 36,\n      borderRadius: 18,\n      backgroundColor: '#FFFFFF',\n      shadowColor: '#000',$2elevation: 2,\n    }`
);
content = content.replace(
  /emojiBtnInner: \{([\s\S]*?)borderRadius: 22,/,
  `emojiBtnInner: {$1borderRadius: 18,`
);

content = content.replace(
  /sendBtnGradientWrap: \{([\s\S]*?)width: 44,\s*height: 44,\s*borderRadius: 22,\s*shadowColor: '#C90E62',([\s\S]*?)elevation: 4,\s*\}/,
  `sendBtnGradientWrap: {$1width: 36,\n      height: 36,\n      borderRadius: 18,\n      backgroundColor: '#FFFFFF',\n      shadowColor: '#000',$2elevation: 2,\n    }`
);
content = content.replace(
  /sendBtnInner: \{([\s\S]*?)borderRadius: 22,/,
  `sendBtnInner: {$1borderRadius: 18,`
);

// 5. Shrink chatInputWrapper a little bit to match the smaller buttons
content = content.replace(
  /chatInputWrapper: \{([\s\S]*?)minHeight: 48,/,
  `chatInputWrapper: {$1minHeight: 40,`
);
content = content.replace(
  /chatInput: \{([\s\S]*?)minHeight: 48,\s*paddingHorizontal: 16,\s*paddingTop: Platform\.OS === 'ios' \? 14 : 12,\s*paddingBottom: Platform\.OS === 'ios' \? 14 : 12,\s*fontSize: 16,/,
  `chatInput: {$1minHeight: 40,\n      paddingHorizontal: 16,\n      paddingTop: Platform.OS === 'ios' ? 10 : 8,\n      paddingBottom: Platform.OS === 'ios' ? 10 : 8,\n      fontSize: 15,`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
