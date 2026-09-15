const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/components/CreatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Make Emojis smaller by adding columns={9}
content = content.replace(
  /<EmojiSelector\s*onEmojiSelected=\{\(emoji\) => setMessage\(prev => prev \+ emoji\)\}\s*showSearchBar=\{false\}\s*category=\{Categories\.emotion\}\s*\/>/,
  `<EmojiSelector
                  onEmojiSelected={(emoji) => setMessage(prev => prev + emoji)}
                  showSearchBar={false}
                  category={Categories.emotion}
                  columns={9}
                />`
);

// 2. Change light green chat bubble to premium Plum Purple
content = content.replace(
  /dummyMessageRight: \{\s*alignSelf: 'flex-end',\s*backgroundColor: '#E1FEC6',\s*\/\/\s*Whatsapp-like light green/,
  `dummyMessageRight: {\n      alignSelf: 'flex-end',\n      backgroundColor: '#9C27B0', // Premium Plum Purple`
);
content = content.replace(
  /dummyMessageTextRight: \{\s*fontSize: 15,\s*color: TEXT_PLUM,/,
  `dummyMessageTextRight: {\n      fontSize: 15,\n      color: '#FFFFFF',`
);
content = content.replace(
  /dummyMessageTimeRight: \{\s*fontSize: 10,\s*color: '#607D8B',/,
  `dummyMessageTimeRight: {\n      fontSize: 10,\n      color: 'rgba(255, 255, 255, 0.7)',`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
