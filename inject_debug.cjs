const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /const formatted = res\.data\.data\.map/,
  `setDebugText(JSON.stringify(res.data.data));\n            const formatted = res.data.data.map`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
