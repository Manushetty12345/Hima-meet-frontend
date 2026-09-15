const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/callRate: item\.voice\?\.rate_per_min,/g, "callRate: item.voice_rate,");
content = content.replace(/videoRate: item\.video\?\.rate_per_min,/g, "videoRate: item.video_rate,");

fs.writeFileSync(file, content);
console.log("SUCCESS");
