const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetRegex = /socket\.off\('friend_update'\)\.on\('friend_update', fetchData\);/;
const newStr = `socket.off('friend_update').on('friend_update', () => {
        console.log('?? [WebSocket] friend_update received - automatically refreshing Friends tab!');
        fetchData();
      });`;

if (targetRegex.test(content)) {
  content = content.replace(targetRegex, newStr);
  fs.writeFileSync(file, content);
  console.log("SUCCESS");
} else {
  console.log("FAILED to find socket listener");
}
