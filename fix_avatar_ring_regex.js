const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/components/FriendRequestCard.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /colors=\{\['#C850C0', '#FF1493'\]\}/;
if (regex.test(content)) {
  content = content.replace(regex, "colors={['#9C27B0', '#5B0E8B']}");
  fs.writeFileSync(file, content);
  console.log("SUCCESS");
} else {
  console.log("FAILED regex");
}
