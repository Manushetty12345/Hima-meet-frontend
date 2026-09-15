const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/screens/CreatorFullProfileScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /setFriendStatus\(res\.data\.data\.friendshipStatus \|\| 'none'\);/,
  "setFriendStatus(res.data.data.friendship_status || 'none');"
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
