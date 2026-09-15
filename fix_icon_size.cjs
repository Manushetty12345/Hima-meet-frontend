const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/components/FriendCard.tsx';
let content = fs.readFileSync(file, 'utf8');

// Increase Pin size
content = content.replace(
  /<Pin size=\{14\} color=\{isPinned \? "#9C27B0" : "#6B7280"\} fill=\{isPinned \? "#9C27B0" : "transparent"\} \/>/,
  '<Pin size={17} color={isPinned ? "#9C27B0" : "#6B7280"} fill={isPinned ? "#9C27B0" : "transparent"} />'
);

// Increase Bell size
content = content.replace(
  /<BellOff size=\{14\} color="#6B7280" \/>/,
  '<BellOff size={17} color="#6B7280" />'
);
content = content.replace(
  /<Bell size=\{14\} color="#6B7280" \/>/,
  '<Bell size={17} color="#6B7280" />'
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
