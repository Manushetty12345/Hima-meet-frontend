const fs = require('fs');
const file = 'd:/App6/hima-meet-frontend/src/modules/friends/components/FriendCard.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/borderColor: '#E91E63',/g, "borderColor: '#9C27B0',");
content = content.replace(/color: '#E91E63',/g, "color: '#9C27B0',");

fs.writeFileSync(file, content);
console.log("SUCCESS");
