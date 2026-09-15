const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const regexAlert = /Alert\.alert\('Real-Time Update!', 'WebSocket friend_update received - automatically refreshing Friends tab!'\);/;
if (regexAlert.test(content)) {
  content = content.replace(regexAlert, '');
  fs.writeFileSync(file, content);
  console.log("SUCCESS");
} else {
  console.log("FAILED to find alert");
}
