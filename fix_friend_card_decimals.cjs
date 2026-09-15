const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/components/FriendCard.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/\{item\.callRate \|\| 20\}\/min/, "{Math.round(Number(item.callRate)) || 20}/min");
content = content.replace(/\{item\.videoRate \|\| 40\}\/min/, "{Math.round(Number(item.videoRate)) || 40}/min");

fs.writeFileSync(file, content);
console.log("SUCCESS");
