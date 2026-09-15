const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /http:\/\/127\.0\.0\.1:9999\//g,
  `http://192.168.1.6:9999/`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
