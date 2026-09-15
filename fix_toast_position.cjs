const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("bottom: Platform.OS === 'ios' ? 40 : 20,", "bottom: Platform.OS === 'ios' ? 120 : 100, // Move above bottom tab bar");

fs.writeFileSync(file, content);
console.log("SUCCESS");
