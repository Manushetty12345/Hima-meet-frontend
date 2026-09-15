const fs = require('fs');

let fsContent = fs.readFileSync('D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx', 'utf8');

// 1. Move it little more up
fsContent = fsContent.replace(
  /bottom: Platform\.OS === 'ios' \? 120 : 100, \/\/ Move above bottom tab bar/,
  "bottom: Platform.OS === 'ios' ? 160 : 140, // Moved up slightly more"
);

// 2. Make it a little bigger (logo size)
fsContent = fsContent.replace(
  /style=\{\{width: 16, height: 16, marginRight: 8, resizeMode: 'contain'\}\}/,
  "style={{width: 20, height: 20, marginRight: 10, resizeMode: 'contain'}}"
);

// 3. Make font a little bigger and padding slightly larger
fsContent = fsContent.replace(
  /toastText: \{\s*color: '#4A148C', \/\/ Dark purple text for contrast\s*fontSize: 12,/,
  "toastText: {\n      color: '#4A148C', // Dark purple text for contrast\n      fontSize: 13,"
);

fsContent = fsContent.replace(
  /paddingVertical: 8,\s*paddingHorizontal: 16,/,
  "paddingVertical: 10,\n      paddingHorizontal: 18,"
);

fs.writeFileSync('D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx', fsContent);
console.log("SUCCESS FRIENDSSCREEN");
