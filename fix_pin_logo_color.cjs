const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/components/FriendCard.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /onShowToast\('Chat pinned', 'info', false\);/,
  "onShowToast('Chat pinned', 'info', true);"
);

content = content.replace(
  /onShowToast\('Chat unpinned', 'info', false\);/,
  "onShowToast('Chat unpinned', 'info', true);"
);

content = content.replace(
  /isPinned \? "#FF1493" : "#6B7280"/g,
  `isPinned ? "#9C27B0" : "#6B7280"`
);

content = content.replace(
  /isPinned \? "#FF1493" : "transparent"/g,
  `isPinned ? "#9C27B0" : "transparent"`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
