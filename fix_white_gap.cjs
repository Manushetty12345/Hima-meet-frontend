const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/components/CreatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Change the main SafeAreaView container background to match the chat background so gaps don't appear white
content = content.replace(
  /container: \{\s*flex: 1,\s*backgroundColor: '#FFFFFF',/s,
  `container: {\n      flex: 1,\n      backgroundColor: '#F4EDFB',`
);

// 2. Remove the extra keyboardVerticalOffset on Android which pushes it slightly too high and creates a gap
content = content.replace(
  /keyboardVerticalOffset=\{Platform\.OS === 'ios' \? 0 : 20\}/,
  `keyboardVerticalOffset={0}`
);

// 3. Just in case styles.body has a solid color overriding the background
content = content.replace(
  /backgroundColor: '#E5DDD5',\s*\/\/\s*Whatsapp-like default color/,
  `backgroundColor: 'transparent',`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
