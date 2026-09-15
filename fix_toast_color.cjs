const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "backgroundColor: '#2A1240',",
  "backgroundColor: '#9C27B0', // Light purple for toast"
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
